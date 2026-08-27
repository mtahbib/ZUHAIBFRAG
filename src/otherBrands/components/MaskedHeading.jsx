import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../motion";

gsap.registerPlugin(ScrollTrigger);

// A line-masked reveal for editorial headlines — the text slides up from
// behind its own baseline rather than fading or flipping in character by
// character. Used wherever a headline should feel "revealed," matching the
// technique already used in the hero and final CTA.
export default function MaskedHeading({ text, as: Tag = "div", style = {} }) {
  const wrapRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        innerRef.current,
        { yPercent: 112 },
        {
          yPercent: 0,
          duration: 0.95,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: { trigger: wrapRef.current, start: "top 88%", once: true },
        }
      );
    }, wrapRef);
    const t = setTimeout(() => ScrollTrigger.refresh(), 150);
    return () => { ctx.revert(); clearTimeout(t); };
  }, [text]);

  return (
    <Tag ref={wrapRef} style={{ overflow: "hidden", display: "block", ...style }}>
      <div ref={innerRef}>{text}</div>
    </Tag>
  );
}
