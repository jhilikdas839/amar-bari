# Amar Bari — landing page (React + GSAP + Lenis)

## Run
npm install
npm run dev        # local dev server (Vite)
npm run build      # production build in dist/
npm run build:single   # one self-contained HTML file in dist-single/ (images inlined)

## Structure
src/App.jsx              Lenis smooth scroll wired to GSAP ScrollTrigger, section order
src/components/Loader    Om traces itself, counter, fire flash
src/components/Cursor    Custom reticle cursor, Om on hover, click sparks
src/components/Embers    Canvas sparks; scroll speed fans the fire
src/components/Hero      3D diorama, mouse camera + torch light, rotating yantra
src/components/Prologue  Pinned word-by-word reveal
src/components/Descent   3D camera fly-through of six story chapters
src/components/FaceOff   Rudra vs Andhak duel with stats
src/components/Pillars   Gameplay pillars with shutter reveals + tilt lighting
src/components/Reel      Pinned horizontal coverflow of teaser frames
src/components/Finale    Closing line, wishlist CTAs, email signup
src/assets/              Your images, cropped, 2x upscaled and sharpened

Placeholders to replace: studio name (Kaalchakra Studios), store links, release window, footer links.
