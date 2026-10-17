import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// The diya is lit: the Om traces itself in brass, the count climbs, a flash of fire opens the world.
export default function Loader({ onDone }) {
  const root = useRef(null), flash = useRef(null), om = useRef(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const counter = { v: 0 };
    const tl = gsap.timeline();
    tl.fromTo(om.current, { strokeDashoffset: 900 }, { strokeDashoffset: 0, duration: reduce ? 0.3 : 2.1, ease: "power2.inOut" }, 0)
      .to(counter, { v: 100, duration: reduce ? 0.3 : 2.2, ease: "power1.inOut", onUpdate: () => setN(Math.round(counter.v)) }, 0)
      .to(om.current, { fill: "#d8a24a", duration: 0.5 }, "-=0.5")
      .to(root.current.querySelector(".loader-om"), { scale: 1.18, filter: "drop-shadow(0 0 40px rgba(255,120,30,1))", duration: 0.4 })
      .to(flash.current, { opacity: 1, duration: 0.25, ease: "power2.in" })
      .add(() => onDone && onDone())
      .set(root.current, { display: "none" })
      .to(flash.current, { opacity: 0, duration: 1.1, ease: "power2.out" });
    return () => tl.kill();
  }, [onDone]);
  return (
    <>
      <div className="loader" ref={root} role="status" aria-label="Loading Amar Bari">
        <div>
          <svg className="loader-om" viewBox="0 0 200 200" aria-hidden="true">
            <text ref={om} x="100" y="150" textAnchor="middle" fontSize="150"
              style={{ fontFamily: "var(--f-deva)", fill: "transparent", stroke: "#d8a24a", strokeWidth: 1.6, strokeDasharray: 900, filter: "drop-shadow(0 0 10px rgba(255,120,30,.8))" }}>ॐ</text>
          </svg>
          <div className="loader-count">{String(n).padStart(3, "0")}</div>
          <div className="loader-line">Lighting the lamp at home</div>
        </div>
      </div>
      <div className="loader-flash" ref={flash} aria-hidden="true" />
    </>
  );
}
