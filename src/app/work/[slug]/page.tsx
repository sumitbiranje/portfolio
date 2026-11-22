import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects } from "@/content/site";
import { Diagram } from "@/components/ui/Diagram";
import { RevealRoot } from "@/components/RevealRoot";
import styles from "./page.module.scss";

export const generateStaticParams = () => projects.map((project) => ({ slug: project.slug }));

const findProject = (slug: string) => projects.find((project) => project.slug === slug);

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title: project.title, description: project.tagline, url: `/work/${project.slug}` },
  };
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  const position = projects.indexOf(project);
  const next = projects[(position + 1) % projects.length];

  return (
    <RevealRoot>
      <article className={`container ${styles.page}`}>
        <Link href="/#work" className={styles.back}>
          <ArrowLeft size={16} aria-hidden="true" /> All work
        </Link>

        <header className={styles.header}>
          <span className="label" data-scramble>
            Quest {project.index} / 05 · Case study
          </span>
          <h1 className={styles.title} data-split>
            {project.title}
          </h1>
          <p className={styles.tagline} data-reveal>
            {project.tagline}
          </p>
          <ul className={styles.chips} data-reveal>
            {project.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </header>

        <figure className={styles.figure} data-reveal>
          <Diagram type={project.diagram} title={project.title} />
          <figcaption className="label">Redrawn architecture. No confidential code, data or client details.</figcaption>
        </figure>

        <div className={styles.body}>
          <section className={styles.block} data-reveal>
            <h2 className="label">01 / Challenge</h2>
            <p>{project.challenge}</p>
          </section>
          <section className={styles.block} data-reveal>
            <h2 className="label">02 / Approach</h2>
            <ol className={styles.steps}>
              {project.approach.map((step, index) => (
                <li key={step}>
                  <span className="label">{String(index + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </section>
          <section className={styles.block} data-reveal>
            <h2 className="label">03 / Outcome</h2>
            <p>{project.outcome}</p>
          </section>
          <section className={styles.block} data-reveal>
            <h2 className="label">04 / What I&apos;d reuse for your project</h2>
            <p>{project.reuse}</p>
          </section>
        </div>

        <nav className={styles.nextWrap} aria-label="Next case study">
          <Link href={`/work/${next.slug}`} className={styles.next}>
            <span className="label">Next quest · {next.index}</span>
            <span className={styles.nextTitle}>
              {next.title} <ArrowUpRight aria-hidden="true" />
            </span>
          </Link>
          <Link href="/#contact" className={styles.cta}>
            Need something like this? Start a project <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </nav>
      </article>
    </RevealRoot>
  );
}
