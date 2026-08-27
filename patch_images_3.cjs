const fs = require('fs');
const file = 'src/otherBrands/data/products.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'name: "Rayhaan Corium",\n    concentration:',
  'name: "Rayhaan Corium",\n    image: "/cor.png",\n    concentration:'
);

content = content.replace(
  'name: "Rayhaan Lion",\n    concentration:',
  'name: "Rayhaan Lion",\n    image: "/lion.png",\n    concentration:'
);

fs.writeFileSync(file, content);
