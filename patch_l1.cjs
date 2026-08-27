const fs = require('fs');
const file = 'src/otherBrands/data/products.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'name: "Liquid Brun",\n    concentration:',
  'name: "Liquid Brun",\n    image: "/l1.png",\n    concentration:'
);

fs.writeFileSync(file, content);
