// Single source of truth for all site copy. Facts come from 01-profile.md / 02-positioning.md.

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sumitbiranje.vercel.app";

export const person = {
  name: "Sumit Biranje",
  firstName: "Sumit",
  lastName: "Biranje",
  title: "AI Engineer",
  roles: ["AI Engineer", "LLM Engineer", "Agentic AI Systems"],
  location: "Pune, India",
  availability: "Available for projects",
  email: "sumitbiranje9@gmail.com",
  headline: "I build AI agents that don't break in production.",
  subheadline:
    "AI Engineer from Pune, India. I design multi-agent systems, RAG pipelines and code knowledge graphs, and I test them like they'll fail, so they don't.",
  // Background-removed, high-contrast grayscale headshot sampled by the hero particles
  portrait: "/photos/portrait-particles.png" as string | null,
  hook: "I spent years breaking software. Now I build AI that understands it.",
  description:
    "Freelance AI Engineer building agentic systems, RAG pipelines and knowledge-graph tooling, with 5 years of software quality discipline at KPIT Technologies.",
} as const;

export const links = {
  linkedin: "https://www.linkedin.com/in/sumit-biranje-",
  github: "https://github.com/sumitbiranje",
  x: "https://twitter.com/biranje_sumit",
  email: `mailto:${person.email}`,
} as const;

export const stats = [
  { value: 5, suffix: "+", label: "Years shipping software at KPIT" },
  { value: 5, suffix: "", label: "Production AI systems built" },
  { value: 7, suffix: "", label: "Specialised agents in one reviewer" },
  { value: 6, suffix: "+", label: "Languages parsed into one graph" },
] as const;

export type Service = {
  id: string;
  title: string;
  pitch: string;
  proof: string;
  icon: "bot" | "database" | "network" | "flask" | "shield";
};

export const services: Service[] = [
  {
    id: "agents",
    title: "Agentic workflow development",
    pitch: "Multi-agent systems with tool calling, MCP servers, memory and task routing that hold up in real use.",
    proof: "7-agent reviewer · traceability agent",
    icon: "bot",
  },
  {
    id: "rag",
    title: "RAG & knowledge systems",
    pitch: "Retrieval that answers correctly: hybrid search, re-ranking, graph-enhanced and vectorless RAG.",
    proof: "RAG + agent memory in production",
    icon: "database",
  },
  {
    id: "graphs",
    title: "Code intelligence & knowledge graphs",
    pitch: "Turn a sprawling, multi-language codebase into a queryable graph for impact analysis and search.",
    proof: "Code → graph pipeline · Eclipse JDT · FalkorDB",
    icon: "network",
  },
  {
    id: "qa",
    title: "AI for QA & testing",
    pitch: "Automate test review, test selection, automation-feasibility analysis and requirement traceability.",
    proof: "4 shipped QA-automation tools",
    icon: "flask",
  },
  {
    id: "hardening",
    title: "Production hardening",
    pitch: "Evaluation, guardrails, observability and cost control for LLM apps that already exist.",
    proof: "Evals · guardrails · observability",
    icon: "shield",
  },
];

export type Project = {
  slug: string;
  index: string;
  title: string;
  tagline: string;
  challenge: string;
  approach: string[];
  outcome: string;
  reuse: string;
  stack: string[];
  diagram: "selection" | "graph" | "trace" | "review" | "feasibility";
  repo: string;
};

export const projects: Project[] = [
  {
    slug: "regression-test-selection",
    repo: "https://github.com/sumitbiranje/ai-regression-test-selection",
    index: "01",
    title: "AI-Assisted Regression Platform",
    tagline: "Two builds in, what changed and what to re-test out, with evidence for every claim.",
    challenge:
      "Full regression of every build of a large Android-based product is too expensive, and picking tests by hand is risky. Teams needed to know what a change can actually reach, down to requirements and test cases, and why.",
    approach: [
      "Diff the two builds' manifests and git history to find changed repositories, files, lines, commits and tickets.",
      "Build a code graph per build (Eclipse JDT for Java, tree-sitter for C/C++, a cross-language linker) and map changed lines to the methods that contain them.",
      "Trace impact with guarded graph walks: dependents, interface dispatch and runtime callback links, layer by layer.",
      "Hand each ticket group to an AI agent that maps the change to requirements through a specification graph; a script derives each verdict from a fixed decision record, and gates check every claim.",
      "Fetch the linked test cases by fixed rules, flag coverage gaps with candidate scenarios, and detect changed screens for a separate UI-impact view.",
    ],
    outcome:
      "Every build gets an evidence chain from commit to ticket, code chain, requirement and test case, with coverage gaps and UI impact, as Excel, JSON and JUnit for CI.",
    reuse: "Any team with a large codebase, requirements and a slow regression suite: graph-based impact, AI judgement constrained by scripts and gates.",
    stack: ["Python", "Eclipse JDT", "FalkorDB", "AI agents + MCP", "tree-sitter", "FastAPI", "React"],
    diagram: "selection",
  },
  {
    slug: "code-knowledge-graph",
    repo: "https://github.com/sumitbiranje/code-knowledge-graph",
    index: "02",
    title: "Codebase → Knowledge Graph",
    tagline: "One precise graph per build, from Java apps down to native and hardware-abstraction code.",
    challenge:
      "A large automotive codebase spans Java, Kotlin, C/C++, interface definitions, manifests and HAL layers. Tracing a change needs calls resolved exactly: which overload, which inherited member, which implementation, across languages.",
    approach: [
      "Java goes through Eclipse JDT in its own JVM per repository, with its dependencies' source roots, so types, overloads and inherited members resolve through real bindings.",
      "C/C++ goes through tree-sitter: definitions merged with headers, calls typed where the receiver can be inferred.",
      "Light parsers cover Kotlin, interface definitions and Android manifests; a linker joins Kotlin↔Java, JNI, interface stubs and HAL implementations.",
      "Each build becomes one FalkorDB graph, cached per repository revision so new builds only re-parse what changed.",
    ],
    outcome:
      "One graph that answers 'what uses this, and what does it break?' for the whole stack. It powers the regression platform's impact tracing.",
    reuse: "The same pipeline fits code search, onboarding assistants, architecture audits and graph-RAG over code.",
    stack: ["Eclipse JDT", "tree-sitter", "FalkorDB", "Python", "Cypher"],
    diagram: "graph",
  },
  {
    slug: "requirement-traceability",
    repo: "https://github.com/sumitbiranje/requirement-traceability-agent",
    index: "03",
    title: "Requirement ⇄ Code Traceability",
    tagline: "Agents that map a change to the requirements it affects, and requirements to the code that implements them.",
    challenge:
      "Proving that each software requirement is implemented, and finding where, meant cross-reading specs and code by hand.",
    approach: [
      "Code → requirement (inside the regression platform): an agent reads a change's root cause and fix, searches the requirements graph through MCP tools, and fills a fixed decision record per candidate; a script derives the verdict.",
      "Validation gates check that every input was read, every pick is backed and every claim is quoted before the agent may finish.",
      "Requirement → code: an agent explores a module's codebase and extracts its behaviour flow and sequence.",
      "It cross-references requirement (SRS) and design (SDS) specifications to understand how internal and external components interact.",
      "Each requirement is mapped one by one to the code elements that implement it.",
    ],
    outcome: "Traceability becomes a generated, reviewable artefact instead of a spreadsheet exercise.",
    reuse: "Fits any regulated or spec-heavy domain: automotive, medical, fintech, enterprise.",
    stack: ["Python", "AI agents + MCP", "FalkorDB", "SRS / SDS analysis"],
    diagram: "trace",
  },
  {
    slug: "multi-agent-test-reviewer",
    repo: "https://github.com/sumitbiranje/multi-agent-test-case-reviewer",
    index: "04",
    title: "7-Agent Test Case Reviewer",
    tagline: "Replacing slow peer review with seven specialised AI reviewers.",
    challenge:
      "Manually written test cases needed peer review against guidelines and requirement traceability. Reviews were slow and inconsistent.",
    approach: [
      "Seven specialised review agents, each owning one quality dimension.",
      "Built on the OpenAI Agents SDK with Pydantic-structured output, so every finding is machine-readable.",
      "Parallel data ingestion keeps large review batches fast.",
    ],
    outcome: "Structured, consistent feedback reports in place of slow, variable peer review.",
    reuse: "The same reviewer pattern works for code review, document QA, compliance checks and content moderation.",
    stack: ["Python", "OpenAI Agents SDK", "Pydantic", "Streamlit"],
    diagram: "review",
  },
  {
    slug: "automation-feasibility",
    repo: "https://github.com/sumitbiranje/automation-feasibility-analyzer",
    index: "05",
    title: "Automation Feasibility Analyzer",
    tagline: "Which manual tests are worth automating? A verdict, with reasoning.",
    challenge:
      "Teams wanted to prioritise test automation but had no consistent way to judge which manual tests could be automated.",
    approach: [
      "A config-driven LangChain pipeline with schema and criteria kept in JSON, so rules change without code changes.",
      "Pydantic-validated output gives a per-test verdict with a justification.",
      "A wizard-style Streamlit UI lets non-engineers run it.",
    ],
    outcome: "A ranked, explained automation backlog instead of gut feel.",
    reuse: "Config-driven LLM classifiers like this fit triage, ticket routing and document classification.",
    stack: ["Python", "LangChain", "Pydantic", "Streamlit"],
    diagram: "feasibility",
  },
];

export const workflow = [
  { step: "01", title: "Discover", text: "Map the workflow, the data and what 'correct' means before touching a model." },
  { step: "02", title: "Prototype", text: "A thin end-to-end slice in days, so we argue about results, not slides." },
  { step: "03", title: "Evaluate", text: "Test sets, metrics and failure cases. The tester in me insists." },
  { step: "04", title: "Harden", text: "Guardrails, retries, observability and cost limits." },
  { step: "05", title: "Ship", text: "Deployed, documented and handed over, or supported on retainer." },
] as const;

export const levels = [
  {
    level: "LV.01",
    role: "Intern",
    period: "2021",
    text: "First contact with automotive software validation and quality workflows.",
    xp: 25,
  },
  {
    level: "LV.02",
    role: "Trainee Engineer",
    period: "Jan 2022 — May 2023",
    text: "Turned requirement, screen-display and design documents into test cases, including interrupt-handling and multi-device switching.",
    xp: 50,
  },
  {
    level: "LV.03",
    role: "Infotainment System Test Engineer",
    period: "Jun 2023 — Mar 2025",
    text: "Functional, regression and integration testing. One of the team's highest defect loggers; L1 reviewer for junior engineers; multiple customer appreciations.",
    xp: 75,
  },
  {
    level: "LV.04",
    role: "Sr. Engineer, AI Engineering",
    period: "Apr 2025 — Present",
    text: "Building production AI tools: agentic workflows, custom MCP tooling, RAG and agent memory on FastAPI, with evals, observability and guardrails.",
    xp: 100,
  },
] as const;

export const stack = [
  { group: "Agentic systems", items: ["Multi-agent orchestration", "MCP servers", "Tool calling", "Memory", "Guardrails", "Evals"] },
  { group: "LLM frameworks", items: ["LangChain", "LangGraph", "OpenAI Agents SDK", "Google ADK", "FastMCP", "Pydantic"] },
  { group: "RAG & retrieval", items: ["Embeddings", "Hybrid search", "Re-ranking", "Graph RAG", "Vectorless RAG", "Chunking"] },
  { group: "Graphs", items: ["Neo4j", "FalkorDB", "Cypher", "Ontology design", "Node traversal"] },
  { group: "Backend", items: ["Python (async)", "FastAPI", "Uvicorn", "REST", "asyncio", "Design patterns"] },
  { group: "Tools", items: ["Eclipse JDT", "tree-sitter", "DuckDB", "Streamlit", "Git / GitLab", "Postman", "Claude Code", "Codex"] },
] as const;

export const exploring = ["LoRA / QLoRA fine-tuning", "vLLM & quantization", "Ollama, air-gapped inference", "Docker, CI/CD & MLOps"] as const;

// Skill atlas (Embedding Atlas-style map). Positions are hand-arranged by topic in a -1..1 space:
// related skills sit close together; projects sit between the clusters they draw on.
export type AtlasFamily = "agents" | "retrieval" | "engineering" | "exploring";

export const atlasFamilies: Record<AtlasFamily, { label: string; color: string }> = {
  agents: { label: "Agents & LLMs", color: "#3987e5" },
  retrieval: { label: "Retrieval & graphs", color: "#d95926" },
  engineering: { label: "Engineering & QA", color: "#199e70" },
  exploring: { label: "Currently exploring", color: "#8a8b94" },
};

export type AtlasCluster = { id: string; label: string; family: AtlasFamily; x: number; y: number; items: readonly string[] };

export const atlasClusters: AtlasCluster[] = [
  { id: "agentic", label: "Agentic systems", family: "agents", x: -0.58, y: 0.38, items: stack[0].items },
  { id: "frameworks", label: "LLM frameworks", family: "agents", x: -0.16, y: 0.68, items: stack[1].items },
  { id: "rag", label: "RAG & retrieval", family: "retrieval", x: 0.34, y: 0.4, items: stack[2].items },
  { id: "graphs", label: "Graphs", family: "retrieval", x: 0.66, y: -0.02, items: stack[3].items },
  { id: "backend", label: "Backend", family: "engineering", x: -0.52, y: -0.38, items: stack[4].items },
  { id: "tools", label: "Tools & testing", family: "engineering", x: 0.02, y: -0.58, items: stack[5].items },
  { id: "exploring", label: "Exploring", family: "exploring", x: 0.62, y: -0.62, items: exploring },
];

export const atlasProjects: Array<{ slug: string; label: string; family: AtlasFamily; x: number; y: number }> = [
  { slug: "regression-test-selection", label: "Regression platform", family: "retrieval", x: 0.38, y: -0.3 },
  { slug: "code-knowledge-graph", label: "Code → knowledge graph", family: "retrieval", x: 0.8, y: 0.26 },
  { slug: "requirement-traceability", label: "Requirement ⇄ code", family: "agents", x: 0.08, y: 0.12 },
  { slug: "multi-agent-test-reviewer", label: "7-agent reviewer", family: "agents", x: -0.36, y: -0.02 },
  { slug: "automation-feasibility", label: "Feasibility analyzer", family: "engineering", x: -0.1, y: -0.2 },
];
