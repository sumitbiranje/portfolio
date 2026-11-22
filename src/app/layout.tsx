import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { MotionProvider } from "@/lib/motion";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Loader } from "@/components/Loader";
import { Nav } from "@/components/Nav";
import { MotionToggle } from "@/components/MotionToggle";
import { Footer } from "@/components/Footer";
import { SITE_URL, links, person } from "@/content/site";
import "@/styles/globals.scss";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-grotesk",
  // "optional" avoids a late font swap re-painting the hero name (keeps LCP = first paint)
  display: "optional",
});
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dmsans", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap", weight: ["400", "500"] });

const title = `${person.name}: AI Engineer for agentic systems, RAG & knowledge graphs`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s · ${person.name}` },
  description: person.description,
  keywords: [
    "freelance AI engineer",
    "AI engineer for hire India",
    "agentic AI developer",
    "multi-agent systems",
    "RAG developer",
    "LangGraph developer",
    "MCP server developer",
    "knowledge graph Neo4j",
    "AI for software testing",
    "LLM engineer Pune",
  ],
  authors: [{ name: person.name, url: links.linkedin }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title,
    description: person.description,
    siteName: person.name,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title, description: person.description, creator: "@biranje_sumit" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050507",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: person.name,
      jobTitle: person.title,
      description: person.description,
      url: SITE_URL,
      email: `mailto:${person.email}`,
      address: { "@type": "PostalAddress", addressLocality: "Pune", addressRegion: "Maharashtra", addressCountry: "IN" },
      worksFor: { "@type": "Organization", name: "KPIT Technologies" },
      sameAs: [links.linkedin, links.github],
      knowsAbout: ["Agentic AI", "Multi-agent systems", "Retrieval-augmented generation", "Knowledge graphs", "Neo4j", "LangGraph", "Model Context Protocol", "Software testing"],
    },
    {
      "@type": "ProfessionalService",
      name: `${person.name}, AI Engineering`,
      url: SITE_URL,
      provider: { "@id": `${SITE_URL}/#person` },
      areaServed: "Worldwide",
      serviceType: ["AI agent development", "RAG systems", "Knowledge graph engineering", "AI for QA", "LLM production hardening"],
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-motion="on"
      className={`${grotesk.variable} ${dmSans.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <MotionProvider>
          <SmoothScroll />
          <Loader />
          <div className="columns" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="grain" aria-hidden="true" />
          <Nav />
          <main id="main">{children}</main>
          <Footer />
          <MotionToggle />
        </MotionProvider>
      </body>
    </html>
  );
}
