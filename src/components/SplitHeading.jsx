import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function SplitHeading({ text, as: Tag = "h2", style = {} }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const spans = Array.from(el.querySelectorAll("[data-char]"));

    const tween = gsap.fromTo(
      spans,
      { opacity: 0, y: 55, rotationX: -85 },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.75,
        stagger: 0.028,
        ease: "power3.out",
        clearProps: "opacity,transform",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
        },
      }
    );

    const t = setTimeout(() => ScrollTrigger.refresh(), 150);
    return () => { tween.kill(); clearTimeout(t); };
  }, [text]);

  return (
    <Tag
      ref={ref}
      style={{ ...style, perspective: "800px", display: "block" }}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          data-char
          style={{
            display: "inline-block",
            whiteSpace: char === " " ? "pre" : "normal",
          }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </Tag>
  );
}
