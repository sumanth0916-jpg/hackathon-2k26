export type PiiCategory = 
  | 'EMAIL'
  | 'PHONE'
  | 'SSN'
  | 'API_KEY'
  | 'CREDIT_CARD'
  | 'IP_ADDRESS'
  | 'SECRET_AUTH'
  | 'LOCATION_NAME'
  | 'FINANCIAL_IBAN';

export interface PiiEntity {
  id: string;
  type: PiiCategory;
  label: string;
  originalValue: string;
  redactedValue: string;
  startIndex: number;
  endIndex: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  confidence: number;
}

export type ThreatCategory = 
  | 'PROMPT_INJECTION'
  | 'SYSTEM_PROMPT_LEAK'
  | 'JAILBREAK_ROLEPLAY'
  | 'DATA_EXFILTRATION'
  | 'CODE_EXECUTION'
  | 'DELIMITER_HIJACKING'
  | 'ENCODING_BYPASS'
  | 'SQL_INJECTION_PROMPT'
  | 'SSRF_PAYLOAD';

export interface SecurityThreat {
  id: string;
  category: ThreatCategory;
  owaspCode: string; // e.g. 'LLM01: Prompt Injection', 'LLM02: Sensitive Info Disclosure'
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  matchedPattern: string;
  matchedSpan?: string;
  confidence: number;
  explanation: string;
  remediation: string;
  actionTaken: 'BLOCKED' | 'SANITIZED' | 'FLAGGED';
}

export interface ScoreDeduction {
  id: string;
  category: 'PRIVACY' | 'SECURITY' | 'RELIABILITY';
  title: string;
  reason: string;
  pointsDeducted: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  evidence?: string;
}

export interface TrustScoreBreakdown {
  privacyScore: number;     // 0-100 (Weight: 35%)
  securityScore: number;    // 0-100 (Weight: 45%)
  reliabilityScore: number; // 0-100 (Weight: 20%)
  overallTrustScore: number;// 0-100 (Weighted calculated score)
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  deductions: ScoreDeduction[];
  heuristicsSummary: string;
  confidenceScore: number;
}

export interface ResponseSafetyAnalysis {
  isGrounded: boolean;
  hallucinationRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  containsLeakedCredentials: boolean;
  toxicityScore: number; // 0-100
  complianceSafe: boolean;
  critique: string;
  flaggedTokens: string[];
}

export interface TrustPassport {
  passportId: string;
  timestamp: string;
  sha256Hash: string;
  scores: TrustScoreBreakdown;
  piiProtectedCount: number;
  threatsBlockedCount: number;
  promptStatus: 'ALLOWED_CLEAN' | 'SANITIZED_ALLOWED' | 'BLOCKED_CRITICAL';
  targetModel: string;
  latencyMs: number;
  rawPromptPreview: string;
  sanitizedPromptPreview: string;
  entitiesDetected: PiiEntity[];
  threatsDetected: SecurityThreat[];
  responseAnalysis?: ResponseSafetyAnalysis;
  disclaimer: string;
  compliance: {
    soc2Compliant: boolean;
    hipaaCompliant: boolean;
    gdprCompliant: boolean;
    owaspLlmTop10Defended: boolean;
  };
}

export interface DemoScenario {
  id: string;
  name: string;
  tag: string;
  badgeColor: 'emerald' | 'amber' | 'rose' | 'purple';
  icon: string;
  headline: string;
  description: string;
  expectedOutcome: string;
  expectedRiskLevel: '🟢 Low Risk' | '🟠 Medium Risk' | '🔴 High Risk' | '⛔ Critical Threat';
  rawPrompt: string;
  simulatedAiResponse: string;
  category: 'SAFE' | 'PII_LEAK' | 'PROMPT_INJECTION' | 'MULTI_VECTOR';
}

export interface AttackVectorBenchmark {
  id: string;
  name: string;
  owaspCategory: string;
  payload: string;
  attackType: string;
  expectedAction: 'BLOCKED' | 'SANITIZED';
  description: string;
}

export interface GuardrailPolicySettings {
  autoRedactPii: boolean;
  blockCriticalThreats: boolean;
  blockSystemLeaks: boolean;
  enableLuhnValidation: boolean;
  stripHiddenDelimiters: boolean;
  minimumTrustScoreThreshold: number;
  targetLlmModel: string;
}
