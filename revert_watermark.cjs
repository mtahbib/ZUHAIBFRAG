const fs = require('fs');
const file = 'src/otherBrands/components/FragranceBottle.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /\{\/\* Conditional watermark for Liquid Brun \*\/\}[\s\S]*?\}\)/;
content = content.replace(regex, '');

fs.writeFileSync(file, content);
