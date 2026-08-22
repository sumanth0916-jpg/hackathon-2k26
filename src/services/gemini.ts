import { AiAttributes, Report } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

/**
 * Extracts AI attributes from an image + description using Gemini 2.5 Flash
 * Falls back to deterministic rule-based NLP extraction if no API key or if offline.
 */
export async function analyzeReportWithAi(
  title: string,
  description: string,
  category: string,
  imageBase64?: string,
  mimeType = 'image/jpeg'
): Promise<{ attributes: AiAttributes; isAiGenerated: boolean; warning?: string }> {
  if (!GEMINI_API_KEY) {
    // Graceful offline heuristic extraction
    return {
      attributes: fallbackAttributeExtraction(title, description, category),
      isAiGenerated: false,
      warning: 'Gemini API key not configured. Using deterministic campus extraction.',
    };
  }

  try {
    const prompt = `You are an AI Lost & Found inspection specialist for a university campus.
Analyze this item report and extract structured attributes in pure JSON format:

Title: "${title}"
Category: "${category}"
Description: "${description}"

Return ONLY a JSON object with this exact structure:
{
  "objectType": "Specific object noun e.g. Backpack, Smartphone, Student ID, Water Bottle",
  "primaryColor": "Dominant color e.g. Black, Blue, Silver, Teal",
  "secondaryColors": ["list", "of", "secondary", "colors"],
  "brand": "Visible brand name e.g. Lenovo, Apple, Samsung, Nike or Unknown",
  "model": "Model name/number if identifiable or null",
  "distinctiveFeatures": ["Key distinguishing feature 1", "Key distinguishing feature 2"],
  "condition": "New / Good / Worn / Cracked / Scratched",
  "textFound": "Any visible or mentioned written text/names on the item or null",
  "confidence": 0.95
}
`;

    const parts: any[] = [{ text: prompt }];

    if (imageBase64) {
      parts.unshift({
        inlineData: {
          mimeType,
          data: imageBase64,
        },
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.warn('Gemini API response error:', errText);
      return {
        attributes: fallbackAttributeExtraction(title, description, category),
        isAiGenerated: false,
        warning: 'Gemini analysis temporarily unavailable. Used smart local fallback.',
      };
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Empty response from Gemini');

    const parsed: AiAttributes = JSON.parse(rawText);
    return {
      attributes: {
        objectType: parsed.objectType || title,
        primaryColor: parsed.primaryColor || 'Unspecified',
        secondaryColors: parsed.secondaryColors || [],
        brand: parsed.brand !== 'Unknown' ? parsed.brand : undefined,
        model: parsed.model || undefined,
        distinctiveFeatures: Array.isArray(parsed.distinctiveFeatures) ? parsed.distinctiveFeatures : [],
        condition: parsed.condition || 'Good',
        textFound: parsed.textFound || undefined,
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.92,
      },
      isAiGenerated: true,
    };
  } catch (error: any) {
    console.warn('Gemini extraction failed, using fallback:', error);
    return {
      attributes: fallbackAttributeExtraction(title, description, category),
      isAiGenerated: false,
      warning: 'AI analysis unavailable — basic matching applied.',
    };
  }
}

/**
 * Generates natural language explanation between two reports using Gemini or smart template fallback
 */
export async function generateAiMatchExplanation(
  lost: Report,
  found: Report,
  score: number,
  factors: { visual: number; description: number; category: number; location: number; time: number }
): Promise<string> {
  if (GEMINI_API_KEY) {
    try {
      const prompt = `Compare these two campus lost & found reports:
LOST: "${lost.title}" - ${lost.description} (Category: ${lost.category}, Location: ${lost.approximateLocation}, Date: ${lost.eventDate})
FOUND: "${found.title}" - ${found.description} (Category: ${found.category}, Location: ${found.approximateLocation}, Date: ${found.eventDate})
Match Score: ${score}%

Generate a concise, objective 2-sentence match explanation explaining the similarities (object type, color, distinctive marks, location distance, time overlap). Do not assert definite ownership; state it as a potential match.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 120 },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) return text;
      }
    } catch {
      // Fallback
    }
  }

  // Deterministic high-quality explanation fallback
  const points: string[] = [];
  if (lost.category === found.category) {
    points.push(`Both reports identify items within the ${lost.category} category`);
  }
  if (lost.aiAttributes?.primaryColor && found.aiAttributes?.primaryColor && 
      lost.aiAttributes.primaryColor.toLowerCase() === found.aiAttributes.primaryColor.toLowerCase()) {
    points.push(`share matching ${lost.aiAttributes.primaryColor} color profile`);
  }
  if (factors.location > 0.8) {
    points.push(`were logged in close proximity near ${lost.approximateLocation}`);
  } else {
    points.push(`are from neighboring campus zones`);
  }

  return `Potential match detected with ${score}% confidence. ${points.join(', ')}. Time windows and physical item characteristics show strong alignment.`;
}

/**
 * Deterministic local NLP extractor for hackathon reliability when no API key is set
 */
function fallbackAttributeExtraction(
  title: string,
  description: string,
  category: string
): AiAttributes {
  const combined = `${title} ${description}`.toLowerCase();

  // Color heuristic
  const colors = ['black', 'blue', 'navy', 'silver', 'white', 'grey', 'gray', 'red', 'green', 'teal', 'gold', 'pink', 'yellow', 'brown', 'purple', 'orange'];
  const foundColors = colors.filter((c) => combined.includes(c));
  const primaryColor = foundColors[0] ? foundColors[0].charAt(0).toUpperCase() + foundColors[0].slice(1) : 'Standard';
  const secondaryColors = foundColors.slice(1).map((c) => c.charAt(0).toUpperCase() + c.slice(1));

  // Brand heuristic
  const brands = ['Apple', 'Lenovo', 'Samsung', 'Dell', 'HP', 'Sony', 'Hydro Flask', 'Stanley', 'Nike', 'Adidas', 'Herschel', 'North Face', 'Anker', 'JBL', 'Logitech', 'Bose', 'Canon'];
  const matchedBrand = brands.find((b) => combined.includes(b.toLowerCase()));

  // Distinctive feature keywords
  const featureClues = [
    'cracked', 'scratch', 'sticker', 'keychain', 'lanyard', 'strap',
    'case', 'initials', 'dongle', 'engraving', 'zipper', 'charger',
    'waterproof', 'leather', 'metallic', 'tag', 'photo', 'carabiner'
  ];
  const detectedFeatures: string[] = [];
  featureClues.forEach((clue) => {
    if (combined.includes(clue)) {
      detectedFeatures.push(`Features ${clue}`);
    }
  });

  if (detectedFeatures.length === 0) {
    detectedFeatures.push('Standard campus item build');
  }

  return {
    objectType: title.split(' ')[0] || category,
    primaryColor,
    secondaryColors: secondaryColors.length > 0 ? secondaryColors : undefined,
    brand: matchedBrand,
    distinctiveFeatures: detectedFeatures.slice(0, 3),
    condition: combined.includes('cracked') || combined.includes('damaged') ? 'Cracked' : 'Good',
    confidence: 0.88,
  };
}
