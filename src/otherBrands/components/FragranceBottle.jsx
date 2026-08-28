import { familyTheme } from "../theme";

export default function FragranceBottle({ product, style, dramatic = false, bare = false, viewTransitionId }) {
  const { soft } = familyTheme(product.family);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "4 / 5",
        borderRadius: bare ? 0 : "16px",
        background: bare
          ? "transparent"
          : dramatic
          ? `linear-gradient(to bottom, ${soft}, #ffffff)`
          : `linear-gradient(to bottom, ${soft}, #f9f9f9)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        viewTransitionName: viewTransitionId,
        overflow: bare ? "visible" : "hidden",
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
      </div>
    </div>
  );
}
