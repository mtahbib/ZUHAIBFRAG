const fs = require('fs');
const file = 'src/otherBrands/data/products.js';
let content = fs.readFileSync(file, 'utf8');

// The user asked to rename "Rayhaan Elixir" to "Rayhaan Nocturno Elixir".
// If I do that, there will be two "Rayhaan Nocturno Elixir"s.
console.log(content.match(/Rayhaan Nocturno Elixir/g).length);
