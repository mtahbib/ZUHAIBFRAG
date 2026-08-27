const fs = require('fs');
const file = 'src/otherBrands/components/ObProductCard.jsx';
let content = fs.readFileSync(file, 'utf8');

const target = `<div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <span style={{ fontFamily: FONT_SANS, fontSize: "11px", color: COLORS.espressoFaint }}>
            {product.family}
          </span>
        </div>`;

const replacement = `<div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <span style={{
            background: COLORS.copperSoft,
            border: \`1px solid \${COLORS.espressoHairline}\`,
            color: COLORS.copper,
            fontSize: "8.5px",
            letterSpacing: "2px",
            padding: "4px 10px",
            borderRadius: "999px",
            fontFamily: FONT_SANS,
            fontWeight: 600,
            textTransform: "uppercase",
          }}>
            {product.family}
          </span>
        </div>`;

content = content.replace(target, replacement);
fs.writeFileSync(file, content);
