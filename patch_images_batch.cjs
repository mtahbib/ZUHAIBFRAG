const fs = require('fs');
const file = 'src/otherBrands/data/products.js';
let content = fs.readFileSync(file, 'utf8');

const mapping = [
  { searchName: "Rayhaan Azul", image: "/azul.png" },
  { searchName: "Beyond Men EDT", image: "/david.png" }, // David beckham
  { searchName: "DXB", image: "/dxb.png" }, // Missoni pour homme / DXB
  { searchName: "Bois Blanc", image: "/bois.png" }, 
  { searchName: "Honor & Glory", image: "/badeealoud.png" },
  { searchName: "Rayhaan Ocean Rush", image: "/ocean.png" },
  { searchName: "Sheikh", image: "/sheikh.png" },
  { searchName: "Rouge French Collection", image: "/haramainrouge.png" },
  { searchName: "Détour Noir", image: "/detour.png" },
  { searchName: "Club de Nuit Urban Elixir", image: "/urban.png" },
  { searchName: "Hawas Fire", image: "/hawasfire.png" },
  { searchName: "Tag Him Uomo Rosso", image: "/taghim.png" },
  { searchName: "Club de Nuit Intense Man Parfum", image: "/cdnim.png" }
];

for (const item of mapping) {
    const safeSearchName = item.searchName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const nameRegex = new RegExp(`name:\\s*"([^"]*?${safeSearchName}?.*?)"`);
    const nameMatch = content.match(nameRegex);
    
    if (nameMatch) {
        const blockStartIndex = content.lastIndexOf('{', nameMatch.index);
        let blockEndIndex = content.indexOf('sizes:', blockStartIndex);
        if (blockEndIndex !== -1) {
            let block = content.substring(blockStartIndex, blockEndIndex);
            
            // If it already has an image, replace it
            if (block.includes('image: "')) {
                block = block.replace(/image:\s*".*?"/, `image: "${item.image}"`);
            } else {
                // Otherwise insert it after name
                block = block.replace(nameMatch[0], `${nameMatch[0]},\n    image: "${item.image}"`);
            }
            
            content = content.substring(0, blockStartIndex) + block + content.substring(blockEndIndex);
            console.log("Updated: " + item.searchName);
        }
    } else {
        console.log("Could not find: " + item.searchName);
    }
}

fs.writeFileSync(file, content);
