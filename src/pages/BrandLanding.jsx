import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import useIsMobile from "../hooks/useIsMobile";
import FirstNote from "../components/FirstNote";

const CARDS = [
  {
    to: "/yusuf-bhai",
    title: "Yusuf Bhai",
    subtitle: "Signature Decants & Fragrances",
    cta: "EXPLORE DECANTS",
    theme: "dark",
  },
  {
    to: "/other-brands",
    title: "Other Brands",
    subtitle: "Original Imported Fragrances",
    cta: "EXPLORE COLLECTION",
    theme: "light",
  },
];

// Ambient particles, computed once at module load — decorative only, so an
// impure Math.random() call here (outside render) is fine.
function makeParticles(side, count) {
  const xBase = side === "dark" ? 8 : 58;
  return Array.from({ length: count }, () => ({
    left: xBase + Math.random() * 34,
    top: 14 + Math.random() * 68,
    size: 3 + Math.random() * 6,
    blur: 2 + Math.random() * 5,
    delay: Math.random() * 4,
    duration: 5 + Math.random() * 4,
    depth: 0.6 + Math.random() * 1.2,
  }));
}
const PARTICLES = [...makeParticles("dark", 7), ...makeParticles("light", 7)];

// Splits a title into per-character spans (word-wrapped) so GSAP can stagger
// individual letters on hover without breaking words across lines.
function splitChars(text) {
  const words = text.split(" ");
  return words.map((word, wi) => (
    <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
      {word.split("").map((ch, ci) => (
        <span key={ci} data-char style={{ display: "inline-block" }}>
          {ch}
        </span>
      ))}
      {wi < words.length - 1 && (
        <span data-char style={{ display: "inline-block" }}>
          &nbsp;
        </span>
      )}
    </span>
  ));
}


function YusufBhaiVisual({ prominent, compact }) {
  return (
    <div
      style={{
        position: "relative",
        width: compact ? "clamp(140px, 40vw, 190px)" : "clamp(200px, 22vw, 320px)",
        aspectRatio: "3 / 4",
        transform: `scale(${prominent ? 1.06 : 1})`,
        transition: "transform 0.6s ease",
      }}
    >
      {/* amber glow to echo the dark side's atmosphere */}
      <div
        style={{
          position: "absolute",
          inset: "-18%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,175,55,0.18), transparent 70%)",
          filter: "blur(34px)",
          pointerEvents: "none",
        }}
      />
      <img
        src="/k1.png"
        alt="Yusuf Bhai signature perfume bottle"
        className="zf-float"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 42%",
          WebkitMaskImage: "radial-gradient(closest-side, black 58%, transparent 88%)",
          maskImage: "radial-gradient(closest-side, black 58%, transparent 88%)",
        }}
      />
    </div>
  );
}

function OtherBrandsVisual({ prominent, compact }) {
  return (
    <div
      style={{
        position: "relative",
        width: compact ? "clamp(140px, 40vw, 190px)" : "clamp(200px, 22vw, 320px)",
        aspectRatio: "3 / 4",
        transform: `scale(${prominent ? 1.06 : 1})`,
        transition: "transform 0.6s ease",
      }}
    >
      {/* soft bronze glow to echo the light side's atmosphere */}
      <div
        style={{
          position: "absolute",
          inset: "-18%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(184,147,95,0.24), transparent 70%)",
          filter: "blur(34px)",
          pointerEvents: "none",
        }}
      />
      {/* photo shot on black — screen blend dissolves the black backdrop into
          the ivory panel, leaving the bottle and smoke */}
      <img
        src="/hws.png"
        alt="An imported fragrance from Zuhaib's Other Brands collection"
        className="zf-float"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 40%",
          mixBlendMode: "screen",
          filter: "contrast(1.1) brightness(1.08)",
          WebkitMaskImage: "radial-gradient(closest-side, black 48%, transparent 76%)",
          maskImage: "radial-gradient(closest-side, black 48%, transparent 76%)",
        }}
      />
    </div>
  );
}

export default function BrandLanding() {
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState(null);
  const [hoveredCta, setHoveredCta] = useState(null);
  const [introDone, setIntroDone] = useState(false);
  const rootRef = useRef(null);
  const particleRefs = useRef([]);
  const titleRefs = useRef([]);

  // Per-letter title lift — each character rises slightly, staggered, when
  // its panel is hovered, and settles back when it isn't.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    titleRefs.current.forEach((el, i) => {
      if (!el) return;
      const chars = el.querySelectorAll("[data-char]");
      if (!chars.length) return;
      gsap.to(chars, {
        y: hovered === i ? -7 : 0,
        duration: hovered === i ? 0.4 : 0.45,
        stagger: hovered === i ? 0.022 : 0.014,
        ease: "power2.out",
        overwrite: true,
      });
    });
  }, [hovered]);

  useEffect(() => {
    if (isMobile) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    const root = rootRef.current;
    if (!root) return;

    const tos = particleRefs.current.filter(Boolean).map((el, i) => ({
      x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" }),
      y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" }),
      depth: PARTICLES[i]?.depth ?? 1,
    }));

    const onMove = (e) => {
      const rect = root.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      tos.forEach((p) => {
        p.x(nx * 26 * p.depth);
        p.y(ny * 18 * p.depth);
      });
    };
    root.addEventListener("mousemove", onMove);
    return () => root.removeEventListener("mousemove", onMove);
  }, [isMobile]);

  return (
    <div
      ref={rootRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        background: "#000",
        cursor: "auto",
        overflowX: "hidden",
        overflowY: isMobile ? "visible" : "hidden",
      }}
    >
      <style>{`
        @keyframes zfParticleFloat {
          0%, 100% { transform: translateY(0); opacity: var(--zf-op, 0.35); }
          50% { transform: translateY(-14px); opacity: calc(var(--zf-op, 0.35) * 0.5); }
        }
        @keyframes zfLinePulse {
          0%, 100% { opacity: 0.25; transform: scaleX(0.5); }
          50% { opacity: 0.9; transform: scaleX(1); }
        }
        @keyframes zfBottleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .zf-cta {
          transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease,
            transform 0.15s ease, letter-spacing 0.35s ease;
        }
        .zf-cta:active { transform: scale(0.97); }
        .zf-panel:active .zf-bottle-wrap { transform: scale(0.98); }
        .zf-bottle-wrap { transition: transform 0.5s ease; }
        .zf-float { animation: zfBottleFloat 4.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .zf-float { animation: none; }
        }
      `}</style>

      {CARDS.map((card, i) => {
        const isDark = card.theme === "dark";
        const isHovered = hovered === i;
        const otherHovered = hovered !== null && hovered !== i;
        const ctaHovered = hoveredCta === i;
        return (
          <Link
            key={card.to}
            to={card.to}
            className="zf-panel"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              flex: isMobile ? "none" : isHovered ? 1.5 : otherHovered ? 1 : 1,
              height: isMobile ? "auto" : "100vh",
              minHeight: isMobile ? "58vh" : undefined,
              padding: isMobile ? (i === 0 ? "108px 24px 44px" : "48px 24px 56px") : 0,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              position: "relative",
              background: isDark
                ? "radial-gradient(120% 90% at 30% 10%, #171310 0%, #0a0a0a 45%, #000 100%)"
                : "radial-gradient(120% 90% at 70% 10%, #FFFBF3 0%, #F3EDE3 55%, #EBE1D0 100%)",
              transition: "flex 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
              overflow: "hidden",
              borderBottom:
                isMobile && i === 0 ? "1px solid rgba(212,175,55,0.15)" : "none",
            }}
          >
            {/* faint grain texture for richness without heaviness */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `radial-gradient(${
                  isDark ? "rgba(255,255,255,0.05)" : "rgba(90,66,34,0.06)"
                } 1px, transparent 1px)`,
                backgroundSize: "26px 26px",
                pointerEvents: "none",
              }}
            />

            <div className="zf-bottle-wrap" style={{ marginBottom: isMobile ? "22px" : "26px" }}>
              {isDark ? (
                <YusufBhaiVisual prominent={isHovered} compact={isMobile} />
              ) : (
                <OtherBrandsVisual prominent={isHovered} compact={isMobile} />
              )}
            </div>

            <div
              ref={(el) => (titleRefs.current[i] = el)}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: isMobile ? "2.1rem" : "clamp(2.4rem, 3.6vw, 3.4rem)",
                fontWeight: 400,
                letterSpacing: "1px",
                color: isDark ? "#fff" : "#2a2419",
                marginBottom: "8px",
                textAlign: "center",
                position: "relative",
                textShadow: isHovered
                  ? isDark
                    ? "0 0 24px rgba(212,175,55,0.35)"
                    : "0 0 20px rgba(150,110,60,0.25)"
                  : "0 0 0 rgba(0,0,0,0)",
                transition: "text-shadow 0.5s ease",
              }}
            >
              {splitChars(card.title)}
            </div>

            {/* underline draws in from the center on hover */}
            <div
              style={{
                width: isHovered ? "44px" : "0px",
                height: "1px",
                background: isDark ? "rgba(212,175,55,0.75)" : "rgba(138,106,58,0.65)",
                margin: isMobile ? "0 auto 14px" : "0 auto 18px",
                transition: "width 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />

            <div
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "12px",
                letterSpacing: isHovered ? "4px" : "3px",
                fontWeight: 300,
                color: isDark
                  ? isHovered
                    ? "rgba(212,175,55,0.95)"
                    : "rgba(212,175,55,0.7)"
                  : isHovered
                  ? "rgba(150,110,60,1)"
                  : "rgba(150,110,60,0.85)",
                textTransform: "uppercase",
                marginBottom: isMobile ? "22px" : "30px",
                textAlign: "center",
                position: "relative",
                transition: "letter-spacing 0.4s ease, color 0.4s ease",
              }}
            >
              {card.subtitle}
            </div>

            <div
              className="zf-cta"
              onMouseEnter={() => setHoveredCta(i)}
              onMouseLeave={() => setHoveredCta(null)}
              style={{
                position: "relative",
                padding: "13px 30px",
                border: `1px solid ${
                  ctaHovered
                    ? isDark
                      ? "rgba(212,175,55,0.85)"
                      : "rgba(150,110,60,0.75)"
                    : isDark
                    ? "rgba(212,175,55,0.4)"
                    : "rgba(150,110,60,0.35)"
                }`,
                borderRadius: "999px",
                background: ctaHovered
                  ? isDark
                    ? "rgba(212,175,55,0.09)"
                    : "rgba(150,110,60,0.08)"
                  : "transparent",
                boxShadow: ctaHovered
                  ? isDark
                    ? "0 0 22px rgba(212,175,55,0.25)"
                    : "0 0 22px rgba(150,110,60,0.18)"
                  : "0 0 0 rgba(0,0,0,0)",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "11px",
                letterSpacing: ctaHovered ? "3.6px" : "3px",
                color: isDark ? "#D4AF37" : "#8a6a3a",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {card.cta}
              <span
                style={{
                  display: "inline-block",
                  transition: "transform 0.35s ease",
                  transform: ctaHovered ? "translateX(4px)" : "translateX(0)",
                }}
              >
                →
              </span>
            </div>
          </Link>
        );
      })}

      {/* Ambient fragrance particles — subtle, mouse-reactive on desktop */}
      {!isMobile &&
        PARTICLES.map((p, i) => {
          const side = p.left < 50 ? 0 : 1;
          const active = hovered === side;
          return (
          <div
            key={i}
            ref={(el) => (particleRefs.current[i] = el)}
            style={{
              position: "absolute",
              left: `${p.left}%`,
              top: `${p.top}%`,
              zIndex: 1,
              pointerEvents: "none",
              willChange: "transform",
              transform: `scale(${active ? 1.5 : 1})`,
              transition: "transform 0.7s ease",
            }}
          >
            <div
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: "50%",
                background:
                  side === 0
                    ? "radial-gradient(circle, rgba(212,175,55,0.5), transparent 70%)"
                    : "radial-gradient(circle, rgba(150,110,60,0.5), transparent 70%)",
                filter: `blur(${p.blur}px)`,
                "--zf-op": active ? (side === 0 ? 0.7 : 0.55) : side === 0 ? 0.4 : 0.3,
                animation: `zfParticleFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
              }}
            />
          </div>
          );
        })}

      {/* Orientation label — split-colored per side instead of relying on
          mix-blend-mode, which wasn't inverting reliably against the light
          panel */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? "16px" : "20px",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "'Montserrat', sans-serif",
          fontSize: "9px",
          letterSpacing: "5px",
          textTransform: "uppercase",
          pointerEvents: "none",
          zIndex: 3,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ color: hovered === 1 ? "rgba(42,36,25,0.55)" : "rgba(255,255,255,0.55)", transition: "color 0.4s ease" }}>
          Choose Your{" "}
        </span>
        <span style={{ color: hovered === 0 ? "rgba(255,255,255,0.55)" : "rgba(42,36,25,0.55)", transition: "color 0.4s ease" }}>
          World
        </span>
      </div>

      {/* Center wordmark — reacts to which side is hovered */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? "40px" : "48px",
          left: "50%",
          transform: `translateX(-50%) scale(${hovered !== null ? 1.05 : 1})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1rem",
            letterSpacing: "4px",
            padding: "8px 20px",
            borderRadius: "999px",
            overflow: "hidden",
            position: "relative",
            border:
              hovered === 0
                ? "1px solid rgba(212,175,55,0.55)"
                : hovered === 1
                ? "1px solid rgba(138,106,58,0.5)"
                : "1px solid rgba(255,255,255,0.15)",
            boxShadow:
              hovered === 0
                ? "0 0 26px rgba(212,175,55,0.35)"
                : hovered === 1
                ? "0 0 26px rgba(138,106,58,0.3)"
                : "0 4px 20px rgba(0,0,0,0.3)",
            transition: "border 0.4s ease, box-shadow 0.4s ease",
          }}
        >
          {/* Background layers cross-fade between split / dark / light */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: hovered === null ? 1 : 0,
              transition: "opacity 0.4s ease",
              background: "linear-gradient(90deg, #0a0a0a 50%, #F3EDE3 50%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: hovered === 0 ? 1 : 0,
              transition: "opacity 0.4s ease",
              background: "#0a0a0a",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: hovered === 1 ? 1 : 0,
              transition: "opacity 0.4s ease",
              background: "#FDFBF7",
            }}
          />

          <img
            src="/zlogo.png"
            alt="Zuhaib Fragrance"
            style={{
              position: "relative",
              zIndex: 1,
              display: "block",
              width: isMobile ? "43px" : "50px",
              height: isMobile ? "43px" : "50px",
              margin: "0 auto 3px",
              objectFit: "contain",
              filter: hovered === 0
                ? "drop-shadow(0 5px 10px rgba(0,0,0,.75)) drop-shadow(0 0 8px rgba(212,175,55,.25))"
                : "drop-shadow(0 5px 9px rgba(42,36,25,.2))",
              transition: "filter 0.4s ease, transform 0.4s ease",
              transform: `rotate(${hovered === 0 ? -3 : hovered === 1 ? 3 : 0}deg)`,
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              color: hovered === 0 ? "#D4AF37" : "#725632",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "9px",
              fontWeight: 500,
              letterSpacing: "2.5px",
              whiteSpace: "nowrap",
              transition: "color 0.4s ease",
            }}
          >
            ZUHAIB FRAGRANCE
          </div>

          {/* Subline lives on the same solid/split background as the title
              above, so it can be colored explicitly per side instead of
              relying on mix-blend-mode (which wasn't inverting reliably). */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              marginTop: "6px",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "7.5px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              textAlign: "center",
            }}
          >
            <span
              style={{
                color: hovered === 1 ? "rgba(138,106,58,0.75)" : "rgba(212,175,55,0.7)",
                transition: "color 0.4s ease",
              }}
            >
              A World{" "}
            </span>
            <span
              style={{
                color: hovered === 0 ? "rgba(212,175,55,0.7)" : "rgba(138,106,58,0.75)",
                transition: "color 0.4s ease",
              }}
            >
              Of Scents
            </span>
          </div>
        </div>
      </div>

      {/* Bottom discovery cue — desktop only; the mobile stack already fills
          the viewport with no scroll, so a scroll-style cue doesn't apply */}
      {!isMobile && (
      <div
        style={{
          position: "absolute",
          bottom: "26px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          pointerEvents: "none",
          zIndex: 3,
        }}
      >
        <div
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "8.5px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: hovered === 1 ? "rgba(42,36,25,0.55)" : "rgba(255,255,255,0.55)", transition: "color 0.4s ease" }}>
            Discover{" "}
          </span>
          <span style={{ color: hovered === 0 ? "rgba(255,255,255,0.55)" : "rgba(42,36,25,0.55)", transition: "color 0.4s ease" }}>
            Your Scent
          </span>
        </div>
        <div
          style={{
            width: "34px",
            height: "1px",
            background:
              hovered === null
                ? "linear-gradient(90deg, rgba(255,255,255,0.55) 50%, rgba(42,36,25,0.55) 50%)"
                : hovered === 0
                ? "rgba(255,255,255,0.55)"
                : "rgba(42,36,25,0.55)",
            transition: "background 0.4s ease",
            transformOrigin: "center",
            animation: "zfLinePulse 2.6s ease-in-out infinite",
          }}
        />
      </div>
      )}

      {!introDone && <FirstNote onDone={() => setIntroDone(true)} />}
    </div>
  );
}
