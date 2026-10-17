import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { TEASER } from "../assets";

// Pinned horizontal film strip. Frames swing like a coverflow, flattening and lighting up at center.
export default function Reel() {
  const root = useRef(null), track = useRef(null);
  const [cur, setCur] = useState(1);
  const curRef = useRef(1);
  useLayoutEffect(() => {
    const frames = gsap.utils.toArray(".reel-frame", root.current);
    const shape = () => {
      const mid = innerWidth / 2;
      let best = 0, bestD = Infinity;
      frames.forEach((f, i) => {
        const tx = gsap.getProperty(track.current, "x") || 0;
        const off = (f.offsetLeft + f.offsetWidth / 2 + tx - mid) / innerWidth;
        const a = Math.abs(off);
        if (a < bestD) { bestD = a; best = i; }
        f.style.transform = `perspective(1100px) rotateY(${gsap.utils.clamp(-28, 28, -off * 55)}deg) translateZ(${-Math.min(a, 1) * 260}px)`;
        f.style.filter = `brightness(${gsap.utils.clamp(0.35, 1.05, 1.05 - a * 1.3)})`;
      });
      if (best + 1 !== curRef.current) { curRef.current = best + 1; setCur(best + 1); }
    };
    const ctx = gsap.context(() => {
      const dist = () => track.current.scrollWidth - innerWidth;
      gsap.to(track.current, {
        x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: () => "+=" + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, onUpdate: shape, onRefresh: shape },
      });
      gsap.to(".film-holes", { xPercent: -30, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
    }, root);
    shape();
    return () => ctx.revert();
  }, []);
  return (
    <section className="sec reel" id="teaser" ref={root} aria-label="Teaser frames">
      <div className="reel-head">
        <div>
          <span className="kicker" lang="bn">ঝলক</span>
          <h2 className="h2">The teaser, frame by frame</h2>
        </div>
        <div className="reel-count" aria-live="polite">{String(cur).padStart(2, "0")}<small> / {String(TEASER.length).padStart(2, "0")}</small></div>
      </div>
      <div className="film-holes" aria-hidden="true" />
      <div className="reel-track" ref={track}>
        {TEASER.map((t, i) => (
          <figure className="reel-frame" key={i}>
            <div className="rf"><img src={t.src} alt={t.cap} /></div>
            <figcaption>{t.cap}</figcaption>
          </figure>
        ))}
      </div>
      <div className="film-holes" aria-hidden="true" />
    </section>
  );
}
