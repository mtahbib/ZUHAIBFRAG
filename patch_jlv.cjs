const fs = require('fs');
const file = 'src/otherBrands/data/products.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'name: "Jean Lowe Vibe",\n    concentration:',
  'name: "Jean Lowe Vibe",\n    image: "/jlv.png",\n    concentration:'
);

fs.writeFileSync(file, content);
