const fs = require('fs');
const file = 'src/otherBrands/pages/ObShop.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'background: COLORS.ivory',
  'background: `radial-gradient(ellipse at top, #FFF5EB, ${COLORS.ivory})`'
);

fs.writeFileSync(file, content);
