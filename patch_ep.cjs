const fs = require('fs');
const file = 'src/otherBrands/data/products.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'name: "Exquisite Privé",\n    concentration:',
  'name: "Exquisite Privé",\n    image: "/ep.png",\n    concentration:'
);

fs.writeFileSync(file, content);
