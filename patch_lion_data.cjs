const fs = require('fs');
const file = 'src/otherBrands/data/products.js';
let lines = fs.readFileSync(file, 'utf8').split('\n');

const startIndex = lines.findIndex(l => l.includes('name: "Rayhaan Lion",'));

// Find the end of this object
let endIndex = startIndex;
while (endIndex < lines.length && !lines[endIndex].includes('sizes:')) {
    endIndex++;
}

if (startIndex !== -1 && endIndex !== -1) {
    const newBlock = `    name: "Rayhaan Lion",
    concentration: "Eau de Parfum",
    gender: "Men",
    family: "Oriental",
    fragranceFamily: "Aromatic / Spicy / Vanilla",
    description:
      "Rayhaan Lion is a sweet, spicy and highly addictive masculine fragrance. It opens with juicy pear, lavender and fresh mint, develops into a warm cinnamon-spicy heart, and dries down into creamy vanilla, amber and woods. It is widely compared with the Jean Paul Gaultier Ultra Mâle DNA.",
    topNotes: ["Pear", "Lavender", "Mint", "Bergamot"],
    heartNotes: ["Cinnamon", "Clary Sage", "Cumin"],
    baseNotes: ["Vanilla", "Amber", "Patchouli", "Cedar"],
    mainAccords: ["Vanilla", "Aromatic", "Sweet", "Fresh Spicy", "Lavender", "Fruity", "Cinnamon", "Amber", "Woody"],
    longevity: 5,
    projection: 5,
    versatility: 4,
    bestSeason: ["Fall", "Winter", "Spring"],
    bestTime: ["Evening", "Night"],
    bestOccasions: ["Date", "Night Out", "Party", "Casual", "Clubbing"],
    released: 2024,
    inspiredBy: "Jean Paul Gaultier Ultra Mâle",
    bestseller: false,
    newArrival: false,
    inStock: true,`;
    
    // sizes is on endIndex
    lines.splice(startIndex, endIndex - startIndex, newBlock);
}

fs.writeFileSync(file, lines.join('\n'));
