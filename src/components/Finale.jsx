import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { IMG } from "../assets";

export default function Finale() {
  const root = useRef(null);
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState({ t: "", kind: "" });

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".finale-bg img", { scale: 1.35, filter: "brightness(.3)" }, { scale: 1, filter: "brightness(.9)", ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: true } });
      const tl = gsap.timeline({ scrollTrigger: { trigger: ".finale-inner", start: "top 70%" } });
      tl.from(".finale-q span", { y: 60, opacity: 0, filter: "blur(10px)", stagger: 0.35, duration: 1.4, ease: "expo.out" })
        .from(".finale-cta, .platforms, .notify", { y: 30, opacity: 0, stagger: 0.12, duration: 1, ease: "expo.out" }, "-=0.6");
    }, root);
    return () => ctx.revert();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMsg({ t: "Enter an email address like name@example.com.", kind: "err" });
      return;
    }
    setMsg({ t: "You’re on the list. We’ll write the moment the gameplay reveal is live.", kind: "ok" });
    setEmail("");
  };

  return (
    <section className="sec finale" id="wishlist" ref={root} aria-label="Wishlist Amar Bari">
      <div className="finale-bg"><img src={IMG.standoff} alt="" /></div>
      <div className="finale-shade" aria-hidden="true" />
      <div className="finale-inner">
        <h2 className="finale-q">
          <span>The final fight isn’t for the house.</span>
          <span className="big">It’s for home.</span>
        </h2>
        <div className="finale-cta">
          <a className="btn btn-fire" href="https://store.steampowered.com/" target="_blank" rel="noopener noreferrer">Wishlist on Steam</a>
          <a className="btn btn-ghost" href="https://store.playstation.com/" target="_blank" rel="noopener noreferrer">Wishlist on PlayStation</a>
        </div>
        <p className="platforms">Coming 2027 to PC, PlayStation 5 and Xbox Series X|S</p>
        <form className="notify" onSubmit={submit} noValidate>
          <label htmlFor="email">Get the gameplay reveal first</label>
          <p>One email when it drops. No spam, ever.</p>
          <div className="notify-row">
            <input id="email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com"
              value={email} onChange={(e) => { setEmail(e.target.value); if (msg.t) setMsg({ t: "", kind: "" }); }} aria-describedby="notify-msg" />
            <button className="btn btn-fire" type="submit">Notify me</button>
          </div>
          <p id="notify-msg" className={`notify-msg ${msg.kind}`} aria-live="polite">{msg.t}</p>
        </form>
      </div>
    </section>
  );
}
