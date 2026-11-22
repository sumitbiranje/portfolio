# Master Build Prompt (Step 4)

> Matches the video's **Prompt 3 + the animation/performance add-on**. Paste this into Codex, Claude Code or any coding agent together with `01-profile.md`, `02-positioning.md`, `03-theme.md` and the photos in `/public/photos`.

```
Build the personal portfolio for Sumit Biranje, a freelance AI Engineer (agentic systems,
RAG, knowledge graphs). All facts come ONLY from 01-profile.md and 02-positioning.md.
Do not invent clients, numbers or links, and never reveal confidential employer details.
All visual decisions come from 03-theme.md. Use his real photos from /public/photos.

STACK
- Next.js (App Router, TypeScript, Turbopack), SCSS modules plus a global tokens file
  (no Tailwind)
- GSAP 3 (ScrollTrigger, SplitText) via @gsap/react useGSAP with proper cleanup
- Lenis smooth scroll synced to gsap.ticker
- Three.js with custom GLSL (Points portrait → knowledge-graph morph), dynamically imported
  client-side only, paused when off-screen, DPR capped at 1.75
- lucide-react icons, next/font (Instrument Serif, Inter Tight, JetBrains Mono)

PAGES
- /            all sections from 03-theme.md §7, in order
- /work/[slug] 5 case studies (Challenge → Approach diagram → Stack → Outcome → Reuse)
- /llms.txt and /llms-full.txt (plain markdown summary of the site for AI agents)
- robots.txt, sitemap.xml, a dynamic Open Graph image, JSON-LD Person + ProfessionalService

ANIMATION RULES
- One master GSAP timeline per section; all ScrollTriggers created in useGSAP scope and
  reverted on unmount; animate only transform and opacity
- Pinned hero morph, horizontal quests strip, SplitText line-mask reveals, label scramble,
  sliding-number stats, magnetic buttons, card tilt, short loader (skipped on repeat
  visits via sessionStorage)
- prefers-reduced-motion and a MOTION ON/OFF toggle: render final states and a static
  poster instead of WebGL

PERFORMANCE / QUALITY TARGETS
- Lighthouse 95+ on Performance and 100 on Accessibility, Best Practices and SEO
  (desktop and mobile)
- LCP < 1.8s: hero headline is server-rendered text (LCP element), WebGL loads after idle
- CLS < 0.05, no console errors, no unused JS on first load, images in AVIF/WebP with sizes
- Semantic HTML, skip link, visible focus rings, 4.5:1 contrast, alt text, labelled form
- Responsive at 375 / 768 / 1024 / 1440; no horizontal scroll on mobile

DO NOT
- add a logo or name-as-logo, use emoji as icons, use Tailwind, or show internal screenshots
```
