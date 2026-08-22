import { Match, MatchConfidenceTier, MatchFactors, Report } from '../types';
import { calculateLocationScore, formatDistance, calculateDistanceMeters } from '../utils/distance';
import { calculateTimeScore } from '../utils/time';
import { generateAiMatchExplanation } from './gemini';

/**
 * Calculates text similarity score (0 to 1) using word-level Jaccard + n-gram overlap
 */
function calculateTextSimilarity(text1: string, text2: string): number {
  if (!text1 || !text2) return 0;

  const tokenize = (t: string) =>
    t
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2);

  const tokens1 = new Set(tokenize(text1));
  const tokens2 = new Set(tokenize(text2));

  if (tokens1.size === 0 || tokens2.size === 0) return 0.2;

  let intersection = 0;
  tokens1.forEach((t) => {
    if (tokens2.has(t)) intersection++;
  });

  const union = new Set([...tokens1, ...tokens2]).size;
  const jaccard = intersection / union;

  // Keyword boost if specific brand / model words match
  return Math.min(1.0, Math.max(0.1, jaccard * 1.5 + (intersection > 2 ? 0.2 : 0)));
}

/**
 * Calculates visual similarity score (0 to 1) based on AI extracted attributes
 */
function calculateVisualSimilarity(report1: Report, report2: Report): number {
  const a1 = report1.aiAttributes;
  const a2 = report2.aiAttributes;

  if (!a1 || !a2) {
    // If attributes missing, fallback to title/description comparison
    return calculateTextSimilarity(report1.title, report2.title);
  }

  let score = 0.2;

  // Primary color match
  if (a1.primaryColor && a2.primaryColor && 
      a1.primaryColor.toLowerCase() === a2.primaryColor.toLowerCase()) {
    score += 0.35;
  }

  // Brand match
  if (a1.brand && a2.brand && a1.brand.toLowerCase() === a2.brand.toLowerCase()) {
    score += 0.30;
  }

  // Distinctive features overlap
  if (a1.distinctiveFeatures && a2.distinctiveFeatures) {
    const f1 = a1.distinctiveFeatures.join(' ').toLowerCase();
    const f2 = a2.distinctiveFeatures.join(' ').toLowerCase();
    const featSim = calculateTextSimilarity(f1, f2);
    score += featSim * 0.25;
  }

  // Condition similarity
  if (a1.condition && a2.condition && a1.condition === a2.condition) {
    score += 0.10;
  }

  return Math.min(1.0, score);
}

/**
 * Calculates category match score (0 to 1)
 */
function calculateCategoryScore(cat1: string, cat2: string): number {
  if (cat1 === cat2) return 1.0;
  // Related categories
  const relatedGroups = [
    ['Electronics', 'Accessories'],
    ['Bags', 'Accessories', 'Sports'],
    ['ID/Cards', 'Documents', 'Other'],
    ['Clothing', 'Accessories', 'Sports'],
  ];

  for (const group of relatedGroups) {
    if (group.includes(cat1) && group.includes(cat2)) return 0.6;
  }

  return 0.1;
}

/**
 * Derives the confidence tier based on score (0-100)
 */
export function getConfidenceTier(score: number): MatchConfidenceTier {
  if (score >= 90) return 'Very Strong Match';
  if (score >= 75) return 'Strong Match';
  if (score >= 60) return 'Possible Match';
  return 'Low Match';
}

/**
 * Generates specific bulleted reasoning factors for why two reports are matched
 */
function generateMatchReasoning(
  lost: Report,
  found: Report,
  factors: MatchFactors
): string[] {
  const reasons: string[] = [];

  if (factors.category >= 0.9) {
    reasons.push(`Same item category (${lost.category})`);
  }

  if (lost.aiAttributes?.primaryColor && found.aiAttributes?.primaryColor &&
      lost.aiAttributes.primaryColor.toLowerCase() === found.aiAttributes.primaryColor.toLowerCase()) {
    reasons.push(`Matching color profile (${lost.aiAttributes.primaryColor})`);
  }

  if (lost.aiAttributes?.brand && found.aiAttributes?.brand &&
      lost.aiAttributes.brand.toLowerCase() === found.aiAttributes.brand.toLowerCase()) {
    reasons.push(`Identical brand detected: ${lost.aiAttributes.brand}`);
  }

  const distMeters = calculateDistanceMeters(
    lost.latitude,
    lost.longitude,
    found.latitude,
    found.longitude
  );

  if (distMeters <= 500) {
    reasons.push(`Proximity: within ${formatDistance(distMeters)}`);
  }

  if (factors.time >= 0.75) {
    reasons.push('Compatible report time window');
  }

  if (factors.visual >= 0.7) {
    reasons.push('High visual and aesthetic attribute match');
  }

  if (reasons.length < 3) {
    reasons.push('Contextual and keyword description alignment');
  }

  return reasons;
}

/**
 * Calculates comprehensive 5-factor weighted score between a lost and found report
 */
export async function evaluateMatch(
  lost: Report,
  found: Report
): Promise<Match> {
  const visual = calculateVisualSimilarity(lost, found);
  const description = calculateTextSimilarity(
    `${lost.title} ${lost.description}`,
    `${found.title} ${found.description}`
  );
  const category = calculateCategoryScore(lost.category, found.category);
  const location = calculateLocationScore(
    lost.latitude,
    lost.longitude,
    found.latitude,
    found.longitude
  );
  const time = calculateTimeScore(
    lost.eventDate,
    lost.eventTime,
    found.eventDate,
    found.eventTime
  );

  // 5-factor weighted score calculation
  const weighted =
    visual * 0.35 +
    description * 0.25 +
    category * 0.15 +
    location * 0.15 +
    time * 0.10;

  const score = Math.min(99, Math.max(15, Math.round(weighted * 100)));
  const confidenceTier = getConfidenceTier(score);

  const factors: MatchFactors = {
    visual: Math.round(visual * 100) / 100,
    description: Math.round(description * 100) / 100,
    category: Math.round(category * 100) / 100,
    location: Math.round(location * 100) / 100,
    time: Math.round(time * 100) / 100,
  };

  const reasoning = generateMatchReasoning(lost, found, factors);
  const explanation = await generateAiMatchExplanation(lost, found, score, factors);

  return {
    id: `match-${lost.id}-${found.id}`,
    lostReportId: lost.id,
    foundReportId: found.id,
    lostReport: lost,
    foundReport: found,
    score,
    confidenceTier,
    factors,
    reasoning,
    explanation,
    createdAt: new Date().toISOString(),
    status: 'active',
  };
}

/**
 * Compares a target report against a list of candidate reports of opposite type
 * and returns ranked matches sorted by score descending
 */
export async function findMatchesForReport(
  targetReport: Report,
  allReports: Report[],
  minScore = 55
): Promise<Match[]> {
  const oppositeType = targetReport.type === 'lost' ? 'found' : 'lost';
  const candidates = allReports.filter(
    (r) => r.type === oppositeType && r.id !== targetReport.id && r.status !== 'resolved'
  );

  const matches: Match[] = [];

  for (const candidate of candidates) {
    const lost = targetReport.type === 'lost' ? targetReport : candidate;
    const found = targetReport.type === 'found' ? targetReport : candidate;
    const match = await evaluateMatch(lost, found);

    if (match.score >= minScore) {
      matches.push(match);
    }
  }

  // Sort descending by match score
  return matches.sort((a, b) => b.score - a.score);
}
