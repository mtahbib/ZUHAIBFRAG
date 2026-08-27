const fs = require('fs');
const file = 'src/otherBrands/components/ObReviews.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '<div\n      onMouseEnter={() => setHov(true)}',
  '<a\n      href={review.url}\n      target="_blank"\n      rel="noopener noreferrer"\n      onMouseEnter={() => setHov(true)}'
);

content = content.replace(
  'transition: "transform 0.4s ease, box-shadow 0.4s ease, border-color 0.3s ease",',
  'transition: "transform 0.4s ease, box-shadow 0.4s ease, border-color 0.3s ease",\n        textDecoration: "none",\n        display: "block",'
);

// We need to change the closing </div> of QuoteCard to </a>
// It's the one before export default function ObReviews()
const parts = content.split('export default function ObReviews()');
const firstPartLines = parts[0].split('\n');
for (let i = firstPartLines.length - 1; i >= 0; i--) {
  if (firstPartLines[i].trim() === '</div>') {
    firstPartLines[i] = firstPartLines[i].replace('</div>', '</a>');
    break;
  }
}
parts[0] = firstPartLines.join('\n');
content = parts.join('export default function ObReviews()');

fs.writeFileSync(file, content);
