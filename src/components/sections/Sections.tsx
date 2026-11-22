import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bot, Database, FlaskConical, Gamepad2, Network, ShieldCheck } from "lucide-react";
import { exploring, levels, person, services, stack, stats, workflow, type Service } from "@/content/site";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./Sections.module.scss";

const ICONS: Record<Service["icon"], typeof Bot> = {
  bot: Bot,
  database: Database,
  network: Network,
  flask: FlaskConical,
  shield: ShieldCheck,
};

export const Proof = () => (
  <section className={`container ${styles.proof}`} aria-label="Highlights">
    <dl className={styles.stats}>
      {stats.map((stat, index) => (
        <div key={stat.label} className={styles.stat} data-reveal data-delay={index * 0.08}>
          <dt className="label">{stat.label}</dt>
          <dd className={styles.statValue}>
            <span data-count={stat.value}>{stat.value}</span>
            {stat.suffix}
          </dd>
        </div>
      ))}
    </dl>
  </section>
);

export const Services = () => (
  <section id="services" className={`container ${styles.section}`} aria-labelledby="services-title">
    <SectionHead
      index="03"
      label="Services"
      aside="What I build for clients"
      titleId="services-title"
      title={
        <>
          AI that works <em>after</em> the demo.
        </>
      }
      intro="Freelance and contract engagements: fixed-scope builds, retainers or architecture reviews. Let's scope it together."
    />
    <ul className={styles.services}>
      {services.map((service, index) => {
        const Icon = ICONS[service.icon];
        return (
          <li key={service.id} className={styles.service} data-reveal data-delay={(index % 3) * 0.08}>
            <span className={styles.brackets} aria-hidden="true" />
            <div className={styles.serviceTop}>
              <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
              <span className="label">S.0{index + 1}</span>
            </div>
            <h3 className={styles.serviceTitle}>{service.title}</h3>
            <p className={styles.serviceText}>{service.pitch}</p>
            <p className={styles.proofTag}>
              <span aria-hidden="true">▸</span> {service.proof}
            </p>
          </li>
        );
      })}
      <li className={`${styles.service} ${styles.serviceCta}`} data-reveal data-delay={0.16}>
        <span className="label">Not sure what you need?</span>
        <p className={styles.serviceTitle}>
          Bring the problem. We&apos;ll scope the <em>right</em> AI for it.
        </p>
        <Link href="/#contact" className={styles.ctaLink}>
          Book a scoping call <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </li>
    </ul>
  </section>
);

export const Process = () => (
  <section id="process" className={`container ${styles.section}`} aria-labelledby="process-title">
    <SectionHead
      index="05"
      label="How I work"
      aside="Tester DNA, built in"
      titleId="process-title"
      title={
        <>
          Prototype fast. <em>Prove</em> it works.
        </>
      }
    />
    <ol className={styles.process}>
      {workflow.map((item, index) => (
        <li key={item.step} className={styles.processItem} data-reveal data-delay={index * 0.08}>
          <span className={styles.processNode} aria-hidden="true" />
          <span className="label">{item.step}</span>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </li>
      ))}
    </ol>
  </section>
);

export const Story = () => (
  <section id="story" className={`container ${styles.section}`} aria-labelledby="story-title">
    <SectionHead
      index="06"
      label="Level up"
      aside="5 years at KPIT Technologies"
      titleId="story-title"
      title={
        <>
          I spent years breaking software. Now I build AI that <em>understands</em> it.
        </>
      }
    />
    <div className={styles.story}>
      <ol className={styles.levels}>
        {levels.map((level) => (
          <li key={level.level} className={styles.level} data-reveal>
            <div className={styles.levelHead}>
              <span className={styles.levelTag}>{level.level}</span>
              <span className="label">{level.period}</span>
            </div>
            <h3>{level.role}</h3>
            <p>{level.text}</p>
            <div className={styles.xp} role="img" aria-label={`Progress ${level.xp}%`}>
              <span data-xp style={{ width: `${level.xp}%` }} />
            </div>
          </li>
        ))}
      </ol>
      <aside className={styles.side}>
        <figure className={styles.player} data-reveal>
          <span className={styles.playerHud} aria-hidden="true">
            <span>Player 01</span>
            <span>LV.04 · AI Engineer</span>
          </span>
          <Image
            src="/photos/sumit-blazer.webp"
            alt={`Portrait of ${person.name} in a grey blazer`}
            width={704}
            height={1029}
            sizes="(min-width: 1200px) 30vw, (min-width: 640px) 60vw, 90vw"
            quality={85}
          />
          <figcaption className="label">
            {person.name} · {person.location}
          </figcaption>
        </figure>
        <div className={styles.offDuty} data-reveal>
          <Image
            className={styles.offDutyPhoto}
            src="/photos/sumit-offduty.webp"
            alt={`${person.firstName} coding on a laptop in a red hoodie, with a cartoon gremlin on his shoulder`}
            width={900}
            height={882}
            sizes="(min-width: 1200px) 30vw, 90vw"
          />
          <div className={styles.offDutyBody}>
            <p className="label">
              <Gamepad2 size={16} strokeWidth={1.5} aria-hidden="true" /> Off-duty
            </p>
            <p className={styles.offDutyQuote}>
              Gamer. Same instinct as testing: find the edge cases, learn the system, then beat it.
            </p>
            <p className={styles.offDutyMeta}>
              Marathi, Hindi, English. Diploma in Computer Science &amp; Engineering, DKTE Ichalkaranji.
            </p>
          </div>
        </div>
      </aside>
    </div>
  </section>
);

export const Stack = () => (
  <section id="stack" className={`container ${styles.section}`} aria-labelledby="stack-title">
    <SectionHead
      index="07"
      label="Stack"
      aside="Tools of the trade"
      titleId="stack-title"
      title={
        <>
          The <em>toolkit</em>.
        </>
      }
    />
    <div className={styles.stack}>
      {stack.map((group) => (
        <div key={group.group} className={styles.stackGroup} data-reveal>
          <h3 className="label">{group.group}</h3>
          <ul>
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
      <div className={`${styles.stackGroup} ${styles.exploring}`} data-reveal>
        <h3 className="label">
          <span className={styles.live} aria-hidden="true" /> Currently exploring
        </h3>
        <ul>
          {exploring.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);
