import React from 'react';
import Hero from "../components/Hero";
import About from "../components/About";
import Work from "../components/Work";
import Experience from "../components/Experience";
import Experiments from "../components/Experiments";
import Contact from "../components/Contact";
import {
  getHeroData,
  getAboutData,
  getWorkData,
  getExperienceData,
  getExperimentsData,
  getContactData
} from "../lib/content";

export async function generateMetadata() {
  const heroData = getHeroData();

  return {
    title: "Aayush Saini — Lead UX Designer in Bangalore",
    description: "Portfolio of Aayush Saini, Lead UX Designer & Product Designer based in Bangalore, India. Designing practical, accessible B2B SaaS experiences & digital products.",
    openGraph: {
      title: "Aayush Saini — Lead UX Designer in Bangalore",
      description: "Portfolio of Aayush Saini, Lead UX Designer & Product Designer based in Bangalore, India.",
      type: 'website',
    },
  };
}

export default function Home() {
  const heroData = getHeroData();
  const aboutData = getAboutData();
  const workData = getWorkData();
  const experienceData = getExperienceData();
  const experimentsData = getExperimentsData();
  const contactData = getContactData();

  return (
    <>
      <Hero data={heroData} />
      <About data={aboutData} />
      <Work data={workData} />
      <Experience data={experienceData} />
      <Experiments data={experimentsData} />
      <Contact data={contactData} />
    </>
  );
}
