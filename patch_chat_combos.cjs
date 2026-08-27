const fs = require('fs');
const file = 'api/chat.js';
let content = fs.readFileSync(file, 'utf8');

const ybTarget = `- Once you do recommend, for EACH product follow this exact order:`;
const ybReplacement = `- **Combo Packages**: You are highly encouraged to suggest custom "Combo Packages" (e.g., "Day & Night Duo", "Fresh Starter Pack") when a customer is looking for gifts, building a collection, or can't decide. Bundle 2-3 complimentary fragrances together, explain why they pair perfectly, and combine their decant prices as a package.
- Once you do recommend individual products or combos, for EACH product follow this exact order:`;

const obTarget = `- Once you do recommend, for EACH product follow this exact order:`;
const obReplacement = `- **Combo Packages**: You are highly encouraged to suggest custom "Combo Packages" (e.g., "Day & Night Duo", "Designer Clone Starter Pack") when a customer is looking for gifts, building a collection, or can't decide. Bundle 2-3 complimentary fragrances together, explain why they pair perfectly, and present their decant prices as a curated package.
- Once you do recommend individual products or combos, for EACH product follow this exact order:`;

content = content.replace(ybTarget, ybReplacement);
content = content.replace(obTarget, obReplacement);

fs.writeFileSync(file, content);
