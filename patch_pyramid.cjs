const fs = require('fs');
const file = 'src/otherBrands/pages/ObProductDetail.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '{notes.join(" · ")}',
  '{notes ? notes.join(" · ") : "Not specified"}'
);

content = content.replace(
  '<PyramidTier label="TOP NOTES" notes={product.topNotes}',
  '{product.topNotes && product.topNotes.length > 0 && <PyramidTier label="TOP NOTES" notes={product.topNotes}'
).replace(
  '<div style={{ textAlign: "center", color: COLORS.espressoHairline, fontSize: "10px" }}>▼</div>',
  '{product.topNotes && product.topNotes.length > 0 && <div style={{ textAlign: "center", color: COLORS.espressoHairline, fontSize: "10px" }}>▼</div>}'
).replace(
  '<PyramidTier label="HEART NOTES" notes={product.heartNotes}',
  '{product.heartNotes && product.heartNotes.length > 0 && <PyramidTier label="HEART NOTES" notes={product.heartNotes}'
).replace(
  '<div style={{ textAlign: "center", color: COLORS.espressoHairline, fontSize: "10px" }}>▼</div>',
  '{product.heartNotes && product.heartNotes.length > 0 && <div style={{ textAlign: "center", color: COLORS.espressoHairline, fontSize: "10px" }}>▼</div>}'
).replace(
  '<PyramidTier label="BASE NOTES" notes={product.baseNotes}',
  '{product.baseNotes && product.baseNotes.length > 0 && <PyramidTier label="BASE NOTES" notes={product.baseNotes}'
);

// Wait, the replace string might not match perfectly if there are multiple occurrences.
// A better way is to conditionally render the whole FRAGRANCE PYRAMID block if notes exist.
