import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const dotRef    = useRef(null);
  const ringRef   = useRef(null);
  const blobRef   = useRef(null);
  const labelRef  = useRef(null);
  const mouse     = useRef({ x: -999, y: -999 });
  const ring      = useRef({ x: -999, y: -999 });
  const blob      = useRef({ x: -999, y: -999 });
  const rafRef    = useRef(null);
  const magnetEl  = useRef(null);
  const ringScale = useRef(1);

  useEffect(() => {
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      // ── Magnetic button effect ──────────────────
      const mag = e.target.closest("[data-magnetic]");
      if (mag) {
        const r  = mag.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width  / 2)) * 0.38;
        const dy = (e.clientY - (r.top  + r.height / 2)) * 0.38;
        mag.style.transform    = `translate(${dx}px, ${dy}px)`;
        mag.style.transition   = "transform 0.25s cubic-bezier(0.16,1,0.3,1)";
        magnetEl.current = mag;
      } else if (magnetEl.current) {
        magnetEl.current.style.transform  = "translate(0,0)";
        magnetEl.current.style.transition = "transform 0.5s cubic-bezier(0.16,1,0.3,1)";
        magnetEl.current = null;
      }

      // ── Cursor label + ring scale ────────────────
      const cursorEl = e.target.closest("[data-cursor]");
      const label    = cursorEl?.dataset.cursor || "";
      if (labelRef.current) {
        labelRef.current.textContent = label;
        labelRef.current.style.opacity = label ? "1" : "0";
      }

      const isButton = e.target.closest("button, a, [data-cursor]");
      ringScale.current = isButton ? 2.2 : 1;
    };

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
        const s = ringScale.current;
        ringRef.current.style.transform =
          `translate(${ring.current.x - 24}px, ${ring.current.y - 24}px) scale(${s})`;
        ringRef.current.style.opacity = s > 1 ? "0.7" : "1";
        ringRef.current.style.borderWidth = s > 1 ? "1.5px" : "1px";
      }
      if (blobRef.current) {
        blobRef.current.style.transform =
          `translate(${blob.current.x - 280}px, ${blob.current.y - 280}px)`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform =
          `translate(${mouse.current.x + 18}px, ${mouse.current.y - 10}px)`;
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

      {/* Lagging ring — scales up on hover */}
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
          transition: "transform 0.08s linear, opacity 0.2s ease, border-width 0.2s ease",
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

      {/* Cursor label */}
      <div
        ref={labelRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          color: "#D4AF37",
          fontSize: "8px",
          letterSpacing: "3px",
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 600,
          pointerEvents: "none",
          zIndex: 99999,
          opacity: 0,
          transition: "opacity 0.2s ease",
          whiteSpace: "nowrap",
        }}
      />
    </>
  );
}
