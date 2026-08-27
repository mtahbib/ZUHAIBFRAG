const fs = require('fs');
const file = 'src/otherBrands/components/ObProductCard.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'border: `1px solid ${COLORS.espressoHairline}`,',
  'border: hovered ? `1px solid rgba(166,106,76,0.3)` : `1px solid ${COLORS.espressoHairline}`,'
);

content = content.replace(
  'boxShadow: hovered ? "0 22px 46px rgba(33,28,24,0.12)" : "0 1px 0 rgba(33,28,24,0.03)",',
  'boxShadow: hovered ? "0 22px 46px rgba(33,28,24,0.12), 0 0 0 3px rgba(166,106,76,0.05)" : "0 1px 0 rgba(33,28,24,0.03)",'
);

fs.writeFileSync(file, content);
