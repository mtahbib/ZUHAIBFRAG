const fs = require('fs');
const file = 'api/chat.js';
let content = fs.readFileSync(file, 'utf8');

// We will completely replace the system instructions and logic.
const newContent = `import { products } from "../src/data/products.js";
import { otherBrandsProducts } from "../src/otherBrands/data/products.js";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

function buildYbCatalogContext() {
  return products.map((p) => ({
    name: p.name,
    category: p.category,
    price: p.price,
    decants: p.decants?.map((d) => \`\${d.size} \${d.price}\`).join(", ") || "none",
    inspiration: p.inspiration,
    notes: p.notes,
    topNotes: p.topNotes,
    heartNotes: p.heartNotes,
    baseNotes: p.baseNotes,
    description: p.description,
    tagline: p.tagline,
    fragranceFamily: p.fragranceFamily,
    perfectFor: p.perfectFor,
    performance: p.performance,
    soldOut: !!p.soldOut,
  }));
}

function buildObCatalogContext() {
  return otherBrandsProducts.map((p) => ({
    brand: p.brand,
    name: p.name,
    gender: p.gender,
    concentration: p.concentration,
    family: p.fragranceFamily || p.family,
    mainAccords: p.mainAccords,
    description: p.description,
    inspiredBy: p.inspiredBy,
    startingPrice: p.startingPrice ? \`৳\${p.startingPrice}\` : "pricing coming soon",
    decants: Object.entries(p.sizes || {}).map(([size, price]) => \`\${size} ৳\${price}\`).join(", "),
    topNotes: p.topNotes,
    heartNotes: p.heartNotes,
    baseNotes: p.baseNotes,
    longevityRating: p.longevity,
    projectionRating: p.projection,
    versatilityRating: p.versatility,
    bestOccasions: p.bestOccasions,
    bestSeason: p.bestSeason,
    bestTime: p.bestTime,
    inStock: !!p.inStock,
  }));
}

const UNIFIED_SYSTEM_INSTRUCTION = \`You are Parvej, the highly knowledgeable and exceptionally smart fragrance guide chatbot for Zuhaib Fragrance, a premium online perfume shop in Bangladesh.

Zuhaib Fragrance sells TWO main collections:
1. "Yusuf Bhai": Our own premium signature line (listed under the YUSUF_BHAI_CATALOG).
2. "Other Brands": A curated collection of imported designer and niche fragrances sold as decants (listed under the OTHER_BRANDS_CATALOG).

Rules for Parvej:
- YOU HAVE ACCESS TO BOTH CATALOGS. You are incredibly smart and can cross-recommend between our Yusuf Bhai signatures and the designer decants in Other Brands based on the customer's needs.
- ONLY recommend products from the provided JSON catalogs. NEVER invent products, brands, notes, or prices.
- Prices are in Bangladeshi Taka. Always quote the exact prices from the catalog (e.g., "৳4,100" for full bottles, or list the specific decant sizes like "5ml ৳299").
- Be a genuinely engaging, intelligent, and warm fragrance expert. If the customer is vague, ask 1-2 sharp follow-up questions to narrow it down (e.g., "Are you looking for a fresh daytime scent for the office, or a sweet, rich fragrance for date night?").
- Show off your deep expertise! Use the rich details from the catalogs ("description", "inspiration"/"inspiredBy", "topNotes", "heartNotes", "baseNotes", "mainAccords", "longevityRating") to vividly describe the scent and explain precisely why it fits them.
- **Cross-Selling & Alternatives**: If they ask for a specific vibe (e.g., "Aventus clone"), you can confidently recommend Armaf Club de Nuit Intense Man from Other Brands, OR suggest a Yusuf Bhai alternative if it fits!
- **Combo Packages**: You are highly encouraged to invent and suggest custom "Combo Packages" (e.g., "The Ultimate Date Night Duo", "Fresh & Dark Starter Kit"). Bundle 2-3 complimentary fragrances (can mix Yusuf Bhai and Other Brands!), explain why they pair perfectly, and present their decant prices as a curated package.
- When recommending a product, follow this exact order: (1) The **Brand & Product Name** in bold, (2) a vivid, expert description of why it fits and what it smells like, (3) the prices (full bottle for Yusuf Bhai, or decant sizes for Other Brands).
- Keep replies conversational, enthusiastic, and structured. Use bullet points for readability when listing multiple options.
- If a product is marked soldOut: true or inStock: false, mention it's out of stock and confidently suggest the next best alternative.
- Never say you are an AI model or mention "Gemini" — stay in character as Parvej.\`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server misconfigured: missing GEMINI_API_KEY" });
    return;
  }

  const { message, history } = req.body || {};
  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "Missing 'message' string" });
    return;
  }

  // We now feed BOTH catalogs to the bot regardless of which page the user is on.
  const yusufBhaiCatalog = buildYbCatalogContext();
  const otherBrandsCatalog = buildObCatalogContext();

  const contents = [
    ...(Array.isArray(history)
      ? history.slice(-6).map((h) => ({
          role: h.sender === "user" ? "user" : "model",
          parts: [{ text: String(h.text || "") }],
        }))
      : []),
    { role: "user", parts: [{ text: message }] },
  ];

  try {
    const geminiRes = await fetch(\`\${GEMINI_URL}?key=\${apiKey}\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            { text: \`\${UNIFIED_SYSTEM_INSTRUCTION}\\n\\n--- YUSUF_BHAI_CATALOG ---\\n\${JSON.stringify(yusufBhaiCatalog)}\\n\\n--- OTHER_BRANDS_CATALOG ---\\n\${JSON.stringify(otherBrandsCatalog)}\` },
          ],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", geminiRes.status, errText);
      res.status(502).json({ error: "Gemini request failed" });
      return;
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("").trim();

    if (!text) {
      res.status(502).json({ error: "Empty response from Gemini" });
      return;
    }

    res.status(200).json({ text });
  } catch (err) {
    console.error("Gemini proxy error:", err);
    res.status(500).json({ error: "Internal error" });
  }
}
`;

fs.writeFileSync(file, newContent);
