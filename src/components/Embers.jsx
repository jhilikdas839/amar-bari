import { useEffect, useRef } from "react";

// Rising sparks across the whole page. Scroll speed fans the fire.
export default function Embers() {
  const canvas = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = canvas.current, ctx = c.getContext("2d");
    let w, h, dpr, raf, boost = 0, lastY = scrollY, running = true;
    const N = innerWidth < 700 ? 40 : 85;
    const make = (init) => ({
      x: Math.random() * innerWidth,
      y: init ? Math.random() * innerHeight : innerHeight + 20,
      r: Math.random() * 1.8 + 0.4,
      vy: Math.random() * 0.7 + 0.25,
      sway: Math.random() * Math.PI * 2,
      life: Math.random() * 0.6 + 0.4,
      hue: 15 + Math.random() * 30,
    });
    const ps = Array.from({ length: N }, () => make(true));
    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = c.width = innerWidth * dpr; h = c.height = innerHeight * dpr;
      c.style.width = innerWidth + "px"; c.style.height = innerHeight + "px";
    };
    size();
    addEventListener("resize", size);
    const tick = () => {
      if (!running) return;
      const dy = Math.abs(scrollY - lastY); lastY = scrollY;
      boost += (Math.min(dy, 80) / 18 - boost) * 0.08;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const p of ps) {
        p.y -= (p.vy + boost) ;
        p.sway += 0.02;
        p.x += Math.sin(p.sway) * 0.4;
        if (p.y < -20) Object.assign(p, make(false));
        const fade = Math.min(1, p.y / (innerHeight * 0.6)) * p.life;
        const x = p.x * dpr, y = p.y * dpr, r = p.r * dpr;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
        g.addColorStop(0, `hsla(${p.hue},100%,70%,${fade})`);
        g.addColorStop(1, `hsla(${p.hue},100%,50%,0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, r * 5, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    const vis = () => { running = !document.hidden; if (running) tick(); else cancelAnimationFrame(raf); };
    document.addEventListener("visibilitychange", vis);
    tick();
    return () => { running = false; cancelAnimationFrame(raf); removeEventListener("resize", size); document.removeEventListener("visibilitychange", vis); };
  }, []);
  return <canvas className="embers" ref={canvas} aria-hidden="true" />;
}
