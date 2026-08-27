import { useEffect, useState } from "react";

const LETTERS = "ZUHAIB".split("");

// Stable, gently randomized mist puffs drifting up from the nozzle.
const MIST_PARTICLES = Array.from({ length: 7 }).map((_, i) => ({
  id: i,
  x: -16 + i * 5.5 + (i % 2 === 0 ? -3 : 3),
  drift: (i % 2 === 0 ? -1 : 1) * (8 + i * 3),
  size: 4 + (i % 3),
  duration: 1.5 + (i % 4) * 0.25,
  delay: i * 0.16,
}));

// A denser one-shot burst fired the moment loading completes.
const BURST_PARTICLES = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  x: -20 + i * 3.6,
  drift: (i % 2 === 0 ? -1 : 1) * (18 + (i % 5) * 8),
  size: 4 + (i % 4),
  delay: (i % 6) * 0.03,
}));

export default function Loader({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [burst, setBurst] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18 + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setBurst(true);
        setTimeout(() => setFade(true), 550);
        setTimeout(() => onFinish(), 1300);
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

      {/* Perfume bottle + spray */}
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          marginBottom: "34px",
          zIndex: 2,
        }}
      >
        {/* Mist plume, anchored above the nozzle */}
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            width: 0,
            height: 0,
          }}
        >
          {MIST_PARTICLES.map((p) => (
            <span
              key={p.id}
              style={{
                position: "absolute",
                left: `${p.x}px`,
                bottom: "2px",
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(212,175,55,0.55) 55%, transparent 75%)",
                filter: "blur(0.5px)",
                opacity: 0,
                "--mx": `${p.drift}px`,
                animation: `mist-rise ${p.duration}s ease-out ${p.delay}s infinite`,
                animationPlayState: burst ? "paused" : "running",
              }}
            />
          ))}

          {burst &&
            BURST_PARTICLES.map((p) => (
              <span
                key={`b-${p.id}`}
                style={{
                  position: "absolute",
                  left: `${p.x}px`,
                  bottom: "2px",
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(212,175,55,0.6) 55%, transparent 75%)",
                  filter: "blur(0.5px)",
                  opacity: 0,
                  "--mx": `${p.drift}px`,
                  animation: `mist-burst 0.75s cubic-bezier(0.16,1,0.3,1) ${p.delay}s forwards`,
                }}
              />
            ))}
        </div>

        {/* Bottle */}
        <img
          src="/ph1.png"
          alt="Yusuf Bhai"
          style={{
            width: "84px",
            height: "auto",
            display: "block",
            filter:
              "drop-shadow(0 0 22px rgba(212,175,55,0.4)) drop-shadow(0 0 8px rgba(212,175,55,0.25))",
            animation: burst
              ? "nozzle-press 0.3s ease-in-out 2"
              : "nozzle-press 1.6s ease-in-out infinite",
          }}
        />
      </div>

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
