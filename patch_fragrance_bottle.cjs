const fs = require('fs');
const file = 'src/otherBrands/components/FragranceBottle.jsx';
let content = fs.readFileSync(file, 'utf8');

// The original file is:
// export default function FragranceBottle({ product, style, dramatic = false, bare = false, viewTransitionId }) {
// ...
//      <div style={{ position: "relative", width: "85%", height: "85%" }}>
//        <img
//          src={product.image || "/bottle.png"}
//          alt={product.name}
//          style={{
//            position: "relative",
//            width: "100%",
//            height: "100%",
//            objectFit: "contain",
//            objectPosition: "center",
//            filter: dramatic
//              ? "drop-shadow(0 26px 34px rgba(33,28,24,0.28))"
//              : "drop-shadow(0 10px 14px rgba(0,0,0,0.18))",
//          }}
//        />
//      </div>

const newImgBlock = `      <div style={{ position: "relative", width: "85%", height: "85%" }}>
        <img
          src={product.image || "/bottle.png"}
          alt={product.name}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            filter: dramatic
              ? "drop-shadow(0 26px 34px rgba(33,28,24,0.28))"
              : "drop-shadow(0 10px 14px rgba(0,0,0,0.18))",
          }}
        />
        {/* Conditional watermark for Liquid Brun */}
        {product.name === "Liquid Brun" && (
          <img
            src="/watermark.png"
            alt="Zuhaib Fragrance"
            style={{
              position: "absolute",
              bottom: "5%",
              right: "5%",
              width: "25%",
              height: "auto",
              opacity: 0.85,
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
              pointerEvents: "none",
              zIndex: 10
            }}
          />
        )}
      </div>`;

content = content.replace(/<div style=\{\{ position: "relative", width: "85%", height: "85%" \}\}>[\s\S]*?<\/div>/, newImgBlock);

fs.writeFileSync(file, content);
