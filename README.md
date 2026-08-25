# LifeLink — Connecting Donors, Saving Lives 🩸

> **Location-aware matching between blood and organ donors and the people who urgently need them.**  
> Deployed live reference: [beacon-life.lovable.app](https://beacon-life.lovable.app)

---

## 🌟 Overview

**LifeLink** is a modern, privacy-first healthcare coordination platform designed to bridge the critical gap between voluntary blood/organ donors and patients in emergency medical situations. By pairing biological compatibility with real-time proximity matching and verified medical identities, LifeLink ensures that the closest eligible donor can be mobilized in seconds.

---

## ✨ Key Features

### 1. 🎯 Location-Aware Proximity Radar
- **Haversine Proximity Matching**: Ranks compatible donors by live distance (5 km, 10 km, 25 km, 50 km).
- **Interactive Proximity Radar Canvas**: Visual radar sweep animation with live emergency markers, distance rings, and hospital pins.
- **Privacy By Default (~1 km Area Jitter)**: Exact home GPS coordinates and addresses are never publicly published. Only an approximate ~1 km radius is visible.

### 2. 🧬 Biological Compatibility Engine
- Full 8-group ABO & Rh compatibility matrix (`O-`, `O+`, `A-`, `A+`, `B-`, `B+`, `AB-`, `AB+`).
- Support for multiple donation types: **Whole Blood**, **Plasma**, **Platelets**, **Organ Registration Coordination**, and **Stem Cells**.

### 3. 🚨 Emergency Mode & Live Broadcasts
- Emergency requests trigger audible and visual siren pulses.
- Real-time alerts broadcast to all compatible donors within city radius.

### 4. 🔒 Two-Way Mutual Consent Contact Vault
- Personal phone numbers and emails are stored in a protected vault.
- Contact details are unlocked only after **both** the donor offers help and the recipient accepts.

### 5. 👥 Dual Specialized Hubs
- **Donor Hub (`/donor`, `/donor/nearby`)**: Instant availability toggle (Active / Away), nearby emergency radar, response tracker.
- **Recipient Hub (`/receiver`, `/receiver/donors`, `/receiver/new`)**: Intuitive 5-step donation request wizard, ranked donor list by match score, live status tracker.

### 6. 🛡️ Admin Moderation Desk (`/admin`)
- Moderation queue to verify medical identities and review urgent clinical requests.
- Real-time platform statistics across active donors, open requests, and fulfilled connections.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS (Tailwind v4 with modern OKLCH tokens & glassmorphism)
- **Typography**: Plus Jakarta Sans & Sora (Google Fonts)
- **Icons**: Lucide React
- **State Management**: Reactive Context API with LocalStorage offline persistence + Supabase ready
- **Animations**: CSS Radar Sweep, Beacon Pulses, Canvas Confetti

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation & Local Setup

```bash
# Clone the repository
git clone https://github.com/sumanth0916-jpg/hackathon-2k26.git
cd hackathon-2k26

# Install dependencies
npm install

# Start the local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Instant Demo Accounts
The application includes preconfigured one-click demo personas in the navigation bar:
- **Donor**: Dr. Ananya Sharma (`donor@lifelink.org`) — O- Universal Donor
- **Recipient**: Rahul Verma (`receiver@lifelink.org`) — B+ Patient
- **Admin**: LifeLink Moderation Desk (`admin@lifelink.org`)

---

## ⚖️ Medical & Legal Disclaimers

1. **Medical Advice**: LifeLink is a connection platform and does not provide medical advice or determine medical eligibility. Blood and organ donation eligibility, compatibility, testing, and medical decisions must be confirmed by qualified healthcare professionals and authorized medical facilities.
2. **Organ Trade Prohibition**: Organ donation on LifeLink covers registration of intent and coordination through authorized medical facilities only. Buying, selling, or otherwise trading human organs is illegal and strictly prohibited.

---

## 📄 License
MIT License. Built for hackathons and public health impact.
