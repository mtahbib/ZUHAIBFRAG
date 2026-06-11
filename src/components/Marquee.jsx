const ITEMS = [
  "ZUHAIB FRAGRANCE",
  "AUTHENTIC YUSUF BHAI",
  "DUBAI'S FINEST",
  "DELIVERED ACROSS BANGLADESH",
  "PREMIUM INSPIRED FRAGRANCES",
  "LUXURY PERFORMANCE",
  "100% AUTHENTIC",
];

export default function Marquee({ inverted = false }) {
  const row = [...ITEMS, ...ITEMS];

  return (
    <div
      aria-hidden="true"
      style={{
        background: inverted ? "rgba(212,175,55,0.06)" : "#060504",
        borderTop: "1px solid rgba(212,175,55,0.09)",
        borderBottom: "1px solid rgba(212,175,55,0.09)",
        overflow: "hidden",
        padding: "14px 0",
        position: "relative",
        zIndex: 5,
      }}
    >
      <style>{`
        @keyframes _marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes _marquee-r { from { transform: translateX(-50%); } to { transform: translateX(0); } }
      `}</style>
      <div
        style={{
          display: "flex",
          width: "max-content",
          animation: `${inverted ? "_marquee-r" : "_marquee"} 30s linear infinite`,
        }}
      >
        {row.map((item, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0 32px",
              color: inverted ? "rgba(212,175,55,0.7)" : "rgba(212,175,55,0.38)",
              fontSize: "8px",
              letterSpacing: "5px",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 400,
              whiteSpace: "nowrap",
            }}
          >
            {item}
            <span style={{ marginLeft: "32px", fontSize: "5px", opacity: 0.5 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
