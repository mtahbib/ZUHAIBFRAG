const fs = require('fs');
const file = 'src/otherBrands/data/products.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'name: "Asad Zanzibar",\n    concentration:',
  'name: "Asad Zanzibar",\n    image: "/az.png",\n    concentration:'
);

fs.writeFileSync(file, content);
