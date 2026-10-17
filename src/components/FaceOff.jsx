import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { IMG } from "../assets";
import useTilt from "../useTilt";

const VEER = {
  name: "Rudra Sen", role: "The son who came home",
  bio: "Left Debipur as a boy. Came back with cracked glasses, a stubborn streak and his mother’s Om. Not a fighter, until tonight.",
  stats: [["Bishwas", "Faith", 92], ["Dhoirjo", "Resolve", 86], ["Raag", "Fury", 38]],
  ability: ["Om Kavach", "the pendant blazes and turns one killing blow into light."],
  img: IMG.veerGaze,
};
const ANDHAK = {
  name: "Andhak", role: "The thing that moved in",
  bio: "Born of every fear left unspoken. It doesn’t want the land. It wants you to forget this was ever home.",
  stats: [["Khide", "Hunger", 99], ["Chhaya", "Shadow", 95], ["Phisphis", "Whisper", 88]],
  ability: ["Andhakaar", "swallows the light around you. Stand still and your faith drains."],
  img: IMG.andhakEyes,
};

function Fighter({ data, dark }) {
  const tilt = useRef(null);
  useTilt(tilt, { max: 7 });
  return (
    <article className={`fighter ${dark ? "dark" : "light"}`}>
      <div className="tilt" ref={tilt} data-hover>
        <div className="fighter-art"><img src={data.img} alt={`${data.name}, ${data.role}`} /></div>
        <div className="fighter-info">
          <h3 className="fighter-name">{data.name}</h3>
          <p className="fighter-role">{data.role}</p>
          <p className="fighter-bio">{data.bio}</p>
          <div className="stats">
            {data.stats.map(([hi, en, v]) => (
              <div className="stat" key={hi}>
                <b title={en}>{hi}</b>
                <span className="bar" role="meter" aria-label={en} aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}><i style={{ transform: `scaleX(${v / 100})` }} /></span>
                <em>{v}</em>
              </div>
            ))}
          </div>
          <p className="ability"><strong>{data.ability[0]}:</strong> {data.ability[1]}</p>
        </div>
      </div>
    </article>
  );
}

// Pinned duel: the two sides swing in on 3D hinges, collide in a flash, and their stats ignite.
export default function FaceOff() {
  const root = useRef(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "+=140%", pin: true, scrub: 0.8 } });
      tl.from(".fighter.light", { xPercent: -70, rotateY: 50, opacity: 0, z: -400, duration: 2, ease: "power3.out" }, 0)
        .from(".fighter.dark", { xPercent: 70, rotateY: -50, opacity: 0, z: -400, duration: 2, ease: "power3.out" }, 0)
        .from(".clash", { scale: 0, rotate: -180, duration: 1 }, 1.4)
        .to(".clash-flash", { opacity: 1, duration: 0.25 }, 2)
        .to(".clash-flash", { opacity: 0, duration: 0.9 }, 2.25)
        .from(".stat .bar i", { scaleX: 0, stagger: 0.08, duration: 0.8, ease: "power2.out" }, 2.1)
        .from(".fighter-art img", { scale: 1.5, duration: 2.5, ease: "none" }, 0);
    }, root.current);
    mm.add("(max-width: 900px)", () => {
      gsap.utils.toArray(".fighter", root.current).forEach((f) => {
        gsap.from(f, { y: 80, opacity: 0, rotateX: 25, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: f, start: "top 85%" } });
        gsap.from(f.querySelectorAll(".stat .bar i"), { scaleX: 0, stagger: 0.1, duration: 1, scrollTrigger: { trigger: f, start: "top 60%" } });
      });
    }, root.current);
    const ctx = gsap.context(() => {
      gsap.from(".faceoff-head > *", { y: 50, opacity: 0, stagger: 0.12, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 75%" } });
    }, root);
    return () => { mm.revert(); ctx.revert(); };
  }, []);
  return (
    <section className="sec faceoff" id="faceoff" ref={root} aria-label="Rudra versus Andhak">
      <div className="sec-head faceoff-head">
        <span className="kicker" lang="bn">মুখোমুখি</span>
        <h2 className="h2">Two claims on one home.</h2>
        <p className="lede">Andhak can’t be beaten by strength alone. Every choice you make in a fight decides who the village belongs to.</p>
      </div>
      <div className="duel">
        <Fighter data={VEER} />
        <div className="clash" aria-hidden="true"><div className="clash-ring" /><span>ॐ</span><div className="clash-flash" /></div>
        <Fighter data={ANDHAK} dark />
      </div>
    </section>
  );
}
