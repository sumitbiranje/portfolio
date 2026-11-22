# Sumit Biranje: Positioning and Audience (Step 2)

> Builds on `01-profile.md`. This decides **who the site talks to, what it sells, and how it's structured**.

## 1. Decisions (from you)

| Question | Answer | What it means for the site |
|---|---|---|
| Primary audience | **Freelance / contract clients** | Write it like a services site, not a CV. Lead with problems solved and outcomes. |
| Job status | **Quietly open**: AI Engineer, any location | No "Open to work" banner. One soft line near the contact section. |
| Project disclosure | Everything, **without confidential details** | Generic case studies: problem, approach, architecture, outcome. No code, data, client names or internal tool names. |
| GitHub | `sumitbiranje` | Link it, but tidy it up first (see §8). |
| Personality | **Gaming** | Use it for flavour and maybe the design concept (see §7). |

---

## 2. Positioning statement

**For** startups, product teams and engineering orgs that want AI to *actually work in production*,
**Sumit** is an AI Engineer who builds **agentic systems, RAG pipelines and knowledge-graph tooling**,
**unlike** prototype-only builders, because he brings **5 years of software quality discipline**: evaluation, guardrails and reliability baked in.

**Headline options (hero):**
1. **"I build AI agents that don't break in production."** ← recommended
2. "Agentic AI systems, built with a tester's paranoia."
3. "From prototype to production-grade AI: agents, RAG and knowledge graphs."

**Sub-headline:**
> AI Engineer from Pune, India. I design multi-agent systems, RAG pipelines and code knowledge graphs, and I test them like they'll fail, so they don't.

## 3. Ideal clients

1. **SaaS startups and product teams** adding AI features: assistants, copilots, document Q&A.
2. **Engineering and QA organisations** (automotive, embedded, enterprise) wanting AI for test, review and traceability work. This is your **unfair advantage**: you've done the job you're automating.
3. **Companies with internal knowledge problems**: big codebases or document sets that need RAG or graph-based search.
4. **Agencies** needing a contract AI engineer to deliver agent or LLM projects.

## 4. Services (what you sell)

| Service | One-line pitch | Proof (from your work) |
|---|---|---|
| **Agentic workflow development** | Multi-agent systems with tool calling, MCP servers, memory and routing. | 7-agent test case reviewer, requirement-traceability agent |
| **RAG and knowledge systems** | Retrieval that answers correctly: hybrid search, re-ranking, graph-enhanced RAG. | RAG systems and agent memory in production |
| **Code intelligence and knowledge graphs** | Turn a codebase into a queryable graph for impact analysis and search. | Code-to-knowledge-graph pipeline, regression test selection |
| **AI for QA and testing** | Automate test review, test selection, automation-feasibility checks and traceability. | 4 shipped QA-automation tools |
| **Production hardening** | Evals, guardrails, observability and cost control for existing LLM apps. | "Ship with evaluation, observability and guardrails" |

**Engagement types:** fixed-scope project · monthly retainer · hourly consulting / architecture review. Leave prices off the site; say "Let's scope it".

## 5. Case studies (sanitised)

**Rules:** no employer-internal tool names, client or OEM names, code, screenshots of internal UIs, or exact internal metrics unless approved. KPIT can be named as employer ✅. Share every detail that doesn't break data policy. Use **redrawn diagrams** and **ballpark outcomes** ("hours → minutes").

| # | Public title | Client-facing framing |
|---|---|---|
| 1 | **Smart Regression Test Selection** | "When a build changes, which of thousands of tests actually need to run?" Build diff → changed entities → graph traversal → minimal test set. |
| 2 | **Codebase → Knowledge Graph** | "Making a multi-language codebase (Java, Kotlin, C/C++, XML, HAL) queryable as a graph." |
| 3 | **Requirement-to-Code Traceability Agent** | "An agent that reads the code and maps every requirement to where it lives." |
| 4 | **7-Agent Test Case Reviewer** | "Replacing slow peer review with seven specialised AI reviewers and structured reports." |
| 5 | **Automation Feasibility Analyzer** | "Which manual tests are worth automating? A per-test verdict with reasoning." |

**Case study template (one per project):**
`Challenge → Approach (architecture diagram) → Stack → Outcome → What I'd reuse for your project`

**[ADD later]** Ballpark outcomes, for example "~X% fewer tests per build", "review time from ~hours to ~minutes", "Y modules mapped".

## 6. Site structure (sections in scroll order)

1. **Loader**: short, on theme (gaming-style "loading level…" if we use the concept).
2. **Hero**: headline, sub-headline, photo, 2 CTAs: **"Start a project"** and **"See my work"**.
3. **Proof bar**: 5+ yrs in industry · 5 AI systems shipped · 7-agent architecture · 6+ languages in one graph.
4. **Services**: the 5 cards from §4.
5. **Selected work**: 5 case studies, each with its own sub-page (`/work/[slug]`).
6. **How I work**: Discover → Prototype → Evaluate → Harden → Ship (tester DNA shows here).
7. **Story / About**: Intern → Trainee → Test Engineer → Sr. AI Engineer ("I spent years breaking software. Now I build AI that understands it.") plus gaming.
8. **Stack**: grouped skills, with logos or icons.
9. **Currently exploring**: fine-tuning, vLLM, Ollama, MLOps (shows growth).
10. **Contact**: short form (name, email, project type, budget range, message) plus email and LinkedIn. Soft line: *"Also open to the right full-time AI Engineer role."*
11. **Footer**: LinkedIn, GitHub, X, email, `llms.txt` link.

Optional later: **/notes** blog (writing about agents and RAG helps SEO and freelance credibility a lot).

## 7. Personality: using gaming

Two options. Pick in Step 3.

- **A. Light touch:** a small "Off-duty: gamer 🎮" note in About, plus subtle hover sounds or a Konami-code easter egg.
- **B. Design concept:** career as a **game progression**. Levels: *Lv.1 Intern → Lv.2 Trainee → Lv.3 Test Engineer (boss: bugs) → Lv.4 AI Engineer*. Skills as a skill tree, projects as "quests", a HUD-style UI on a futuristic dark theme. Memorable, but it needs restraint so it still reads as **professional to clients**.

Recommendation: **B, done subtly.** Keep it a dark, premium, futuristic site with game-UI *details* (HUD frames, level labels, a skill tree), not a cartoon game.

## 8. Fix before launch (consistency)

- **LinkedIn URL:** the correct one is `linkedin.com/in/sumit-biranje-` ✅. **TODO:** update the old link (`…-154101206/`) on your GitHub profile.
- **GitHub cleanup (you'll do this later):** add a bio ("AI Engineer · Agentic systems, RAG, knowledge graphs"), location and a profile README. Pin your best repos. Add descriptions to `resume`, `iron-log` and `my-youtube`. Consider publishing 1–2 **public demo projects** (for example a small MCP server or a graph-RAG demo with generic data), because freelance clients will check your GitHub.
- **X handle:** `@biranje_sumit` is linked from GitHub. Add it to the site only if you're active there.
- Use a **professional contact email** on the site (Gmail is fine, or a domain email later, like hello@yourdomain).

## 9. SEO / AIO keywords to target
`AI engineer for hire India` · `freelance AI engineer` · `agentic AI developer` · `multi-agent systems developer` · `RAG developer` · `LangGraph developer` · `MCP server developer` · `knowledge graph Neo4j developer` · `AI for software testing` · `LLM engineer Pune`

## 10. Tone of voice
Confident, plain English, specific. Talk about outcomes, not buzzwords. A little dry humour from the "tester who breaks things" angle. No hype like "revolutionary" or "cutting-edge".
