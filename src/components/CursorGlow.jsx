import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const blobRef = useRef(null);
  const mouse   = useRef({ x: -999, y: -999 });
  const ring    = useRef({ x: -999, y: -999 });
  const blob    = useRef({ x: -999, y: -999 });
  const rafRef  = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const onMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.1;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.1;
      blob.current.x += (mouse.current.x - blob.current.x) * 0.055;
      blob.current.y += (mouse.current.y - blob.current.y) * 0.055;

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${mouse.current.x - 5}px, ${mouse.current.y - 5}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${ring.current.x - 24}px, ${ring.current.y - 24}px)`;
      }
      if (blobRef.current) {
        blobRef.current.style.transform =
          `translate(${blob.current.x - 280}px, ${blob.current.y - 280}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Large trailing glow blob */}
      <div
        ref={blobRef}
        style={{
          position: "fixed",
          width: "560px",
          height: "560px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(212,175,55,0.09) 0%, transparent 65%)",
          filter: "blur(30px)",
          pointerEvents: "none",
          zIndex: 1,
          top: 0,
          left: 0,
        }}
      />

      {/* Lagging ring */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: "1px solid rgba(212,175,55,0.55)",
          pointerEvents: "none",
          zIndex: 99997,
          top: 0,
          left: 0,
        }}
      />

      {/* Precise dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: "#D4AF37",
          pointerEvents: "none",
          zIndex: 99999,
          top: 0,
          left: 0,
        }}
      />
    </>
  );
}
