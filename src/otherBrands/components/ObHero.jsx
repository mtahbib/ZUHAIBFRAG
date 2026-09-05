import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { otherBrandsProducts } from "../data/products";
import { prefersReducedMotion } from "../motion";
import ObBottleStage from "./ObBottleStage";

const EDITS = [
  { name: "Hawas Fire", mood: "The bold edit", word: "Fire", tone: "fire" },
  { name: "Liquid Brun", mood: "The warm edit", word: "Amber", tone: "amber" },
  { name: "9PM Elixir", mood: "The after-dark edit", word: "Noir", tone: "noir" },
].map((edit) => ({ ...edit, product: otherBrandsProducts.find((p) => p.name === edit.name) }));

export default function ObHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef(null);
  const edit = EDITS[active];

  useEffect(() => {
    const section = sectionRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      section.dataset.visible = String(entry.isIntersecting);
    }, { threshold: 0.05 });
    observer.observe(section);
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(".ob-hero-reveal", { y: 35, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.25, stagger: 0.12, ease: "power3.out", clearProps: "all",
      });
    }, section);
    return () => { observer.disconnect(); ctx.revert(); };
  }, []);

  return (
    <section ref={sectionRef} className={`ob-hero ob-tone-${edit.tone}`} data-paused={paused} data-visible="true" aria-label="The fragrance edit">
      <div className="ob-hero-grain" aria-hidden="true" />
      <div className="ob-hero-grid" aria-hidden="true" />
      <div className="ob-hero-topline ob-hero-reveal"><span>THE WORLD OF FRAGRANCE, CURATED.</span><span>DHAKA · BANGLADESH</span></div>
      <div className="ob-hero-copy">
        <p className="ob-eyebrow ob-hero-reveal"><span className="ob-small-star">✦</span> OTHER BRANDS. EXTRAORDINARY SCENTS.</p>
        <h1 className="ob-hero-reveal">Leave a little<br /><em>mystery.</em></h1>
        <p className="ob-hero-description ob-hero-reveal">Some things are better left unspoken.<br />Let your fragrance do the talking.</p>
        <div className="ob-hero-actions ob-hero-reveal">
          <a className="ob-button ob-button-cream" href="#ob-catalog">Discover the collection <span aria-hidden="true">↗</span></a>
          <a className="ob-quiet-link" href="#find-your-scent">Find your signature <span aria-hidden="true">→</span></a>
        </div>
        <div className="ob-hero-footnote ob-hero-reveal"><span className="ob-footnote-rule" /> Exceptional houses. Personally curated. Yours to discover.</div>
      </div>
      <div className="ob-hero-exhibit">
        <div className="ob-exhibit-edition"><span>THE OLFACTORY EDIT</span><span>VOL. 0{active + 1} / 03</span></div>
        <div className="ob-exhibit-word" key={edit.word} aria-hidden="true">{edit.word}</div>
        <ObBottleStage key={edit.name} edit={edit} paused={paused} />
        <div className="ob-exhibit-caption" aria-live="polite" aria-atomic="true">
          <div><span className="ob-eyebrow">{edit.product.brand} · {edit.product.concentration}</span><Link to={`/other-brands/product/${edit.product.slug}`}>{edit.name}<span aria-hidden="true">↗</span></Link></div>
          <span className="ob-exhibit-price">from <strong>৳{edit.product.startingPrice}</strong><small>5 ml decant</small></span>
        </div>
      </div>
      <div className="ob-hero-bottom">
        <a href="#ob-catalog" className="ob-scroll-cue"><span aria-hidden="true">↓</span> SCROLL TO DISCOVER</a>
        <div className="ob-edit-picker" aria-label="Choose a featured fragrance">
          {EDITS.map((item, index) => <button key={item.name} onClick={() => setActive(index)} aria-pressed={active === index} aria-label={`Feature ${item.name}`}><span>0{index + 1}</span>{item.mood}<i aria-hidden="true" /></button>)}
        </div>
        <button className="ob-motion-toggle" onClick={() => setPaused((value) => !value)} aria-pressed={paused} aria-label={paused ? "Resume bottle animation" : "Pause bottle animation"}><span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span><span>{paused ? "Play" : "Pause"} motion</span></button>
      </div>
    </section>
  );
}
