import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { IMG } from "../assets";

const CHAPTERS = [
  { n: "I", name: "The return", img: IMG.ruinsDusk, text: "Rudra came back to Debipur after twelve years. The temple his grandfather built was the only thing still standing." },
  { n: "II", name: "The waking", img: IMG.andhakEyes, text: "Beneath it, something had waited for the village to empty. It knew every house by name, and his most of all." },
  { n: "III", name: "The circle", img: IMG.circleFight, text: "Shadows took the faces of neighbours he once knew and stepped out of every pillar at once." },
  { n: "IV", name: "The fall", img: IMG.fallen, text: "He hit the stone. Glasses cracked, palms bleeding, and a voice said: this isn’t your home anymore." },
  { n: "V", name: "The pendant", img: IMG.omPendant, text: "His mother’s Om, warm against his chest. The one thing he carried out of this house, and the reason he came back." },
  { n: "VI", name: "The answer", img: IMG.punchStone, text: "He got up. He struck. And the darkness finally learned whose home this was." },
];
const D = 1500; // depth between scenes, in px

// The signature moment: scroll is a camera dolly. You fly forward through six scenes hung in 3D space.
export default function Descent() {
  const root = useRef(null), world = useRef(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useLayoutEffect(() => {
    const frames = gsap.utils.toArray(".frame", root.current);
    const fogs = gsap.utils.toArray(".frame-fog", root.current);
    const narrow = innerWidth < 760;
    const titleEl = root.current.querySelector(".descent-title");
    const place = frames.map((_, i) => ({
      x: narrow ? 0 : (i % 2 ? 1 : -1) * innerWidth * 0.14,
      y: narrow ? 0 : (i % 3 - 1) * innerHeight * 0.05,
      ry: narrow ? 0 : (i % 2 ? -14 : 14),
    }));
    const START = -350, total = (frames.length - 1) * D + 950;
    const render = (p) => {
      const z = START + p * total;
      // slight camera sway so the flight feels hand-held
      world.current.style.transform = `translate3d(0,0,${z}px) rotateY(${Math.sin(p * 9) * 2}deg) rotateZ(${Math.sin(p * 6) * 0.8}deg)`;
      frames.forEach((f, i) => {
        const rel = -i * D + z; // 0 = at the screen plane
        let o = gsap.utils.clamp(0, 1, (rel + 3.2 * D) / (1.3 * D));
        if (rel > 120) o *= gsap.utils.clamp(0, 1, 1 - (rel - 120) / 480);
        f.style.opacity = o;
        f.style.visibility = o < 0.01 ? "hidden" : "visible";
        fogs[i].style.opacity = gsap.utils.clamp(0, 0.92, -rel / (2.4 * D));
      });
      if (titleEl) titleEl.style.opacity = gsap.utils.clamp(0, 1, 1 - (p - 0.06) / 0.06);
      const idx = gsap.utils.clamp(0, frames.length - 1, Math.floor((z + 900) / D));
      if (idx !== activeRef.current) { activeRef.current = idx; setActive(idx); }
    };
    frames.forEach((f, i) => {
      const { x, y, ry } = place[i];
      f.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${-i * D}px) rotateY(${ry}deg)`;
    });
    render(0);
    const ctx = gsap.context(() => {
      gsap.to({}, {
        scrollTrigger: {
          trigger: root.current, start: "top top", end: `+=${frames.length * 120}%`, pin: true, scrub: 1,
          onUpdate: (s) => render(s.progress),
        },
      });
      gsap.from(".descent-title > *", { y: 40, opacity: 0, stagger: 0.15, duration: 1, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 70%" } });
    }, root);
    return () => ctx.revert();
  }, []);

  // HUD swap on chapter change
  useLayoutEffect(() => {
    gsap.fromTo(".descent-hud > *", { y: 18, opacity: 0, filter: "blur(6px)" }, { y: 0, opacity: 1, filter: "blur(0px)", stagger: 0.06, duration: 0.6, ease: "power3.out", overwrite: true });
  }, [active]);

  const c = CHAPTERS[active];
  return (
    <section className="sec descent" id="descent" ref={root} aria-label="Story chapters">
      <div className="descent-stage">
        <div className="descent-world" ref={world}>
          {CHAPTERS.map((ch, i) => (
            <figure className="frame" key={ch.n}>
              <span className="frame-num">{ch.n}</span>
              <div className="frame-inner">
                <img src={ch.img} alt={`${ch.name}: ${ch.text}`} />
                <div className="frame-fog" />
              </div>
              <i className="frame-corner tl" /><i className="frame-corner br" />
            </figure>
          ))}
        </div>
      </div>
      <div className="descent-title">
        <span className="kicker" lang="bn">অধ্যায়</span>
        <h2 className="h2">Walk back into Debipur</h2>
        <p>Keep scrolling to walk deeper.</p>
      </div>
      <div className="descent-hud" aria-live="polite">
        <div className="hud-roman">Chapter {c.n}</div>
        <div className="hud-name">{c.name}</div>
        <p className="hud-text">{c.text}</p>
      </div>
      <div className="descent-progress" aria-hidden="true">
        {CHAPTERS.map((_, i) => <span key={i} className={i === active ? "on" : ""} />)}
      </div>
    </section>
  );
}
