import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { otherBrandsProducts } from "../data/products";
import ObCollectionCard from "./ObCollectionCard";

function Gallery({ products }) {
  const [index, setIndex] = useState(0);
  const touchStart = useRef(null);
  const change = (direction) => setIndex((current) => (current + direction + products.length) % products.length);
  return (
    <div className="ob-curated-gallery" role="region" aria-label="Fragrance gallery" tabIndex={0}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); change(event.key === "ArrowRight" ? 1 : -1); }
      }}
      onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const delta = touchStart.current - event.changedTouches[0].clientX;
        if (Math.abs(delta) > 60) change(delta > 0 ? 1 : -1);
        touchStart.current = null;
      }}>
      <div className="ob-gallery-heading"><span className="ob-eyebrow">A CLOSER ENCOUNTER</span><span aria-live="polite">{String(index + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}</span></div>
      <div className="ob-gallery-stage">
        {products.length > 1 && <button className="ob-gallery-side ob-gallery-prev" onClick={() => change(-1)} aria-label="Previous fragrance"><img src={products[(index - 1 + products.length) % products.length].image} alt="" /></button>}
        <div className="ob-gallery-focus"><ObCollectionCard key={products[index].id} product={products[index]} /></div>
        {products.length > 1 && <button className="ob-gallery-side ob-gallery-next" onClick={() => change(1)} aria-label="Next fragrance"><img src={products[(index + 1) % products.length].image} alt="" /></button>}
      </div>
      <div className="ob-gallery-navigation"><button onClick={() => change(-1)} disabled={products.length < 2} aria-label="Previous product">←</button><span>Explore at your own pace</span><button onClick={() => change(1)} disabled={products.length < 2} aria-label="Next product">→</button></div>
    </div>
  );
}

export default function ObCatalog() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState(() => params.get("q") || "");
  const [gender, setGender] = useState("all");
  const [limit, setLimit] = useState(8);
  const [view, setView] = useState(() => {
    try { return sessionStorage.getItem("ob-view") === "gallery" ? "gallery" : "grid"; } catch { return "grid"; }
  });
  useEffect(() => {
    try { sessionStorage.setItem("ob-view", view); } catch { /* Browsing still works when storage is disabled. */ }
  }, [view]);
  const query = search.trim().toLowerCase();
  const filtered = otherBrandsProducts.filter((product) => {
    const text = [product.name, product.brand, product.family, ...product.topNotes, ...product.heartNotes, ...product.baseNotes].join(" ").toLowerCase();
    return text.includes(query) && (gender === "all" || product.gender === gender || product.gender === "Unisex");
  });
  const reset = () => { setSearch(""); setGender("all"); setLimit(8); };

  return (
    <section id="ob-catalog" className="ob-collection" aria-labelledby="ob-collection-title">
      <div className="ob-collection-heading">
        <div><p className="ob-eyebrow">01 / THE COLLECTION</p><h2 id="ob-collection-title">Good taste. <em>Great scents.</em></h2></div>
        <p className="ob-collection-intro">The ones you know. The ones you’ll fall for.<br />Discover your next signature, one note at a time.</p>
      </div>
      <div className="ob-collection-controls">
        <div className="ob-collection-filters" aria-label="Filter by wearer">{[["all", "All fragrances"], ["Men", "For him"], ["Women", "For her"], ["Unisex", "For everyone"]].map(([value, label]) => <button key={value} aria-pressed={gender === value} onClick={() => { setGender(value); setLimit(8); }}>{label}</button>)}</div>
        <label className="ob-collection-search"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><circle cx="10" cy="10" r="6" /><path d="m15 15 6 6" /></svg><input type="search" value={search} onChange={(event) => { setSearch(event.target.value); setLimit(8); }} placeholder="A name, a house, a note…" aria-label="Search the collection" /></label>
        <div className="ob-collection-view" aria-label="Collection view">
          <button aria-label="Grid view" aria-pressed={view === "grid"} onClick={() => setView("grid")}><svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true"><path d="M1 1h7v7H1zM12 1h7v7h-7zM1 12h7v7H1zM12 12h7v7h-7z" /></svg></button>
          <button aria-label="Gallery view" aria-pressed={view === "gallery"} onClick={() => setView("gallery")}><svg width="19" height="16" viewBox="0 0 24 20" fill="none" stroke="currentColor" aria-hidden="true"><path d="M7 1h10v18H7zM1 4h3v12H1zM20 4h3v12h-3z" /></svg></button>
        </div>
      </div>
      <div className="ob-collection-meta"><span aria-live="polite">{filtered.length} fragrances to fall for</span><span>YOUR FAVOURITES, IN 5–15 ML DECANTS</span></div>
      {filtered.length === 0 ? <div className="ob-collection-empty"><p>No fragrances found. Try another house or scent note.</p><button onClick={reset}>Reset filters</button></div> : view === "gallery" ? <Gallery key={`${gender}|${query}`} products={filtered} /> : <>
        <div className="ob-collection-grid">{filtered.slice(0, limit).map((product) => <ObCollectionCard key={product.id} product={product} />)}</div>
        {limit < filtered.length && <div className="ob-collection-more"><button className="ob-button ob-button-outline" onClick={() => setLimit((value) => value + 8)}>Discover more fragrances <span aria-hidden="true">↓</span></button></div>}
      </>}
    </section>
  );
}
