const fs = require('fs');
const file = 'src/otherBrands/components/ObHero.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'background: \`linear-gradient(175deg, \${STONE}, \${STONE_DEEP})\`,',
  'background: \`radial-gradient(circle at 60% 40%, #FFF5EB 0%, \${STONE} 60%, \${STONE_DEEP} 100%)\`,'
);

fs.writeFileSync(file, content);
