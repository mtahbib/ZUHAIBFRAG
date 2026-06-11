import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct   = total > 0 ? window.scrollY / total : 0;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${Math.min(pct, 1)})`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        zIndex: 99998,
        pointerEvents: "none",
      }}
    >
      <div
        ref={barRef}
        style={{
          height: "100%",
          background: "linear-gradient(90deg, #D4AF37, rgba(212,175,55,0.55))",
          transformOrigin: "left",
          transform: "scaleX(0)",
          boxShadow: "0 0 10px rgba(212,175,55,0.7), 0 0 20px rgba(212,175,55,0.3)",
        }}
      />
    </div>
  );
}
