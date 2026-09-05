import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { COLORS, FONT_SANS, FONT_SERIF } from "../theme";
import { otherBrandsProducts } from "../data/products";
import { useObCart } from "../context/ObCartContext";
import { useWishlist } from "../context/WishlistContext";
import FragranceBottle from "./FragranceBottle";
import useIsMobile from "../../hooks/useIsMobile";
import { prefersReducedMotion } from "../motion";
import { navigateWithTransition } from "../viewTransition";

// A quiet underline-reveal link: the rule grows in from the left on hover
// rather than a flat color swap — a small, restrained tell of care.
function NavLink({ to, children, style }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      to={to}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        fontFamily: FONT_SANS,
        fontSize: "10px",
        letterSpacing: "2px",
        color: COLORS.espressoSoft,
        textDecoration: "none",
        whiteSpace: "nowrap",
        paddingBottom: "3px",
        ...style,
      }}
    >
      {children}
      <span
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: "1px",
          width: hov ? "100%" : "0%",
          background: COLORS.copper,
          transition: "width 0.35s cubic-bezier(0.22,0.8,0.2,1)",
        }}
      />
    </Link>
  );
}

function matches(product, q) {
  const hay = [
    product.brand,
    product.name,
    product.family,
    ...product.topNotes,
    ...product.heartNotes,
    ...product.baseNotes,
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(q.toLowerCase());
}

function SearchBox({ onNavigate }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const boxRef = useRef(null);

  const results = query.trim().length
    ? otherBrandsProducts.filter((p) => matches(p, query.trim())).slice(0, 6)
    : [];

  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setFocused(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div
      ref={boxRef}
      style={{
        position: "relative",
        flex: focused ? 1.35 : 1,
        maxWidth: focused ? "440px" : "360px",
        transition: "flex 0.4s cubic-bezier(0.22,0.8,0.2,1), max-width 0.4s cubic-bezier(0.22,0.8,0.2,1)",
      }}
    >
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        placeholder={focused ? "Search by fragrance, house, or note…" : "Search fragrances, brands, notes…"}
        style={{
          width: "100%",
          background: focused ? COLORS.white : COLORS.sand,
          border: `1px solid ${focused ? COLORS.copperSoft : "transparent"}`,
          borderRadius: "999px",
          padding: "10px 18px",
          fontFamily: FONT_SANS,
          fontSize: "12.5px",
          color: COLORS.espresso,
          outline: "none",
          boxShadow: focused ? "0 10px 30px rgba(33,28,24,0.08)" : "none",
          transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
        }}
      />
      {focused && results.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            background: COLORS.white,
            border: `1px solid ${COLORS.espressoHairline}`,
            borderRadius: "14px",
            boxShadow: "0 20px 50px rgba(33,28,24,0.14)",
            overflow: "hidden",
            zIndex: 60,
          }}
        >
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setFocused(false);
                setQuery("");
                onNavigate(p.slug);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "10px 14px",
                background: "none",
                border: "none",
                borderBottom: `1px solid ${COLORS.espressoHairline}`,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ width: "36px", flexShrink: 0 }}>
                <FragranceBottle product={p} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: "0.95rem",
                    color: COLORS.espresso,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.name}
                </div>
                <div style={{ fontFamily: FONT_SANS, fontSize: "10px", color: COLORS.espressoFaint }}>
                  {p.brand}
                </div>
              </div>
              <div style={{ fontFamily: FONT_SANS, fontSize: "11px", color: COLORS.copper }}>
                From ৳{p.startingPrice}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ObNavbar() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, setDrawer } = useObCart();
  const { ids: wishIds } = useWishlist();
  const navRef = useRef(null);

  const goTo = (slug) => navigateWithTransition(navigate, `/other-brands/product/${slug}`);

  useEffect(() => {
    if (!navRef.current) return;
    if (prefersReducedMotion()) return;
    gsap.fromTo(
      navRef.current,
      { y: -14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", clearProps: "transform,opacity" }
    );
  }, []);

  // A restrained scroll state — the bar quietly tightens and gains a
  // touch more translucency once the reader has committed to scrolling,
  // rather than staying visually identical the whole way down.
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        .ob-icon-btn { transition: transform 0.25s cubic-bezier(0.22,0.8,0.2,1); display: inline-flex; }
        .ob-icon-btn:hover { transform: translateY(-1px) scale(1.08); }
        .ob-icon-btn:active { transform: scale(0.92); }
      `}</style>
      <nav
        className="ob-navbar"
        ref={navRef}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 70,
          display: "flex",
          alignItems: "center",
          gap: "20px",
          padding: scrolled ? (isMobile ? "10px 5%" : "11px 4%") : (isMobile ? "14px 5%" : "16px 4%"),
          background: scrolled ? "rgba(245,240,231,0.72)" : "rgba(245,240,231,0.9)",
          backdropFilter: "blur(14px)",
          borderBottom: `1px solid ${COLORS.espressoHairline}`,
          transition: "padding 0.35s cubic-bezier(0.22,0.8,0.2,1), background 0.35s ease",
        }}
      >
        <Link
          className="ob-nav-brand"
          to="/other-brands"
          style={{
            fontFamily: FONT_SERIF,
            fontSize: "1.15rem",
            color: COLORS.espresso,
            textDecoration: "none",
            letterSpacing: "0.5px",
            flexShrink: 0,
          }}
          aria-label="Zuhaib Fragrance — Other Brands home"
        >
          <img className="ob-brand-logo" src="/zlogo.png" alt="" aria-hidden="true" />
          <span className="ob-brand-wordmark">Zuhaib <b>Fragrance</b></span>
        </Link>

        {!isMobile && <SearchBox onNavigate={goTo} />}

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: isMobile ? "10px" : "18px" }}>
          {!isMobile && <NavLink to="/other-brands/shop">SHOP</NavLink>}
          {!isMobile && <NavLink to="/yusuf-bhai">YUSUF BHAI →</NavLink>}

          <Link
            to="/other-brands/wishlist"
            aria-label="Wishlist"
            className="ob-icon-btn"
            style={{ position: "relative", color: COLORS.espresso, textDecoration: "none" }}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 21s-7.5-4.6-10-9.1C0.3 8.2 2 4.5 5.6 4c2.1-.3 4 .8 6.4 3.2C14.4 4.8 16.3 3.7 18.4 4c3.6.5 5.3 4.2 3.6 7.9C19.5 16.4 12 21 12 21z" />
            </svg>
            {wishIds.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-7px",
                  right: "-9px",
                  background: COLORS.copper,
                  color: COLORS.ivory,
                  borderRadius: "50%",
                  width: "16px",
                  height: "16px",
                  fontSize: "9px",
                  fontFamily: FONT_SANS,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {wishIds.length}
              </span>
            )}
          </Link>

          <button
            onClick={() => setDrawer(true)}
            aria-label="Cart"
            className="ob-icon-btn"
            style={{
              position: "relative",
              background: "none",
              border: "none",
              color: COLORS.espresso,
              cursor: "pointer",
              padding: 0,
              display: "flex",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {totalItems > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-7px",
                  right: "-9px",
                  background: COLORS.copper,
                  color: COLORS.ivory,
                  borderRadius: "50%",
                  width: "16px",
                  height: "16px",
                  fontSize: "9px",
                  fontFamily: FONT_SANS,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {totalItems}
              </span>
            )}
          </button>

          {isMobile && (
            <button
              onClick={() => setMenuOpen((o) => !o)}
              style={{
                background: "none",
                border: `1px solid ${COLORS.espressoHairline}`,
                color: COLORS.espresso,
                borderRadius: "8px",
                padding: "6px 10px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          )}
        </div>
      </nav>

      {isMobile && menuOpen && (
        <div
          style={{
            background: COLORS.ivory,
            borderBottom: `1px solid ${COLORS.espressoHairline}`,
            padding: "16px 5% 22px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <SearchBox onNavigate={(slug) => { setMenuOpen(false); goTo(slug); }} />
          <Link
            to="/other-brands/shop"
            onClick={() => setMenuOpen(false)}
            style={{ fontFamily: FONT_SANS, fontSize: "11px", letterSpacing: "2px", color: COLORS.espressoSoft, textDecoration: "none" }}
          >
            SHOP
          </Link>
          <Link
            to="/yusuf-bhai"
            onClick={() => setMenuOpen(false)}
            style={{ fontFamily: FONT_SANS, fontSize: "11px", letterSpacing: "2px", color: COLORS.espressoSoft, textDecoration: "none" }}
          >
            YUSUF BHAI →
          </Link>
        </div>
      )}
    </>
  );
}
