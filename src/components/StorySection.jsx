import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import useIsMobile from "../hooks/useIsMobile";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: "27+", label: "Fragrances" },
  { value: "100%", label: "Authentic" },
  { value: "BD", label: "Nationwide" },
];

export default function StorySection() {
  const isMobile   = useIsMobile();
  const sectionRef = useRef(null);
  const imageRef   = useRef(null);
  const textRef    = useRef(null);
  const statsRef   = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { x: -70, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.3, ease: "power3.out", clearProps: "opacity,transform",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", once: true } }
      );
      gsap.fromTo(
        Array.from(textRef.current.children),
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.1, stagger: 0.14, ease: "power2.out", clearProps: "opacity,transform",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", once: true } }
      );
      gsap.fromTo(
        Array.from(statsRef.current.children),
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.13, ease: "power2.out", clearProps: "opacity,transform",
          scrollTrigger: { trigger: statsRef.current, start: "top 88%", once: true } }
      );
    }, sectionRef);
    const t = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => { ctx.revert(); clearTimeout(t); };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        background: "#050505",
        padding: isMobile ? "80px 5%" : "140px 8%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Vertical accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "8%",
          width: "1px",
          height: "100%",
          background:
            "linear-gradient(to bottom, transparent, rgba(212,175,55,0.18), transparent)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(360px, 1fr))",
          gap: isMobile ? "40px" : "100px",
          alignItems: "center",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        {/* Image */}
        <div ref={imageRef} style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <div
              style={{
                position: "absolute",
                inset: -14,
                border: "1px solid rgba(212,175,55,0.18)",
                borderRadius: "32px",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: -7,
                border: "1px solid rgba(212,175,55,0.08)",
                borderRadius: "26px",
              }}
            />
            <img
              src="/yb.png"
              alt="Yusuf Bhai"
              style={{
                width: isMobile ? "100%" : "420px",
                maxWidth: "100%",
                borderRadius: "20px",
                display: "block",
                filter: "brightness(0.88) contrast(1.06)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(0,0,0,0.8)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(212,175,55,0.3)",
                padding: "10px 24px",
                borderRadius: "999px",
                color: "#D4AF37",
                fontSize: "10px",
                letterSpacing: "4px",
                fontFamily: "'Montserrat', sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              DUBAI'S FINEST PERFUMER
            </div>
          </div>
        </div>

        {/* Text */}
        <div ref={textRef}>
          <div
            style={{
              color: "#D4AF37",
              letterSpacing: "7px",
              marginBottom: "20px",
              fontSize: "10px",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 300,
            }}
          >
            THE STORY
          </div>

          <h2
            style={{
              color: "#fff",
              fontSize: "clamp(2.8rem,5vw,4.5rem)",
              margin: 0,
              lineHeight: 1.1,
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
            }}
          >
            Why{" "}
            <span style={{ color: "#D4AF37", fontStyle: "italic" }}>
              Yusuf Bhai?
            </span>
          </h2>

          <div
            style={{
              width: "50px",
              height: "1px",
              background: "linear-gradient(90deg, #D4AF37, transparent)",
              margin: "28px 0",
            }}
          />

          {[
            "Yusuf Bhai is one of Dubai's most recognized perfumers, renowned for creating premium inspired fragrances that deliver exceptional performance and remarkable longevity.",
            "His fragrances have gained popularity across the Middle East and internationally — making luxury scent experiences accessible to all.",
            "Zuhaib Fragrance proudly brings authentic Yusuf Bhai fragrances to Bangladesh, ensuring quality, authenticity, and the best possible value.",
          ].map((text, i) => (
            <p
              key={i}
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "13px",
                lineHeight: "2.1",
                marginTop: i === 0 ? 0 : "18px",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 300,
                letterSpacing: "0.5px",
              }}
            >
              {text}
            </p>
          ))}

          {/* Stats */}
          <div
            ref={statsRef}
            style={{
              display: "flex",
              gap: isMobile ? "24px" : "45px",
              marginTop: "50px",
              borderTop: "1px solid rgba(212,175,55,0.1)",
              paddingTop: "40px",
            }}
          >
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div
                  style={{
                    color: "#D4AF37",
                    fontSize: "2.8rem",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 400,
                    lineHeight: 1,
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: "9px",
                    letterSpacing: "3px",
                    marginTop: "8px",
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 300,
                  }}
                >
                  {label.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
