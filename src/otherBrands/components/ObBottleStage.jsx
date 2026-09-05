import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "../motion";

// Stacked transparent photographs give the glass a shallow edge when
// tilted. The original alpha channel also masks the moving studio light.

export default function ObBottleStage({ edit, paused }) {
  const stageRef = useRef(null);
  const tiltRef = useRef(null);
  const product = edit.product;

  useEffect(() => {
    const stage = stageRef.current;
    const tilt = tiltRef.current;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ctx = gsap.context(() => {
      if (media.matches || paused) return;
      gsap.fromTo(".ob-bottle-arrival", { opacity: 0, y: 55, rotation: -12, scale: 0.88 }, { opacity: 1, y: 0, rotation: 0, scale: 1, duration: 1.2, ease: "power3.out", clearProps: "all" });
    }, stage);
    const rotateX = gsap.quickTo(tilt, "rotationX", { duration: 0.9, ease: "power3.out" });
    const rotateY = gsap.quickTo(tilt, "rotationY", { duration: 0.9, ease: "power3.out" });
    const moveX = gsap.quickTo(tilt, "x", { duration: 0.9, ease: "power3.out" });
    const onMove = (event) => {
      if (paused || prefersReducedMotion() || event.pointerType === "touch") return;
      const bounds = stage.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      rotateX(-y * 20); rotateY(x * 36); moveX(x * 22);
      stage.style.setProperty("--light-x", `${50 + x * 55}%`);
    };
    const reset = () => { rotateX(0); rotateY(0); moveX(0); };
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", reset);
    media.addEventListener("change", reset);
    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", reset);
      media.removeEventListener("change", reset);
      [rotateX, rotateY, moveX].forEach((fn) => fn.tween.kill());
      gsap.set(tilt, { clearProps: "transform" });
      ctx.revert();
    };
  }, [paused]);

  return (
    <div className={`ob-bottle-stage ob-bottle-${edit.tone}`} ref={stageRef}>
      <div className="ob-stage-halo" aria-hidden="true" />
      <div className="ob-stage-orbit ob-stage-orbit-one" aria-hidden="true" />
      <div className="ob-stage-orbit ob-stage-orbit-two" aria-hidden="true" />
      <div className="ob-stage-plinth" aria-hidden="true" />
      <div className="ob-stage-shadow" aria-hidden="true" />
      <div className="ob-bottle-arrival">
        <div className="ob-bottle-tilt" ref={tiltRef}>
          <div className="ob-bottle-float" style={{ "--bottle-mask": `url("${product.image}")` }}>
            {[0, 1, 2, 3].map((layer) => <img key={layer} src={product.image} className="ob-bottle-edge" alt="" aria-hidden="true" draggable="false" style={{ transform: `translateZ(${-4 - layer * 4}px)`, filter: `brightness(${0.42 + layer * 0.09})` }} />)}
            <img className="ob-bottle-front" src={product.image} alt={`${product.brand} ${product.name} perfume bottle`} draggable="false" fetchPriority="high" />
            <div className="ob-bottle-light" aria-hidden="true" />
          </div>
        </div>
      </div>
      <div className="ob-scent-callout ob-scent-top"><span>THE FIRST IMPRESSION</span><strong>{product.topNotes[0]}</strong><i aria-hidden="true" /></div>
      <div className="ob-scent-callout ob-scent-base"><span>WHAT LINGERS</span><strong>{product.baseNotes[0]}</strong><i aria-hidden="true" /></div>
      <p className="ob-stage-instruction"><span aria-hidden="true">✧</span> Move your cursor. Feel the depth.</p>
    </div>
  );
}
