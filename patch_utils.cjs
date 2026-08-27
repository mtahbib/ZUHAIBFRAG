const fs = require('fs');
const file = 'src/otherBrands/utils.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'const productNotes = new Set([...product.topNotes, ...product.heartNotes, ...product.baseNotes]);',
  'const productNotes = new Set([...(product.topNotes||[]), ...(product.heartNotes||[]), ...(product.baseNotes||[])]);'
);

content = content.replace(
  'const notes = [...p.topNotes, ...p.heartNotes, ...p.baseNotes];',
  'const notes = [...(p.topNotes||[]), ...(p.heartNotes||[]), ...(p.baseNotes||[])];'
);

fs.writeFileSync(file, content);
