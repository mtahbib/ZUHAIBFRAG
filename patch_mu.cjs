const fs = require('fs');
const file = 'src/otherBrands/data/products.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'name: "Modest Une",\n    concentration:',
  'name: "Modest Une",\n    image: "/mu.png",\n    concentration:'
);

fs.writeFileSync(file, content);
