# Sumit Biranje: Portfolio Profile (Step 1)

> Source: resume (Nov 2026). This is the single source of facts for every later prompt and for the site copy.
> Lines marked **[CONFIRM]** need your input. Lines marked **[ADD]** are gaps worth filling.

---

## 1. Identity

| Field | Value |
|---|---|
| Full name | Sumit Tanaji Biranje |
| Display name on site | Sumit Biranje **[CONFIRM]** |
| Title | AI Engineer · LLM Engineer · Agentic AI Systems |
| Current role | Sr. Engineer, AI Engineering, KPIT Technologies, Pune (Apr 2025 to present) |
| Location | Pimpri-Chinchwad, Pune, Maharashtra, India |
| Email | sumitbiranje9@gmail.com |
| Phone | Leave **off** the public site (recommended) **[CONFIRM]** |
| LinkedIn | linkedin.com/in/sumit-biranje- ✅ (confirmed) |
| GitHub | github.com/sumitbiranje (cleanup pending) |
| X | @biranje_sumit (optional) |
| Languages | Marathi (native), Hindi (conversational), English (professional) |

## 2. One-liner and elevator pitch

**One-liner:**
> I build agentic AI systems that actually ship: multi-agent workflows, RAG and code knowledge graphs, with the reliability habits of five years in automotive software quality.

**Short bio (about 60 words):**
> I'm an AI Engineer at KPIT Technologies in Pune. I design production AI tools: multi-agent systems, custom MCP tooling, RAG pipelines and graph-powered code intelligence on FastAPI backends. I started in automotive infotainment testing, and that background shapes how I build AI: evaluation, guardrails, observability and execution you can trust.

**Long bio / story arc (for a storytelling site):**
1. **Origin (2021–2022):** Intern, then trainee at KPIT. First contact with automotive software validation. Learned to read requirement, screen-display and design documents and turn them into test cases.
2. **The tester's eye (2023–2025):** Infotainment System Test Engineer. Functional, regression and integration testing. One of the top defect loggers on the team, finding exploratory bugs beyond the planned cases. Did L1 reviews of junior engineers' test cases. Received multiple customer and management appreciations.
3. **The pivot (2025 to now):** Promoted to Sr. Engineer, AI Engineering. Took the pain points he knew from QA (slow peer reviews, choosing which regression tests to run, requirement traceability) and **automated them with agentic AI**.
4. **What's next:** Exploring fine-tuning (LoRA/QLoRA), model serving (vLLM, Ollama, quantization) and MLOps, to own the full path from model to production.

> **The hook:** *"I spent years breaking software. Now I build AI that understands it."* **[CONFIRM the tone]**

## 3. Experience (KPIT Technologies, Pune)

**Sr. Engineer, AI Engineering**: Apr 2025 to present
- Build production AI tools and internal assistants: agentic workflows with custom MCP tooling, RAG systems, and short- and long-term agent memory, on scalable FastAPI backends (sync and async Python).
- Ship with evaluation, observability and guardrails, so execution is reliable and cost-aware.

**Infotainment System Test Engineer**: Jun 2023 to Mar 2025
- Wrote functional test cases and did L1 reviews of junior engineers' cases, based on a strong understanding of the SRS.
- Ran functional, regression and integration testing for automotive infotainment software. One of the highest defect loggers on the team.
- Received multiple customer and internal-management appreciations. Unblocked critical internal features.

**Trainee Engineer**: Jan 2022 to May 2023
- Designed test cases from requirement, screen-display and design documents: single-function, interrupt-handling and multi-device-switching cases.

**Intern**: 2021
- First exposure to automotive software validation and quality workflows.

## 4. Flagship projects

> These are internal KPIT work, so there are no public code or demo links. On the site, show **architecture diagrams, flow animations and outcomes**, never proprietary code, data or client names. **[CONFIRM what you're allowed to show, and add any metrics: % tests skipped, review time saved, etc.]**

| # | Project | Problem → Solution | Stack |
|---|---|---|---|
| 1 | **AI-Assisted Regression Test Selection** | Running every regression test on every build is slow. The tool diffs two builds, extracts the changed code entities, traces their impact through a code knowledge graph by node traversal, and picks only the tests affected. Crash-resilient, checkpointed pipeline. | Python, FalkorDB, Neo4j, tree-sitter, DuckDB, Streamlit |
| 2 | **Code-to-Knowledge-Graph Pipeline** | Powers #1. Parses a multi-language codebase (Java, Kotlin, C, C++, XML, HAL) with tree-sitter and import resolvers, links definitions to their usages across files, and ingests everything into a graph from the app layer through services, frameworks and ISP/BSP down to HAL. | Python, tree-sitter, Neo4j / FalkorDB |
| 3 | **Requirement-to-Code Traceability** | An agent explores a module's code, extracts its behaviour flow and sequence, and maps each requirement to the code that implements it, cross-referencing the SRS and SDS. | Python, multi-agent framework |
| 4 | **Multi-Agent Test Case Reviewer** | Replaces slow peer review. Seven specialised review agents check manually written test cases against guidelines and traceability, and produce structured feedback reports. Parallel ingestion. | Python, OpenAI Agents SDK, Pydantic, Streamlit |
| 5 | **Automation Feasibility Analyzer** | Gives a per-test verdict, with justification, on whether a manual test can be automated, so teams can prioritise automation effort. Config-driven (schema and criteria in JSON), wizard-style UI. | Python, LangChain, Pydantic, Streamlit |

**Theme across all five:** *AI for software quality*. #1 and #2 are a matched pair (the graph plus the selector built on it), which makes a great hero case study.

**[ADD]** Any public or side projects (GitHub repos, hackathons, blog posts) to balance out the internal-only work.

## 5. Skills (grouped for the site)

- **Agentic systems:** multi-agent orchestration, MCP tools and servers, agent-as-tool, tool calling, planning and task routing, short- and long-term memory, guardrails, evaluation and observability
- **LLM frameworks:** LangChain, LangGraph, OpenAI Agents SDK, Google ADK, FastMCP, Pydantic structured output
- **Prompt engineering:** zero-, one- and few-shot, dynamic, contextual, role-based, prompt chaining
- **RAG and retrieval:** embeddings, semantic and hybrid search, re-ranking, graph-enhanced and vectorless RAG, chunking
- **Graphs and knowledge:** Neo4j, FalkorDB, Cypher, ontology and knowledge-graph design, node traversal
- **Python and backend:** async, OOP, FastAPI, Uvicorn, REST, asyncio / ThreadPoolExecutor, design patterns
- **Web, data and tools:** HTML, CSS, JS, TypeScript, PHP, MySQL, Flask, Streamlit, DuckDB, tree-sitter, Git, GitLab, Postman, JIRA, CANoe
- **AI-assisted development:** Claude Code, OpenAI Codex, GitHub Copilot
- **Currently exploring:** LoRA/QLoRA fine-tuning, vLLM, quantization, Ollama (air-gapped inference), Docker, CI/CD, MLOps

## 6. Education
- Diploma, Computer Science and Engineering: DKTE Yashwantrao Chavan Polytechnic, Ichalkaranji (78.36%)
- SSC: Govindrao High School, Ichalkaranji (72.40%)

> Tip: on the portfolio, show the institutions and leave out the percentages. Five years of industry experience matters more.

## 7. Numbers to highlight (stats section)
- **5+ years** at KPIT (2021 to now), progressing intern → trainee → test engineer → Sr. AI Engineer
- **5** production AI tools built
- **7** specialised agents in one review system
- **6+** languages parsed into one knowledge graph
- **[ADD]** impact numbers, for example "cut regression suite by X%" or "review time from X hours to Y minutes"

## 8. Open questions for Step 2 (positioning)
1. **Audience:** recruiters for AI Engineer / LLM Engineer roles, freelance or consulting clients, or networking and personal brand?
2. **Open to work?** Yes, no, or quietly open?
3. **Personality:** hobbies or anything memorable (travel, photography, Pune, Kolhapur roots…)?
4. **Photos:** do you have 3–5 good photos of yourself for the site?
5. **Links:** GitHub username and any other public profiles.
