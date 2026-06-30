import React from 'react';
import Hero from "../components/Hero";
import About from "../components/About";
import Work from "../components/Work";
import Experience from "../components/Experience";
import Tools from "../components/Tools";
import Contact from "../components/Contact";
import {
  getHeroData,
  getAboutData,
  getWorkData,
  getExperienceData,
  getToolsData,
  getContactData
} from "../lib/content";

export async function generateMetadata() {
  const heroData = getHeroData();
  const aboutData = getAboutData();
  
  // Helper to convert string to Title Case
  const toTitleCase = (str) =>
    str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  const formattedTitle = toTitleCase(heroData.title.replace(/\n/g, ' '));

  return {
    title: `${formattedTitle} - ${heroData.subtitle}`,
    description: aboutData.content,
    openGraph: {
      title: `${formattedTitle} | Portfolio`,
      description: aboutData.content,
      type: 'website',
    },
  };
}

export default function Home() {
  const heroData = getHeroData();
  const aboutData = getAboutData();
  const workData = getWorkData();
  const experienceData = getExperienceData();
  const toolsData = getToolsData();
  const contactData = getContactData();

  return (
    <>
      <Hero data={heroData} />
      <About data={aboutData} />
      <Work data={workData} />
      <Experience data={experienceData} />
      <Tools data={toolsData} />
      <Contact data={contactData} />
    </>
  );
}
