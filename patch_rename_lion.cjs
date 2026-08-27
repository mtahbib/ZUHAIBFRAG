const fs = require('fs');
const file = 'src/otherBrands/data/products.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'name: "Rayhaan Elixir",',
  'name: "Rayhaan Lion",'
);

fs.writeFileSync(file, content);
