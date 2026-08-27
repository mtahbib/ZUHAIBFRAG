const fs = require('fs');
const file = 'src/otherBrands/components/ObProductCard.jsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

const infoIndex = lines.findIndex(l => l.includes('{/* Info */}'));
if (infoIndex !== -1) {
    // replace lines from infoIndex+1 to infoIndex+4 with proper div structure
    lines.splice(infoIndex + 1, 4,
        '      <div style={{ padding: "18px 20px 22px" }}>',
        '        <div style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: "11px", letterSpacing: "2.5px", color: COLORS.espressoSoft, marginBottom: "5px" }}>',
        '          {product.brand.toUpperCase()}',
        '        </div>',
        '        <div'
    );
}

fs.writeFileSync(file, lines.join('\n'));
