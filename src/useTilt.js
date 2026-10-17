import { useEffect } from "react";

// Mouse-driven 3D tilt + moving key light. Writes CSS vars so GSAP can own `transform` on the parent.
export default function useTilt(ref, { max = 8, light = true } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--ry", `${(x - 0.5) * max * 2}deg`);
      el.style.setProperty("--rx", `${(0.5 - y) * max * 2}deg`);
      if (light) {
        el.style.setProperty("--mx", `${x * 100}%`);
        el.style.setProperty("--my", `${y * 100}%`);
      }
    };
    const leave = () => {
      el.style.setProperty("--ry", "0deg");
      el.style.setProperty("--rx", "0deg");
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [ref, max, light]);
}
