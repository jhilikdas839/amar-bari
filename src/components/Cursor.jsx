import { useEffect, useRef } from "react";
import gsap from "gsap";

// Gaming reticle: lagging brass ring + ember dot. Grows into an Om on anything clickable, sparks on click.
export default function Cursor() {
  const wrap = useRef(null), ring = useRef(null), dot = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.body.classList.add("has-cursor");
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, raf;
    const move = (e) => {
      mx = e.clientX; my = e.clientY;
      dot.current.style.transform = `translate3d(${mx}px,${my}px,0)`;
      const hit = e.target.closest && e.target.closest("a, button, input, [data-hover]");
      wrap.current.classList.toggle("is-hover", !!hit);
    };
    const loop = () => {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    const down = (e) => {
      wrap.current.classList.add("is-down");
      for (let i = 0; i < 12; i++) {
        const s = document.createElement("span");
        s.className = "spark";
        s.style.left = e.clientX + "px"; s.style.top = e.clientY + "px";
        document.body.appendChild(s);
        const a = (Math.PI * 2 * i) / 12 + Math.random() * 0.4;
        const d = 30 + Math.random() * 50;
        gsap.to(s, {
          x: Math.cos(a) * d, y: Math.sin(a) * d - 10, opacity: 0, scale: 0.2,
          duration: 0.6 + Math.random() * 0.3, ease: "power3.out", onComplete: () => s.remove(),
        });
      }
    };
    const up = () => wrap.current.classList.remove("is-down");
    addEventListener("pointermove", move);
    addEventListener("pointerdown", down);
    addEventListener("pointerup", up);
    loop();
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", move);
      removeEventListener("pointerdown", down);
      removeEventListener("pointerup", up);
      document.body.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div className="cursor" ref={wrap} aria-hidden="true">
      <div className="cursor-ring" ref={ring}>
        <svg viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="22" fill="none" stroke="#d8a24a" strokeWidth="1" strokeDasharray="26 8.5" opacity=".9" />
          <path d="M25 0v6M25 44v6M0 25h6M44 25h6" stroke="#ff4d1a" strokeWidth="1.4" />
        </svg>
        <span className="om">ॐ</span>
      </div>
      <div className="cursor-dot" ref={dot} />
    </div>
  );
}
