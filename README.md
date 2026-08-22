# LostX.ai — Smart Campus Lost & Found 🎒⚡

> "Lost something? Let AI help bring it back."

LostX.ai is an AI-powered lost and found intelligence platform designed for university campuses. It eliminates messy message boards by analyzing submitted item photos with Gemini 2.5 multimodal vision, extracting physical attributes, and cross-matching lost and found reports using a deterministic 5-factor weighted algorithm.

---

## 🌟 Key Features

1. **Multimodal Gemini 2.5 Vision Attribute Extraction**:
   - Analyzes photos to identify object type, brand, primary/secondary colors, distinctive marks, stickers, scratches, and condition.
2. **5-Factor Weighted Matching Pipeline**:
   - Visual Similarity (35%)
   - Description Text Similarity (25%)
   - Category Match (15%)
   - Campus Location Proximity (15%)
   - Time Compatibility (10%)
3. **Categorized Confidence Tiers**:
   - `90%–100%`: Very Strong Match
   - `75%–89%`: Strong Match
   - `60%–74%`: Possible Match
   - `<60%`: Low Match
4. **Side-by-Side Comparison Matrix**:
   - Side-by-side desktop view / mobile stacked comparison with natural language AI reasoning.
5. **Safe Ownership Claiming Flow**:
   - "I Think This Is Mine" workflow with private verification clues (e.g. wallpaper description, hidden serial number) without exposing personal phone/email publicly.
6. **Campus Reconnection & Reunited Lifecycle**:
   - "Mark as Reunited 🎉" celebratory flow with confetti animations.
7. **Zero-Setup Judge Demo Mode**:
   - Pre-seeded with 12 realistic campus items across 6 pairs (backpacks, phones, student IDs, AirPods, water bottles, keys) with a 1-click dataset reset button.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React
- **AI & Vision**: Google Gemini 2.5 Flash (`@google/genai` / REST) with deterministic offline fallback
- **Backend & Cloud**: Firebase Authentication, Cloud Firestore, Firebase Cloud Storage
- **Geolocation**: Browser Geolocation API + Campus Building presets (Library, CS Block, Cafeteria, etc.)
- **Security**: Strict `firestore.rules` and `storage.rules`

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional)
Copy `.env.example` to `.env` and provide your keys:
```bash
cp .env.example .env
```
*(Note: If no API keys are provided, LostX.ai automatically operates in Standalone Demo Mode with a deterministic matching engine.)*

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 🔒 Security & Privacy

- Public views only expose approximate campus zones, never exact GPS coordinates.
- Firebase Security Rules restrict write operations to authenticated owners and validate file sizes (<12MB) and image MIME types.
- Claims and verification clues are private between the claimant, report owner, and campus administrators.
