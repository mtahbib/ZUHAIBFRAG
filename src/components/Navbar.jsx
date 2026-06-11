import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

const NAV_LINKS = [
  { label: "HOME",       id: "home" },
  { label: "COLLECTION", id: "collection" },
  { label: "ABOUT",      id: "about" },
  { label: "CONTACT",    id: "contact" },
];

function CartIcon({ totalItems, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "relative",
        background: "none",
        border: "1px solid rgba(212,175,55,0.3)",
        borderRadius: "999px",
        padding: "8px 16px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "7px",
        color: "#D4AF37",
        fontFamily: "'Montserrat', sans-serif",
        fontSize: "10px",
        letterSpacing: "2px",
        fontWeight: 600,
        transition: "all 0.3s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,175,55,0.1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      CART
      {totalItems > 0 && (
        <span style={{
          position: "absolute",
          top: "-6px",
          right: "-6px",
          background: "#D4AF37",
          color: "#000",
          borderRadius: "50%",
          width: "18px",
          height: "18px",
          fontSize: "9px",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {totalItems}
        </span>
      )}
    </button>
  );
}

export default function Navbar() {
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [isMobile,  setIsMobile]  = useState(window.innerWidth < 768);
  const [scrolled,  setScrolled]  = useState(false);
  const [hovered,   setHovered]   = useState(null);
  const { totalItems, setDrawer } = useCart();

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          padding: isMobile ? "14px 24px" : "18px 6%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backdropFilter: "blur(20px)",
          background: scrolled
            ? "rgba(0,0,0,0.85)"
            : "rgba(0,0,0,0.2)",
          borderBottom: scrolled
            ? "1px solid rgba(212,175,55,0.12)"
            : "1px solid transparent",
          transition: "background 0.4s ease, border-color 0.4s ease",
          boxSizing: "border-box",
        }}
      >
        <img
          src="/logo.png"
          alt="Zuhaib Fragrance"
          style={{ height: isMobile ? "50px" : "65px", cursor: "none" }}
        />

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
            {NAV_LINKS.map(({ label, id }) => (
              <div
                key={id}
                onClick={() => scrollTo(id)}
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  color: hovered === id ? "#D4AF37" : "#aaa",
                  letterSpacing: "3px",
                  fontSize: "11px",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 400,
                  cursor: "none",
                  transition: "color 0.3s ease",
                  position: "relative",
                  paddingBottom: "4px",
                }}
              >
                {label}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: "1px",
                    width: hovered === id ? "100%" : "0%",
                    background: "#D4AF37",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            ))}
            <CartIcon totalItems={totalItems} onClick={() => setDrawer(true)} />
          </div>
        )}

        {/* Mobile: hamburger + cart */}
        {isMobile && (
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <CartIcon totalItems={totalItems} onClick={() => setDrawer(true)} />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: "none",
                border: "1px solid rgba(212,175,55,0.3)",
                color: "#D4AF37",
                fontSize: "20px",
                cursor: "pointer",
                padding: "6px 12px",
                borderRadius: "8px",
              }}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        )}
      </nav>

      {/* Mobile drawer */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "280px",
            height: "100vh",
            background: "#050505",
            zIndex: 9999,
            padding: "100px 40px",
            borderLeft: "1px solid rgba(212,175,55,0.15)",
            backdropFilter: "blur(20px)",
            transform: menuOpen ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "35px" }}>
            {NAV_LINKS.map(({ label, id }) => (
              <div
                key={id}
                onClick={() => scrollTo(id)}
                style={{
                  color: "#fff",
                  fontSize: "1.4rem",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  letterSpacing: "4px",
                  cursor: "pointer",
                  borderBottom: "1px solid rgba(212,175,55,0.08)",
                  paddingBottom: "15px",
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {menuOpen && isMobile && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 9998,
          }}
        />
      )}
    </>
  );
}
