import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { IMG } from "../assets";
import { goTo } from "./Nav";

const TITLE = "AMAR BARI";

// A 3D diorama: the burning backdrop sits deep in Z, a sacred yantra turns between, the title floats forward.
// The cursor is a torch — it moves the camera and the light.
export default function Hero({ ready }) {
  const root = useRef(null), scene = useRef(null), light = useRef(null);

  useEffect(() => {
    if (matchMedia("(pointer: coarse)").matches) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, lx = innerWidth / 2, ly = innerHeight * 0.45, clx = lx, cly = ly, raf;
    const move = (e) => { tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; lx = e.clientX; ly = e.clientY; };
    const loop = () => {
      cx += (tx - cx) * 0.05; cy += (ty - cy) * 0.05;
      clx += (lx - clx) * 0.08; cly += (ly - cly) * 0.08;
      if (scene.current) scene.current.style.transform = `rotateY(${cx * 9}deg) rotateX(${-cy * 6}deg)`;
      if (light.current) { light.current.style.setProperty("--lx", clx + "px"); light.current.style.setProperty("--ly", cly + "px"); }
      raf = requestAnimationFrame(loop);
    };
    addEventListener("pointermove", move);
    loop();
    return () => { cancelAnimationFrame(raf); removeEventListener("pointermove", move); };
  }, []);

  // Scroll: the camera pulls back into the fire as the title burns away
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(".hero-bg img", { scale: 1.25, yPercent: 8, filter: "saturate(1.4) contrast(1.15) brightness(.55)", ease: "none", scrollTrigger: st });
      gsap.to(".hero-content", { yPercent: -28, opacity: 0, ease: "none", scrollTrigger: { ...st, end: "70% top" } });
      gsap.to(".hero-yantra", { rotate: 90, scale: 1.4, opacity: 0, ease: "none", scrollTrigger: st });
    }, root);
    return () => ctx.revert();
  }, []);

  // Intro: plays once the loader's flash hits
  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".hero-bg img", { scale: 1.6, filter: "brightness(0) saturate(0)", duration: 2.6 }, 0)
        .from(".hero-yantra", { opacity: 0, scale: 0.6, rotate: -60, duration: 2.4 }, 0.2)
        .to(".hero-studio", { opacity: 1, duration: 1 }, 0.5)
        .from(".hero-title .ch", { yPercent: 110, rotateX: -95, opacity: 0, stagger: 0.07, duration: 1.4, transformOrigin: "50% 100%", clearProps: "transform,opacity" }, 0.6)
        .to(".hero-deva", { opacity: 0.75, duration: 1.2 }, 1.3)
        .to(".hero-line", { opacity: 1, duration: 1.2 }, 1.5)
        .to(".hero-cta", { opacity: 1, duration: 1 }, 1.7)
        .to(".hero-meta", { opacity: 1, duration: 1 }, 1.9);
    }, root);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section className="hero" id="top" ref={root} aria-label="Amar Bari">
      <div className="hero-scene" ref={scene}>
        <div className="hero-bg"><img src={IMG.silhouetteFire} alt="Rudra stands alone before a towering demon of fire" /></div>
        <div className="hero-yantra" aria-hidden="true">
          <svg viewBox="0 0 400 400">
            <defs><path id="ring" d="M200 200m-170 0a170 170 0 1 1 340 0a170 170 0 1 1-340 0" /></defs>
            <circle cx="200" cy="200" r="190" fill="none" stroke="#d8a24a" strokeOpacity=".35" />
            <circle cx="200" cy="200" r="150" fill="none" stroke="#ff4d1a" strokeOpacity=".35" strokeDasharray="2 6" />
            <circle cx="200" cy="200" r="120" fill="none" stroke="#d8a24a" strokeOpacity=".25" />
            <polygon points="200,85 300,258 100,258" fill="none" stroke="#d8a24a" strokeOpacity=".3" />
            <polygon points="200,315 100,142 300,142" fill="none" stroke="#d8a24a" strokeOpacity=".3" />
            <text><textPath href="#ring">ॐ আমার বাড়ি ॥ বিশ্বাস ॥ ধৈর্য ॥ আলো ॥ ॐ আমার বাড়ি ॥ বিশ্বাস ॥ ধৈর্য ॥ আলো ॥</textPath></text>
          </svg>
        </div>
      </div>
      <div className="hero-light" ref={light} aria-hidden="true" />
      <div className="hero-fade" aria-hidden="true" />

      <div className="hero-content">
        <p className="hero-studio">Kaalchakra Studios presents</p>
        <div className="hero-title-glow">
          <h1 className="hero-title" aria-label="Amar Bari">
            {TITLE.split("").map((c, i) => c === " "
              ? <span className="gap" key={i} aria-hidden="true" />
              : <span className="ch" key={i} aria-hidden="true">{c}</span>)}
          </h1>
        </div>
        <p className="hero-deva"><span lang="bn">আমার বাড়ি</span> — my home</p>
        <p className="hero-line">Something has moved into the village Rudra grew up in. He walks back in with nothing but his fists and his faith.</p>
        <div className="hero-cta">
          <a href="#wishlist" className="btn btn-fire" onClick={(e) => { e.preventDefault(); goTo("wishlist"); }}>Wishlist on Steam</a>
          <a href="#teaser" className="btn btn-ghost" onClick={(e) => { e.preventDefault(); goTo("teaser"); }}><span className="btn-play" aria-hidden="true" />See the teaser</a>
        </div>
      </div>

      <div className="hero-meta">
        <span className="hm-side">Coming 2027</span>
        <span className="scroll-cue" aria-hidden="true">Scroll<i /></span>
        <span className="hm-side">PC, PlayStation 5, Xbox Series X|S</span>
      </div>
    </section>
  );
}
