import { useEffect, useRef } from "react";
import gsap from "gsap";
import useIsMobile from "../hooks/useIsMobile";

const NOTES = ["VANILLA", "OUD", "AMBER"];
const BRONZE = "#9C7A45";
const BRONZE_LIGHT = "#E8CFA0";
const IVORY = "#F8F1E4";

// Mist motes drift mostly upward with slight lateral wander, like scent
// molecules rising off the glass rather than an outward smoke burst.
// Computed once at module load — purely decorative, no need to vary per mount.
function makeParticles(count) {
  return Array.from({ length: count }, (_, i) => {
    const wander = (Math.random() - 0.5) * 30;
    const rise = 44 + Math.random() * 60;
    return {
      x: wander,
      y: -rise,
      size: 3 + Math.random() * 6,
      blur: 2 + Math.random() * 4,
      max: 0.22 + Math.random() * 0.16,
    };
  });
}
const PARTICLES_DESKTOP = makeParticles(9);
const PARTICLES_MOBILE = makeParticles(5);

export default function FirstNote({ onDone }) {
  const isMobile = useIsMobile();
  const particles = isMobile ? PARTICLES_MOBILE : PARTICLES_DESKTOP;

  const rootRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const centerRef = useRef(null);
  const glowRef = useRef(null);
  const mistRef = useRef(null);
  const shadowRef = useRef(null);
  const bottleRef = useRef(null);
  const noteRefs = useRef([]);
  const particleRefs = useRef([]);
  const brandRef = useRef(null);
  const brandSubRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set([bottleRef.current, shadowRef.current, brandRef.current, brandSubRef.current], {
        opacity: 1,
        scale: 1,
        y: 0,
      });
      gsap.set([noteRefs.current, particleRefs.current, glowRef.current, mistRef.current], {
        opacity: 0,
      });
      const tl = gsap.timeline({ onComplete: () => onDone?.() });
      tl.to(rootRef.current, { opacity: 0, duration: 0.5, delay: 0.6, ease: "power1.out" });
      return () => tl.kill();
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => onDone?.() });

      tl.set(glowRef.current, { opacity: 0, scale: 0.7 });
      tl.set(mistRef.current, { opacity: 0, scale: 0.5 });
      tl.set(bottleRef.current, { opacity: 0, scale: 0.88, y: 10 });
      tl.set(shadowRef.current, { opacity: 0, scaleX: 0.7 });
      tl.set(noteRefs.current, { opacity: 0, y: 8 });
      tl.set(particleRefs.current, { opacity: 0, x: 0, y: 0, scale: 0.6 });
      tl.set([brandRef.current, brandSubRef.current], { opacity: 0, y: 10 });

      // 0.3s — a soft atmospheric light gathers, as if catching the glass.
      tl.to(glowRef.current, { opacity: 0.55, scale: 1, duration: 0.7, ease: "sine.out" }, 0.3);
      tl.to(
        glowRef.current,
        { scale: 1.1, opacity: 0.4, duration: 1.6, ease: "sine.inOut", repeat: 1, yoyo: true },
        0.5
      );

      // 0.5s — the bottle settles into view, then breathes almost imperceptibly.
      tl.to(bottleRef.current, { opacity: 0.96, scale: 1, y: 0, duration: 0.55, ease: "power2.out" }, 0.5);
      tl.to(shadowRef.current, { opacity: 0.22, scaleX: 1, duration: 0.55, ease: "power2.out" }, 0.5);
      tl.to(
        bottleRef.current,
        { scale: 1.025, duration: 1.1, ease: "sine.inOut", repeat: 1, yoyo: true },
        1.05
      );

      // Mist motes rise gently off the glass throughout the sequence.
      particles.forEach((p, i) => {
        const el = particleRefs.current[i];
        if (!el) return;
        const start = 0.55 + (i % particles.length) * 0.14;
        tl.to(el, { opacity: p.max, scale: 1, duration: 0.5, ease: "sine.out" }, start);
        tl.to(el, { x: p.x, y: p.y, duration: 1.5, ease: "sine.out" }, start);
        tl.to(el, { opacity: 0, duration: 0.5, ease: "sine.in" }, start + 1.0);
      });

      // Fragrance notes reveal one at a time — never overlapping.
      const notes = noteRefs.current;
      tl.to(notes[0], { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }, 0.8)
        .to(notes[0], { opacity: 0, y: -6, duration: 0.2, ease: "power2.in" }, 1.1)
        .to(notes[1], { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }, 1.2)
        .to(notes[1], { opacity: 0, y: -6, duration: 0.2, ease: "power2.in" }, 1.5)
        .to(notes[2], { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }, 1.6)
        .to(notes[2], { opacity: 0, y: -6, duration: 0.2, ease: "power2.in" }, 1.9);

      // 2.0s — the bottle and its mist dissolve away.
      tl.to(
        [bottleRef.current, shadowRef.current, glowRef.current, ...particleRefs.current],
        { opacity: 0, scale: 0.94, duration: 0.3, ease: "power2.in" },
        2.0
      );

      // 2.1s — the brand reveals itself, clean and quiet.
      tl.to([brandRef.current, brandSubRef.current], { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 2.1);

      // 2.3s — the mist expands outward, and the world beneath is revealed.
      tl.to([brandRef.current, brandSubRef.current], { opacity: 0, duration: 0.2, ease: "power1.in" }, 2.3);
      tl.to(mistRef.current, { opacity: 0.5, scale: 3.2, duration: 0.45, ease: "power2.out" }, 2.3);
      tl.to(mistRef.current, { opacity: 0, duration: 0.35, ease: "power1.in" }, 2.55);
      tl.to(leftRef.current, { xPercent: -100, duration: 0.55, ease: "power3.inOut" }, 2.3);
      tl.to(rightRef.current, { xPercent: 100, duration: 0.55, ease: "power3.inOut" }, 2.3);
    }, rootRef);

    return () => ctx.revert();
  }, [onDone, particles]);

  const bottleScale = isMobile ? 0.85 : 1;

  return (
    <div
      ref={rootRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100000,
        overflow: "hidden",
        cursor: "auto",
      }}
      aria-hidden="true"
    >
      {/* Two halves that form the ivory curtain, then part like flowing mist */}
      <div
        ref={leftRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50%",
          height: "100%",
          background: IVORY,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: "-40px",
            width: "120px",
            height: "100%",
            background: `linear-gradient(to right, transparent, ${IVORY})`,
            filter: "blur(18px)",
          }}
        />
      </div>
      <div
        ref={rightRef}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50%",
          height: "100%",
          background: IVORY,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "-40px",
            width: "120px",
            height: "100%",
            background: `linear-gradient(to left, transparent, ${IVORY})`,
            filter: "blur(18px)",
          }}
        />
      </div>

      {/* Full-screen mist wash used only for the final expand-and-reveal beat */}
      <div
        ref={mistRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "70vmax",
          height: "70vmax",
          marginLeft: "-35vmax",
          marginTop: "-35vmax",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(232,207,160,0.55), rgba(232,207,160,0.15) 45%, transparent 72%)`,
          filter: "blur(6px)",
          pointerEvents: "none",
        }}
      />

      {/* Center composition: light, bottle, mist motes, notes */}
      <div
        ref={centerRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "relative", width: "2px", height: "2px", transform: `scale(${bottleScale})` }}>
          {/* Soft atmospheric glow, as if light is passing through the glass */}
          <div
            ref={glowRef}
            style={{
              position: "absolute",
              top: "-4px",
              left: 0,
              width: "260px",
              height: "260px",
              marginLeft: "-130px",
              marginTop: "-130px",
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(232,207,160,0.5), rgba(232,207,160,0.12) 55%, transparent 75%)`,
              filter: "blur(20px)",
              willChange: "transform, opacity",
            }}
          />

          {particles.map((p, i) => (
            <div
              key={i}
              ref={(el) => (particleRefs.current[i] = el)}
              style={{
                position: "absolute",
                top: "36px",
                left: 0,
                width: `${p.size}px`,
                height: `${p.size}px`,
                marginLeft: `${-p.size / 2}px`,
                marginTop: `${-p.size / 2}px`,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${BRONZE_LIGHT}, transparent 70%)`,
                filter: `blur(${p.blur}px)`,
                willChange: "transform, opacity",
              }}
            />
          ))}

          {/* Yusuf Bhai bottle photo — white backdrop dissolved via multiply
              blend so it sits directly in the ivory scene, no visible box */}
          <img
            ref={bottleRef}
            src="/ph1.png"
            alt=""
            width="130"
            height="173"
            style={{
              position: "absolute",
              top: "-128px",
              left: "-65px",
              width: "130px",
              height: "173px",
              objectFit: "contain",
              mixBlendMode: "multiply",
              willChange: "transform, opacity",
            }}
          />

          {/* Delicate contact shadow beneath the bottle */}
          <div
            ref={shadowRef}
            style={{
              position: "absolute",
              top: "42px",
              left: 0,
              width: "70px",
              height: "14px",
              marginLeft: "-35px",
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(58,42,20,0.4), transparent 72%)",
              filter: "blur(3px)",
              willChange: "transform, opacity",
            }}
          />

          {/* Fragrance notes — one at a time, editorial serif type */}
          <div
            style={{
              position: "absolute",
              top: "-136px",
              left: "50%",
              transform: "translateX(-50%)",
              whiteSpace: "nowrap",
              textAlign: "center",
            }}
          >
            {NOTES.map((note, i) => (
              <div
                key={note}
                ref={(el) => (noteRefs.current[i] = el)}
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(1.1rem, 3vw, 1.6rem)",
                  letterSpacing: "6px",
                  color: BRONZE,
                  willChange: "opacity, transform",
                }}
              >
                {note}
              </div>
            ))}
          </div>

          {/* Brand reveal — quiet and clean, just before the world opens up */}
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "50%",
              transform: "translateX(-50%)",
              whiteSpace: "nowrap",
              textAlign: "center",
            }}
          >
            <div
              ref={brandRef}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 400,
                fontSize: isMobile ? "1.6rem" : "2.1rem",
                letterSpacing: "5px",
                color: "#2a2419",
                willChange: "opacity, transform",
              }}
            >
              ZUHAIB FRAGRANCE
            </div>
            <div
              ref={brandSubRef}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 300,
                fontSize: "10px",
                letterSpacing: "4px",
                color: "rgba(150,110,60,0.85)",
                marginTop: "10px",
                willChange: "opacity, transform",
              }}
            >
              A WORLD OF SCENTS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
