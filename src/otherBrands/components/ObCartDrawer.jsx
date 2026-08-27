import { COLORS, FONT_SANS, FONT_SERIF } from "../theme";
import { useObCart } from "../context/ObCartContext";
import { openWhatsAppOrder } from "../utils";
import useIsMobile from "../../hooks/useIsMobile";

export default function ObCartDrawer() {
  const isMobile = useIsMobile();
  const { items, removeItem, updateQty, totalPrice, drawerOpen, setDrawer } = useObCart();

  if (!drawerOpen) return null;

  const checkout = () => openWhatsAppOrder(items, totalPrice);

  return (
    <>
      <div
        onClick={() => setDrawer(false)}
        style={{ position: "fixed", inset: 0, background: "rgba(33,28,24,0.4)", zIndex: 200 }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: isMobile ? "100%" : "400px",
          background: COLORS.ivory,
          zIndex: 201,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "20px 22px",
            borderBottom: `1px solid ${COLORS.espressoHairline}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontFamily: FONT_SERIF, fontSize: "1.3rem", color: COLORS.espresso }}>
            Your Bag ({items.length})
          </div>
          <button
            onClick={() => setDrawer(false)}
            style={{ background: "none", border: "none", fontSize: "18px", color: COLORS.espresso, cursor: "pointer" }}
          >
            ✕
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "18px 22px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: "60px", color: COLORS.espressoFaint, fontFamily: FONT_SANS, fontSize: "12px" }}>
              Your bag is empty.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartKey}
                style={{
                  display: "flex",
                  gap: "14px",
                  padding: "14px 0",
                  borderBottom: `1px solid ${COLORS.espressoHairline}`,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: FONT_SANS, fontSize: "9.5px", letterSpacing: "1px", color: COLORS.espressoFaint }}>
                    {item.brand.toUpperCase()}
                  </div>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: "1.05rem", color: COLORS.espresso, marginBottom: "6px" }}>
                    {item.name}
                  </div>
                  <div style={{ fontFamily: FONT_SANS, fontSize: "10.5px", color: COLORS.espressoFaint, marginBottom: "10px" }}>
                    Size: {item.size}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <button
                        onClick={() => updateQty(item.cartKey, -1)}
                        style={qtyBtnStyle}
                      >
                        −
                      </button>
                      <span style={{ fontFamily: FONT_SANS, fontSize: "12px", color: COLORS.espresso }}>{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.cartKey, 1)}
                        style={qtyBtnStyle}
                      >
                        +
                      </button>
                    </div>
                    <div style={{ fontFamily: FONT_SANS, fontSize: "12.5px", color: COLORS.copper, fontWeight: 600 }}>
                      ৳{item.price * item.qty}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.cartKey)}
                  aria-label="Remove"
                  style={{ background: "none", border: "none", color: COLORS.espressoFaint, cursor: "pointer", fontSize: "14px", height: "fit-content" }}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div style={{ padding: "20px 22px", borderTop: `1px solid ${COLORS.espressoHairline}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <span style={{ fontFamily: FONT_SANS, fontSize: "12px", color: COLORS.espressoSoft }}>Total</span>
              <span style={{ fontFamily: FONT_SERIF, fontSize: "1.3rem", color: COLORS.espresso }}>৳{totalPrice}</span>
            </div>
            <button
              onClick={checkout}
              style={{
                width: "100%",
                fontFamily: FONT_SANS,
                fontSize: "11px",
                letterSpacing: "2px",
                fontWeight: 600,
                color: COLORS.ivory,
                background: COLORS.espresso,
                border: "none",
                borderRadius: "999px",
                padding: "16px",
                cursor: "pointer",
              }}
            >
              CHECKOUT VIA WHATSAPP
            </button>
          </div>
        )}
      </div>
    </>
  );
}

const qtyBtnStyle = {
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  border: `1px solid ${COLORS.espressoHairline}`,
  background: COLORS.white,
  color: COLORS.espresso,
  cursor: "pointer",
  fontSize: "13px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1,
};
