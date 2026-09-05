import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const COLLECTIONS = [
  { number: "01", title: "For Him", count: "27 fragrances", image: "/ph.png", category: "male", note: "Citrus · Woods · Leather", className: "yb-collection-him" },
  { number: "02", title: "For Her", count: "7 fragrances", image: "/pfm.png", category: "female", note: "Flowers · Fruit · Amber", className: "yb-collection-her" },
  { number: "03", title: "Beyond", count: "12 fragrances", image: "/ahsm.png", category: "unisex", note: "Oud · Musk · Mineral", className: "yb-collection-all" },
];

export default function Collections() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(".yb-collection-card", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: .14, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 78%", once: true } });
    }, section);
    return () => ctx.revert();
  }, []);

  const openCollection = (category) => {
    window.dispatchEvent(new CustomEvent("yb:set-category", { detail: category }));
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="collection" className="yb-collections" ref={sectionRef} aria-labelledby="yb-collection-title">
      <div className="yb-section-heading">
        <div><p className="yb-kicker"><i>✦</i> Three ways to wear a room</p><h2 id="yb-collection-title">Choose your<br /><em>presence.</em></h2></div>
        <p>A wardrobe of signatures for every version of you—from clean daylight to deep, unforgettable nights.</p>
      </div>
      <div className="yb-collection-grid">
        {COLLECTIONS.map((collection) => (
          <article className={`yb-collection-card ${collection.className}`} key={collection.category}>
            <img src={collection.image} alt="" loading="lazy" />
            <div className="yb-collection-shade" />
            <div className="yb-collection-top"><span>{collection.number} / 03</span><span>{collection.count}</span></div>
            <div className="yb-collection-copy"><p>{collection.note}</p><h3>{collection.title}</h3><button onClick={() => openCollection(collection.category)}>Enter this world <span>↗</span></button></div>
          </article>
        ))}
      </div>
    </section>
  );
}
