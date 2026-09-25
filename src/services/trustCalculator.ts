import { PiiScanResult } from './piiDetector';
import { ThreatScanResult } from './injectionDetector';
import { ScoreDeduction, TrustScoreBreakdown } from '../types/security';

export function calculateExplainableTrustScore(
  piiResult: PiiScanResult,
  threatResult: ThreatScanResult,
  simulatedResponseQuality?: {
    hallucinationRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    toxicityScore: number;
    groundednessScore: number;
  }
): TrustScoreBreakdown {
  const deductions: ScoreDeduction[] = [];

  // ==========================================
  // 1. PRIVACY SCORE CALCULATION (Base: 100)
  // ==========================================
  let privacyScore = 100;

  for (const pii of piiResult.entities) {
    let pointLoss = 0;
    if (pii.severity === 'CRITICAL') {
      pointLoss = pii.type === 'API_KEY' ? 28 : pii.type === 'CREDIT_CARD' || pii.type === 'SSN' ? 24 : 20;
    } else if (pii.severity === 'HIGH') {
      pointLoss = pii.type === 'EMAIL' ? 8 : 10;
    } else {
      pointLoss = 5;
    }

    privacyScore = Math.max(0, privacyScore - pointLoss);

    deductions.push({
      id: `deduct-pii-${pii.id}`,
      category: 'PRIVACY',
      title: `${pii.label} Exposure`,
      reason: `Unencrypted ${pii.label} found in raw prompt. Data will leak to third-party model inference logs unless redacted.`,
      pointsDeducted: pointLoss,
      severity: pii.severity,
      evidence: pii.originalValue.length > 24 ? `${pii.originalValue.slice(0, 12)}...` : pii.originalValue
    });
  }

  // ==========================================
  // 2. SECURITY SCORE CALCULATION (Base: 100)
  // ==========================================
  let securityScore = 100;

  for (const threat of threatResult.threats) {
    let pointLoss = 0;
    if (threat.severity === 'CRITICAL') {
      pointLoss = 45;
    } else if (threat.severity === 'HIGH') {
      pointLoss = 25;
    } else if (threat.severity === 'MEDIUM') {
      pointLoss = 15;
    } else {
      pointLoss = 8;
    }

    securityScore = Math.max(0, securityScore - pointLoss);

    deductions.push({
      id: `deduct-sec-${threat.id}`,
      category: 'SECURITY',
      title: threat.title,
      reason: threat.explanation,
      pointsDeducted: pointLoss,
      severity: threat.severity,
      evidence: threat.matchedSpan
    });
  }

  // ==========================================
  // 3. RELIABILITY SCORE CALCULATION (Base: 95)
  // ==========================================
  let reliabilityScore = 95;

  if (simulatedResponseQuality) {
    if (simulatedResponseQuality.hallucinationRisk === 'HIGH') {
      reliabilityScore -= 24;
      deductions.push({
        id: 'deduct-rel-hallucination-high',
        category: 'RELIABILITY',
        title: 'Elevated Hallucination Risk',
        reason: 'Generated output contains ungrounded factual assertions with low confidence verification.',
        pointsDeducted: 24,
        severity: 'HIGH'
      });
    } else if (simulatedResponseQuality.hallucinationRisk === 'MEDIUM') {
      reliabilityScore -= 12;
      deductions.push({
        id: 'deduct-rel-hallucination-med',
        category: 'RELIABILITY',
        title: 'Moderate Confidence Drift',
        reason: 'Output relies on generalized heuristics without linked citations or primary sources.',
        pointsDeducted: 12,
        severity: 'MEDIUM'
      });
    }

    if (simulatedResponseQuality.toxicityScore > 10) {
      const toxLoss = Math.min(25, Math.round(simulatedResponseQuality.toxicityScore * 0.4));
      reliabilityScore = Math.max(0, reliabilityScore - toxLoss);
      deductions.push({
        id: 'deduct-rel-toxicity',
        category: 'RELIABILITY',
        title: 'Content Tone / Bias Warning',
        reason: 'Detected borderline aggressive or non-compliant vocabulary.',
        pointsDeducted: toxLoss,
        severity: 'MEDIUM'
      });
    }
  } else {
    // Default prompt reliability assessment
    if (threatResult.hasThreat) {
      reliabilityScore -= 18;
      deductions.push({
        id: 'deduct-rel-adversarial-context',
        category: 'RELIABILITY',
        title: 'Adversarial Prompt Contamination',
        reason: 'Adversarial syntax reduces downstream LLM response consistency and alignment.',
        pointsDeducted: 18,
        severity: 'HIGH'
      });
    }
  }

  // Cap scores between 0 and 100
  privacyScore = Math.min(100, Math.max(0, Math.round(privacyScore)));
  securityScore = Math.min(100, Math.max(0, Math.round(securityScore)));
  reliabilityScore = Math.min(100, Math.max(0, Math.round(reliabilityScore)));

  // ==========================================
  // 4. OVERALL WEIGHTED TRUST SCORE FORMULA
  // Privacy: 35%, Security: 45%, Reliability: 20%
  // ==========================================
  const rawWeighted = (privacyScore * 0.35) + (securityScore * 0.45) + (reliabilityScore * 0.20);
  const overallTrustScore = Math.min(100, Math.max(0, Math.round(rawWeighted)));

  let threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (overallTrustScore >= 88 && securityScore >= 80 && privacyScore >= 80) {
    threatLevel = 'LOW';
  } else if (overallTrustScore >= 65 && securityScore >= 50) {
    threatLevel = 'MEDIUM';
  } else if (overallTrustScore >= 40) {
    threatLevel = 'HIGH';
  } else {
    threatLevel = 'CRITICAL';
  }

  let heuristicsSummary = '';
  if (deductions.length === 0) {
    heuristicsSummary = 'Optimal safety rating. No sensitive PII disclosed, zero prompt injection vectors identified, and high response reliability.';
  } else {
    const mainConcerns = deductions.slice(0, 2).map((d) => d.title).join(' and ');
    heuristicsSummary = `Score reduced by ${100 - overallTrustScore} points primarily due to ${mainConcerns}. ${piiResult.hasPii ? 'Redacting PII restored downstream safety.' : ''}`;
  }

  return {
    privacyScore,
    securityScore,
    reliabilityScore,
    overallTrustScore,
    threatLevel,
    deductions,
    heuristicsSummary,
    confidenceScore: 0.96
  };
}
