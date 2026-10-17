import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { IMG } from "../assets";

const LINE_A = "Some battles are not fought with weapons.".split(" ");
const LINE_B = "They are fought for".split(" ");

// Pinned. Each scroll step kindles one word; the dusk ruins burn down into the glowing pendant.
export default function Prologue() {
  const root = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=220%", scrub: 0.8, pin: true },
        defaults: { ease: "none" },
      });
      tl.fromTo(".pro-img.a img", { scale: 1.35, rotate: -2 }, { scale: 1.05, rotate: 0, duration: 6 }, 0)
        .to(".pro-text .w", { opacity: 1, filter: "blur(0px)", stagger: 0.4, duration: 0.6 }, 0.2)
        .to(".pro-img.b", { opacity: 1, duration: 2 }, 3.6)
        .fromTo(".pro-img.b img", { scale: 1.4 }, { scale: 1, duration: 3 }, 3.6)
        .fromTo(".pro-text .faith", { textShadow: "0 0 0px rgba(255,140,40,0)" }, { textShadow: "0 0 40px rgba(255,140,40,.9)", duration: 1 }, 5.2)
        .to(".pro-cap", { opacity: 0, duration: 0.6 }, 5.6);
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="sec prologue" id="story" ref={root} aria-label="Prologue">
      <div className="pro-img a"><img src={IMG.ruinsDusk} alt="" /></div>
      <div className="pro-img b"><img src={IMG.omPendant} alt="" /></div>
      <div className="pro-shade" aria-hidden="true" />
      <p className="pro-text">
        {LINE_A.map((w, i) => <span className="w" key={"a" + i}>{w}&nbsp;</span>)}
        <br />
        {LINE_B.map((w, i) => <span className="w" key={"b" + i}>{w}&nbsp;</span>)}
        <span className="w faith">home.</span>
      </p>
      <p className="pro-cap">Debipur, the last evening before the dark</p>
    </section>
  );
}
