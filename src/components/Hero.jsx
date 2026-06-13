import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef      = useRef(null);
  const bottleRef    = useRef(null);
  const bottleWrapRef = useRef(null);
  const textRef      = useRef(null);
  const glowRef      = useRef(null);

  useEffect(() => {
    // ── Entrance ─────────────────────────
    gsap.fromTo(
      bottleRef.current,
      { opacity: 0, scale: 0.72 },
      { opacity: 1, scale: 1, duration: 2.2, ease: "power3.out" }
    );
    gsap.fromTo(
      Array.from(textRef.current.children),
      { opacity: 0, y: 55 },
      { opacity: 1, y: 0, duration: 1.3, stagger: 0.13, delay: 0.7, ease: "power2.out" }
    );

    // ── Float loop on bottle (not wrapper) ───
    gsap.to(bottleRef.current, {
      y: -22,
      duration: 3.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // ── Scroll parallax on wrapper — no conflict with float ──
    gsap.to(bottleWrapRef.current, {
      y: -220,
      opacity: 0,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "65% top",
        scrub: 1.8,
      },
    });
    gsap.to(textRef.current, {
      y: -100,
      opacity: 0,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "50% top",
        scrub: 1.2,
      },
    });
    gsap.to(glowRef.current, {
      scale: 2.2,
      opacity: 0,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "50% top",
        scrub: 1,
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  const handleMouseMove = (e) => {
    const rect = heroRef.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
    const dy = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);
    gsap.to(bottleRef.current, {
      rotateY: dx * 20,
      rotateX: -dy * 10,
      duration: 0.7,
      ease: "power2.out",
      transformPerspective: 900,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(bottleRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 1.8,
      ease: "elastic.out(1, 0.4)",
    });
  };

  return (
    <section
      id="home"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
        padding: "40px 20px 80px",
      }}
    >
      {/* Concentric rings */}
      {[380, 620, 880].map((size, i) => (
        <div
          key={size}
          style={{
            position: "absolute",
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: "50%",
            border: "1px solid rgba(212,175,55,0.07)",
            animation: `ring-pulse ${3.5 + i * 0.9}s ease-in-out ${i * 0.5}s infinite`,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      ))}

      {/* Ambient glow */}
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          width: "750px",
          height: "750px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(212,175,55,0.13) 0%, transparent 65%)",
          filter: "blur(55px)",
          zIndex: 2,
          animation: "pulse-glow 5s ease-in-out infinite",
        }}
      />

      {/* Bottle — wrapper owns scroll parallax, img owns float + tilt */}
      <div ref={bottleWrapRef} style={{ zIndex: 10, position: "relative" }}>
        <img
          ref={bottleRef}
          src="/k1.png"
          alt="Yusuf Bhai Fragrance"
          style={{
            width: "760px",
            maxWidth: "90vw",
            display: "block",
            filter:
              "drop-shadow(0 0 90px rgba(212,175,55,0.5)) drop-shadow(0 0 25px rgba(212,175,55,0.2))",
            willChange: "transform",
          }}
        />
      </div>

      {/* Text block */}
      <div
        ref={textRef}
        style={{ zIndex: 20, position: "relative", marginTop: "10px" }}
      >
        <div
          style={{
            color: "#D4AF37",
            letterSpacing: "10px",
            fontSize: "10px",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 300,
          }}
        >
          AUTHENTIC YUSUF BHAI FRAGRANCES
        </div>

        <h1
          style={{
            color: "#fff",
            margin: "10px 0 0",
            fontSize: "clamp(4rem,12vw,9rem)",
            letterSpacing: "14px",
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            lineHeight: 0.95,
            textShadow: "0 0 60px rgba(255,255,255,0.08)",
          }}
        >
          ZUHAIB
        </h1>

        <div
          style={{
            color: "rgba(212,175,55,0.75)",
            letterSpacing: "20px",
            marginTop: "10px",
            fontSize: "12px",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 200,
          }}
        >
          FRAGRANCE
        </div>

        <div
          style={{
            width: "55px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
            margin: "28px auto",
          }}
        />

        <p
          style={{
            color: "rgba(255,255,255,0.38)",
            maxWidth: "500px",
            margin: "0 auto",
            lineHeight: "2.2",
            fontSize: "12px",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 300,
            letterSpacing: "1.5px",
          }}
        >
          Crafted in Dubai. Delivered across Bangladesh.
          <br />
          Premium inspired fragrances with luxury performance.
        </p>

        <button
          onClick={() =>
            document
              .getElementById("collection")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#D4AF37";
            e.currentTarget.style.color = "#000";
            e.currentTarget.style.letterSpacing = "5px";
            e.currentTarget.style.borderColor = "#D4AF37";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#D4AF37";
            e.currentTarget.style.letterSpacing = "4px";
            e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)";
          }}
          data-magnetic
          data-cursor="EXPLORE"
          style={{
            background: "transparent",
            color: "#D4AF37",
            border: "1px solid rgba(212,175,55,0.5)",
            padding: "16px 52px",
            borderRadius: "999px",
            fontWeight: 600,
            cursor: "none",
            letterSpacing: "4px",
            fontSize: "11px",
            fontFamily: "'Montserrat', sans-serif",
            transition: "all 0.35s ease",
            marginTop: "36px",
            display: "inline-block",
          }}
        >
          EXPLORE COLLECTION
        </button>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "14px",
          zIndex: 20,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.18)",
            letterSpacing: "5px",
            fontSize: "8px",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 300,
          }}
        >
          SCROLL
        </div>
        <div
          style={{
            width: "1px",
            height: "65px",
            background: "linear-gradient(to bottom, #D4AF37, transparent)",
            animation: "scroll-line 2.2s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}
