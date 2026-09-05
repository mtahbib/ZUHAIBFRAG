import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useRef, useState } from "react";
import useIsMobile from "../hooks/useIsMobile";
import { products } from "../data/products";
import ProductModal from "./ProductModal";
import { useCart } from "../context/CartContext";
import SplitHeading from "./SplitHeading";

gsap.registerPlugin(ScrollTrigger);

// ─── View Toggle pill ─────────────────────────────────────────────────────────
function ViewToggle({ view, onChange }) {
  return (
    <div
      className="yb-view-toggle"
      style={{
        display: "inline-flex",
        border: "1px solid rgba(212,175,55,0.35)",
        borderRadius: "999px",
        overflow: "hidden",
      }}
    >
      {["grid", "gallery"].map((v) => {
        const active = view === v;
        return (
          <button
            key={v}
            aria-pressed={active}
            onClick={() => onChange(v)}
            style={{
              padding: "10px 22px",
              background: active ? "#D4AF37" : "transparent",
              color: active ? "#000" : "rgba(255,255,255,0.45)",
              border: "none",
              cursor: "pointer",
              fontSize: "9px",
              letterSpacing: "3px",
              fontFamily: "'Montserrat', sans-serif",
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

// ─── Size selector helpers ────────────────────────────────────────────────────
function buildSizeOpts(product) {
  const opts = [];
  if (product.decants) {
    for (const d of product.decants) opts.push({ size: d.size, price: d.price });
  }
  opts.push({
    size: "100ml",
    price: product.price,
    label: "Full Bottle",
    soldOut: !!product.fullBottleSoldOut,
  });
  return opts;
}

function getDefaultOpt(product) {
  if (product?.fullBottleSoldOut && product?.decants?.length) {
    const d = product.decants[0];
    return { size: d.size, price: d.price };
  }
  return { size: "100ml", price: product?.price, label: "Full Bottle" };
}

function SizeSelector({ product, value, onChange }) {
  const opts = buildSizeOpts(product);
  return (
    <div className="yb-size-selector" style={{ display: "flex", gap: "5px", flexWrap: "wrap", justifyContent: "center", marginBottom: "8px" }}>
      {opts.map((opt) => {
        const active    = value.size === opt.size;
        const isSoldOut = opt.soldOut;
        return (
          <button
            key={opt.size}
            onClick={(e) => { if (isSoldOut) return; e.stopPropagation(); onChange(opt); }}
            disabled={isSoldOut}
            style={{
              background: isSoldOut
                ? "rgba(220,50,50,0.05)"
                : active ? "#D4AF37" : "rgba(212,175,55,0.05)",
              color: isSoldOut
                ? "rgba(220,80,80,0.45)"
                : active ? "#000" : "rgba(255,255,255,0.5)",
              border: isSoldOut
                ? "1px solid rgba(220,50,50,0.2)"
                : active ? "1px solid #D4AF37" : "1px solid rgba(212,175,55,0.2)",
              textDecoration: isSoldOut ? "line-through" : "none",
              borderRadius: "999px",
              padding: "4px 11px",
              fontSize: "8.5px",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: active ? 700 : 400,
              letterSpacing: "0.5px",
              cursor: isSoldOut ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {opt.label || opt.size}
          </button>
        );
      })}
    </div>
  );
}

// ─── Canvas dust particles ────────────────────────────────────────────────────
function GalleryParticles() {
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

    const pts = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.1 + 0.2,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -Math.random() * 0.22 - 0.04,
      a: Math.random() * 0.35 + 0.08,
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
        ctx.fillStyle = `rgba(212,175,55,${p.a})`;
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
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

// ─── Gallery View ─────────────────────────────────────────────────────────────
function GalleryView({ filtered, onSelect, isMobile }) {
  const [idx, setIdx]           = useState(0);
  const [animating, setAnim]    = useState(false);
  const [captionKey, setCKey]   = useState(0);
  const [addedId, setAddedId]           = useState(null);
  const [selectedOpt, setSelectedOpt]   = useState(() => getDefaultOpt(filtered[0]));
  const { addItem }                     = useCart();
  const animRef                         = useRef(false);
  const touchX                  = useRef(null);
  const reducedMotion           =
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const total = filtered.length;

  const navigate = useCallback(
    (dir) => {
      if (animRef.current || total <= 1) return;
      const next = (idx + dir + total) % total;
      animRef.current = true;
      setAnim(true);
      setIdx(next);
      setSelectedOpt(getDefaultOpt(filtered[next]));
      setCKey((k) => k + 1);
      const delay = reducedMotion ? 60 : 960;
      setTimeout(() => { animRef.current = false; setAnim(false); }, delay);
    },
    [filtered, idx, reducedMotion, total]
  );

  // Direct-jump (for dot clicks)
  const jumpTo = useCallback(
    (i) => {
      if (animRef.current || i === idx) return;
      animRef.current = true;
      setAnim(true);
      setIdx(i);
      setSelectedOpt(getDefaultOpt(filtered[i]));
      setCKey((k) => k + 1);
      setTimeout(() => { animRef.current = false; setAnim(false); }, reducedMotion ? 60 : 960);
    },
    [filtered, idx, reducedMotion]
  );

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft")  navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchX.current === null) return;
    const delta = touchX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 48) navigate(delta > 0 ? 1 : -1);
    touchX.current = null;
  };

  const handleCart = (p) => {
    addItem({
      ...p,
      price: selectedOpt.price,
      selectedSize: selectedOpt.size,
      cartKey: `${p.id}-${selectedOpt.size}`,
    });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const TRANS = reducedMotion
    ? "opacity 0.3s ease"
    : "transform 0.9s cubic-bezier(0.22,0.8,0.2,1), opacity 0.9s cubic-bezier(0.22,0.8,0.2,1), filter 0.9s cubic-bezier(0.22,0.8,0.2,1)";

  const stageH    = isMobile ? 440 : 760;
  const STEP      = isMobile ? 52 : 40;   // % of container per slot — wider on mobile so ghosts peek in
  const bottleW   = isMobile ? 220 : 440;

  if (total === 0) {
    return (
      <div style={{
        textAlign: "center",
        padding: "80px 20px",
        color: "rgba(255,255,255,0.2)",
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(1.4rem, 3vw, 2rem)",
        fontWeight: 300,
        letterSpacing: "4px",
      }}>
        No fragrances match your selection
      </div>
    );
  }

  const product = filtered[idx];

  return (
    <div style={{ userSelect: "none" }}>
      <style>{`
        @keyframes _gcaption {
          from { opacity: 0; transform: translateY(9px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>

      {/* ── Stage ── */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          position: "relative",
          width: "100%",
          height: `${stageH}px`,
          background:
            "radial-gradient(ellipse 80% 65% at 50% 38%, rgba(58,38,8,0.55) 0%, rgba(8,6,2,0) 100%), #060504",
          overflow: "hidden",
          borderRadius: "22px",
          border: "1px solid rgba(212,175,55,0.07)",
        }}
      >
        <GalleryParticles />

        {/* Floor reflection line */}
        <div style={{
          position: "absolute",
          bottom: "26%",
          left: "8%",
          right: "8%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.22), transparent)",
          zIndex: 1,
          pointerEvents: "none",
        }} />

        {/* Bottles */}
        {filtered.map((p, i) => {
          let slot = ((i - idx) % total + total) % total;
          if (slot > total / 2) slot -= total;

          const isCenter = slot === 0;
          const isAdj    = Math.abs(slot) === 1;
          const inDom    = Math.abs(slot) <= 2;
          if (!inDom) return null;

          const opacity = isCenter ? 1 : isAdj ? 0.36 : 0;
          const scale   = isCenter ? 1 : 0.6;
          const blur    = isCenter ? 0 : isAdj ? 3 : 0;
          const xPct    = slot * STEP;

          return (
            <div
              key={p.id}
              onClick={isCenter ? () => onSelect(p) : undefined}
              style={{
                position: "absolute",
                left: "50%",
                top: "44%",
                transform: `translateX(calc(-50% + ${xPct}%)) translateY(-50%) scale(${scale})`,
                opacity,
                filter: blur > 0 ? `blur(${blur}px)` : "none",
                transition: TRANS,
                pointerEvents: isCenter ? "auto" : "none",
                zIndex: isCenter ? 4 : 2,
                cursor: isCenter ? "pointer" : "default",
                transformOrigin: "center bottom",
              }}
            >
              <img
                src={p.image}
                alt={p.name}
                draggable={false}
                style={{
                  width: `${bottleW}px`,
                  display: "block",
                  filter: isCenter
                    ? "drop-shadow(0 0 55px rgba(212,175,55,0.4)) drop-shadow(0 18px 36px rgba(0,0,0,0.85))"
                    : "drop-shadow(0 0 16px rgba(212,175,55,0.12))",
                  transition: TRANS,
                }}
              />

              {/* Mirror reflection – center bottle only */}
              {isCenter && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: `${bottleW}px`,
                  height: `${bottleW * 0.42}px`,
                  overflow: "hidden",
                  pointerEvents: "none",
                  marginTop: "2px",
                }}>
                  <img
                    src={p.image}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    style={{
                      width: `${bottleW}px`,
                      transform: "scaleY(-1)",
                      filter: "blur(2px)",
                      opacity: 0.32,
                      WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 75%)",
                      maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 75%)",
                      display: "block",
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Prev arrow */}
        {total > 1 && (
          <button
            onClick={() => navigate(-1)}
            disabled={animating}
            aria-label="Previous"
            style={{
              position: "absolute",
              left: isMobile ? "10px" : "22px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              background: "rgba(5,4,2,0.55)",
              border: "1px solid rgba(212,175,55,0.22)",
              color: "#D4AF37",
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
              opacity: animating ? 0.35 : 0.85,
              transition: "opacity 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.borderColor = "#D4AF37"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.22)"; }}
          >
            ‹
          </button>
        )}

        {/* Next arrow */}
        {total > 1 && (
          <button
            onClick={() => navigate(1)}
            disabled={animating}
            aria-label="Next"
            style={{
              position: "absolute",
              right: isMobile ? "10px" : "22px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              background: "rgba(5,4,2,0.55)",
              border: "1px solid rgba(212,175,55,0.22)",
              color: "#D4AF37",
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
              opacity: animating ? 0.35 : 0.85,
              transition: "opacity 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.borderColor = "#D4AF37"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.22)"; }}
          >
            ›
          </button>
        )}
      </div>

      {/* ── Caption (crossfades via key remount) ── */}
      <div
        key={captionKey}
        style={{
          textAlign: "center",
          padding: isMobile ? "10px 20px 20px" : "14px 20px 28px",
          animation: "_gcaption 0.55s cubic-bezier(0.22,0.8,0.2,1) both",
        }}
      >
        <div style={{
          color: "rgba(212,175,55,0.45)",
          fontSize: "9px",
          letterSpacing: "6px",
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 300,
          marginBottom: "14px",
        }}>
          {String(idx + 1).padStart(2, "0")} — {String(total).padStart(2, "0")}
        </div>

        <h3 style={{
          color: "#fff",
          fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          margin: "0 0 10px",
          letterSpacing: "1px",
        }}>
          {product.name}
        </h3>

        <div style={{
          color: "rgba(255,255,255,0.28)",
          fontSize: "9px",
          letterSpacing: "3px",
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 300,
          marginBottom: "10px",
        }}>
          {product.notes}
        </div>

        <SizeSelector product={product} value={selectedOpt} onChange={setSelectedOpt} />

        <div style={{
          color: "#D4AF37",
          fontSize: "clamp(1.1rem, 2.2vw, 1.35rem)",
          fontFamily: "'Cormorant Garamond', serif",
          marginBottom: "22px",
        }}>
          {selectedOpt.price}
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => onSelect(product)}
            style={{
              background: "transparent",
              color: "#D4AF37",
              border: "1px solid rgba(212,175,55,0.38)",
              padding: "12px 28px",
              borderRadius: "999px",
              cursor: "pointer",
              fontSize: "9px",
              letterSpacing: "3px",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,175,55,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            VIEW DETAILS
          </button>
          <button
            onClick={product.soldOut ? undefined : () => handleCart(product)}
            disabled={product.soldOut}
            style={{
              background: product.soldOut ? "rgba(220,50,50,0.08)" : addedId === product.id ? "rgba(212,175,55,0.12)" : "#D4AF37",
              color: product.soldOut ? "#E05555" : addedId === product.id ? "#D4AF37" : "#000",
              border: `1px solid ${product.soldOut ? "rgba(220,50,50,0.3)" : "rgba(212,175,55,0.38)"}`,
              padding: "12px 28px",
              borderRadius: "999px",
              cursor: product.soldOut ? "not-allowed" : "pointer",
              fontSize: "9px",
              letterSpacing: "3px",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              transition: "all 0.3s ease",
              whiteSpace: "nowrap",
              opacity: product.soldOut ? 0.7 : 1,
            }}
          >
            {product.soldOut ? "SOLD OUT" : addedId === product.id ? "ADDED ✓" : "+ CART"}
          </button>
        </div>
      </div>

      {/* ── Dot indicators (only when ≤ 20 products) ── */}
      {total > 1 && total <= 20 && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "7px",
          paddingBottom: "10px",
        }}>
          {filtered.map((_, i) => (
            <button
              key={i}
              onClick={() => jumpTo(i)}
              aria-label={`Go to product ${i + 1}`}
              style={{
                width: i === idx ? "22px" : "6px",
                height: "6px",
                borderRadius: "999px",
                background: i === idx ? "#D4AF37" : "rgba(212,175,55,0.22)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.4s ease, background 0.4s ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── TiltCard ─────────────────────────────────────────────────────────────────
function TiltCard({ product, onSelect }) {
  const cardRef = useRef(null);
  const [hov, setHov]                   = useState(false);
  const [added, setAdded]               = useState(false);
  const [selectedOpt, setSelectedOpt]   = useState(() => getDefaultOpt(product));
  const { addItem }                     = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem({
      ...product,
      price: selectedOpt.price,
      selectedSize: selectedOpt.size,
      cartKey: `${product.id}-${selectedOpt.size}`,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const onMove = (e) => {
    const el   = cardRef.current;
    const rect = el.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width  - 0.5;
    const y    = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform  = `perspective(600px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) scale(1.03)`;
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
    <div className="yb-product-perspective" style={{ perspective: "600px" }}>
      <div
        className="yb-product-card"
        ref={cardRef}
        data-cursor="VIEW"
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
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="yb-product-badge" style={{
          position: "absolute", top: "14px", left: "14px",
          background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)",
          color: "#D4AF37", fontSize: "7px", letterSpacing: "2px",
          padding: "4px 10px", borderRadius: "999px",
          fontFamily: "'Montserrat', sans-serif", fontWeight: 600, textTransform: "uppercase",
        }}>
          {product.category}
        </div>

        {product.soldOut && (
          <div style={{
            position: "absolute", top: "14px", right: "14px",
            background: "rgba(220,50,50,0.12)", border: "1px solid rgba(220,50,50,0.4)",
            color: "#E05555", fontSize: "7px", letterSpacing: "2px",
            padding: "4px 10px", borderRadius: "999px",
            fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: "uppercase",
          }}>
            SOLD OUT
          </div>
        )}

        <div className="yb-product-image-wrap" style={{
          width: "300px", maxWidth: "90%",
          height: "300px",
          marginTop: "24px", marginBottom: "24px",
          marginLeft: "auto", marginRight: "auto",
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: hov ? "translateY(-10px)" : "translateY(0)",
          transition: "transform 0.4s ease",
        }}>
          <img
            className="yb-product-image"
            src={product.image}
            alt={product.name}
            style={{
              width: "100%", height: "100%",
              objectFit: "contain",
              filter: "drop-shadow(0 0 50px rgba(212,175,55,0.32))",
            }}
          />
        </div>

        <h3 style={{
          color: "#fff", marginBottom: "6px",
          fontSize: "1rem", fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400, lineHeight: 1.3,
        }}>
          {product.name}
        </h3>

        <div style={{
          color: "rgba(255,255,255,0.3)", fontSize: "9px",
          letterSpacing: "1.5px", fontFamily: "'Montserrat', sans-serif",
          fontWeight: 300, marginBottom: "10px",
        }}>
          {product.notes}
        </div>

        <SizeSelector product={product} value={selectedOpt} onChange={setSelectedOpt} />

        <div style={{
          color: "#D4AF37", fontSize: "0.95rem",
          fontFamily: "'Cormorant Garamond', serif", marginBottom: "18px",
        }}>
          {selectedOpt.price}
        </div>

        <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => onSelect(product)}
            style={{
              background: "transparent", color: "#D4AF37",
              border: "1px solid rgba(212,175,55,0.35)",
              padding: "10px 18px", borderRadius: "999px", cursor: "pointer",
              fontWeight: 600, fontSize: "9px", letterSpacing: "2px",
              fontFamily: "'Montserrat', sans-serif", transition: "all 0.3s ease",
            }}
          >
            DETAILS
          </button>
          <button
            onClick={product.soldOut ? undefined : handleAddToCart}
            data-cursor="ADD"
            disabled={product.soldOut}
            style={{
              background: product.soldOut ? "rgba(220,50,50,0.08)" : added ? "rgba(212,175,55,0.2)" : hov ? "#D4AF37" : "transparent",
              color: product.soldOut ? "#E05555" : added ? "#D4AF37" : hov ? "#000" : "#D4AF37",
              border: `1px solid ${product.soldOut ? "rgba(220,50,50,0.3)" : "rgba(212,175,55,0.35)"}`,
              padding: "10px 18px", borderRadius: "999px",
              cursor: product.soldOut ? "not-allowed" : "pointer",
              fontWeight: 700, fontSize: "9px", letterSpacing: "2px",
              fontFamily: "'Montserrat', sans-serif", transition: "all 0.3s ease",
              whiteSpace: "nowrap", opacity: product.soldOut ? 0.7 : 1,
            }}
          >
            {product.soldOut ? "SOLD OUT" : added ? "ADDED ✓" : "+ CART"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ProductCatalog ───────────────────────────────────────────────────────────
export default function ProductCatalog() {
  const isMobile   = useIsMobile();
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(null);
  const [view, setView]         = useState(
    () => (typeof sessionStorage !== "undefined" && sessionStorage.getItem("zf-view")) || "grid"
  );
  const [viewVis, setViewVis]   = useState(true);
  const sectionRef              = useRef(null);
  const headerRef               = useRef(null);

  const filtered = products.filter((p) => {
    const haystack = [p.name, p.notes, p.fragranceFamily, ...(p.topNotes || []), ...(p.heartNotes || []), ...(p.baseNotes || [])].join(" ").toLowerCase();
    const nameMatch = haystack.includes(search.toLowerCase());
    const catMatch  = category === "all" || p.category === category;
    return nameMatch && catMatch;
  });

  // filterKey drives gallery reset without depending on filtered array identity
  const filterKey = `${search}|${category}`;

  useEffect(() => {
    const onCollection = (event) => {
      const next = ["male", "female", "unisex"].includes(event.detail) ? event.detail : "all";
      setCategory(next);
      setSearch("");
    };
    window.addEventListener("yb:set-category", onCollection);
    return () => window.removeEventListener("yb:set-category", onCollection);
  }, []);

  const changeView = (v) => {
    if (v === view) return;
    setViewVis(false);
    setTimeout(() => {
      setView(v);
      try { sessionStorage.setItem("zf-view", v); } catch { /* Storage is optional. */ }
      setViewVis(true);
    }, 240);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        Array.from(headerRef.current.children),
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: "power2.out",
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", once: true },
        }
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
        className="yb-catalog"
        ref={sectionRef}
        style={{ background: "#050505", padding: isMobile ? "80px 5%" : "140px 8%" }}
      >
        {/* ── Header ── */}
        <div className="yb-catalog-heading" ref={headerRef} style={{ textAlign: "center", marginBottom: "60px" }}>
          <div style={{
            color: "#D4AF37", letterSpacing: "8px", marginBottom: "20px",
            fontSize: "10px", fontFamily: "'Montserrat', sans-serif", fontWeight: 300,
          }}>
            FULL RANGE
          </div>
          <SplitHeading
            text="Product Catalog"
            style={{
              color: "#fff", fontSize: "clamp(2.8rem,6vw,5rem)", margin: 0,
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
            }}
          />
        </div>

        {/* ── Search ── */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <input
            className="yb-catalog-search"
            type="text"
            placeholder="Search fragrance..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", maxWidth: "480px",
              padding: "15px 24px", borderRadius: "999px",
              border: "1px solid rgba(212,175,55,0.2)",
              background: "rgba(255,255,255,0.03)",
              color: "#fff", fontSize: "13px",
              fontFamily: "'Montserrat', sans-serif", fontWeight: 300,
              letterSpacing: "1px", outline: "none",
            }}
          />
        </div>

        {/* ── Filters row ── */}
        <div className="yb-catalog-filters" style={{
          display: "flex", justifyContent: "center",
          alignItems: "center", gap: isMobile ? "8px" : "10px",
          marginBottom: isMobile ? "14px" : "18px",
          flexWrap: "wrap",
        }}>
          {CATS.map((cat) => (
            <button
              key={cat}
              aria-pressed={category === cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: isMobile ? "9px 18px" : "11px 26px",
                borderRadius: "999px",
                border: "1px solid rgba(212,175,55,0.3)",
                background: category === cat ? "#D4AF37" : "transparent",
                color: category === cat ? "#000" : "rgba(255,255,255,0.5)",
                cursor: "pointer",
                fontSize: isMobile ? "9px" : "10px",
                letterSpacing: "3px",
                fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                transition: "all 0.3s ease",
              }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ── View toggle row ── */}
        <div className="yb-catalog-view-row" style={{
          display: "flex", justifyContent: "center",
          marginBottom: "40px",
        }}>
          <ViewToggle view={view} onChange={changeView} />
        </div>

        {/* ── View content with animated transition ── */}
        <div style={{
          opacity: viewVis ? 1 : 0,
          transform: viewVis ? "scale(1)" : "scale(0.985)",
          transition: "opacity 0.24s ease, transform 0.24s ease",
        }}>
          {view === "grid" ? (
            <div className="yb-product-grid" style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: isMobile ? "18px" : "28px",
              maxWidth: "1300px",
              margin: "0 auto",
            }}>
              {filtered.length > 0
                ? filtered.map((product) => (
                    <TiltCard key={product.id} product={product} onSelect={setSelected} />
                  ))
                : (
                  <div style={{
                    gridColumn: "1 / -1", textAlign: "center",
                    padding: "60px 20px",
                    color: "rgba(255,255,255,0.2)",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(1.4rem, 3vw, 2rem)",
                    fontWeight: 300, letterSpacing: "4px",
                  }}>
                    No fragrances match your selection
                  </div>
                )
              }
            </div>
          ) : (
            <GalleryView
              key={filterKey}
              filtered={filtered}
              onSelect={setSelected}
              isMobile={isMobile}
            />
          )}
        </div>
      </section>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
}
