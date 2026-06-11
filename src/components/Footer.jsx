import useIsMobile from "../hooks/useIsMobile";

const LINKS = [
  { label: "Home",       id: "home" },
  { label: "Collection", id: "collection" },
  { label: "About",      id: "about" },
  { label: "Contact",    id: "contact" },
];

export default function Footer() {
  const isMobile = useIsMobile();
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer
      id="contact"
      style={{
        background: "#050505",
        borderTop: "1px solid rgba(212,175,55,0.08)",
        padding: isMobile ? "60px 5% 30px" : "90px 8% 40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top gradient line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "50px",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        {/* Brand */}
        <div>
          <img
            src="/logo.png"
            alt="Zuhaib Fragrance"
            style={{ height: "80px", marginBottom: "20px" }}
          />
          <p
            style={{
              color: "rgba(255,255,255,0.35)",
              maxWidth: "300px",
              lineHeight: "2",
              fontSize: "12px",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 300,
              letterSpacing: "0.5px",
            }}
          >
            Authentic Yusuf Bhai fragrances delivered across Bangladesh.
            Premium Dubai-crafted scents at exceptional value.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3
            style={{
              color: "#D4AF37",
              fontSize: "11px",
              letterSpacing: "5px",
              marginBottom: "28px",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
            }}
          >
            QUICK LINKS
          </h3>
          {LINKS.map(({ label, id }) => (
            <div
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                color: "rgba(255,255,255,0.38)",
                marginBottom: "14px",
                fontSize: "12px",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 300,
                letterSpacing: "1.5px",
                cursor: "pointer",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#D4AF37")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.38)")
              }
            >
              {label}
            </div>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h3
            style={{
              color: "#D4AF37",
              fontSize: "11px",
              letterSpacing: "5px",
              marginBottom: "28px",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
            }}
          >
            CONTACT
          </h3>

          <div
            style={{
              color: "rgba(255,255,255,0.38)",
              marginBottom: "14px",
              fontSize: "12px",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 300,
              letterSpacing: "0.5px",
            }}
          >
            WhatsApp:{" "}
            <a
              href="https://wa.me/8801790221253"
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#D4AF37",
                textDecoration: "none",
                transition: "opacity 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              +8801790221253
            </a>
          </div>

          <div
            style={{
              color: "rgba(255,255,255,0.38)",
              fontSize: "12px",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 300,
              letterSpacing: "0.5px",
            }}
          >
            Facebook:{" "}
            <a
              href="https://www.facebook.com/profile.php?id=61590815666004"
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#D4AF37",
                textDecoration: "none",
                transition: "opacity 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Zuhaib Fragrance
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          marginTop: "70px",
          paddingTop: "24px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          textAlign: "center",
          color: "rgba(255,255,255,0.2)",
          fontSize: "11px",
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 300,
          letterSpacing: "2px",
        }}
      >
        © 2026 ZUHAIB FRAGRANCE — ALL RIGHTS RESERVED
      </div>
    </footer>
  );
}
