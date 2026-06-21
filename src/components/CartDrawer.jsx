import { useState } from "react";
import { useCart } from "../context/CartContext";
import useIsMobile from "../hooks/useIsMobile";

const OWNER_WHATSAPP = "8801790221253";
const OWNER_EMAIL    = "mtahbib@gmail.com";

const parsePrice = (str) =>
  parseInt(str.replace(/[^\d]/g, ""), 10) || 0;

const formatBDT = (n) =>
  "৳" + n.toLocaleString("en-IN");

export default function CartDrawer() {
  const { items, removeItem, updateQty, clearCart, drawerOpen, setDrawer } =
    useCart();
  const isMobile = useIsMobile();

  const [step, setStep]         = useState("cart"); // "cart" | "checkout" | "success"
  const [form, setForm]         = useState({ name: "", phone: "", address: "" });
  const [errors, setErrors]     = useState({});
  const [sending, setSending]   = useState(false);

  const subtotal = items.reduce(
    (s, i) => s + parsePrice(i.price) * i.qty,
    0
  );

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.phone.trim())   e.phone   = "Phone is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildOrderText = () => {
    const lines = items
      .map((i) => {
        const sizeLabel = i.selectedSize ? ` (${i.selectedSize})` : "";
        return `• ${i.name}${sizeLabel} × ${i.qty}  —  ${formatBDT(parsePrice(i.price) * i.qty)}`;
      })
      .join("\n");
    return (
      `🌟 NEW ORDER — ZUHAIB FRAGRANCE\n\n` +
      `👤 Name: ${form.name}\n` +
      `📞 Phone: ${form.phone}\n` +
      `📍 Address: ${form.address}\n\n` +
      `🛒 ORDER ITEMS:\n${lines}\n\n` +
      `💰 TOTAL: ${formatBDT(subtotal)}\n\n` +
      `Please confirm availability and delivery timeline.`
    );
  };

  const handleWhatsApp = () => {
    if (!validate()) return;
    const msg = encodeURIComponent(buildOrderText());
    window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${msg}`, "_blank");
    clearCart();
    setStep("success");
  };

  const handleEmail = () => {
    if (!validate()) return;
    const subject = encodeURIComponent(
      `New Order — ${form.name} — Zuhaib Fragrance`
    );
    const body = encodeURIComponent(buildOrderText());
    window.open(`mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`);
    clearCart();
    setStep("success");
  };

  const handleBoth = () => {
    if (!validate()) return;
    setSending(true);
    // WhatsApp
    const msg = encodeURIComponent(buildOrderText());
    window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${msg}`, "_blank");
    // Email
    const subject = encodeURIComponent(`New Order — ${form.name} — Zuhaib Fragrance`);
    const body    = encodeURIComponent(buildOrderText());
    setTimeout(() => {
      window.open(`mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`);
      setSending(false);
      clearCart();
      setStep("success");
    }, 600);
  };

  const close = () => {
    setDrawer(false);
    setTimeout(() => { setStep("cart"); setForm({ name: "", phone: "", address: "" }); setErrors({}); }, 400);
  };

  const drawerWidth = isMobile ? "100vw" : "420px";

  return (
    <>
      {/* Backdrop */}
      {drawerOpen && (
        <div
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(6px)",
            zIndex: 99990,
          }}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: drawerWidth,
          height: "100vh",
          background: "#0a0a0a",
          borderLeft: "1px solid rgba(212,175,55,0.2)",
          zIndex: 99995,
          display: "flex",
          flexDirection: "column",
          transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Top accent */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
        }} />

        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 24px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          <div>
            <div style={{
              color: "#D4AF37",
              fontSize: "9px",
              letterSpacing: "5px",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 300,
              marginBottom: "4px",
            }}>
              ZUHAIB FRAGRANCE
            </div>
            <div style={{
              color: "#fff",
              fontSize: "1.4rem",
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400,
            }}>
              {step === "checkout" ? "Checkout" : step === "success" ? "Order Placed" : `Your Cart (${items.length})`}
            </div>
          </div>
          <button
            onClick={close}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)",
              fontSize: "18px",
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#D4AF37"; e.currentTarget.style.color = "#D4AF37"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>

          {/* ── SUCCESS ── */}
          {step === "success" && (
            <div style={{ textAlign: "center", paddingTop: "60px" }}>
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>✅</div>
              <h3 style={{ color: "#fff", fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300 }}>
                Order Sent!
              </h3>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", fontFamily: "'Montserrat', sans-serif", lineHeight: "1.8", marginTop: "12px" }}>
                Your order has been sent via WhatsApp and email. We'll confirm availability shortly.
              </p>
              <button
                onClick={close}
                style={{
                  marginTop: "36px",
                  background: "#D4AF37",
                  color: "#000",
                  border: "none",
                  padding: "14px 36px",
                  borderRadius: "999px",
                  fontWeight: 700,
                  fontSize: "11px",
                  letterSpacing: "3px",
                  fontFamily: "'Montserrat', sans-serif",
                  cursor: "pointer",
                }}
              >
                CONTINUE SHOPPING
              </button>
            </div>
          )}

          {/* ── EMPTY CART ── */}
          {step === "cart" && items.length === 0 && (
            <div style={{ textAlign: "center", paddingTop: "80px" }}>
              <div style={{ fontSize: "3rem", marginBottom: "16px", opacity: 0.3 }}>🛒</div>
              <p style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Montserrat', sans-serif", fontSize: "13px", letterSpacing: "1px" }}>
                Your cart is empty
              </p>
            </div>
          )}

          {/* ── CART ITEMS ── */}
          {step === "cart" && items.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {items.map((item) => (
                <div key={item.cartKey} style={{
                  display: "grid",
                  gridTemplateColumns: "70px 1fr auto",
                  gap: "14px",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(212,175,55,0.1)",
                  borderRadius: "14px",
                  padding: "14px",
                }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: "70px", filter: "drop-shadow(0 0 10px rgba(212,175,55,0.2))" }}
                  />
                  <div>
                    <div style={{ color: "#fff", fontSize: "13px", fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, lineHeight: 1.3 }}>
                      {item.name}
                    </div>
                    {item.selectedSize && (
                      <span style={{
                        display: "inline-block", marginTop: "5px",
                        background: "rgba(212,175,55,0.1)",
                        border: "1px solid rgba(212,175,55,0.25)",
                        color: "#D4AF37", fontSize: "8px", letterSpacing: "1.5px",
                        padding: "2px 8px", borderRadius: "999px",
                        fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                      }}>
                        {item.selectedSize}
                      </span>
                    )}
                    <div style={{ color: "#D4AF37", fontSize: "12px", fontFamily: "'Montserrat', sans-serif", marginTop: "6px" }}>
                      {formatBDT(parsePrice(item.price) * item.qty)}
                    </div>
                    {/* Qty controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
                      {["-", "+"].map((op) => (
                        <button
                          key={op}
                          onClick={() => updateQty(item.cartKey, op === "+" ? 1 : -1)}
                          style={{
                            width: "26px", height: "26px", borderRadius: "50%",
                            border: "1px solid rgba(212,175,55,0.3)",
                            background: "none", color: "#D4AF37",
                            fontSize: "14px", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >
                          {op}
                        </button>
                      ))}
                      <span style={{ color: "#fff", fontSize: "13px", fontFamily: "'Montserrat', sans-serif", minWidth: "20px", textAlign: "center" }}>
                        {item.qty}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.cartKey)}
                    style={{ background: "none", border: "none", color: "rgba(255,255,255,0.2)", fontSize: "16px", cursor: "pointer", alignSelf: "flex-start" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ff6b6b")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Subtotal */}
              <div style={{
                borderTop: "1px solid rgba(212,175,55,0.1)",
                paddingTop: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "6px",
              }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", letterSpacing: "3px", fontFamily: "'Montserrat', sans-serif" }}>SUBTOTAL</span>
                <span style={{ color: "#D4AF37", fontSize: "1.4rem", fontFamily: "'Cormorant Garamond', serif" }}>
                  {formatBDT(subtotal)}
                </span>
              </div>
            </div>
          )}

          {/* ── CHECKOUT FORM ── */}
          {step === "checkout" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", fontFamily: "'Montserrat', sans-serif", lineHeight: "1.8", letterSpacing: "0.5px" }}>
                Fill in your details and we'll send the order via WhatsApp and email.
              </p>

              {/* Order summary pill */}
              <div style={{
                background: "rgba(212,175,55,0.05)",
                border: "1px solid rgba(212,175,55,0.15)",
                borderRadius: "12px",
                padding: "12px 16px",
              }}>
                {items.map((i) => (
                  <div key={i.cartKey} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", fontFamily: "'Montserrat', sans-serif" }}>
                      {i.name}{i.selectedSize ? ` (${i.selectedSize})` : ""} × {i.qty}
                    </span>
                    <span style={{ color: "#D4AF37", fontSize: "11px", fontFamily: "'Montserrat', sans-serif" }}>
                      {formatBDT(parsePrice(i.price) * i.qty)}
                    </span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid rgba(212,175,55,0.1)", paddingTop: "8px", marginTop: "4px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", letterSpacing: "2px", fontFamily: "'Montserrat', sans-serif" }}>TOTAL</span>
                  <span style={{ color: "#D4AF37", fontSize: "1.1rem", fontFamily: "'Cormorant Garamond', serif" }}>{formatBDT(subtotal)}</span>
                </div>
              </div>

              {/* Inputs */}
              {[
                { key: "name",    label: "FULL NAME",       placeholder: "Your name",         type: "text" },
                { key: "phone",   label: "WHATSAPP / PHONE", placeholder: "+880...",           type: "tel" },
                { key: "address", label: "DELIVERY ADDRESS", placeholder: "Street, City, District", type: "textarea" },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label style={{ display: "block", color: "rgba(255,255,255,0.3)", fontSize: "9px", letterSpacing: "4px", fontFamily: "'Montserrat', sans-serif", marginBottom: "8px" }}>
                    {label}
                  </label>
                  {type === "textarea" ? (
                    <textarea
                      rows={3}
                      value={form[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.04)",
                        border: `1px solid ${errors[key] ? "#ff6b6b" : "rgba(212,175,55,0.2)"}`,
                        borderRadius: "10px",
                        padding: "12px 14px",
                        color: "#fff",
                        fontSize: "13px",
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 300,
                        outline: "none",
                        resize: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  ) : (
                    <input
                      type={type}
                      value={form[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.04)",
                        border: `1px solid ${errors[key] ? "#ff6b6b" : "rgba(212,175,55,0.2)"}`,
                        borderRadius: "10px",
                        padding: "12px 14px",
                        color: "#fff",
                        fontSize: "13px",
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 300,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  )}
                  {errors[key] && (
                    <span style={{ color: "#ff6b6b", fontSize: "10px", fontFamily: "'Montserrat', sans-serif", marginTop: "4px", display: "block" }}>
                      {errors[key]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {step !== "success" && (
          <div style={{
            padding: "16px 24px 24px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}>
            {step === "cart" && items.length > 0 && (
              <button
                onClick={() => setStep("checkout")}
                style={{
                  background: "#D4AF37",
                  color: "#000",
                  border: "none",
                  padding: "16px",
                  borderRadius: "999px",
                  fontWeight: 700,
                  fontSize: "11px",
                  letterSpacing: "4px",
                  fontFamily: "'Montserrat', sans-serif",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#D4AF37")}
              >
                PROCEED TO CHECKOUT
              </button>
            )}

            {step === "checkout" && (
              <>
                <button
                  onClick={handleBoth}
                  disabled={sending}
                  style={{
                    background: "#D4AF37",
                    color: "#000",
                    border: "none",
                    padding: "16px",
                    borderRadius: "999px",
                    fontWeight: 700,
                    fontSize: "11px",
                    letterSpacing: "3px",
                    fontFamily: "'Montserrat', sans-serif",
                    cursor: sending ? "not-allowed" : "pointer",
                    opacity: sending ? 0.7 : 1,
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => { if (!sending) e.currentTarget.style.background = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#D4AF37"; }}
                >
                  {sending ? "SENDING..." : "SEND ORDER (WHATSAPP + EMAIL)"}
                </button>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <button
                    onClick={handleWhatsApp}
                    style={{
                      background: "none",
                      border: "1px solid rgba(37,211,102,0.5)",
                      color: "#25d366",
                      padding: "13px",
                      borderRadius: "999px",
                      fontWeight: 600,
                      fontSize: "10px",
                      letterSpacing: "2px",
                      fontFamily: "'Montserrat', sans-serif",
                      cursor: "pointer",
                    }}
                  >
                    WHATSAPP
                  </button>
                  <button
                    onClick={handleEmail}
                    style={{
                      background: "none",
                      border: "1px solid rgba(212,175,55,0.4)",
                      color: "#D4AF37",
                      padding: "13px",
                      borderRadius: "999px",
                      fontWeight: 600,
                      fontSize: "10px",
                      letterSpacing: "2px",
                      fontFamily: "'Montserrat', sans-serif",
                      cursor: "pointer",
                    }}
                  >
                    EMAIL ONLY
                  </button>
                </div>

                <button
                  onClick={() => setStep("cart")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.3)",
                    fontSize: "11px",
                    fontFamily: "'Montserrat', sans-serif",
                    cursor: "pointer",
                    letterSpacing: "1px",
                    paddingTop: "4px",
                  }}
                >
                  ← Back to cart
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
