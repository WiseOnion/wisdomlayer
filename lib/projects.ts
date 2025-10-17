import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const projectsDirectory = path.join(process.cwd(), 'content/projects');

export interface Project {
  slug: string;
  title: string;
  short_description: string;
  tags: string[];
  price_estimate: string;
  client_name: string;
  project_date: string;
  published: boolean;
  content: string;
  challenge?: string;
  solution?: string;
  results?: string;
  testimonial?: string;
  tech_stack?: string[];
}

export function getAllProjects(): Project[] {
  try {
    if (!fs.existsSync(projectsDirectory)) {
      return [];
    }

    const fileNames = fs.readdirSync(projectsDirectory);
    const projects = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(projectsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
          slug,
          title: data.title || '',
          short_description: data.short_description || '',
          tags: data.tags || [],
          price_estimate: data.price_estimate || '',
          client_name: data.client_name || '',
          project_date: data.project_date || '',
          published: data.published !== false,
          content,
          challenge: data.challenge,
          solution: data.solution,
          results: data.results,
          testimonial: data.testimonial,
          tech_stack: data.tech_stack || []
        } as Project;
      })
      .filter(project => project.published);

    return projects.sort((a, b) => b.project_date.localeCompare(a.project_date));
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
}

export function getProjectBySlug(slug: string): Project | null {
  try {
    const fullPath = path.join(projectsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || '',
      short_description: data.short_description || '',
      tags: data.tags || [],
      price_estimate: data.price_estimate || '',
      client_name: data.client_name || '',
      project_date: data.project_date || '',
      published: data.published !== false,
      content,
      challenge: data.challenge,
      solution: data.solution,
      results: data.results,
      testimonial: data.testimonial,
      tech_stack: data.tech_stack || []
    } as Project;
  } catch (error) {
    console.error('Error loading project:', error);
    return null;
  }
}

export function getProjectImages(slug: string): string[] {
  const imagesPath = path.join(process.cwd(), 'public', 'images', 'projects', slug);
  
  if (!fs.existsSync(imagesPath)) {
    return [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=800&fit=crop'
    ];
  }

  const files = fs.readdirSync(imagesPath);
  const imageFiles = files.filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
  
  return imageFiles.map(file => `/images/projects/${slug}/${file}`);
}