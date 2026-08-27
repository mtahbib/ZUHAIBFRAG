import { useState } from "react";
import { COLORS, FONT_SANS, FONT_SERIF, familyTheme } from "../theme";
import { otherBrandsProducts } from "../data/products";
import { MOODS, productMatchesMood } from "../moodMap";
import useIsMobile from "../../hooks/useIsMobile";
import MaskedHeading from "./MaskedHeading";
import ObProductCard from "./ObProductCard";

const IMPRESSIONS = MOODS;

// Each impression carries its own quiet atmosphere — a wash pulled from
// the same family-accent palette already used across the catalog, plus a
// "depth" cue (a barely-there brighten or darken of the surrounding
// surface) so the room itself seems to respond to what's being considered,
// not just the button being pressed.
const MOOD_ATMOSPHERE = {
  FRESH: { family: "Fresh", depth: "bright" },
  DARK: { family: "Woody", depth: "dark" },
  SEDUCTIVE: { family: "Oriental", depth: "neutral" },
  CLEAN: { family: "Aquatic", depth: "bright" },
  WARM: { family: "Gourmand", depth: "neutral" },
  MYSTERIOUS: { family: "Oud", depth: "dark" },
};

const INTENSITIES = [
  { key: "Subtle", desc: "Close to the skin" },
  { key: "Balanced", desc: "Noticeable, not loud" },
  { key: "Bold", desc: "Fills the room" },
];

const GENDERS = ["Men", "Women", "Unisex", "No preference"];

function recommend({ mood, intensity, gender }) {
  let pool = otherBrandsProducts.filter((p) => productMatchesMood(p, mood));
  if (!pool.length) pool = [...otherBrandsProducts];

  if (gender && gender !== "No preference") {
    const genderPool = pool.filter((p) => p.gender === gender || p.gender === "Unisex");
    if (genderPool.length) pool = genderPool;
  }

  // Prefer in-stock, but only if enough remain to fill the row.
  const inStock = pool.filter((p) => p.inStock);
  if (inStock.length >= 3) pool = inStock;

  const desiredProjection = intensity === "Subtle" ? 2 : intensity === "Bold" ? 5 : 3.5;

  return [...pool]
    .map((p) => ({
      product: p,
      score:
        (p.bestseller ? 2 : 0) +
        (p.newArrival ? 0.5 : 0) -
        Math.abs((p.projection ?? 3) - desiredProjection) * 0.6,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.product);
}

function StepShell({ eyebrow, title, children }) {
  return (
    <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto" }}>
      <div style={{ fontFamily: FONT_SANS, fontSize: "10px", letterSpacing: "4px", color: COLORS.copper, marginBottom: "16px" }}>
        {eyebrow}
      </div>
      <div style={{ fontFamily: FONT_SERIF, fontSize: "clamp(1.5rem, 3vw, 2.2rem)", color: COLORS.espresso, marginBottom: "36px" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

export default function ObFindYourScent() {
  const isMobile = useIsMobile();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ mood: null, intensity: null, gender: null });
  const [hoveredMood, setHoveredMood] = useState(null);

  const totalSteps = 3;

  const choose = (key, value) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    setStep((s) => Math.min(s + 1, totalSteps));
  };

  const restart = () => {
    setAnswers({ mood: null, intensity: null, gender: null });
    setStep(0);
  };

  const results = step === totalSteps ? recommend(answers) : [];
  const moodLabel = IMPRESSIONS.find((m) => m.key === answers.mood)?.label;

  // The atmosphere responds to whichever impression is being considered
  // right now — hovered while choosing, or the one already chosen once the
  // reader has moved past step one. It carries through the rest of the
  // consultation as a quiet, consistent thread.
  const activeMoodKey = hoveredMood || answers.mood;
  const atmosphere = activeMoodKey ? MOOD_ATMOSPHERE[activeMoodKey] : null;
  const washColor = atmosphere ? familyTheme(atmosphere.family).soft : null;

  return (
    <section
      id="find-your-scent"
      style={{ position: "relative", padding: isMobile ? "70px 6%" : "120px 8%", background: COLORS.sand, overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: washColor ? `radial-gradient(ellipse 65% 55% at 50% 12%, ${washColor}, transparent 72%)` : "transparent",
          opacity: washColor ? 0.7 : 0,
          transition: "opacity 0.8s ease, background 0.8s ease",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: atmosphere?.depth === "dark" ? "rgba(25,23,20,0.045)" : atmosphere?.depth === "bright" ? "rgba(255,255,255,0.4)" : "transparent",
          opacity: atmosphere ? 1 : 0,
          transition: "opacity 0.8s ease, background 0.8s ease",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative" }}>
      <div style={{ textAlign: "center", marginBottom: isMobile ? "36px" : "56px" }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: "10px", letterSpacing: "5px", color: COLORS.copper, marginBottom: "16px" }}>
          FIND YOUR SCENT
        </div>
        <MaskedHeading
          as="h2"
          text="A signature, guided by you."
          style={{
            fontFamily: FONT_SERIF, fontWeight: 400, color: COLORS.espresso,
            fontSize: "clamp(1.9rem, 4vw, 3rem)", margin: 0,
          }}
        />
      </div>

      {/* Progress dots */}
      {step < totalSteps && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "40px" }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: i <= step ? COLORS.copper : COLORS.espressoHairline,
                transition: "background 0.3s ease",
              }}
            />
          ))}
        </div>
      )}

      {step === 0 && (
        <StepShell eyebrow="STEP 1 OF 3" title="What kind of impression do you want to leave?">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)",
              gap: "14px",
              maxWidth: "620px",
              margin: "0 auto",
            }}
          >
            {IMPRESSIONS.map((imp) => {
              const isHovered = hoveredMood === imp.key;
              const isReceding = hoveredMood && !isHovered;
              return (
                <button
                  key={imp.key}
                  onClick={() => choose("mood", imp.key)}
                  onMouseEnter={() => setHoveredMood(imp.key)}
                  onMouseLeave={() => setHoveredMood(null)}
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: "1.15rem",
                    color: COLORS.espresso,
                    background: COLORS.white,
                    border: `1px solid ${isHovered ? COLORS.copper : COLORS.espressoHairline}`,
                    borderRadius: "14px",
                    padding: "22px 12px",
                    cursor: "pointer",
                    transform: isHovered ? "scale(1.045)" : isReceding ? "scale(0.97)" : "scale(1)",
                    opacity: isReceding ? 0.6 : 1,
                    boxShadow: isHovered ? "0 16px 34px rgba(33,28,24,0.1)" : "0 0 0 rgba(0,0,0,0)",
                    transition: "transform 0.35s cubic-bezier(0.22,0.8,0.2,1), opacity 0.35s ease, border-color 0.3s ease, box-shadow 0.35s ease",
                  }}
                >
                  {imp.label}
                </button>
              );
            })}
          </div>
        </StepShell>
      )}

      {step === 1 && (
        <StepShell eyebrow="STEP 2 OF 3" title="How much presence should it have?">
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "14px", justifyContent: "center", maxWidth: "620px", margin: "0 auto" }}>
            {INTENSITIES.map((intensity) => (
              <button
                key={intensity.key}
                onClick={() => choose("intensity", intensity.key)}
                style={{
                  flex: 1,
                  fontFamily: FONT_SANS,
                  background: COLORS.white,
                  border: `1px solid ${COLORS.espressoHairline}`,
                  borderRadius: "14px",
                  padding: "22px 16px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = COLORS.copper)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = COLORS.espressoHairline)}
              >
                <div style={{ fontFamily: FONT_SERIF, fontSize: "1.15rem", color: COLORS.espresso, marginBottom: "6px" }}>
                  {intensity.key}
                </div>
                <div style={{ fontSize: "10.5px", color: COLORS.espressoFaint }}>{intensity.desc}</div>
              </button>
            ))}
          </div>
        </StepShell>
      )}

      {step === 2 && (
        <StepShell eyebrow="STEP 3 OF 3" title="Who is this fragrance for?">
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: "14px", maxWidth: "620px", margin: "0 auto" }}>
            {GENDERS.map((g) => (
              <button
                key={g}
                onClick={() => choose("gender", g)}
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: "12px",
                  color: COLORS.espresso,
                  background: COLORS.white,
                  border: `1px solid ${COLORS.espressoHairline}`,
                  borderRadius: "14px",
                  padding: "20px 10px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = COLORS.copper)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = COLORS.espressoHairline)}
              >
                {g}
              </button>
            ))}
          </div>
        </StepShell>
      )}

      {step === totalSteps && (
        <div>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{ fontFamily: FONT_SANS, fontSize: "10px", letterSpacing: "4px", color: COLORS.copper, marginBottom: "14px" }}>
              YOUR MATCHES
            </div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: "clamp(1.5rem, 3vw, 2.2rem)", color: COLORS.espresso }}>
              {moodLabel ? `Fragrances for a ${moodLabel.toLowerCase()} impression` : "Your recommended fragrances"}
            </div>
          </div>

          {results.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gap: "20px",
                maxWidth: "900px",
                margin: "0 auto 32px",
              }}
            >
              {results.map((p) => (
                <ObProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", color: COLORS.espressoFaint, fontFamily: FONT_SANS, fontSize: "12px", marginBottom: "32px" }}>
              We couldn't find a perfect match — explore the full collection instead.
            </div>
          )}

          <div style={{ textAlign: "center" }}>
            <button
              onClick={restart}
              style={{
                fontFamily: FONT_SANS,
                fontSize: "10.5px",
                letterSpacing: "2px",
                color: COLORS.espressoSoft,
                background: "none",
                border: `1px solid ${COLORS.espressoHairline}`,
                borderRadius: "999px",
                padding: "12px 26px",
                cursor: "pointer",
              }}
            >
              RETAKE QUIZ
            </button>
          </div>
        </div>
      )}
      </div>
    </section>
  );
}
