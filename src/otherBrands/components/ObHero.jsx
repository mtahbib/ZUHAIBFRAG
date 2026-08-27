import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COLORS, FONT_SANS, FONT_SERIF } from "../theme";
import useIsMobile from "../../hooks/useIsMobile";
import { prefersReducedMotion, magneticHandlers } from "../motion";

gsap.registerPlugin(ScrollTrigger);

// Restrained editorial palette for this hero only — deliberately distinct
// from the rest of the Other Brands ivory theme, per the brief: warm
// stone background, deep charcoal type, antique bronze accent. No black
// backdrop, no gold, no warm-beige/feminine cast.
const STONE = "#E5DED1";
const STONE_DEEP = "#DCD3C3";
const CHARCOAL = "#191714";
const BRONZE = "#75614B";

// A near-invisible film-grain texture, generated once as a data URI —
// keeps the studio backdrop from feeling like a flat digital gradient.
const GRAIN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export default function ObHero() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const sectionRef = useRef(null);
  const typeColRef = useRef(null);
  const eyebrowRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const bottleWrapRef = useRef(null);
  const bottleImgRef = useRef(null);
  const shadowRef = useRef(null);
  const arrowRef = useRef(null);
  const magnetic = !isMobile ? magneticHandlers(gsap, arrowRef, { max: 5 }) : {};

  useEffect(() => {
    const reduceMotion = prefersReducedMotion();
    const section = sectionRef.current;
    if (!section) return;

    let removeMouseListener = () => {};
    let removeHoverListeners = () => {};

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(
          [eyebrowRef.current, line1Ref.current, line2Ref.current, subRef.current, ctaRef.current, bottleWrapRef.current, shadowRef.current],
          { opacity: 1, y: 0, scale: 1 }
        );
        return;
      }

      gsap.set(section, { opacity: 0 });
      gsap.set(eyebrowRef.current, { opacity: 0, y: 14 });
      gsap.set([line1Ref.current, line2Ref.current], { yPercent: 115 });
      gsap.set(subRef.current, { opacity: 0, y: 12 });
      gsap.set(ctaRef.current, { opacity: 0, y: 10 });
      gsap.set(bottleWrapRef.current, { opacity: 0, scale: 0.97, y: 18 });
      gsap.set(shadowRef.current, { opacity: 0, scaleX: 0.7 });

      const tl = gsap.timeline({ delay: 0.15 });

      tl.to(section, { opacity: 1, duration: 0.7, ease: "power1.out" }, 0)
        .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.25)
        .to(line1Ref.current, { yPercent: 0, duration: 0.85, ease: "power3.out" }, 0.45)
        .to(line2Ref.current, { yPercent: 0, duration: 0.85, ease: "power3.out" }, 0.58)
        .to(subRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.95)
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, 1.15)
        .to(bottleWrapRef.current, { opacity: 1, scale: 1, y: 0, duration: 1.3, ease: "power2.out" }, 0.5)
        .to(shadowRef.current, { opacity: 1, scaleX: 1, duration: 1.1, ease: "power2.out" }, 0.75);

      if (!isMobile) {
        // A slight overscan so the parallax drift never reveals an edge —
        // the photograph fills its panel with a few px of margin to spare.
        gsap.set(bottleImgRef.current, { scale: 1.06 });

        // Almost imperceptible response — the photograph drifts a few
        // pixels, nothing that reads as "an animation".
        const bottleX = gsap.quickTo(bottleImgRef.current, "x", { duration: 1.1, ease: "power3.out" });
        const bottleY = gsap.quickTo(bottleImgRef.current, "y", { duration: 1.1, ease: "power3.out" });

        const onMove = (e) => {
          const rect = section.getBoundingClientRect();
          const nx = (e.clientX - rect.left) / rect.width - 0.5;
          const ny = (e.clientY - rect.top) / rect.height - 0.5;
          bottleX(nx * 6);
          bottleY(ny * 4);
        };
        section.addEventListener("mousemove", onMove);
        removeMouseListener = () => section.removeEventListener("mousemove", onMove);

        // The photograph responds to being hovered directly — a slight
        // additional scale and a touch more light, as if it has physical
        // depth rather than being a flat image sitting on the page.
        const onEnter = () => gsap.to(bottleImgRef.current, { scale: 1.1, filter: "brightness(1.05)", duration: 0.7, ease: "power2.out" });
        const onLeave = () => gsap.to(bottleImgRef.current, { scale: 1.06, filter: "brightness(1)", duration: 0.7, ease: "power2.out" });
        const panel = bottleWrapRef.current;
        panel.addEventListener("mouseenter", onEnter);
        panel.addEventListener("mouseleave", onLeave);
        removeHoverListeners = () => {
          panel.removeEventListener("mouseenter", onEnter);
          panel.removeEventListener("mouseleave", onLeave);
        };

        // Scroll-out: as the reader leaves the campaign shot for the
        // collection below, the headline lifts and fades and the
        // photograph eases back slightly — the hero recedes rather than
        // cutting off hard at the section boundary.
        gsap.to(typeColRef.current, {
          yPercent: -10,
          opacity: 0.25,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.6 },
        });
        gsap.to(bottleWrapRef.current, {
          scale: 0.95,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.6 },
        });
      }
    }, section);

    return () => {
      ctx.revert();
      removeMouseListener();
      removeHoverListeners();
    };
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: isMobile ? "auto" : "94vh",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1.15fr 0.85fr",
        alignItems: "stretch",
        overflow: "hidden",
        background: `radial-gradient(circle at 60% 40%, #FFF5EB 0%, ${STONE} 60%, ${STONE_DEEP} 100%)`,
        paddingTop: isMobile ? "76px" : "0",
      }}
    >
      {/* Grain — near-invisible, breaks up the flat gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("${GRAIN_URL}")`,
          opacity: 0.035,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />

      {/* Typography */}
      <div
        ref={typeColRef}
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: isMobile ? "48px 7% 8px" : "0 6% 0 8%",
          textAlign: isMobile ? "center" : "left",
          alignItems: isMobile ? "center" : "flex-start",
        }}
      >
        <div
          ref={eyebrowRef}
          style={{
            fontFamily: FONT_SANS,
            fontSize: "11px",
            letterSpacing: "6px",
            color: BRONZE,
            marginBottom: isMobile ? "18px" : "26px",
          }}
        >
          OTHER BRANDS
        </div>

        <h1 style={{ margin: 0 }}>
          <div style={{ overflow: "hidden" }}>
            <div
              ref={line1Ref}
              style={{
                fontFamily: FONT_SERIF,
                fontWeight: 400,
                color: CHARCOAL,
                fontSize: "clamp(2.6rem, 6.4vw, 5.4rem)",
                lineHeight: 0.98,
                letterSpacing: "-0.01em",
              }}
            >
              Find Your
            </div>
          </div>
          <div style={{ overflow: "hidden" }}>
            <div
              ref={line2Ref}
              style={{
                fontFamily: FONT_SERIF,
                fontStyle: "italic",
                fontWeight: 500,
                color: BRONZE,
                fontSize: "clamp(2.9rem, 7.1vw, 6rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.01em",
              }}
            >
              Signature.
            </div>
          </div>
        </h1>

        <div
          ref={subRef}
          style={{
            fontFamily: FONT_SANS,
            fontWeight: 300,
            fontSize: "13.5px",
            lineHeight: 1.7,
            letterSpacing: "0.2px",
            color: "rgba(25,23,20,0.58)",
            maxWidth: "360px",
            marginTop: isMobile ? "22px" : "28px",
          }}
        >
          A collection of fragrances chosen to become unmistakably yours.
        </div>

        <div ref={ctaRef} style={{ marginTop: isMobile ? "32px" : "42px" }}>
          <button
            onClick={() => navigate("/other-brands/shop")}
            onMouseMove={magnetic.onMouseMove}
            onMouseLeave={magnetic.onMouseLeave}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontFamily: FONT_SANS,
              fontSize: "11.5px",
              letterSpacing: "2.5px",
              fontWeight: 600,
              color: CHARCOAL,
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              borderBottom: `1px solid ${CHARCOAL}`,
              paddingBottom: "6px",
            }}
          >
            EXPLORE THE COLLECTION
            <span ref={arrowRef} style={{ fontSize: "14px", display: "inline-block" }}>→</span>
          </button>
        </div>
      </div>

      {/* Hairline gutter — the one structural device joining the type
          column to the photograph panel, like the fold of a magazine
          spread. Sits on top of both, at the column boundary. */}
      {!isMobile && (
        <div
          style={{
            position: "absolute",
            top: "9%",
            bottom: "9%",
            left: "53.5%",
            width: "1px",
            background: "rgba(25,23,20,0.14)",
            zIndex: 2,
          }}
        />
      )}

      {/* Product staging — the Hawas Fire campaign photograph, bled to the
          panel's own edges and cropped (never stretched) to fill it, so it
          reads as a full campaign plate set against the stone column
          rather than a thumbnail floating in it. */}
      <div
        ref={bottleWrapRef}
        style={{
          position: "relative",
          overflow: "hidden",
          height: isMobile ? "58vh" : "auto",
        }}
      >
        <video
          ref={bottleImgRef}
          src="/cool-trimmed.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Hawas Fire — cinematic campaign film"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 38%",
          }}
        />

        <div ref={shadowRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
      </div>

      {/* Seam scrim — the stone background eases into the catalog's ivory
          rather than cutting hard at the section boundary, so scrolling
          past the hero reads as one continuous surface. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: isMobile ? "70px" : "130px",
          background: `linear-gradient(to bottom, transparent, ${COLORS.ivory})`,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
    </section>
  );
}
