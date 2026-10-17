import { useEffect, useState } from "react";

export const goTo = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { duration: 1.8 });
  else el.scrollIntoView({ behavior: "smooth" });
};

const LINKS = [["story", "Story"], ["descent", "Chapters"], ["faceoff", "Rudra vs Andhak"], ["combat", "Combat"], ["teaser", "Teaser"]];

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = 0;
    const on = () => {
      const y = scrollY;
      setSolid(y > 60);
      setHidden(y > 400 && y > last);
      last = y;
    };
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  const click = (id) => (e) => { e.preventDefault(); goTo(id); };
  return (
    <header className={`nav ${solid ? "is-solid" : ""} ${hidden ? "is-hidden" : ""}`}>
      <a href="#top" className="brand" onClick={click("top")} aria-label="Amar Bari, back to top">
        <span className="brand-om" aria-hidden="true">ॐ</span>AMAR BARI
      </a>
      <nav className="nav-links" aria-label="Sections">
        {LINKS.map(([id, label]) => <a key={id} href={`#${id}`} onClick={click(id)}>{label}</a>)}
      </nav>
      <a href="#wishlist" className="btn btn-fire" onClick={click("wishlist")}>Wishlist</a>
    </header>
  );
}
