const fs = require('fs');
const file = 'src/otherBrands/data/products.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'name: "Alpine Homme Sport",\n    concentration:',
  'name: "Alpine Homme Sport",\n    image: "/ah.png",\n    concentration:'
);

fs.writeFileSync(file, content);
