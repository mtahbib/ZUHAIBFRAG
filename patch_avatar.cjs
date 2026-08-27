const fs = require('fs');
const files = ['src/components/Parvej.jsx', 'src/otherBrands/components/ObParvej.jsx'];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Replace Avatar component
  content = content.replace(
    /function Avatar\(\{ size = \d+ \}\) \{\s+return \(\s+<div style=\{\{\s+width: size, height: size, borderRadius: "50%", flexShrink: 0,\s+background: "linear-gradient[^>]+>\s+<div[^>]+>P<\/div>\s+<\/div>\s+\);\s+\}/m,
    `function Avatar({ size = 28 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: "linear-gradient(135deg, #D4AF37, #9a6f1a)",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden"
    }}>
      <img src="/parvex.png" alt="Parvez" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
}`
  );
  
  // Actually the regex might fail due to exact whitespace.
  // Let's use a simpler regex
  content = content.replace(
    /function Avatar\(\{ size = \d+ \}\) \{[\s\S]*?return \([\s\S]*?P<\/div>\s*\);\s*\}/,
    `function Avatar({ size = 28 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: "linear-gradient(135deg, #D4AF37, #9a6f1a)",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden",
      border: "1px solid rgba(212,175,55,0.4)"
    }}>
      <img src="/parvex.png" alt="Parvez" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
}`
  );

  fs.writeFileSync(file, content);
}
