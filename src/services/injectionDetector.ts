import { SecurityThreat, ThreatCategory } from '../types/security';

export interface ThreatScanResult {
  hasThreat: boolean;
  threats: SecurityThreat[];
  riskScore: number; // 0 (safe) to 100 (critical risk)
  highestSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  shouldBlock: boolean;
  threatExplanationSummary: string;
  recommendedAction: 'BLOCK_IMMEDIATELY' | 'SANITIZE_AND_WARN' | 'ALLOW_WITH_LOG' | 'CLEAN_PASS';
}

interface ThreatRule {
  id: string;
  category: ThreatCategory;
  owaspCode: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  regex: RegExp;
  actionTaken: 'BLOCKED' | 'SANITIZED' | 'FLAGGED';
  explanationGenerator: (match: string) => string;
  remediation: string;
}

const THREAT_RULES: ThreatRule[] = [
  // 1. Direct Instruction Overrides (OWASP LLM01: Prompt Injection)
  {
    id: 'INJ-001',
    category: 'PROMPT_INJECTION',
    owaspCode: 'LLM01: Prompt Injection',
    title: 'Direct Instruction Negation / Guardrail Bypass',
    severity: 'CRITICAL',
    regex: /(?:ignore|disregard|forget|bypass|override|cancel|drop)\s+(?:all\s+)?(?:previous|prior|above|system|existing|current)\s+(?:instructions|rules|prompts|directives|constraints|guardrails|guidelines)/i,
    actionTaken: 'BLOCKED',
    explanationGenerator: (match) =>
      `Explicit prompt override phrase detected ("${match}"). The prompt attempts to force the model to disregard developer system safety boundaries and system directives.`,
    remediation: 'Block query execution immediately. Do not forward uncurated override commands to underlying LLMs.'
  },
  {
    id: 'INJ-002',
    category: 'PROMPT_INJECTION',
    owaspCode: 'LLM01: Prompt Injection',
    title: 'System Override Directive',
    severity: 'CRITICAL',
    regex: /\b(?:system\s+override|admin\s+override|root\s+access\s+granted|developer\s+mode\s+enabled|sudo\s+mode)\b/i,
    actionTaken: 'BLOCKED',
    explanationGenerator: (match) =>
      `Fictitious privilege escalation command detected ("${match}"). Attackers use faux administrative tokens to induce the model into bypassing safety filters.`,
    remediation: 'Terminate inference pipeline and quarantine prompt payload.'
  },

  // 2. System Prompt & Instruction Exfiltration (OWASP LLM02: Sensitive Info Disclosure)
  {
    id: 'LEAK-001',
    category: 'SYSTEM_PROMPT_LEAK',
    owaspCode: 'LLM02: Sensitive Info Disclosure',
    title: 'System Prompt Extraction Probe',
    severity: 'CRITICAL',
    regex: /(?:print|output|display|show|reveal|repeat|echo|tell\s+me|verbatim|extract)\s+(?:your\s+)?(?:complete\s+|full\s+|exact\s+)?(?:system\s+prompt|system\s+instructions|initial\s+prompt|preamble|internal\s+instructions|hidden\s+rules|developer\s+prompt)/i,
    actionTaken: 'BLOCKED',
    explanationGenerator: (match) =>
      `Targeted system prompt exfiltration attempt detected ("${match}"). The query seeks to leak internal system instructions, proprietary context, or embedded keys.`,
    remediation: 'Sanitize or block request. Strip prompt extraction queries to prevent system context disclosure.'
  },
  {
    id: 'LEAK-002',
    category: 'SYSTEM_PROMPT_LEAK',
    owaspCode: 'LLM02: Sensitive Info Disclosure',
    title: 'Prefix / Initial Instruction Replay Attack',
    severity: 'HIGH',
    regex: /(?:repeat\s+everything\s+above|what\s+(?:did\s+you\s+say|were\s+you\s+told)\s+before|show\s+me\s+the\s+text\s+before\s+this)/i,
    actionTaken: 'BLOCKED',
    explanationGenerator: (match) =>
      `Conversation preamble replay query ("${match}"). Used to inspect hidden context windows and system prompt headers.`,
    remediation: 'Block attempt to reflect preceding context window.'
  },

  // 3. Jailbreak Personas & Roleplay Attacks (OWASP LLM01: Jailbreaking)
  {
    id: 'JAIL-001',
    category: 'JAILBREAK_ROLEPLAY',
    owaspCode: 'LLM01: Prompt Injection (Jailbreak)',
    title: 'DAN (Do Anything Now) Persona Exploitation',
    severity: 'CRITICAL',
    regex: /\b(?:dan\s*(?:mode|1[0-9]|2[0-9]|version)?|do\s+anything\s+now|jailbreakgpt|aim\s+persona|unfiltered\s+mode|chaos\s+mode|lucifer\s+mode)\b/i,
    actionTaken: 'BLOCKED',
    explanationGenerator: (match) =>
      `Recognized jailbreak persona signature ("${match}"). Known adversary technique to simulate an AI archetype that ignores ethics, safety, and legal constraints.`,
    remediation: 'Halt prompt execution. Reject jailbreak archetype initialization.'
  },
  {
    id: 'JAIL-002',
    category: 'JAILBREAK_ROLEPLAY',
    owaspCode: 'LLM01: Prompt Injection (Jailbreak)',
    title: 'Hypothetical / Fictional Unrestricted Roleplay',
    severity: 'HIGH',
    regex: /(?:act\s+as\s+(?:an?\s+)?(?:unfiltered|unrestricted|unethical|evil|malicious|lawless|rogue)\s+(?:assistant|ai|bot|terminal|coder)|for\s+educational\s+purposes\s+only\s*,?\s*how\s+(?:to\s+|do\s+i\s+)?(?:hack|exploit|bypass|attack))/i,
    actionTaken: 'BLOCKED',
    explanationGenerator: (match) =>
      `Adversarial roleplay wrapper detected ("${match}"). Attempting to bypass safety filters under the guise of an unrestricted or hypothetical persona.`,
    remediation: 'Strip adversarial roleplay context and evaluate raw underlying intent.'
  },

  // 4. Delimiter & Control Token Hijacking (OWASP LLM07: Insecure Plugin / Delimiter Injection)
  {
    id: 'DELIM-001',
    category: 'DELIMITER_HIJACKING',
    owaspCode: 'LLM07: Delimiter Hijacking',
    title: 'Control Delimiter Injection (<|im_start|>, [INST], <<<SYS>>>)',
    severity: 'CRITICAL',
    regex: /(?:<\|im_start\|>|<\|im_end\|>|\[INST\]|\[\/INST\]|<<SYS>>|<\/SYS>|<system>|<\/system>|"""system\b|###\s*System\s*Instruction)/i,
    actionTaken: 'BLOCKED',
    explanationGenerator: (match) =>
      `Raw LLM framing token or structural delimiter detected ("${match}"). Used to inject fake system messages into the tokenizer stream.`,
    remediation: 'Strip all control tokens from untrusted user inputs before prompt assembly.'
  },

  // 5. Code Execution & Shell Commands (OWASP LLM06: Excessive Agency)
  {
    id: 'EXEC-001',
    category: 'CODE_EXECUTION',
    owaspCode: 'LLM06: Excessive Agency',
    title: 'Malicious Command / Reverse Shell Payload',
    severity: 'CRITICAL',
    regex: /(?:rm\s+-rf\s+\/|nc\s+(?:-[a-z0-9]+\s+){1,3}\d{2,5}|bash\s+-i\s+>&|\/dev\/tcp\/\d{1,3}\.\d{1,3}|subprocess\.(?:Popen|call|check_output)|eval\(base64_decode)/i,
    actionTaken: 'BLOCKED',
    explanationGenerator: (match) =>
      `Destructive shell or reverse-shell command string detected ("${match}"). Poses extreme threat if downstream agent possesses tool execution capabilities.`,
    remediation: 'Quarantine query immediately. Block execution in sandboxed tool agent.'
  },

  // 6. Data Exfiltration via SSRF / Webhooks (OWASP LLM06)
  {
    id: 'EXFIL-001',
    category: 'DATA_EXFILTRATION',
    owaspCode: 'LLM06: Excessive Agency',
    title: 'Out-of-Band Data Exfiltration URL / SSRF',
    severity: 'HIGH',
    regex: /(?:curl|wget|fetch)\s+(?:-[a-z0-9]+\s+)*(?:https?:\/\/|http:\/\/)(?:webhook\.site|burpcollaborator|ngrok\.io|attacker|requestbin|[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/i,
    actionTaken: 'BLOCKED',
    explanationGenerator: (match) =>
      `Remote exfiltration webhook or SSRF trigger identified ("${match}"). Probing for out-of-band data leakage through automated network requests.`,
    remediation: 'Block URL access to external unapproved endpoints.'
  },

  // 7. Obfuscated / Encoded Payload Evasion (Base64, Hex)
  {
    id: 'ENC-001',
    category: 'ENCODING_BYPASS',
    owaspCode: 'LLM01: Prompt Injection (Obfuscation)',
    title: 'Base64 Evasion Payload Trigger',
    severity: 'HIGH',
    regex: /(?:decode\s+(?:the\s+following\s+)?base64|base64\s+-d|echo\s+["'][A-Za-z0-9+/=]{30,}["']\s*\|\s*base64)/i,
    actionTaken: 'FLAGGED',
    explanationGenerator: (match) =>
      `Obfuscated Base64 decoding request detected ("${match}"). Attackers frequently wrap prohibited payloads in Base64 encoding to evade naive keyword filters.`,
    remediation: 'Recursively decode and inspect nested Base64 strings before inference.'
  },

  // 8. SQL Injection in Natural Language Prompt
  {
    id: 'SQLI-001',
    category: 'SQL_INJECTION_PROMPT',
    owaspCode: 'LLM06: Excessive Agency',
    title: 'SQL Injection Construct in Prompt',
    severity: 'HIGH',
    regex: /(?:union\s+select\s+.*\s+from\s+|;\s*drop\s+table\s+|'\s*or\s+'1'='1|admin'\s*--)/i,
    actionTaken: 'BLOCKED',
    explanationGenerator: (match) =>
      `SQL Injection syntax detected in natural language prompt ("${match}"). High risk for text-to-SQL or database-backed agent workflows.`,
    remediation: 'Enforce parameterized queries and strict database permission scoping.'
  }
];

export function detectThreatsAndInjections(text: string): ThreatScanResult {
  if (!text || typeof text !== 'string') {
    return {
      hasThreat: false,
      threats: [],
      riskScore: 0,
      highestSeverity: 'NONE',
      shouldBlock: false,
      threatExplanationSummary: 'No input provided.',
      recommendedAction: 'CLEAN_PASS'
    };
  }

  const detectedThreats: SecurityThreat[] = [];

  for (const rule of THREAT_RULES) {
    const match = rule.regex.exec(text);
    if (match) {
      const matchedString = match[0];
      const explanation = rule.explanationGenerator(matchedString);

      detectedThreats.push({
        id: `${rule.id}-${Date.now()}-${detectedThreats.length + 1}`,
        category: rule.category,
        owaspCode: rule.owaspCode,
        title: rule.title,
        severity: rule.severity,
        matchedPattern: rule.regex.source,
        matchedSpan: matchedString,
        confidence: 0.96,
        explanation,
        remediation: rule.remediation,
        actionTaken: rule.actionTaken
      });
    }
  }

  // Calculate severity metrics
  const criticalThreats = detectedThreats.filter((t) => t.severity === 'CRITICAL');
  const highThreats = detectedThreats.filter((t) => t.severity === 'HIGH');
  const mediumThreats = detectedThreats.filter((t) => t.severity === 'MEDIUM');

  let riskScore = 0;
  if (criticalThreats.length > 0) {
    riskScore = Math.min(100, 75 + criticalThreats.length * 10);
  } else if (highThreats.length > 0) {
    riskScore = Math.min(74, 45 + highThreats.length * 10);
  } else if (mediumThreats.length > 0) {
    riskScore = Math.min(44, 20 + mediumThreats.length * 8);
  }

  let highestSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE' = 'NONE';
  if (criticalThreats.length > 0) highestSeverity = 'CRITICAL';
  else if (highThreats.length > 0) highestSeverity = 'HIGH';
  else if (mediumThreats.length > 0) highestSeverity = 'MEDIUM';
  else if (detectedThreats.length > 0) highestSeverity = 'LOW';

  const shouldBlock = criticalThreats.length > 0 || highThreats.length > 1;

  let recommendedAction: 'BLOCK_IMMEDIATELY' | 'SANITIZE_AND_WARN' | 'ALLOW_WITH_LOG' | 'CLEAN_PASS' = 'CLEAN_PASS';
  if (shouldBlock) {
    recommendedAction = 'BLOCK_IMMEDIATELY';
  } else if (detectedThreats.length > 0) {
    recommendedAction = 'SANITIZE_AND_WARN';
  }

  let threatExplanationSummary = '';
  if (detectedThreats.length === 0) {
    threatExplanationSummary = '🟢 No malicious prompt injection, jailbreak, or exfiltration patterns detected. Prompt passed all OWASP LLM security heuristic checks.';
  } else {
    threatExplanationSummary = `🚨 Detected ${detectedThreats.length} security threat(s) [${detectedThreats.map((t) => t.title).join(', ')}]. ${shouldBlock ? 'Prompt blocked to protect model integrity.' : 'Review flagged tokens prior to execution.'}`;
  }

  return {
    hasThreat: detectedThreats.length > 0,
    threats: detectedThreats,
    riskScore,
    highestSeverity,
    shouldBlock,
    threatExplanationSummary,
    recommendedAction
  };
}
