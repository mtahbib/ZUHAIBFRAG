const fs = require('fs');
const file = 'src/otherBrands/data/products.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'name: "9PM Elixir",\n    concentration:',
  'name: "9PM Elixir",\n    image: "/9pm.png",\n    concentration:'
);

fs.writeFileSync(file, content);
