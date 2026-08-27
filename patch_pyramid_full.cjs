const fs = require('fs');
const file = 'src/otherBrands/pages/ObProductDetail.jsx';
let content = fs.readFileSync(file, 'utf8');

// Ensure notes is an array before joining
content = content.replace(
  '      <div style={{ fontFamily: FONT_SERIF, fontSize: "1.1rem", color: COLORS.espresso, fontStyle: active ? "italic" : "normal" }}>\n        {notes.join(" · ")}\n      </div>',
  '      <div style={{ fontFamily: FONT_SERIF, fontSize: "1.1rem", color: COLORS.espresso, fontStyle: active ? "italic" : "normal" }}>\n        {notes && Array.isArray(notes) ? notes.join(" · ") : "Not specified"}\n      </div>'
);

// Conditionally render the entire pyramid block
content = content.replace(
  `            {/* Fragrance pyramid */}\n            <div>\n              <div style={{ fontFamily: FONT_SANS, fontSize: "10px", letterSpacing: "2px", color: COLORS.espressoFaint, marginBottom: "16px", fontWeight: 600 }}>\n                FRAGRANCE PYRAMID\n              </div>\n              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>\n                <PyramidTier label="TOP NOTES" notes={product.topNotes} accent={accent} active={hoveredTier === "TOP NOTES"} onHover={setHoveredTier} />\n                <div style={{ textAlign: "center", color: COLORS.espressoHairline, fontSize: "10px" }}>▼</div>\n                <PyramidTier label="HEART NOTES" notes={product.heartNotes} accent={accent} active={hoveredTier === "HEART NOTES"} onHover={setHoveredTier} />\n                <div style={{ textAlign: "center", color: COLORS.espressoHairline, fontSize: "10px" }}>▼</div>\n                <PyramidTier label="BASE NOTES" notes={product.baseNotes} accent={accent} active={hoveredTier === "BASE NOTES"} onHover={setHoveredTier} />\n              </div>\n            </div>`,
  `            {/* Fragrance pyramid */}\n            {(product.topNotes || product.heartNotes || product.baseNotes) && (\n              <div>\n                <div style={{ fontFamily: FONT_SANS, fontSize: "10px", letterSpacing: "2px", color: COLORS.espressoFaint, marginBottom: "16px", fontWeight: 600 }}>\n                  FRAGRANCE PYRAMID\n                </div>\n                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>\n                  {product.topNotes && product.topNotes.length > 0 && (\n                    <>\n                      <PyramidTier label="TOP NOTES" notes={product.topNotes} accent={accent} active={hoveredTier === "TOP NOTES"} onHover={setHoveredTier} />\n                      {(product.heartNotes || product.baseNotes) && <div style={{ textAlign: "center", color: COLORS.espressoHairline, fontSize: "10px" }}>▼</div>}\n                    </>\n                  )}\n                  {product.heartNotes && product.heartNotes.length > 0 && (\n                    <>\n                      <PyramidTier label="HEART NOTES" notes={product.heartNotes} accent={accent} active={hoveredTier === "HEART NOTES"} onHover={setHoveredTier} />\n                      {product.baseNotes && <div style={{ textAlign: "center", color: COLORS.espressoHairline, fontSize: "10px" }}>▼</div>}\n                    </>\n                  )}\n                  {product.baseNotes && product.baseNotes.length > 0 && (\n                    <PyramidTier label="BASE NOTES" notes={product.baseNotes} accent={accent} active={hoveredTier === "BASE NOTES"} onHover={setHoveredTier} />\n                  )}\n                </div>\n              </div>\n            )}`
);

// Also fix PerformanceBar crashes if longevity is missing
content = content.replace(
  `              <PerformanceBar label="Longevity" value={product.longevity} accent={accent} />\n              <PerformanceBar label="Projection" value={product.projection} accent={accent} />\n              <PerformanceBar label="Versatility" value={product.versatility} accent={accent} />`,
  `              {product.longevity !== undefined && <PerformanceBar label="Longevity" value={product.longevity} accent={accent} />}\n              {product.projection !== undefined && <PerformanceBar label="Projection" value={product.projection} accent={accent} />}\n              {product.versatility !== undefined && <PerformanceBar label="Versatility" value={product.versatility} accent={accent} />}`
);

fs.writeFileSync(file, content);
