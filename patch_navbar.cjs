const fs = require('fs');
const file = 'src/otherBrands/components/ObNavbar.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace standard white background with frosted glass
content = content.replace(
  'background: isSolid ? "rgba(255,255,255,0.98)" : "transparent",',
  'background: isSolid ? "rgba(245,240,231,0.75)" : "transparent",\n          backdropFilter: isSolid ? "blur(16px) saturate(1.8)" : "none",\n          WebkitBackdropFilter: isSolid ? "blur(16px) saturate(1.8)" : "none",'
);

fs.writeFileSync(file, content);
