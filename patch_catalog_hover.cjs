const fs = require('fs');
const file = 'src/otherBrands/components/ObCatalog.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'boxShadow: hov ? "0 22px 44px rgba(33,28,24,0.1)" : "0 0px 0px rgba(33,28,24,0)",',
  'boxShadow: hov ? "0 30px 60px rgba(33,28,24,0.12), 0 0 0 4px rgba(166,106,76,0.06)" : "0 4px 12px rgba(33,28,24,0.02)",'
);

fs.writeFileSync(file, content);
