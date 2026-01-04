/// <reference types="vite/client" />
import { Article } from '../types';
import { DIRECTORY_MAPPING } from '../constants';

export const parseFrontmatter = (text: string) => {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = text.match(frontmatterRegex);

  if (!match) {
    return { metadata: {}, content: text };
  }

  const rawMetadata = match[1];
  const content = match[2];
  const metadata: Record<string, any> = {};

  rawMetadata.split('\n').forEach(line => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let value = parts.slice(1).join(':').trim();

      // Handle arrays (simple bracket style [a, b, c])
      if (value.startsWith('[') && value.endsWith(']')) {
        const arrayContent = value.substring(1, value.length - 1);
        metadata[key] = arrayContent.split(',').map(item => item.trim());
      } else {
        metadata[key] = value;
      }
    }
  });

  return { metadata, content };
};

export const fetchArticle = async (path: string): Promise<Article | null> => {
  try {
    // Sanitize path: Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    
    // In production (Vite), we need to prepend the Base URL
    const finalPath = import.meta.env.BASE_URL + cleanPath;

    const response = await fetch(finalPath);
    if (!response.ok) throw new Error(`Failed to load ${finalPath}`);
    const text = await response.text();
    
    const { metadata, content } = parseFrontmatter(text);
    
    // Extract Directory from path (e.g. /posts/informatique/file.md -> informatique)
    const pathParts = path.split('/');
    const folderName = pathParts[pathParts.length - 2];
    const fileName = pathParts[pathParts.length - 1].replace('.md', '');
    
    // Map folder name to pretty name, or capitalize if not found
    let directoryName = DIRECTORY_MAPPING[folderName];
    
    if (!directoryName) {
        // Fallback: "my-new-subject" -> "My New Subject"
        directoryName = folderName
            .split(/[-_]/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    return {
      id: path, // Use path as ID
      slug: fileName,
      title: metadata.title || 'Untitled',
      excerpt: metadata.excerpt || '',
      content: content,
      author: metadata.author || 'Anonymous',
      date: metadata.date || new Date().toISOString(),
      readTime: metadata.readTime || '5 min',
      // Tags are now dynamically set to the directory name only, ensuring strict 1-to-1 mapping
      tags: [directoryName],
      directory: directoryName,
      coverImage: metadata.coverImage || 'https://picsum.photos/800/400',
    };
  } catch (error) {
    console.error("Error loading article:", error);
    return null;
  }
};