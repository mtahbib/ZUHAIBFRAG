import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import useIsMobile from "../hooks/useIsMobile";
import { products } from "../data/products";
import ProductModal from "./ProductModal";
import { useCart } from "../context/CartContext";

gsap.registerPlugin(ScrollTrigger);

function TiltCard({ product, onSelect }) {
  const cardRef  = useRef(null);
  const [hov, setHov] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const onMove = (e) => {
    const el   = cardRef.current;
    const rect = el.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width  - 0.5;
    const y    = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) scale(1.03)`;
    el.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(212,175,55,0.08), transparent 65%), #0a0a0a`;
  };

  const onLeave = () => {
    const el = cardRef.current;
    el.style.transition = "transform 0.6s cubic-bezier(0.16,1,0.3,1), background 0.5s ease";
    el.style.transform  = "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)";
    el.style.background = "#0a0a0a";
    setTimeout(() => { el.style.transition = ""; }, 650);
    setHov(false);
  };

  return (
    <div style={{ perspective: "600px" }}>
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={onLeave}
        style={{
          background: "#0a0a0a",
          border: `1px solid ${hov ? "rgba(212,175,55,0.4)" : "rgba(212,175,55,0.12)"}`,
          borderRadius: "20px",
          padding: "28px",
          textAlign: "center",
          willChange: "transform",
          transition: "border-color 0.3s ease",
          cursor: "none",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Category badge */}
        <div
          style={{
            position: "absolute",
            top: "14px",
            left: "14px",
            background: "rgba(212,175,55,0.1)",
            border: "1px solid rgba(212,175,55,0.2)",
            color: "#D4AF37",
            fontSize: "7px",
            letterSpacing: "2px",
            padding: "4px 10px",
            borderRadius: "999px",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          {product.category}
        </div>

        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "160px",
            maxWidth: "80%",
            marginTop: "16px",
            marginBottom: "18px",
            filter: "drop-shadow(0 0 30px rgba(212,175,55,0.25))",
            transform: hov ? "translateY(-6px)" : "translateY(0)",
            transition: "transform 0.4s ease",
          }}
        />

        <h3
          style={{
            color: "#fff",
            marginBottom: "6px",
            fontSize: "1rem",
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </h3>

        <div
          style={{
            color: "rgba(255,255,255,0.3)",
            fontSize: "9px",
            letterSpacing: "1.5px",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 300,
            marginBottom: "10px",
          }}
        >
          {product.notes}
        </div>

        <div
          style={{
            color: "#D4AF37",
            fontSize: "1rem",
            fontFamily: "'Cormorant Garamond', serif",
            marginBottom: "20px",
          }}
        >
          {product.price}
        </div>

        <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => onSelect(product)}
            style={{
              background: "transparent",
              color: "#D4AF37",
              border: "1px solid rgba(212,175,55,0.35)",
              padding: "10px 18px",
              borderRadius: "999px",
              cursor: "none",
              fontWeight: 600,
              fontSize: "9px",
              letterSpacing: "2px",
              fontFamily: "'Montserrat', sans-serif",
              transition: "all 0.3s ease",
            }}
          >
            DETAILS
          </button>
          <button
            onClick={handleAddToCart}
            style={{
              background: added ? "rgba(212,175,55,0.2)" : hov ? "#D4AF37" : "transparent",
              color: added ? "#D4AF37" : hov ? "#000" : "#D4AF37",
              border: "1px solid rgba(212,175,55,0.35)",
              padding: "10px 18px",
              borderRadius: "999px",
              cursor: "none",
              fontWeight: 700,
              fontSize: "9px",
              letterSpacing: "2px",
              fontFamily: "'Montserrat', sans-serif",
              transition: "all 0.3s ease",
              whiteSpace: "nowrap",
            }}
          >
            {added ? "ADDED ✓" : "+ CART"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductCatalog() {
  const isMobile   = useIsMobile();
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(null);
  const sectionRef = useRef(null);
  const headerRef  = useRef(null);

  const filtered = products.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(search.toLowerCase());
    const catMatch  = category === "all" || p.category === category;
    return nameMatch && catMatch;
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        Array.from(headerRef.current.children),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: "power2.out", clearProps: "opacity,transform",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", once: true } }
      );
    }, sectionRef);
    const t = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => { ctx.revert(); clearTimeout(t); };
  }, []);

  const CATS = ["all", "male", "female", "unisex"];

  return (
    <>
      <section
        id="catalog"
        ref={sectionRef}
        style={{ background: "#050505", padding: isMobile ? "80px 5%" : "140px 8%" }}
      >
        <div ref={headerRef} style={{ textAlign: "center", marginBottom: "60px" }}>
          <div
            style={{
              color: "#D4AF37",
              letterSpacing: "8px",
              marginBottom: "20px",
              fontSize: "10px",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 300,
            }}
          >
            FULL RANGE
          </div>
          <h2
            style={{
              color: "#fff",
              fontSize: "clamp(2.8rem,6vw,5rem)",
              margin: 0,
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
            }}
          >
            Product Catalog
          </h2>
        </div>

        {/* Search */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <input
            type="text"
            placeholder="Search fragrance..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "480px",
              padding: "15px 24px",
              borderRadius: "999px",
              border: "1px solid rgba(212,175,55,0.2)",
              background: "rgba(255,255,255,0.03)",
              color: "#fff",
              fontSize: "13px",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 300,
              letterSpacing: "1px",
              outline: "none",
            }}
          />
        </div>

        {/* Filter buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "50px",
            flexWrap: "wrap",
          }}
        >
          {CATS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: "11px 26px",
                borderRadius: "999px",
                border: "1px solid rgba(212,175,55,0.3)",
                background: category === cat ? "#D4AF37" : "transparent",
                color: category === cat ? "#000" : "rgba(255,255,255,0.5)",
                cursor: "none",
                fontSize: "10px",
                letterSpacing: "3px",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 600,
                transition: "all 0.3s ease",
              }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "22px",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          {filtered.map((product) => (
            <TiltCard
              key={product.id}
              product={product}
              onSelect={setSelected}
            />
          ))}
        </div>
      </section>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
}
