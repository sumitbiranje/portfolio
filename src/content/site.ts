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
    proof: "Code → graph pipeline · Neo4j / FalkorDB",
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
};

export const projects: Project[] = [
  {
    slug: "regression-test-selection",
    index: "01",
    title: "Smart Regression Test Selection",
    tagline: "When a build changes, which of thousands of tests actually need to run?",
    challenge:
      "Running the full regression suite on every software build is slow and expensive. Teams needed to know exactly which tests a code change could affect, without guessing.",
    approach: [
      "Diff two software builds and extract the code entities that changed.",
      "Trace each change through a code knowledge graph (FalkorDB / Neo4j) using node traversal to find everything it touches.",
      "Map the impacted entities to the tests that exercise them and return a minimal, justified test set.",
      "Run it as a crash-resilient, checkpointed pipeline so long jobs resume instead of restarting.",
    ],
    outcome:
      "Test selection becomes evidence-based: each selected test links back to the code change that triggered it.",
    reuse: "Any team with a large codebase and a slow CI suite can use the same change-impact approach.",
    stack: ["Python", "FalkorDB", "Neo4j", "tree-sitter", "DuckDB", "Streamlit"],
    diagram: "selection",
  },
  {
    slug: "code-knowledge-graph",
    index: "02",
    title: "Codebase → Knowledge Graph",
    tagline: "Making a multi-language codebase queryable as a graph.",
    challenge:
      "A large automotive codebase spans Java, Kotlin, C, C++, XML and HAL layers. Understanding how a method is used across files and layers was manual, slow work.",
    approach: [
      "Parse every language with tree-sitter and custom import resolvers.",
      "Link each method definition to its usages across files.",
      "Ingest nodes, properties and relationships into a graph covering every layer: application, services, frameworks, ISP/BSP and HAL.",
    ],
    outcome:
      "One graph that answers 'what uses this, and what does it break?' It powers the regression test selector.",
    reuse: "The same pipeline fits code search, onboarding assistants and architecture audits.",
    stack: ["Python", "tree-sitter", "Neo4j", "FalkorDB", "Multi-language parsing"],
    diagram: "graph",
  },
  {
    slug: "requirement-traceability",
    index: "03",
    title: "Requirement-to-Code Traceability Agent",
    tagline: "An agent that reads the code and maps every requirement to where it lives.",
    challenge:
      "Proving that each software requirement is implemented, and finding where, meant cross-reading specs and code by hand.",
    approach: [
      "An agent explores a module's codebase and extracts its behaviour flow and sequence.",
      "It cross-references requirement (SRS) and design (SDS) specifications to understand how internal and external components interact.",
      "Each requirement is mapped one by one to the code elements that implement it.",
    ],
    outcome: "Traceability becomes a generated, reviewable artefact instead of a spreadsheet exercise.",
    reuse: "Fits any regulated or spec-heavy domain: automotive, medical, fintech, enterprise.",
    stack: ["Python", "Multi-agent framework", "SRS / SDS analysis"],
    diagram: "trace",
  },
  {
    slug: "multi-agent-test-reviewer",
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
  { group: "Tools", items: ["tree-sitter", "DuckDB", "Streamlit", "Git / GitLab", "Postman", "Claude Code", "Codex"] },
] as const;

export const exploring = ["LoRA / QLoRA fine-tuning", "vLLM & quantization", "Ollama, air-gapped inference", "Docker, CI/CD & MLOps"] as const;
