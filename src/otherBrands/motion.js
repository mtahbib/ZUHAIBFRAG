// A small shared motion vocabulary for the Other Brands experience — every
// scroll reveal and hover transition across the site pulls from this same
// small set of eases/durations so the motion reads as one coherent system
// rather than dozens of one-off tuned values.

export const EASE = "power2.out";
export const EASE_SOFT = "power1.out";
export const EASE_ENTER = "power3.out";

export const DUR = {
  fast: 0.35,
  base: 0.6,
  slow: 0.9,
  reveal: 1.1,
};

export const RISE = 26; // standard "enters from a few px below" offset

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// A restrained "magnetic" pull for small CTA affordances — the target
// drifts a few px toward the cursor within its own bounds, communicating
// "this is interactive" without chasing the pointer or transforming the
// whole button. Returns plain mouse handlers to spread onto the element;
// desktop callers should skip wiring this up entirely on touch/mobile.
export function magneticHandlers(gsap, ref, { max = 6 } = {}) {
  if (prefersReducedMotion()) return {};
  let moveX, moveY;
  return {
    onMouseMove: (e) => {
      if (!ref.current) return;
      if (!moveX) {
        moveX = gsap.quickTo(ref.current, "x", { duration: 0.5, ease: EASE });
        moveY = gsap.quickTo(ref.current, "y", { duration: 0.5, ease: EASE });
      }
      const rect = ref.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      moveX(nx * max);
      moveY(ny * max);
    },
    onMouseLeave: () => {
      moveX?.(0);
      moveY?.(0);
    },
  };
}

// Standard scroll-triggered rise+fade, applied to a list of elements with a
// gentle stagger. Used for section headings, brand indices, card grids —
// anywhere a group of siblings should feel like one considered reveal
// rather than a pile of individually-animated parts.
export function revealOnScroll(gsap, ScrollTrigger, targets, { trigger, start = "top 82%", stagger = 0.08, y = RISE } = {}) {
  if (!targets || (Array.isArray(targets) && targets.length === 0)) return;
  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0 });
    return;
  }
  gsap.fromTo(
    targets,
    { y, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: DUR.slow,
      stagger,
      ease: EASE,
      clearProps: "opacity,transform",
      scrollTrigger: { trigger: trigger || targets, start, once: true },
    }
  );
}
