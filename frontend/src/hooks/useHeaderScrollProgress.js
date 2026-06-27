import { useEffect, useRef } from "react";

const SCROLL_IDLE_MS = 120;
const SETTLE_LERP = 0.28;
const SETTLE_EPSILON = 0.001;

function getScrollY() {
  return window.scrollY || document.documentElement.scrollTop || 0;
}

function getTargetProgress(scrollY, start, range) {
  if (scrollY <= start) return 0;
  return Math.min(1, (scrollY - start) / range);
}

function applyProgress(node, progress) {
  node?.style.setProperty("--header-progress", progress.toFixed(4));
}

export function useHeaderScrollProgress({ start = 30, range = 72 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    let rafId = 0;
    let current = 0;
    let isScrolling = false;
    let idleTimer = 0;

    function tick() {
      const target = getTargetProgress(getScrollY(), start, range);

      if (isScrolling) {
        current = target;
      } else if (Math.abs(target - current) >= SETTLE_EPSILON) {
        current += (target - current) * SETTLE_LERP;
        if (Math.abs(target - current) < SETTLE_EPSILON) {
          current = target;
        }
      }

      applyProgress(ref.current, current);

      if (isScrolling || Math.abs(target - current) >= SETTLE_EPSILON) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    }

    function markScrolling() {
      isScrolling = true;
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        isScrolling = false;
      }, SCROLL_IDLE_MS);

      if (!rafId) {
        rafId = window.requestAnimationFrame(tick);
      }
    }

    applyProgress(ref.current, 0);
    markScrolling();

    window.addEventListener("scroll", markScrolling, { passive: true });
    window.addEventListener("touchmove", markScrolling, { passive: true });

    return () => {
      window.removeEventListener("scroll", markScrolling);
      window.removeEventListener("touchmove", markScrolling);
      window.clearTimeout(idleTimer);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [start, range]);

  return ref;
}
