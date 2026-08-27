const fs = require('fs');
const file = 'src/otherBrands/data/products.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'image: "/Versace Eros Parfum Teal Bottle.jpg"',
  'image: "/Versace Eros Parfum Teal Bottle.png"'
);

fs.writeFileSync(file, content);
console.log("Updated Eros image to PNG.");
