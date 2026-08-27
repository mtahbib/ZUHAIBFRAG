const fs = require('fs');
const file = 'src/otherBrands/data/products.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'name: "Khadlaj Island",\n    concentration:',
  'name: "Khadlaj Island",\n    image: "/ki.png",\n    concentration:'
);

fs.writeFileSync(file, content);
