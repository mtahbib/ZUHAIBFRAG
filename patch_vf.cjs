const fs = require('fs');
const file = 'src/otherBrands/data/products.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'name: "Vulcan Feu",\n    concentration:',
  'name: "Vulcan Feu",\n    image: "/vf.png",\n    concentration:'
);

fs.writeFileSync(file, content);
