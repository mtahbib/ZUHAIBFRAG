import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: "46+", label: "Compositions" },
  { value: "100%", label: "Authentic" },
  { value: "64", label: "Districts served" },
];

export default function StorySection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(".yb-story-visual", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.3, ease: "power3.inOut", scrollTrigger: { trigger: section, start: "top 75%", once: true } });
      gsap.fromTo(".yb-story-reveal", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: .9, stagger: .1, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 76%", once: true } });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="yb-story" ref={sectionRef} aria-labelledby="yb-story-title">
      <div className="yb-story-number" aria-hidden="true">01</div>
      <div className="yb-story-visual">
        <img src="/yb.png" alt="Yusuf Bhai, Dubai perfumer" loading="lazy" />
        <span className="yb-story-stamp">DUBAI<br />PERFUMERY<br />ATELIER</span>
        <p>“A fragrance should arrive<br />before your introduction.”</p>
      </div>
      <div className="yb-story-copy">
        <p className="yb-kicker yb-story-reveal"><i>✦</i> The man behind the trail</p>
        <h2 id="yb-story-title" className="yb-story-reveal">Made to be<br /><em>remembered.</em></h2>
        <div className="yb-story-body yb-story-reveal">
          <p>Yusuf Bhai is one of Dubai’s most recognised perfumers, known for translating the character of iconic fragrances into compositions with remarkable performance.</p>
          <p>His work brings the ritual of fine fragrance closer: complex openings, memorable hearts and dry-downs that remain long after the room changes.</p>
        </div>
        <div className="yb-story-signature yb-story-reveal"><span>Curated in Dubai</span><strong>Yusuf Bhai</strong></div>
        <div className="yb-story-stats yb-story-reveal">
          {STATS.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
        </div>
      </div>
      <div className="yb-story-sidecopy" aria-hidden="true">THE ART OF LEAVING AN IMPRESSION</div>
    </section>
  );
}
