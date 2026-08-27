const fs = require('fs');
const file = 'src/otherBrands/data/products.js';
let lines = fs.readFileSync(file, 'utf8').split('\n');

// 1. Remove Dark Door Intense
const darkDoorStart = lines.findIndex(l => l.includes('name: "Dark Door Intense",'));
if (darkDoorStart !== -1) {
    // Find the enclosing {
    let start = darkDoorStart;
    while (start >= 0 && !lines[start].includes('{')) start--;
    
    // Find the enclosing },
    let end = darkDoorStart;
    while (end < lines.length && !lines[end].includes('},')) end++;
    
    // Remove the block
    lines.splice(start, (end - start) + 1);
}

// 2. Remove /lb.png from Liquid Brun
const lbIndex = lines.findIndex(l => l.includes('image: "/lb.png",'));
if (lbIndex !== -1) {
    lines.splice(lbIndex, 1);
}

// 3. Add /lb.png to Liquid Brun Limited Edition
const lbLeIndex = lines.findIndex(l => l.includes('name: "Liquid Brun Limited Edition",'));
if (lbLeIndex !== -1) {
    lines.splice(lbLeIndex + 1, 0, '    image: "/lb.png",');
}

fs.writeFileSync(file, lines.join('\n'));
