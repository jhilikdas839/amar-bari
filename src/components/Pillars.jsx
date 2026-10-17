import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { IMG } from "../assets";
import useTilt from "../useTilt";

const PILLARS = [
  {
    deva: "যুদ্ধ", word: "Juddho, the fight", title: "Fight with your hands. Read with your eyes.",
    text: "Hand-to-hand combat built on timing, not button mashing. Every shadow shows its tell a heartbeat before it strikes. Read it, counter it, end it.",
    tags: ["Counter-based melee", "Aerial finishers", "No weapons, ever"], img: IMG.kick,
  },
  {
    deva: "বিশ্বাস", word: "Bishwas, faith", title: "Faith is your health bar.",
    text: "The Om pendant powers everything Rudra can’t do alone. Panic, retreat or strike in anger and it dims. Hold your ground and it burns brighter.",
    tags: ["Faith meter", "Om Kavach shield", "Calm unlocks power"], img: IMG.fistOm,
  },
  {
    deva: "স্মৃতি", word: "Smriti, memory", title: "Every room remembers you.",
    text: "Debipur rebuilds itself out of Rudra’s memories: the courtyard, the pond, his mother’s kitchen. Some doors open only when he faces what happened there.",
    tags: ["Shifting village map", "Hidden memory rooms", "Blood moon nights"], img: IMG.veerReach,
  },
];

function Pillar({ p, flip }) {
  const tilt = useRef(null);
  useTilt(tilt, { max: 5 });
  return (
    <div className={`pillar ${flip ? "flip" : ""}`}>
      <div className="pillar-media">
        <div className="tilt" ref={tilt} data-hover>
          <div className="pillar-frame"><img src={p.img} alt={p.title} /></div>
          <div className="pillar-hud" aria-hidden="true"><i /><i /><i /><i /></div>
        </div>
      </div>
      <div className="pillar-copy">
        <div className="pillar-deva" lang="bn" aria-hidden="true">{p.deva}</div>
        <p className="pillar-sub">{p.word}</p>
        <h3>{p.title}</h3>
        <p>{p.text}</p>
        <div className="pillar-tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
      </div>
    </div>
  );
}

// Each screen opens like a shutter as you reach it; the camera eases back from inside the shot.
export default function Pillars() {
  const root = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".pillar", root.current).forEach((el) => {
        const st = { trigger: el, start: "top 85%", end: "center 50%", scrub: 1 };
        gsap.to(el.querySelector(".pillar-frame"), { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: st });
        gsap.to(el.querySelector(".pillar-frame img"), { scale: 1.05, ease: "none", scrollTrigger: st });
        gsap.from(el.querySelectorAll(".pillar-copy > *"), { y: 40, opacity: 0, stagger: 0.1, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 65%" } });
      });
      gsap.from(".pillars .sec-head > *", { y: 50, opacity: 0, stagger: 0.12, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 75%" } });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="sec pillars" id="combat" ref={root} aria-label="How you play">
      <div className="sec-head">
        <span className="kicker" lang="bn">খেলা</span>
        <h2 className="h2">How you take it back</h2>
        <p className="lede">Three ideas shape every fight, every room and every choice in Amar Bari.</p>
      </div>
      {PILLARS.map((p, i) => <Pillar p={p} flip={i % 2 === 1} key={p.deva} />)}
    </section>
  );
}
