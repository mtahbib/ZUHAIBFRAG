const fs = require('fs');
const file = 'src/otherBrands/data/products.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'name: "Rayhaan Nocturno Elixir",\n    concentration:',
  'name: "Rayhaan Nocturno Elixir",\n    image: "/noc.png",\n    concentration:'
);

content = content.replace(
  'name: "Daarej Extrait",\n    concentration:',
  'name: "Daarej Extrait",\n    image: "/dare.png",\n    concentration:'
);

fs.writeFileSync(file, content);
