import { useState } from "react";
import { products } from "../data/products";
import ProductModal from "./ProductModal";
import "./ScentFinder.css";

const MOODS = [
  { id: "fresh", label: "Fresh start", hint: "Clear skies. A clean slate.", time: "08:00", scene: "A little fresh perspective.", productId: 3, copy: "Bright orange, clean cedar and soft tonka. An easy companion for days that start with possibility.", color: "#456b61", sky: "#b9c8b6", glow: "#faf1ce", land: "#668477" },
  { id: "golden", label: "Golden hour", hint: "Slow down. Soak it in.", time: "17:30", scene: "Stay a little longer.", productId: 43, copy: "Lavender meets golden honey and warm tobacco. For unhurried evenings and the last light of the day.", color: "#86542e", sky: "#d1ac7f", glow: "#ffe2a0", land: "#a66b43" },
  { id: "dark", label: "After dark", hint: "Good company. Late nights.", time: "22:00", scene: "The night is still young.", productId: 1, copy: "Juicy pear, a spark of cinnamon and rich black vanilla. A bold choice for plans that run past midnight.", color: "#655776", sky: "#343443", glow: "#e3d6c3", land: "#535064" },
  { id: "impression", label: "Leave an impression", hint: "Your moment. Make it yours.", time: "20:00", scene: "Some moments stay with you.", productId: 36, copy: "Luminous saffron, jasmine and deep amberwood. A little opulence for the moments you want to remember.", color: "#88504b", sky: "#b9877c", glow: "#f8d6b1", land: "#8b514c" },
];

function MoodIcon({ mood }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
      {mood === "fresh" && <><circle cx="16" cy="16" r="6" /><path d="M16 2v4m0 20v4M2 16h4m20 0h4M6 6l3 3m14 14 3 3M6 26l3-3M23 9l3-3" /></>}
      {mood === "golden" && <><path d="M3 21h26M6 25h20M10 29h12M8 18a8 8 0 0 1 16 0M16 2v4M4 8l3 3m18 0 3-3" /></>}
      {mood === "dark" && <><path d="M23 22A12 12 0 0 1 11 3a12 12 0 1 0 18 18c-2 1-4 1-6 1Z" /><path d="m23 3 1.5 4.5L29 9l-4.5 1.5L23 15l-1.5-4.5L17 9l4.5-1.5Z" /></>}
      {mood === "impression" && <><path d="m16 2 4 10 10 4-10 4-4 10-4-10-10-4 10-4Z" /><path d="m26 2 1 3 3 1-3 1-1 3-1-3-3-1 3-1Z" /></>}
    </svg>
  );
}

export default function NotesSection() {
  const [active, setActive] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const mood = MOODS[active];
  const product = products.find((item) => item.id === mood.productId);

  return (
    <>
      <section id="scent-finder" className="yb-scent-finder" aria-labelledby="yb-scent-title" style={{ "--scent-accent": mood.color, "--scent-sky": mood.sky, "--scent-glow": mood.glow, "--scent-land": mood.land }}>
        <header className="yb-scent-heading">
          <div>
            <p className="yb-kicker"><i aria-hidden="true">✦</i> A scent for the feeling</p>
            <h2 id="yb-scent-title">Where will today<br /><em>take you?</em></h2>
          </div>
          <p>Start with a mood. Find a fragrance.<br />Let your next memory begin here.</p>
        </header>
        <div className="yb-scent-experience">
          <div className="yb-scent-choices" role="group" aria-label="Choose your mood">
            <p className="yb-scent-eyebrow">01 / Choose your mood</p>
            {MOODS.map((item, index) => (
              <button type="button" className="yb-scent-choice" key={item.id} aria-pressed={active === index} aria-controls="yb-scent-result" onClick={() => setActive(index)}>
                <MoodIcon mood={item.id} />
                <span><strong>{item.label}</strong><small>{item.hint}</small></span>
                <span className="yb-scent-choice-arrow" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
          <div className="yb-scent-art" data-mood={mood.id} aria-hidden="true">
            <div className="yb-scent-arch">
              <div className="yb-scent-orbit" /><div className="yb-scent-sun" />
              <span className="yb-scent-star yb-scent-star-one">✦</span>
              <span className="yb-scent-star yb-scent-star-two">✧</span>
              <div className="yb-scent-dune yb-scent-dune-back" /><div className="yb-scent-dune yb-scent-dune-front" />
              <div className="yb-scent-scene-caption" key={mood.id}><span>{mood.time}</span><p>{mood.scene}</p></div>
            </div>
            <span className="yb-scent-art-label">An everyday escape, bottled.</span>
          </div>
          <div id="yb-scent-result" className="yb-scent-result" aria-live="polite" aria-atomic="true">
            <div key={mood.id} className="yb-scent-result-content">
              <p className="yb-scent-eyebrow">02 / Your scent pairing</p>
              <span className="yb-scent-family">{product.fragranceFamily}</span>
              <h3>{product.name.replace(/^YB /, "").replace(/ 100ml$/, "")}</h3>
              <p className="yb-scent-description">{mood.copy}</p>
              <div className="yb-scent-notes">{product.notes.split(" • ").map((note) => <span key={note}>{note}</span>)}</div>
              <div className="yb-scent-price"><strong>{product.price}</strong><span>100ml · Yusuf Bhai</span></div>
              <button type="button" className="yb-scent-discover" onClick={() => setSelectedProduct(product)}>Discover this scent <span aria-hidden="true">↗</span></button>
              <p className="yb-scent-decant">Curious? Explore smaller decant sizes, too.</p>
            </div>
          </div>
        </div>
        <footer className="yb-scent-footer"><span>Follow a feeling. Find your signature.</span><span>Four moods. A world of possibility. <i aria-hidden="true">✦</i></span></footer>
      </section>
      {selectedProduct && <ProductModal key={selectedProduct.id} product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </>
  );
}
