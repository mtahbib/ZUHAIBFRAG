const fs = require('fs');
const file = 'src/otherBrands/components/ObProductCard.jsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

const infoIndex = lines.findIndex(l => l.includes('{/* Info */}'));
if (infoIndex !== -1) {
    lines[infoIndex + 1] = '      <div style={{ padding: "18px 20px 22px" }}>';
    lines[infoIndex + 2] = '        <div style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: "11px", letterSpacing: "2.5px", color: COLORS.espressoSoft, marginBottom: "5px" }}>';
    lines[infoIndex + 3] = '          {product.brand.toUpperCase()}';
    lines[infoIndex + 4] = '        </div>';
}

fs.writeFileSync(file, lines.join('\n'));
