const fs = require('fs');
const file = 'src/otherBrands/components/FragranceBottle.jsx';

const newContent = `import { familyTheme } from "../theme";

export default function FragranceBottle({ product, style, dramatic = false, viewTransitionId }) {
  const { soft } = familyTheme(product.family);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "4 / 5",
        borderRadius: "16px",
        background: dramatic
          ? \`linear-gradient(to bottom, \${soft}, #ffffff)\`
          : \`linear-gradient(to bottom, \${soft}, #f9f9f9)\`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        viewTransitionName: viewTransitionId,
        overflow: "hidden",
        ...style,
      }}
    >
      <div style={{ position: "relative", width: "85%", height: "85%" }}>
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
              ? "drop-shadow(0 22px 28px rgba(0,0,0,0.3))"
              : "drop-shadow(0 10px 14px rgba(0,0,0,0.18))",
          }}
        />
      </div>
    </div>
  );
}
`;

fs.writeFileSync(file, newContent);
