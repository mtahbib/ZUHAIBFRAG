import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COLORS, FONT_SANS, FONT_SERIF } from "../theme";
import useIsMobile from "../../hooks/useIsMobile";
import { prefersReducedMotion } from "../motion";

gsap.registerPlugin(ScrollTrigger);

export default function ObFooter() {
  const isMobile = useIsMobile();
  const footerRef = useRef(null);

  useEffect(() => {
    if (!footerRef.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current,
        { opacity: 0, y: 14 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: footerRef.current, start: "top 95%", once: true },
        }
      );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      style={{
        background: COLORS.espresso,
        padding: isMobile ? "40px 6% 26px" : "56px 8% 30px",
        color: COLORS.ivory,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          gap: "18px",
          maxWidth: "1280px",
          margin: "0 auto 28px",
        }}
      >
        <div className="ob-footer-brand" style={{ fontFamily: FONT_SERIF, fontSize: "1.2rem" }}>
          <img src="/zlogo.png" alt="" aria-hidden="true" />
          <span>Zuhaib <b style={{ color: COLORS.copper }}>Fragrance</b></span>
        </div>
        <div style={{ display: "flex", gap: "22px", flexWrap: "wrap" }}>
          <Link to="/" style={{ color: "rgba(245,240,231,0.6)", fontFamily: FONT_SANS, fontSize: "10.5px", letterSpacing: "1px", textDecoration: "none" }}>
            HOME
          </Link>
          <Link to="/yusuf-bhai" style={{ color: "rgba(245,240,231,0.6)", fontFamily: FONT_SANS, fontSize: "10.5px", letterSpacing: "1px", textDecoration: "none" }}>
            YUSUF BHAI
          </Link>
          <Link to="/other-brands/wishlist" style={{ color: "rgba(245,240,231,0.6)", fontFamily: FONT_SANS, fontSize: "10.5px", letterSpacing: "1px", textDecoration: "none" }}>
            WISHLIST
          </Link>
        </div>
      </div>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          paddingTop: "20px",
          borderTop: "1px solid rgba(245,240,231,0.12)",
          fontFamily: FONT_SANS,
          fontSize: "9.5px",
          color: "rgba(245,240,231,0.4)",
          letterSpacing: "0.5px",
        }}
      >
        © {new Date().getFullYear()} Zuhaib Fragrance. Other Brands products are sold by Zuhaib Fragrance as an authorized retailer/curator; all brand names are the property of their respective owners.
      </div>
    </footer>
  );
}
