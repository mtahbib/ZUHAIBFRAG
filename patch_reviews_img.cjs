const fs = require('fs');
const file = 'src/otherBrands/components/ObReviews.jsx';
let content = fs.readFileSync(file, 'utf8');

const target = `        <div>
          <div style={{ fontFamily: FONT_SANS, fontSize: "10.5px", letterSpacing: "0.5px", color: COLORS.espressoSoft, fontWeight: 600 }}>
            {review.name}
          </div>
          <div style={{ fontFamily: FONT_SANS, fontSize: "9.5px", color: COLORS.espressoFaint }}>{review.location}</div>
        </div>`;

const replacement = `        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {review.image && (
            <img src={review.image} alt={review.name} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
          )}
          <div>
            <div style={{ fontFamily: FONT_SANS, fontSize: "10.5px", letterSpacing: "0.5px", color: COLORS.espressoSoft, fontWeight: 600 }}>
              {review.name}
            </div>
            <div style={{ fontFamily: FONT_SANS, fontSize: "9.5px", color: COLORS.espressoFaint }}>{review.location}</div>
          </div>
        </div>`;

content = content.replace(target, replacement);
fs.writeFileSync(file, content);
