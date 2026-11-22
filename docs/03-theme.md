# Sumit Biranje: Theme and Design Direction (Step 3)

> Builds on `01-profile.md` and `02-positioning.md`. Matches the video's **Prompt 2** ("theme only, no website").
> References studied (screenshots at 1440px, five scroll positions each):
> 1. **razorpay.com/ai-builders**: black field, **ASCII / dither imagery**, electric-blue squares, big condensed serif headline with an italic emphasis word, terminal-text textures.
> 2. **sarthak-sharma-portfolio-six.vercel.app**: near-black (#030303), **halftone dot-portrait** of the person in the hero, **Instrument Serif** display with italic surname, DM Sans body, **mono uppercase HUD labels** ("01 / PRESENCE"), a single warm accent, browser-frame project cards, a "MOTION ON" toggle, big stat numbers.
> 3. **animate-ui.com**: tactile **micro-interactions**: sliding numbers, tab and accordion springs, floating tilted UI cards, copy-command pill.
>
> Design-intelligence check (ui-ux-pro-max): style **Dark Mode (OLED)**, high motion, low density. Rules: 4.5:1 contrast, visible focus, `prefers-reduced-motion`, SVG icons only (no emoji), CLS < 0.1.

---

## 1. Concept: "Signal from Noise"

Sumit builds AI that turns messy codebases and requirements into **structured knowledge graphs**. The site acts that out:

- **Hero:** Sumit's portrait rendered as a **field of dots / ASCII characters** (Three.js points sampled from his photo). On scroll, the dots **detach and re-form into a glowing knowledge graph**: nodes and edges, "agents" travelling along the edges. *Noise becomes structure.*
- **Story:** the tester-turned-AI-engineer arc is told as **levels** (subtle gaming): `LV.01 INTERN → LV.02 TRAINEE → LV.03 TEST ENGINEER → LV.04 AI ENGINEER`.
- **Tone:** premium, editorial and technical, not cartoonish. The gaming is in the *details* (HUD labels, XP bars, "quest" numbering, a Konami easter egg).

## 2. Colour

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#050507` | page background (OLED near-black) |
| `--bg-raised` | `#0C0D12` | cards, nav pill |
| `--bg-sunken` | `#020203` | footer, loader |
| `--line` | `#1C1E26` | hairlines, grid lines |
| `--line-strong` | `#2A2D38` | card borders, hover |
| `--text` | `#EDEBE6` | primary text (warm off-white, about 17:1 on bg) |
| `--text-muted` | `#9A9AA3` | body secondary (about 7:1) |
| `--text-faint` | `#6B6C75` | labels, meta (about 4.6:1, AA) |
| `--accent` | `#3D5BFF` | **electric blue**: blocks, CTA fill, graph nodes (from Razorpay) |
| `--accent-soft` | `#7D93FF` | accent text on dark (about 6.5:1, AA) |
| `--signal` | `#C6FF3D` | **HUD lime**: tiny status dots, "LIVE", XP fill, at most 2% of the screen |
| `--danger` | `#FF5A4E` | form errors only |

Rules: one accent per view; lime is only for HUD or status micro-details; never blue text on blue; gradients only as soft radial glows behind 3D.

## 3. Typography

| Role | Font | Notes |
|---|---|---|
| Display | **Space Grotesk** (500) | Huge, tight tracking (-0.045em). One **blue emphasis word** per headline ("Sumit **Biranje**", "AI that works **after** the demo"). |
| Body / UI | **DM Sans** (400/500) | 16–18px body, 1.55 line-height, `text-wrap: pretty`. |
| HUD / labels / code | **JetBrains Mono** (400/500) | 11–12px uppercase, +0.14em tracking: `01 / SERVICES`, `LV.04`, `LATENCY 120MS`. |

Scale (fluid `clamp`): display 64→168px · h2 44→96px · h3 28→40px · body 16→18px · label 11–12px. All loaded via `next/font` (self-hosted, `display: swap`, no CLS).

## 4. Imagery and texture

- **Photos of Sumit:** a background-removed PNG/WebP with a **cool blue rim light** on one side (colour-graded to match the palette). Used three ways: (1) the dot/ASCII particle portrait in the hero, (2) a clean cut-out in About, (3) a small duotone avatar in Contact.
- **Project visuals:** never internal screenshots. Instead, **redrawn architecture diagrams** as animated SVG (nodes, arrows, agent boxes) inside browser- or terminal-style frames.
- **Texture:** a faint dot-grid / dither overlay (CSS, about 3% opacity), thin vertical column lines like Sarthak's grid, and a little ASCII "noise" text at section edges like Razorpay.
- **Icons:** Lucide (SVG). No emoji.
- **No logo**, and no name-as-logo in the nav: the nav shows `SB` as a mono monogram plus a status dot "AVAILABLE FOR PROJECTS".

## 5. Layout language

- 12-column grid, 1440px max, 72px desktop gutters and 20px mobile gutters, visible hairline columns.
- Sections open with a **mono index label** row: `02 / SERVICES ———————— WHAT I BUILD FOR CLIENTS`.
- Floating **pill nav** (glass `--bg-raised` at 70% plus blur), top centre, with a "Start a project ↗" button.
- Cards: 1px `--line-strong` border, 2px radius on HUD elements, 14px on cards; hover lifts the border to accent with a corner-bracket HUD frame `⌜ ⌝ ⌞ ⌟`.
- Generous spacing (density 3/10): 160–200px between sections on desktop.

## 6. Motion system

| Layer | Library | Behaviour |
|---|---|---|
| Smooth scroll | **Lenis** | `lerp 0.1`, synced to the GSAP ticker; off when reduced motion is set |
| Scroll choreography | **GSAP + ScrollTrigger** | pinned hero morph (portrait → graph), section reveals, horizontal "quests" strip |
| Text | **GSAP SplitText** | headlines: line mask with chars rising (0.9s, `expo.out`, 0.02 stagger); labels: **scramble/decode** effect (hacker HUD) |
| 3D | **Three.js + custom GLSL** | `THREE.Points` from the photo luminance; vertex shader mixes `uPortrait ↔ uGraph` positions by `uProgress`; curl-noise drift; mouse repulsion; additive blue points |
| Micro | GSAP / CSS | magnetic buttons, sliding-number counters (animate-ui style), card tilt (max 6°), HUD corner brackets draw in, cursor-follow label |
| Page loader | GSAP | 0→100% mono counter, `INITIALISING AGENTS…`, dots assemble into the hero (≤1.2s, skipped on repeat visits) |

Timing: micro 150–250ms · reveals 700–1000ms · `expo.out` / `power3.out`; exits about 30% faster than enters. **Motion toggle** button (bottom-right, "MOTION ON/OFF") plus `prefers-reduced-motion`. With motion off, render final states and a static poster image instead of WebGL.

## 7. Section-by-section look

1. **Loader:** black, mono counter, blue progress line, dots converge.
2. **Hero:** dot-portrait canvas centred; giant serif "Sumit *Biranje*" over it; mono corners (`AI ENGINEER · AGENTIC SYSTEMS` / `PUNE, IN · REMOTE WORLDWIDE`); headline "I build AI agents that don't break in production."; CTAs **Start a project** (filled blue) and **See the work** (ghost).
3. **Morph (pinned):** scrolling turns the portrait into a knowledge graph; labels fade in on nodes: `RAG`, `AGENTS`, `MCP`, `GRAPH`, `EVALS`. Copy: "Noise in. *Structure* out."
4. **Proof bar:** sliding-number stats (5+ yrs · 5 AI systems · 7-agent architecture · 6+ languages in one graph).
5. **Services:** 5 HUD cards (icon, title, one-liner, "proof" mono tag); hover draws corner brackets.
6. **Selected work ("Quests"):** horizontal pinned strip of 5 case-study cards, each with an animated SVG architecture diagram in a terminal frame; `QUEST 01 / 05`, a stack chip row, "Read case study ↗" → `/work/[slug]`.
7. **How I work:** 5-step pipeline (Discover → Prototype → Evaluate → Harden → Ship) as a node path that lights up on scroll.
8. **Story ("Level up"):** vertical timeline LV.01→LV.04 with XP bars; a cut-out photo; line "I spent years breaking software. Now I build AI that *understands* it." Plus "Off-duty: gamer" with a controller icon.
9. **Stack:** grouped skill chips; "Currently exploring" with a lime pulsing dot.
10. **Contact:** big serif "Let's build something that *ships*."; form (name, email, project type, budget, message) plus email and LinkedIn; soft line "Also open to the right full-time AI Engineer role."
11. **Footer:** mono links, local time in Pune (live clock), `llms.txt` link, "Built with Next.js · Three.js · GSAP".

## 8. Copy rules
Plain, specific, confident; outcomes over buzzwords; at most one italic word per heading; no "revolutionary", "cutting-edge" or "passionate".

---

## 9. Theme prompt (paste into any AI)

```
Design direction for a personal portfolio for Sumit Biranje, a freelance AI Engineer
(agentic systems, RAG, knowledge graphs; 5 years at KPIT, tester turned AI engineer).
Use his authentic information from the attached profile document and his own photos.
Do not invent facts or reveal any confidential employer details.

CONCEPT: "Signal from Noise". His portrait appears as a field of dots / ASCII characters
(Three.js Points sampled from his photo). On scroll, the dots re-form into a glowing
knowledge graph (nodes, edges, small "agents" travelling along edges). Career told as
subtle game levels: LV.01 Intern → LV.02 Trainee → LV.03 Test Engineer → LV.04 AI Engineer.
Premium, editorial and technical, never cartoonish.

COLOURS: bg #050507, raised #0C0D12, lines #1C1E26/#2A2D38, text #EDEBE6,
muted #9A9AA3, faint #6B6C75, accent electric blue #3D5BFF (text-safe #7D93FF),
HUD lime #C6FF3D for tiny status details only. One accent per view.

TYPE: Space Grotesk 500 for display (huge, -0.045em, one blue emphasis word per headline),
DM Sans for body/UI (16–18px, 1.55), JetBrains Mono for uppercase HUD labels (11–12px,
+0.14em) such as "02 / SERVICES", "LV.04", "QUEST 01 / 05". Self-host via next/font.

TEXTURE: faint dot-grid/dither overlay, thin vertical grid lines, ASCII noise at edges,
HUD corner brackets on hover, browser/terminal frames for redrawn architecture diagrams.
Lucide SVG icons, no emoji, no logo (mono "SB" monogram plus a status dot only).

MOTION: Lenis smooth scroll + GSAP ScrollTrigger (pinned hero morph, horizontal quest
strip), SplitText line-mask reveals, scramble/decode effect on HUD labels, sliding-number
counters, magnetic buttons, gentle card tilt, a short loader (mono 0–100 counter,
"INITIALISING AGENTS…"). Custom GLSL shader mixes portrait and graph positions by
uProgress with curl-noise drift and mouse repulsion. Respect prefers-reduced-motion,
plus a visible MOTION ON/OFF toggle that falls back to static images.

SECTIONS: Loader, Hero, pinned Morph, Proof stats, Services (5), Quests (5 case studies),
How I work (5-step pipeline), Level-up story, Stack and Currently exploring, Contact form,
Footer with live Pune clock and llms.txt link.
```
