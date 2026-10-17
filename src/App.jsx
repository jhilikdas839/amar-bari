import { useCallback, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Loader from "./components/Loader";
import Cursor from "./components/Cursor";
import Embers from "./components/Embers";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Prologue from "./components/Prologue";
import Descent from "./components/Descent";
import FaceOff from "./components/FaceOff";
import Pillars from "./components/Pillars";
import Reel from "./components/Reel";
import Finale from "./components/Finale";
import Footer from "./components/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [ready, setReady] = useState(false);

  // Smooth scroll: Lenis drives the page, GSAP's ticker drives Lenis, ScrollTrigger listens to both
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.25, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
    return () => { gsap.ticker.remove(raf); lenis.destroy(); window.__lenis = null; };
  }, []);

  const onDone = useCallback(() => {
    setReady(true);
    window.__lenis && window.__lenis.start();
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  useEffect(() => {
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return (
    <>
      <Loader onDone={onDone} />
      <Cursor />
      <Nav />
      <main>
        <Hero ready={ready} />
        <Prologue />
        <Descent />
        <FaceOff />
        <Pillars />
        <Reel />
        <Finale />
      </main>
      <Footer />
      <Embers />
      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
