import { PiiCategory, PiiEntity } from '../types/security';

export interface PiiScanResult {
  hasPii: boolean;
  entities: PiiEntity[];
  sanitizedText: string;
  originalText: string;
  tokenMap: Record<string, string>;
  stats: {
    totalEntitiesFound: number;
    typesFound: PiiCategory[];
    criticalCount: number;
    highCount: number;
  };
}

// Luhn algorithm helper for credit card verification
function isValidLuhn(cardNumber: string): boolean {
  const digitsOnly = cardNumber.replace(/\D/g, '');
  if (digitsOnly.length < 13 || digitsOnly.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;
  for (let i = digitsOnly.length - 1; i >= 0; i--) {
    let digit = parseInt(digitsOnly.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export function detectAndRedactPii(text: string): PiiScanResult {
  if (!text || typeof text !== 'string') {
    return {
      hasPii: false,
      entities: [],
      sanitizedText: '',
      originalText: text || '',
      tokenMap: {},
      stats: { totalEntitiesFound: 0, typesFound: [], criticalCount: 0, highCount: 0 }
    };
  }

  const entities: PiiEntity[] = [];
  const typeCounters: Record<PiiCategory, number> = {
    EMAIL: 0,
    PHONE: 0,
    SSN: 0,
    API_KEY: 0,
    CREDIT_CARD: 0,
    IP_ADDRESS: 0,
    SECRET_AUTH: 0,
    LOCATION_NAME: 0,
    FINANCIAL_IBAN: 0
  };

  // Helper to add entity avoiding overlapping duplicates
  const addEntity = (
    type: PiiCategory,
    label: string,
    originalValue: string,
    startIndex: number,
    endIndex: number,
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
    description: string,
    confidence: number = 0.95
  ) => {
    // Check if overlap exists with already detected entity
    const isOverlapping = entities.some(
      (e) => (startIndex >= e.startIndex && startIndex < e.endIndex) ||
             (endIndex > e.startIndex && endIndex <= e.endIndex)
    );
    if (isOverlapping) return;

    typeCounters[type] = (typeCounters[type] || 0) + 1;
    const redactedPlaceholder = `[${type}_REDACTED_${typeCounters[type]}]`;

    entities.push({
      id: `pii-${type.toLowerCase()}-${Date.now()}-${entities.length + 1}`,
      type,
      label,
      originalValue,
      redactedValue: redactedPlaceholder,
      startIndex,
      endIndex,
      severity,
      description,
      confidence
    });
  };

  // 1. API Keys & Secrets (High & Critical Priority)
  // OpenAI Keys (sk-..., sk-proj-...)
  const openaiRegex = /\b(sk-(?:proj-)?[a-zA-Z0-9_-]{20,64})\b/g;
  let match: RegExpExecArray | null;
  while ((match = openaiRegex.exec(text)) !== null) {
    addEntity('API_KEY', 'OpenAI API Key', match[1], match.index, match.index + match[1].length, 'CRITICAL', 'Direct exposed LLM API credential');
  }

  // AWS Access Key ID (AKIA...)
  const awsKeyRegex = /\b(AKIA[0-9A-Z]{16})\b/g;
  while ((match = awsKeyRegex.exec(text)) !== null) {
    addEntity('API_KEY', 'AWS Access Key', match[1], match.index, match.index + match[1].length, 'CRITICAL', 'Cloud Infrastructure root/IAM access key');
  }

  // GitHub Tokens (ghp_, gho_, ghs_)
  const githubTokenRegex = /\b(gh[pousr]_[A-Za-z0-9_]{36,255})\b/g;
  while ((match = githubTokenRegex.exec(text)) !== null) {
    addEntity('API_KEY', 'GitHub Access Token', match[1], match.index, match.index + match[1].length, 'CRITICAL', 'Source code repository bearer token');
  }

  // JWT Tokens
  const jwtRegex = /\b(eyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,})\b/g;
  while ((match = jwtRegex.exec(text)) !== null) {
    addEntity('SECRET_AUTH', 'JSON Web Token (JWT)', match[1], match.index, match.index + match[1].length, 'CRITICAL', 'Active session authentication token');
  }

  // Generic Passwords / Auth Secrets (e.g. password = "...", secret_key = "...")
  const passwordSecretRegex = /(?:password|secret_key|api_secret|auth_token|client_secret)\s*[:=]\s*["']?([^\s"',;]{6,})["']?/gi;
  while ((match = passwordSecretRegex.exec(text)) !== null) {
    if (match[1]) {
      const fullMatch = match[0];
      addEntity('SECRET_AUTH', 'Plaintext Password/Secret', fullMatch, match.index, match.index + fullMatch.length, 'CRITICAL', 'Hardcoded credential or authorization secret');
    }
  }

  // 2. SSN / National Identification (XXX-XX-XXXX)
  const ssnRegex = /\b(?!000|666|9\d{2})(\d{3})[- ](?!00)(\d{2})[- ](?!0000)(\d{4})\b/g;
  while ((match = ssnRegex.exec(text)) !== null) {
    addEntity('SSN', 'Social Security Number', match[0], match.index, match.index + match[0].length, 'CRITICAL', 'Government issued national identity number');
  }

  // 3. Credit / Debit Cards
  const creditCardRegex = /\b(?:\d{4}[- ]?){3}\d{4}\b|\b\d{13,19}\b/g;
  while ((match = creditCardRegex.exec(text)) !== null) {
    const rawCard = match[0];
    const cleanDigits = rawCard.replace(/\D/g, '');
    if (cleanDigits.length >= 13 && cleanDigits.length <= 19) {
      const luhnPass = isValidLuhn(cleanDigits);
      if (luhnPass || cleanDigits.startsWith('4') || cleanDigits.startsWith('5') || cleanDigits.startsWith('37')) {
        addEntity('CREDIT_CARD', 'Payment Card Number', rawCard, match.index, match.index + rawCard.length, 'CRITICAL', 'Financial payment card number (PCI DSS restricted)');
      }
    }
  }

  // 4. Email Addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  while ((match = emailRegex.exec(text)) !== null) {
    addEntity('EMAIL', 'Email Address', match[0], match.index, match.index + match[0].length, 'HIGH', 'Personal email address identifier');
  }

  // 5. Phone Numbers (Intl & Domestic)
  const phoneRegex = /(?:\+?\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}\b/g;
  while ((match = phoneRegex.exec(text)) !== null) {
    // avoid matching small numerical codes
    const digitsCount = match[0].replace(/\D/g, '').length;
    if (digitsCount >= 10 && digitsCount <= 15) {
      addEntity('PHONE', 'Phone Number', match[0], match.index, match.index + match[0].length, 'HIGH', 'Telecommunication contact number');
    }
  }

  // 6. IPv4 Addresses (Excluding loopback 127.0.0.1 or sample 0.0.0.0 if not sensitive)
  const ipRegex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
  while ((match = ipRegex.exec(text)) !== null) {
    const ip = match[0];
    if (ip !== '127.0.0.1' && ip !== '0.0.0.0') {
      addEntity('IP_ADDRESS', 'IP Address', ip, match.index, match.index + ip.length, 'MEDIUM', 'Network location or internal server host IP');
    }
  }

  // Sort entities by startIndex ascending
  entities.sort((a, b) => a.startIndex - b.startIndex);

  // Construct sanitized string and tokenMap
  let sanitizedText = text;
  const tokenMap: Record<string, string> = {};

  // Replace from end to start so indices remain valid
  for (let i = entities.length - 1; i >= 0; i--) {
    const entity = entities[i];
    tokenMap[entity.redactedValue] = entity.originalValue;
    sanitizedText =
      sanitizedText.substring(0, entity.startIndex) +
      entity.redactedValue +
      sanitizedText.substring(entity.endIndex);
  }

  const typesFound = Array.from(new Set(entities.map((e) => e.type)));
  const criticalCount = entities.filter((e) => e.severity === 'CRITICAL').length;
  const highCount = entities.filter((e) => e.severity === 'HIGH').length;

  return {
    hasPii: entities.length > 0,
    entities,
    sanitizedText,
    originalText: text,
    tokenMap,
    stats: {
      totalEntitiesFound: entities.length,
      typesFound,
      criticalCount,
      highCount
    }
  };
}

export function rehydrateRedactedTokens(sanitizedText: string, tokenMap: Record<string, string>): string {
  let restored = sanitizedText;
  for (const [placeholder, original] of Object.entries(tokenMap)) {
    restored = restored.replaceAll(placeholder, original);
  }
  return restored;
}
