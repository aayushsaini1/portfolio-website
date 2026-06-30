import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const contentDirectory = path.join(process.cwd(), 'content');

export function getHeroData() {
  const filePath = path.join(contentDirectory, 'hero.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  return {
    ...data,
    title: content.trim()
  };
}

export function getAboutData() {
  const filePath = path.join(contentDirectory, 'about.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  return {
    ...data,
    content: content.trim()
  };
}

export function getWorkData() {
  const filePath = path.join(contentDirectory, 'work.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export function getExperienceData() {
  const filePath = path.join(contentDirectory, 'experience.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const experiences = JSON.parse(fileContents);

  return experiences.map((exp) => {
    try {
      const descPath = path.join(contentDirectory, 'experience', `${exp.slug}.md`);
      if (fs.existsSync(descPath)) {
        const descContents = fs.readFileSync(descPath, 'utf8');
        exp.descriptionHtml = marked.parse(descContents);
      } else {
        exp.descriptionHtml = '';
      }
    } catch (e) {
      exp.descriptionHtml = '';
    }
    return exp;
  });
}

export function getToolsData() {
  const filePath = path.join(contentDirectory, 'tools.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export function getContactData() {
  const filePath = path.join(contentDirectory, 'contact.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);
  return data;
}

export function getWorkDetailHtml(id) {
  try {
    const filePath = path.join(contentDirectory, 'work', `${id}.md`);
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      return {
        metadata: data,
        htmlContent: marked.parse(content)
      };
    }
  } catch (e) {
    console.error(`Error loading work details for project ${id}:`, e);
  }
  return null;
}
