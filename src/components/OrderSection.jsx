import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function OrderSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(".yb-order-bottle", { y: 70, opacity: 0, rotate: -8 }, { y: 0, opacity: 1, rotate: 0, duration: 1.3, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 78%", once: true } });
      gsap.fromTo(".yb-order-copy > *", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .9, stagger: .1, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 75%", once: true } });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section className="yb-order" ref={sectionRef} aria-labelledby="yb-order-title">
      <img className="yb-order-monogram" src="/zlogo.png" alt="" aria-hidden="true" />
      <div className="yb-order-visual">
        <div className="yb-order-orbit" />
        <img className="yb-order-bottle" src="/phb.png" alt="Yusuf Bhai signature fragrance bottle" loading="lazy" />
        <span>AUTHENTICITY, SEALED.</span>
      </div>
      <div className="yb-order-copy">
        <p className="yb-kicker"><i>✦</i> Your private consultation</p>
        <h2 id="yb-order-title">Find the one<br />that feels <em>like you.</em></h2>
        <p>Tell us what you already love—or the impression you want to leave. We’ll help you choose, confirm availability and arrange delivery across Bangladesh.</p>
        <a className="yb-primary-button" href="https://wa.me/8801790221253" target="_blank" rel="noreferrer">Begin on WhatsApp <span>↗</span></a>
        <div className="yb-order-assurances"><span>✓ Personal recommendations</span><span>✓ Authentic Yusuf Bhai</span><span>✓ Nationwide delivery</span></div>
      </div>
    </section>
  );
}
