import { Hero } from "@/components/sections/Hero";
import { Process, Proof, Services, Stack, Story } from "@/components/sections/Sections";
import { Work } from "@/components/sections/Work";
import { Contact } from "@/components/sections/Contact";
import { RevealRoot } from "@/components/RevealRoot";
import { ParticleField } from "@/components/ParticleField";

export default function Home() {
  return (
    <>
      <ParticleField />
      <Hero />
      <RevealRoot>
        <Proof />
        <Services />
        <Work />
        <Process />
        <Story />
        <Stack />
        <Contact />
      </RevealRoot>
    </>
  );
}
