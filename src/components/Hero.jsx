import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DETAILS = [
  ["Origin", "Dubai, UAE"],
  ["Collection", "46 signatures"],
  ["Discovery", "From 5 ml"],
];

export default function Hero() {
  const heroRef = useRef(null);
  const artRef = useRef(null);
  const glowRef = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    const art = artRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.fromTo(".yb-hero-reveal", { opacity: 0, y: 38 }, { opacity: 1, y: 0, duration: 1.25, stagger: 0.09, delay: 0.12, ease: "power3.out", clearProps: "opacity,transform" });
      gsap.fromTo(art, { opacity: 0, scale: .78, rotation: -7 }, { opacity: 1, scale: 1, rotation: 0, duration: 1.8, ease: "power3.out", clearProps: "opacity,transform" });
      gsap.to(".yb-hero-copy", { yPercent: -13, opacity: .2, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "78% top", scrub: .8 } });
      gsap.to(".yb-hero-scene", { yPercent: -18, scale: .91, opacity: .15, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "78% top", scrub: .8 } });
    }, hero);

    const xTo = gsap.quickTo(art, "rotationY", { duration: 1, ease: "power3.out" });
    const yTo = gsap.quickTo(art, "rotationX", { duration: 1, ease: "power3.out" });
    const glowX = gsap.quickTo(glowRef.current, "x", { duration: 1.2, ease: "power3.out" });
    const onMove = (event) => {
      if (paused || reduced || event.pointerType === "touch") return;
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      xTo(x * 18); yTo(-y * 10); glowX(x * 70);
    };
    const reset = () => { xTo(0); yTo(0); glowX(0); };
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", reset);
    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", reset);
      [xTo, yTo, glowX].forEach((fn) => fn.tween.kill());
      ctx.revert();
    };
  }, [paused]);

  const discover = () => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="home" className="yb-hero" ref={heroRef} data-paused={paused}>
      <div className="yb-hero-grain" aria-hidden="true" />
      <div className="yb-hero-grid" aria-hidden="true" />
      <div className="yb-hero-ghost" aria-hidden="true">YB</div>
      <div className="yb-hero-index yb-hero-reveal"><span>THE PERFUMER’S COLLECTION</span><span>EST. DUBAI · ARRIVED DHAKA</span></div>

      <div className="yb-hero-copy">
        <p className="yb-kicker yb-hero-reveal"><i>✦</i> Authentic Yusuf Bhai</p>
        <h1 className="yb-hero-reveal">A signature<br /><em>before a word.</em></h1>
        <p className="yb-hero-lede yb-hero-reveal">Dubai-born compositions with presence, projection and a trail that people remember.</p>
        <div className="yb-hero-actions yb-hero-reveal">
          <button className="yb-primary-button" onClick={discover}>Enter the collection <span>↘</span></button>
          <button className="yb-text-button" onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}>Meet the perfumer <span>→</span></button>
        </div>
        <div className="yb-hero-details yb-hero-reveal">
          {DETAILS.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
        </div>
      </div>

      <div className="yb-hero-scene">
        <div className="yb-scene-glow" ref={glowRef} aria-hidden="true" />
        <div className="yb-scene-ring yb-ring-one" aria-hidden="true" />
        <div className="yb-scene-ring yb-ring-two" aria-hidden="true" />
        <div className="yb-hero-art" ref={artRef}>
          {[3, 2, 1].map((layer) => <img key={layer} className="yb-hero-art-edge" src="/k1.png" alt="" aria-hidden="true" style={{ transform: `translateZ(${-layer * 7}px)`, filter: `brightness(${.25 + layer * .1})` }} />)}
          <img src="/k1.png" alt="Yusuf Bhai fragrance staged with sculptural smoke" fetchPriority="high" draggable="false" />
          <div className="yb-hero-sheen" aria-hidden="true" />
        </div>
        <div className="yb-scene-note yb-note-top"><span>01 / OPENING</span><strong>Rare citrus</strong><i /></div>
        <div className="yb-scene-note yb-note-base"><span>03 / THE TRAIL</span><strong>Woods & amber</strong><i /></div>
        <p className="yb-scene-hint"><span>✧</span> Move to reveal the dimension</p>
      </div>

      <div className="yb-hero-footer">
        <button className="yb-scroll" onClick={discover}><span>↓</span>SCROLL TO DISCOVER</button>
        <p>PERSONAL LUXURY · BOTTLED IN DUBAI · DELIVERED NATIONWIDE</p>
        <button className="yb-pause" onClick={() => setPaused((value) => !value)} aria-pressed={paused} aria-label={paused ? "Play hero motion" : "Pause hero motion"}>{paused ? "▷ Play motion" : "Ⅱ Pause motion"}</button>
      </div>
    </section>
  );
}
