import { flushSync } from "react-dom";
import { prefersReducedMotion } from "./motion";

// Wraps a react-router navigate() call in the browser's native View
// Transitions API where available. Combined with a matching
// `view-transition-name` on the product bottle in both the catalog card
// and the detail page (see FragranceBottle's `viewTransitionId` prop),
// this makes the bottle visually travel from its card into the detail
// page instead of the route hard-cutting to a new screen. In browsers
// without support (or with reduced motion requested) it's a plain
// navigate — no shim, no fallback animation, just the ordinary route
// change.
export function navigateWithTransition(navigate, to) {
  if (typeof document !== "undefined" && document.startViewTransition && !prefersReducedMotion()) {
    document.startViewTransition(() => {
      flushSync(() => navigate(to));
    });
  } else {
    navigate(to);
  }
}
