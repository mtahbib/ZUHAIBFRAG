import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useIsMobile from "../../hooks/useIsMobile";
import SplitHeading from "../../components/SplitHeading";
import { otherBrandsProducts } from "../data/products";
import { useObCart } from "../context/ObCartContext";
import { COLORS, FONT_SANS, FONT_SERIF, SIZE_ORDER, familyTheme } from "../theme";
import FragranceBottle from "./FragranceBottle";
import { prefersReducedMotion } from "../motion";
import { navigateWithTransition } from "../viewTransition";

gsap.registerPlugin(ScrollTrigger);

// A light/ivory clone of the Yusuf Bhai "Product Catalog" experience (grid +
// coverflow gallery, dust particles, mirror reflection, tilt cards) built for
// the Other Brands collection instead.

// ─── View Toggle pill ─────────────────────────────────────────────────────────
function ObViewToggle({ view, onChange }) {
  return (
    <div
      style={{
        display: "inline-flex",
        border: `1px solid ${COLORS.espressoHairline}`,
        borderRadius: "999px",
        overflow: "hidden",
      }}
    >
      {["grid", "gallery"].map((v) => {
        const active = view === v;
        return (
          <button
            key={v}
            onClick={() => onChange(v)}
            style={{
              padding: "10px 22px",
              background: active ? COLORS.espresso : "transparent",
              color: active ? COLORS.ivory : COLORS.espressoFaint,
              border: "none",
              cursor: "pointer",
              fontSize: "9px",
              letterSpacing: "3px",
              fontFamily: FONT_SANS,
              fontWeight: active ? 700 : 400,
              transition: "background 0.35s ease, color 0.35s ease",
              whiteSpace: "nowrap",
            }}
          >
            {v === "grid" ? "GRID VIEW" : "GALLERY VIEW"}
          </button>
        );
      })}
    </div>
  );
}

// ─── Size selector ────────────────────────────────────────────────────────────
function buildSizeOpts(product) {
  return SIZE_ORDER.map((size) => ({ size, price: product.sizes[size] }));
}

function ObSizeSelector({ product, value, onChange }) {
  const opts = buildSizeOpts(product);
  return (
    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", justifyContent: "center", marginBottom: "8px" }}>
      {opts.map((opt) => {
        const active = value.size === opt.size;
        return (
          <button
            key={opt.size}
            onClick={(e) => { e.stopPropagation(); onChange(opt); }}
            style={{
              background: active ? COLORS.espresso : COLORS.copperSoft,
              color: active ? COLORS.ivory : COLORS.espressoSoft,
              border: `1px solid ${active ? COLORS.espresso : COLORS.espressoHairline}`,
              borderRadius: "999px",
              padding: "6px 14px",
              fontSize: "10.5px",
              fontFamily: FONT_SANS,
              fontWeight: active ? 700 : 400,
              letterSpacing: "0.5px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {opt.size}
          </button>
        );
      })}
    </div>
  );
}

// ─── Canvas dust particles ────────────────────────────────────────────────────
function ObGalleryParticles() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: 26 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.1 + 0.2,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -Math.random() * 0.22 - 0.04,
      a: Math.random() * 0.3 + 0.06,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }
        if (p.x < -4) p.x = canvas.width + 4;
        if (p.x > canvas.width + 4) p.x = -4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(166,106,76,${p.a})`;
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
    />
  );
}

// ─── Gallery (coverflow) View ─────────────────────────────────────────────────
function ObGalleryView({ filtered, filterKey, onDetails, isMobile }) {
  const [idx, setIdx] = useState(0);
  const [animating, setAnim] = useState(false);
  const [captionKey, setCKey] = useState(0);
  const [addedId, setAddedId] = useState(null);
  const [selectedOpt, setSelectedOpt] = useState(() => ({ size: SIZE_ORDER[0], price: filtered[0]?.sizes[SIZE_ORDER[0]] }));
  const { addItem } = useObCart();
  const animRef = useRef(false);
  const touchX = useRef(null);
  const reducedMotion = useRef(
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const total = filtered.length;

  useEffect(() => {
    setIdx(0);
    setCKey((k) => k + 1);
  }, [filterKey]);

  useEffect(() => {
    if (filtered[idx]) setSelectedOpt({ size: SIZE_ORDER[0], price: filtered[idx].sizes[SIZE_ORDER[0]] });
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  const navigate = useCallback(
    (dir) => {
      if (animRef.current || total <= 1) return;
      animRef.current = true;
      setAnim(true);
      setIdx((i) => (i + dir + total) % total);
      setCKey((k) => k + 1);
      const delay = reducedMotion.current ? 60 : 960;
      setTimeout(() => { animRef.current = false; setAnim(false); }, delay);
    },
    [total]
  );

  const jumpTo = useCallback(
    (i) => {
      if (animRef.current || i === idx) return;
      animRef.current = true;
      setAnim(true);
      setIdx(i);
      setCKey((k) => k + 1);
      setTimeout(() => { animRef.current = false; setAnim(false); }, reducedMotion.current ? 60 : 960);
    },
    [idx]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const delta = touchX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 48) navigate(delta > 0 ? 1 : -1);
    touchX.current = null;
  };

  const handleCart = (p) => {
    addItem({ id: p.id, brand: p.brand, name: p.name, size: selectedOpt.size, price: selectedOpt.price, family: p.family });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const TRANS = reducedMotion.current
    ? "opacity 0.3s ease"
    : "transform 0.9s cubic-bezier(0.22,0.8,0.2,1), opacity 0.9s cubic-bezier(0.22,0.8,0.2,1), filter 0.9s cubic-bezier(0.22,0.8,0.2,1)";

  const stageH = isMobile ? 380 : 540;
  const STEP = isMobile ? 52 : 40;
  const bottleW = isMobile ? 170 : 300;

  if (total === 0) {
    return (
      <div style={{
        textAlign: "center", padding: "80px 20px", color: COLORS.espressoFaint,
        fontFamily: FONT_SERIF, fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 300, letterSpacing: "4px",
      }}>
        No fragrances match your selection
      </div>
    );
  }

  const product = filtered[idx];
  const theme = familyTheme(product.family);

  return (
    <div style={{ userSelect: "none" }}>
      <style>{`
        @keyframes _obgcaption {
          from { opacity: 0; transform: translateY(9px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes _obgfloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-12px); }
        }
        @keyframes _obgrise {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .obg-float { animation: none !important; }
        }
      `}</style>

      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          position: "relative",
          width: "100%",
          height: `${stageH}px`,
          background: `radial-gradient(ellipse 70% 55% at 50% 40%, ${theme.soft}88 0%, transparent 72%)`,
          overflow: "hidden",
          borderRadius: "22px",
        }}
      >
        <ObGalleryParticles />

        <div style={{
          position: "absolute", bottom: "26%", left: "8%", right: "8%", height: "1px",
          background: `linear-gradient(90deg, transparent, ${COLORS.copperSoft}, transparent)`,
          zIndex: 1, pointerEvents: "none",
        }} />

        {filtered.map((p, i) => {
          let slot = ((i - idx) % total + total) % total;
          if (slot > total / 2) slot -= total;

          const isCenter = slot === 0;
          const isAdj = Math.abs(slot) === 1;
          const inDom = Math.abs(slot) <= 2;
          if (!inDom) return null;

          const opacity = isCenter ? 1 : isAdj ? 0.32 : 0;
          const scale = isCenter ? 1 : 0.62;
          const blur = isCenter ? 0 : isAdj ? 2.5 : 0;
          const xPct = slot * STEP;

          return (
            <div
              key={p.id}
              onClick={isCenter ? () => onDetails(p) : undefined}
              style={{
                position: "absolute",
                left: "50%",
                top: "46%",
                transform: `translateX(calc(-50% + ${xPct}%)) translateY(-50%) scale(${scale})`,
                opacity,
                filter: blur > 0 ? `blur(${blur}px)` : "none",
                transition: TRANS,
                willChange: "transform, opacity, filter",
                pointerEvents: isCenter ? "auto" : "none",
                zIndex: isCenter ? 4 : 2,
                cursor: isCenter ? "pointer" : "default",
                transformOrigin: "center bottom",
                width: `${bottleW}px`,
              }}
            >
              <div
                className={isCenter ? "obg-float" : undefined}
                style={
                  isCenter && !reducedMotion.current
                    ? { animation: "_obgrise 0.7s cubic-bezier(0.22,0.8,0.2,1) both, _obgfloat 6s ease-in-out 0.7s infinite" }
                    : undefined
                }
              >
                <FragranceBottle
                  product={p}
                  bare
                  dramatic={isCenter}
                  viewTransitionId={isCenter ? `pimg-${p.id}` : undefined}
                />
              </div>

              {isCenter && (
                <div style={{
                  position: "absolute", top: "100%", left: 0, width: `${bottleW}px`, height: `${bottleW * 0.42}px`,
                  overflow: "hidden", pointerEvents: "none", marginTop: "2px", transform: "scaleY(-1)", opacity: 0.22,
                  WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 75%)",
                  maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 75%)",
                }}>
                  <FragranceBottle product={p} bare dramatic />
                </div>
              )}
            </div>
          );
        })}

        {total > 1 && (
          <NavArrow dir="prev" onClick={() => navigate(-1)} disabled={animating} isMobile={isMobile} />
        )}
        {total > 1 && (
          <NavArrow dir="next" onClick={() => navigate(1)} disabled={animating} isMobile={isMobile} />
        )}
      </div>

      <div key={captionKey} style={{
        textAlign: "center", padding: isMobile ? "2px 20px 18px" : "0 20px 24px",
        marginTop: isMobile ? "-24px" : "-40px",
        animation: "_obgcaption 0.55s cubic-bezier(0.22,0.8,0.2,1) both",
      }}>
        <div style={{ color: COLORS.espressoFaint, fontSize: "9px", letterSpacing: "6px", fontFamily: FONT_SANS, fontWeight: 300, marginBottom: "10px" }}>
          {String(idx + 1).padStart(2, "0")} — {String(total).padStart(2, "0")}
        </div>

        <div style={{ color: COLORS.copper, fontSize: "10px", letterSpacing: "3px", fontFamily: FONT_SANS, fontWeight: 600, marginBottom: "6px" }}>
          {product.brand.toUpperCase()}
        </div>

        <h3 style={{ color: COLORS.espresso, fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontFamily: FONT_SERIF, fontWeight: 300, margin: "0 0 10px", letterSpacing: "1px" }}>
          {product.name}
        </h3>

        <div style={{ color: COLORS.espressoFaint, fontSize: "9px", letterSpacing: "3px", fontFamily: FONT_SANS, fontWeight: 300, marginBottom: "10px" }}>
          {[...product.topNotes.slice(0, 2), ...product.baseNotes.slice(0, 1)].join(" · ")}
        </div>

        <ObSizeSelector product={product} value={selectedOpt} onChange={setSelectedOpt} />

        <div style={{ color: COLORS.copper, fontSize: "clamp(1.1rem, 2.2vw, 1.35rem)", fontFamily: FONT_SERIF, marginBottom: "22px" }}>
          ৳{selectedOpt.price}
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => onDetails(product)}
            style={{
              background: "transparent", color: COLORS.espresso, border: `1px solid ${COLORS.espressoHairline}`,
              padding: "12px 28px", borderRadius: "999px", cursor: "pointer",
              fontSize: "9px", letterSpacing: "3px", fontFamily: FONT_SANS, fontWeight: 600, transition: "all 0.3s ease",
            }}
          >
            VIEW DETAILS
          </button>
          <button
            onClick={product.inStock ? () => handleCart(product) : undefined}
            disabled={!product.inStock}
            style={{
              background: !product.inStock ? COLORS.espressoHairline : addedId === product.id ? COLORS.copperSoft : COLORS.espresso,
              color: !product.inStock ? COLORS.espressoFaint : addedId === product.id ? COLORS.copper : COLORS.ivory,
              border: `1px solid ${COLORS.espresso}`,
              padding: "12px 28px", borderRadius: "999px",
              cursor: product.inStock ? "pointer" : "not-allowed",
              fontSize: "9px", letterSpacing: "3px", fontFamily: FONT_SANS, fontWeight: 700, transition: "all 0.3s ease",
              whiteSpace: "nowrap", opacity: product.inStock ? 1 : 0.7,
            }}
          >
            {!product.inStock ? "SOLD OUT" : addedId === product.id ? "ADDED ✓" : "+ CART"}
          </button>
        </div>
      </div>

      {total > 1 && total <= 20 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "7px", paddingBottom: "10px" }}>
          {filtered.map((_, i) => (
            <button
              key={i}
              onClick={() => jumpTo(i)}
              aria-label={`Go to product ${i + 1}`}
              style={{
                width: i === idx ? "22px" : "6px", height: "6px", borderRadius: "999px",
                background: i === idx ? COLORS.copper : COLORS.espressoHairline,
                border: "none", cursor: "pointer", padding: 0, transition: "width 0.4s ease, background 0.4s ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NavArrow({ dir, onClick, disabled, isMobile }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous" : "Next"}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "absolute",
        [dir === "prev" ? "left" : "right"]: isMobile ? "10px" : "22px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 10,
        background: "rgba(255,255,255,0.7)",
        border: `1px solid ${hov ? COLORS.copper : COLORS.espressoHairline}`,
        color: COLORS.copper,
        width: isMobile ? "38px" : "46px",
        height: isMobile ? "38px" : "46px",
        borderRadius: "50%",
        cursor: "pointer",
        fontSize: "22px",
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(10px)",
        opacity: disabled ? 0.35 : 0.9,
        transition: "opacity 0.2s ease, border-color 0.2s ease",
      }}
    >
      {dir === "prev" ? "‹" : "›"}
    </button>
  );
}

// ─── TiltCard ─────────────────────────────────────────────────────────────────
function ObTiltCard({ product, onDetails }) {
  const cardRef = useRef(null);
  const [hov, setHov] = useState(false);
  const [added, setAdded] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState({ size: SIZE_ORDER[0], price: product.sizes[SIZE_ORDER[0]] });
  const { addItem } = useObCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem({ id: product.id, brand: product.brand, name: product.name, size: selectedOpt.size, price: selectedOpt.price, family: product.family });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const onMove = (e) => {
    const el = cardRef.current;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) scale(1.03)`;
  };

  const onLeave = () => {
    const el = cardRef.current;
    el.style.transition = "transform 0.6s cubic-bezier(0.16,1,0.3,1)";
    el.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)";
    setTimeout(() => { el.style.transition = ""; }, 650);
    setHov(false);
  };

  return (
    <div style={{ perspective: "600px" }}>
      <div
        ref={cardRef}
        onClick={() => onDetails(product)}
        onMouseMove={onMove}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={onLeave}
        style={{
          background: COLORS.white,
          border: `1px solid ${hov ? COLORS.copper : COLORS.espressoHairline}`,
          borderRadius: "20px",
          padding: "30px 24px",
          textAlign: "center",
          willChange: "transform",
          boxShadow: hov ? "0 30px 60px rgba(33,28,24,0.12), 0 0 0 4px rgba(166,106,76,0.06)" : "0 4px 12px rgba(33,28,24,0.02)",
          transition: "border-color 0.3s ease, box-shadow 0.4s ease",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", top: "14px", left: "14px", zIndex: 10,
          background: COLORS.copperSoft, border: `1px solid ${COLORS.espressoHairline}`,
          color: COLORS.copper, fontSize: "8.5px", letterSpacing: "2px",
          padding: "5px 12px", borderRadius: "999px",
          fontFamily: FONT_SANS, fontWeight: 600, textTransform: "uppercase",
        }}>
          {product.family}
        </div>

        {!product.inStock && (
          <div style={{
            position: "absolute", top: "14px", right: "14px", zIndex: 10,
            background: "rgba(220,50,50,0.08)", border: "1px solid rgba(220,50,50,0.3)",
            color: "#B23A3A", fontSize: "8.5px", letterSpacing: "2px",
            padding: "5px 12px", borderRadius: "999px",
            fontFamily: FONT_SANS, fontWeight: 700, textTransform: "uppercase",
          }}>
            SOLD OUT
          </div>
        )}

        <div style={{
          position: "absolute", top: "6%", left: "50%", width: "320px", height: "320px",
          transform: `translate(-50%, 0) scale(${hov ? 1.08 : 0.9})`,
          background: `radial-gradient(circle, ${familyTheme(product.family).soft} 0%, transparent 72%)`,
          opacity: hov ? 0.9 : 0,
          transition: "transform 0.5s ease, opacity 0.5s ease",
          pointerEvents: "none",
        }} />

        <div style={{
          position: "relative",
          width: "280px", maxWidth: "96%", height: "auto",
          marginTop: "20px", marginBottom: "22px", marginLeft: "auto", marginRight: "auto",
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: hov ? "translateY(-10px) scale(1.04)" : "translateY(0) scale(1)",
          transition: "transform 0.4s ease",
        }}>
          <FragranceBottle product={product} dramatic viewTransitionId={`pimg-${product.id}`} />
        </div>

        <div style={{ transform: hov ? "translateY(-3px)" : "translateY(0)", transition: "transform 0.4s ease" }}>
          <div style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: "13px", letterSpacing: "2.5px", color: COLORS.espresso, marginBottom: "5px" }}>
            {product.brand.toUpperCase()}
          </div>
          <h3 style={{ color: COLORS.espresso, marginBottom: "8px", fontSize: "1.35rem", fontFamily: FONT_SERIF, fontWeight: 400, lineHeight: 1.3 }}>
            {product.name}
          </h3>

          <ObSizeSelector product={product} value={selectedOpt} onChange={setSelectedOpt} />

          <div style={{ color: COLORS.copper, fontSize: "1.2rem", fontFamily: FONT_SERIF, marginBottom: "20px" }}>
            ৳{selectedOpt.price}
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={(e) => { e.stopPropagation(); onDetails(product); }}
            style={{
              background: "transparent", color: COLORS.espresso,
              border: `1px solid ${COLORS.espressoHairline}`,
              padding: "12px 22px", borderRadius: "999px", cursor: "pointer",
              fontWeight: 600, fontSize: "10.5px", letterSpacing: "2px",
              fontFamily: FONT_SANS, transition: "all 0.3s ease",
            }}
          >
            DETAILS
          </button>
          <button
            onClick={product.inStock ? handleAddToCart : undefined}
            disabled={!product.inStock}
            style={{
              background: !product.inStock ? "rgba(220,50,50,0.06)" : added ? COLORS.copperSoft : hov ? COLORS.espresso : "transparent",
              color: !product.inStock ? "#B23A3A" : added ? COLORS.copper : hov ? COLORS.ivory : COLORS.espresso,
              border: `1px solid ${!product.inStock ? "rgba(220,50,50,0.25)" : COLORS.espresso}`,
              padding: "12px 22px", borderRadius: "999px",
              cursor: product.inStock ? "pointer" : "not-allowed",
              fontWeight: 700, fontSize: "10.5px", letterSpacing: "2px",
              fontFamily: FONT_SANS, transition: "all 0.3s ease",
              whiteSpace: "nowrap", opacity: product.inStock ? 1 : 0.7,
            }}
          >
            {!product.inStock ? "SOLD OUT" : added ? "ADDED ✓" : "+ CART"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ObCatalog ────────────────────────────────────────────────────────────────
export default function ObCatalog() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("all");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedGender, setAppliedGender] = useState("all");
  const [view, setView] = useState(
    () => (typeof sessionStorage !== "undefined" && sessionStorage.getItem("ob-view")) || "grid"
  );
  const [viewVis, setViewVis] = useState(true);
  const [gridVis, setGridVis] = useState(true);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const controlsRef = useRef(null);
  const gridRef = useRef(null);
  const mounted = useRef(false);

  const goToDetails = (product) => navigateWithTransition(navigate, `/other-brands/product/${product.slug}`);

  const filtered = otherBrandsProducts.filter((p) => {
    const q = appliedSearch.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    const genderMatch = appliedGender === "all" || p.gender === appliedGender || p.gender === "Unisex";
    return nameMatch && genderMatch;
  });

  const filterKey = `${appliedSearch}|${appliedGender}`;

  const changeView = (v) => {
    if (v === view) return;
    setViewVis(false);
    setTimeout(() => {
      setView(v);
      try { sessionStorage.setItem("ob-view", v); } catch { /* storage unavailable */ }
      setViewVis(true);
    }, 240);
  };

  // A luxury catalog doesn't hard-cut when you filter — the current
  // products settle out and the new set settles in. Search is debounced so
  // typing doesn't retrigger the transition on every keystroke; the gender
  // tabs (a discrete choice) animate immediately.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const delay = search === appliedSearch ? 0 : 320;
    setGridVis(false);
    const t = setTimeout(() => {
      setAppliedSearch(search);
      setAppliedGender(gender);
      setGridVis(true);
    }, delay);
    return () => clearTimeout(t);
  }, [search, gender]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const ctx = gsap.context(() => {
      const groups = [Array.from(headerRef.current.children), Array.from(controlsRef.current.children)].flat();
      gsap.fromTo(
        groups,
        { y: 32, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: "power2.out",
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", once: true },
        }
      );

      if (gridRef.current && !prefersReducedMotion()) {
        gsap.fromTo(
          Array.from(gridRef.current.children),
          { y: 34, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.07, ease: "power2.out",
            clearProps: "opacity,transform",
            scrollTrigger: { trigger: gridRef.current, start: "top 88%", once: true },
          }
        );
      }
    }, sectionRef);
    const t = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => { ctx.revert(); clearTimeout(t); };
  }, []);

  const GENDERS = ["all", "Men", "Women", "Unisex"];

  return (
    <section id="ob-catalog" ref={sectionRef} style={{ background: COLORS.ivory, padding: isMobile ? "70px 5%" : "120px 8%" }}>
      <div ref={headerRef} style={{ textAlign: "center", marginBottom: "50px" }}>
        <div style={{ color: COLORS.copper, letterSpacing: "8px", marginBottom: "18px", fontSize: "10px", fontFamily: FONT_SANS, fontWeight: 300 }}>
          FULL RANGE
        </div>
        <SplitHeading
          text="Product Catalog"
          style={{ color: COLORS.espresso, fontSize: "clamp(2.4rem,5.4vw,4.2rem)", margin: 0, fontFamily: FONT_SERIF, fontWeight: 300 }}
        />
      </div>

      <div ref={controlsRef}>
        <div style={{ textAlign: "center", marginBottom: "26px" }}>
          <input
            type="text"
            placeholder="Search fragrance or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", maxWidth: "480px",
              padding: "15px 24px", borderRadius: "999px",
              border: `1px solid ${COLORS.espressoHairline}`,
              background: COLORS.white,
              color: COLORS.espresso, fontSize: "13px",
              fontFamily: FONT_SANS, fontWeight: 300, letterSpacing: "1px", outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: isMobile ? "8px" : "10px", marginBottom: isMobile ? "14px" : "18px", flexWrap: "wrap" }}>
          {GENDERS.map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              style={{
                padding: isMobile ? "9px 18px" : "11px 26px",
                borderRadius: "999px",
                border: `1px solid ${COLORS.espressoHairline}`,
                background: gender === g ? COLORS.espresso : "transparent",
                color: gender === g ? COLORS.ivory : COLORS.espressoSoft,
                cursor: "pointer",
                fontSize: isMobile ? "9px" : "10px",
                letterSpacing: "3px",
                fontFamily: FONT_SANS, fontWeight: 600,
                transition: "all 0.3s ease",
              }}
            >
              {g.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "40px" }}>
          <ObViewToggle view={view} onChange={changeView} />
        </div>
      </div>

      <div style={{
        opacity: viewVis && gridVis ? 1 : 0,
        transform: viewVis && gridVis ? "scale(1)" : "scale(0.985)",
        transition: "opacity 0.28s ease, transform 0.28s ease",
      }}>
        {view === "grid" ? (
          <div ref={gridRef} style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? "18px" : "28px", maxWidth: "1300px", margin: "0 auto" }}>
            {filtered.length > 0 ? (
              filtered.map((product) => (
                <ObTiltCard key={product.id} product={product} onDetails={goToDetails} />
              ))
            ) : (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px", color: COLORS.espressoFaint, fontFamily: FONT_SERIF, fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 300, letterSpacing: "4px" }}>
                No fragrances match your selection
              </div>
            )}
          </div>
        ) : (
          <ObGalleryView filtered={filtered} filterKey={filterKey} onDetails={goToDetails} isMobile={isMobile} />
        )}
      </div>
    </section>
  );
}
