import { Hero } from "@/components/sections/Hero";
import { Process, Proof, Services, Stack, Story } from "@/components/sections/Sections";
import { Work } from "@/components/sections/Work";
import { Contact } from "@/components/sections/Contact";
import { RevealRoot } from "@/components/RevealRoot";

export default function Home() {
  return (
    <>
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
