import { useEffect, useState } from "react";

const LETTERS = "ZUHAIB".split("");

export default function Loader({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18 + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => setFade(true), 400);
        setTimeout(() => onFinish(), 1100);
      }
      setProgress(Math.min(p, 100));
    }, 110);
    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        zIndex: 999999,
        transition: "opacity 0.7s ease",
        opacity: fade ? 0 : 1,
        pointerEvents: fade ? "none" : "all",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 65%)",
          filter: "blur(50px)",
          animation: "pulse-glow 3s ease-in-out infinite",
        }}
      />

      {/* Letters */}
      <div style={{ display: "flex", gap: "2px", position: "relative", zIndex: 2 }}>
        {LETTERS.map((letter, i) => (
          <span
            key={i}
            style={{
              color: "#fff",
              fontSize: "clamp(3.5rem,11vw,8rem)",
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              letterSpacing: "0.12em",
              animation: "float-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
              animationDelay: `${i * 0.07}s`,
              opacity: 0,
              lineHeight: 1,
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      <div
        style={{
          color: "#D4AF37",
          letterSpacing: "14px",
          marginTop: "12px",
          fontSize: "11px",
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 300,
          animation: "float-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s forwards",
          opacity: 0,
          position: "relative",
          zIndex: 2,
        }}
      >
        FRAGRANCE
      </div>

      {/* Progress bar */}
      <div
        style={{
          marginTop: "70px",
          width: "220px",
          height: "1px",
          background: "rgba(255,255,255,0.06)",
          borderRadius: "1px",
          overflow: "hidden",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.8), #fff)",
            transition: "width 0.1s ease",
          }}
        />
      </div>

      <div
        style={{
          marginTop: "16px",
          color: "#333",
          letterSpacing: "5px",
          fontSize: "10px",
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 300,
          position: "relative",
          zIndex: 2,
        }}
      >
        {Math.floor(progress)}%
      </div>
    </div>
  );
}
