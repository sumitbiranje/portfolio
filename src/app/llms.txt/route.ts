import { SITE_URL, exploring, links, person, projects, services, stack } from "@/content/site";

// Plain-markdown summary of the site for AI agents and LLM crawlers (llmstxt.org).
const buildLlmsText = () =>
  [
    `# ${person.name}`,
    "",
    `> ${person.description}`,
    "",
    `${person.title} based in ${person.location}. Available for freelance and contract projects worldwide; also open to full-time AI Engineer roles.`,
    `Contact: ${person.email} · LinkedIn: ${links.linkedin} · GitHub: ${links.github}`,
    "",
    "## Services",
    ...services.map((service) => `- **${service.title}**: ${service.pitch}`),
    "",
    "## Case studies",
    ...projects.map((project) => `- [${project.title}](${SITE_URL}/work/${project.slug}): ${project.tagline} Stack: ${project.stack.join(", ")}.`),
    "",
    "## Experience",
    "- Sr. Engineer, AI Engineering, KPIT Technologies, Pune (Apr 2025 – present)",
    "- Infotainment System Test Engineer, KPIT Technologies (Jun 2023 – Mar 2025)",
    "- Trainee Engineer, KPIT Technologies (Jan 2022 – May 2023)",
    "- Intern, KPIT Technologies (2021)",
    "",
    "## Skills",
    ...stack.map((group) => `- ${group.group}: ${group.items.join(", ")}`),
    `- Currently exploring: ${exploring.join(", ")}`,
    "",
  ].join("\n");

export function GET() {
  return new Response(buildLlmsText(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
