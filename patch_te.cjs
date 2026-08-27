const fs = require('fs');
const file = 'src/otherBrands/data/products.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'name: "Turathi Electric",\n    concentration:',
  'name: "Turathi Electric",\n    image: "/te.png",\n    concentration:'
);

fs.writeFileSync(file, content);
