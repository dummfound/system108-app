import { useEffect } from "react";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function applyTilt(gamma, beta) {
  const root = document.documentElement;
  const x = clamp(gamma / 42, -1, 1);
  const y = clamp((beta - 45) / 42, -1, 1);
  const angle = Math.atan2(y, x) * (180 / Math.PI);
  const strength = clamp(Math.hypot(x, y), 0, 1);

  root.style.setProperty("--tilt-x", x.toFixed(3));
  root.style.setProperty("--tilt-y", y.toFixed(3));
  root.style.setProperty("--tilt-angle", `${angle.toFixed(1)}deg`);
  root.style.setProperty("--tilt-strength", strength.toFixed(3));
  root.classList.add("tilt-active");
}

export function useDeviceTilt() {
  useEffect(() => {
    const root = document.documentElement;
    let listening = false;

    function onOrientation(event) {
      if (event.gamma == null && event.beta == null) return;
      applyTilt(event.gamma ?? 0, event.beta ?? 45);
    }

    async function startListening() {
      if (listening) return;

      if (typeof DeviceOrientationEvent?.requestPermission === "function") {
        try {
          const state = await DeviceOrientationEvent.requestPermission();
          if (state !== "granted") return;
        } catch {
          return;
        }
      }

      window.addEventListener("deviceorientation", onOrientation, true);
      listening = true;
    }

    startListening();

    const unlock = () => {
      startListening();
    };

    window.addEventListener("touchstart", unlock, { once: true, passive: true });
    window.addEventListener("click", unlock, { once: true });

    return () => {
      window.removeEventListener("deviceorientation", onOrientation, true);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("click", unlock);
      root.classList.remove("tilt-active");
      root.style.removeProperty("--tilt-x");
      root.style.removeProperty("--tilt-y");
      root.style.removeProperty("--tilt-angle");
      root.style.removeProperty("--tilt-strength");
    };
  }, []);
}
