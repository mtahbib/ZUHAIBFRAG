import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const NAV_LINKS = [
  { label: "Maison", id: "home" },
  { label: "The story", id: "about" },
  { label: "Collections", id: "collection" },
  { label: "All scents", id: "catalog" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, setDrawer } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => { if (event.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <nav className={`yb-navbar ${scrolled ? "is-scrolled" : ""}`} aria-label="Yusuf Bhai navigation">
        <button className="yb-nav-brand" onClick={() => scrollTo("home")} aria-label="Zuhaib Fragrance home">
          <img className="yb-brand-logo" src="/zlogo.png" alt="" aria-hidden="true" />
          <span><strong>ZUHAIB</strong><small>FRAGRANCE</small></span>
        </button>

        <div className="yb-nav-links">
          {NAV_LINKS.map(({ label, id }, index) => (
            <button key={id} onClick={() => scrollTo(id)}><span>0{index + 1}</span>{label}</button>
          ))}
        </div>

        <div className="yb-nav-actions">
          <Link to="/other-brands" className="yb-nav-other">Other brands <span aria-hidden="true">↗</span></Link>
          <button className="yb-nav-cart" onClick={() => setDrawer(true)} aria-label={`Open bag with ${totalItems} items`}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>
            <span>Bag</span><b>{String(totalItems).padStart(2, "0")}</b>
          </button>
          <button className="yb-menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="yb-mobile-menu" aria-label={menuOpen ? "Close menu" : "Open menu"}>
            <i /><i />
          </button>
        </div>
      </nav>

      <div id="yb-mobile-menu" className={`yb-mobile-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="yb-mobile-menu-top"><span>MENU / YUSUF BHAI</span><button onClick={() => setMenuOpen(false)} aria-label="Close menu">×</button></div>
        <div className="yb-mobile-links">
          {NAV_LINKS.map(({ label, id }, index) => <button key={id} onClick={() => scrollTo(id)}><span>0{index + 1}</span>{label}<i>↘</i></button>)}
          <Link to="/other-brands" onClick={() => setMenuOpen(false)}><span>05</span>Other brands<i>↗</i></Link>
        </div>
        <p>Dubai-crafted fragrance, curated for Bangladesh.</p>
      </div>
      {menuOpen && <button className="yb-menu-backdrop" onClick={() => setMenuOpen(false)} aria-label="Close menu backdrop" />}
    </>
  );
}
