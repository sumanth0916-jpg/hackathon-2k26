# 🛡️ PRIVORA.AI — Next-Gen AI Security Gateway & Trust Passport Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-sumanth09.vercel.app-06b6d4?style=for-the-badge&logo=vercel)](https://sumanth09.vercel.app/)
[![OWASP LLM Top 10](https://img.shields.io/badge/Security-OWASP%20LLM%20Top%2010-emerald?style=for-the-badge)](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
[![Audit Status](https://img.shields.io/badge/Audit%20Ledger-Cryptographic%20SHA--256-blue?style=for-the-badge)](https://sumanth09.vercel.app/vault)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

---

## 🚀 Overview

**Privora** is an enterprise AI Security Gateway that intercepts adversarial prompt injections, deterministically redacts confidential PII/credentials with zero-knowledge tokenization, calculates mathematically explainable trust scores, and generates verifiable cryptographic **Privora Trust Passports™**.

```
    [ User / Client Prompt ]
               │
               ▼
   ┌───────────────────────┐
   │   PRIVORA GATEWAY     │
   │  ───────────────────  │
   │  1. Threat Detection  │ ──► 🔴 Explains WHY flagged (OWASP LLM01/02)
   │  2. PII Redaction     │ ──► 🟠 Visual Before / After Sanitization
   │  3. Trust Calculation │ ──► 📊 Privacy(35%) + Security(45%) + Rel(20%)
   └───────────────────────┘
               │
               ▼
   ┌───────────────────────┐
   │ 🛡️ TRUST PASSPORT™    │ ──► Cryptographic SHA-256 Stamp & Vault
   └───────────────────────┘
               │
               ▼
    [ Target LLM: Gemini / GPT-4o / Claude ]
```

---

## ⚡ Instant Judge Demo Proof Scenarios

Privora features **1-Click Judge Proof Scenarios** and a **30-Second Guided Auto-Tour** that demonstrates full defense capabilities:

| Scenario | Risk Level | Detection Engine | Action Taken & Outcome |
| :--- | :--- | :--- | :--- |
| **🟢 Safe Prompt** | Low Risk (98/100) | Full Heuristic Clearance | Clean Execution · Zero Deductions · Mint Clean Passport |
| **🟠 Privacy Leak** | Medium Risk (78/100) | PII, SSN, AWS Key, Emails | Visual Deterministic Redaction (`[EMAIL_REDACTED]`, `[API_KEY_REDACTED]`) |
| **🔴 Prompt Injection** | Critical Risk (24/100) | DAN 12.0 & System Leak | **Execution Halted & Blocked** · Plain English "Why Flagged" Explanation |
| **🟣 Multi-Vector Exploit** | Critical Threat (18/100) | Compound OWASP Exploits | Delimiters Stripped · Key Masked · Shell Execution Quarantined |

---

## 🪪 The Core Differentiator: Privora Trust Passport™

Every scanned prompt produces an immutable, verifiable digital security certificate:

```
╔══════════════════════════════════════════╗
║        🛡️ PRIVORA TRUST PASSPORT         ║
║  Passport ID: PV-2026-9488-76X           ║
║                                          ║
║  Privacy Score      94 / 100             ║
║  Security Score     88 / 100             ║
║  Reliability Score  76 / 100             ║
║                                          ║
║  Threat Level       🟠 MEDIUM RISK       ║
║                                          ║
║  PII Protected      2 entities           ║
║  Threats Blocked    1 threat             ║
║  Prompt Status      ✓ Sanitized & Allowed║
║                                          ║
║  Digest: sha256:pv_8a92f03b1e7c...       ║
║                                          ║
║  ⚠ VERIFY BEFORE TRUSTING (Heuristic)   ║
╚══════════════════════════════════════════╝
```

- **Cryptographic Integrity**: Deterministic SHA-256 fingerprint generated per prompt.
- **Audit Vault**: Searchable, filterable audit log in `/vault` for compliance tracking (SOC-2, HIPAA, GDPR, OWASP LLM-10).
- **Public Verification**: Instant verify modal checking passport authenticity against vault records.

---

## 📊 Transparent Mathematical Trust Score Calculation

Instead of opaque scores, Privora exposes the exact formula and heuristic deductions:

$$\text{Overall Trust Score} = (0.35 \times \text{Privacy}) + (0.45 \times \text{Security}) + (0.20 \times \text{Reliability})$$

- **Privacy Deductions**: API keys (-28 pts), SSN/Cards (-24 pts), Emails (-8 pts).
- **Security Deductions**: Jailbreaks/Injections (-45 pts), Delimiter spoofing (-25 pts).
- **Reliability Deductions**: High hallucination risk (-24 pts), Tone bias (-12 pts).
- **Disclaimer**: Expressly stated as a heuristic risk assessment, not an infallible truth guarantee.

---

## 🎯 16-Vector Attack Simulation Benchmark

Visit `/attack-matrix` to run an automated stress test against 16 real-world attack payloads:
- Direct Prompt Overrides & Negation
- DAN 12.0 & Unrestricted Roleplay Jailbreaks
- System Prompt / Preamble Exfiltration
- Delimiter Hijacking (`<|im_start|>system`, `[INST]`)
- Plaintext Cloud Keys (AWS IAM, OpenAI, GitHub PATs)
- Luhn PCI-DSS Credit Card Leaks
- Remote Shell Payloads & Command Injection (`nc -e /bin/sh`)
- Out-of-band SSRF Webhooks (`curl webhook.site`)
- Base64 Obfuscation Evasion Payloads

---

## 💻 3-Line Integration SDK

```python
from privora import PrivoraGateway

gateway = PrivoraGateway(api_key="privora_live_...")
audit = gateway.sanitize_and_evaluate(raw_user_prompt)

if audit.is_blocked:
    print(f"Blocked: {audit.threat_explanation}")
else:
    # Send safe prompt to Gemini or OpenAI
    response = call_llm(audit.sanitized_prompt)
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS v4
- **Icons & Visuals**: Lucide React, Canvas Confetti
- **Security Services**: Custom Heuristic Lexical Tokenizer, Luhn Checksum Validator, Cryptographic SHA-256 Engine

---

## 🏆 Hackathon Submission Details

- **Deployed URL**: [https://sumanth09.vercel.app/](https://sumanth09.vercel.app/)
- **Repository**: [https://github.com/sumanth0916-jpg/hackathon-2k26.git](https://github.com/sumanth0916-jpg/hackathon-2k26.git)
