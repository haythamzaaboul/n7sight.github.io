/**
 * ARTICLE REGISTRY
 * 
 * AUTOMATIC TAGGING SYSTEM:
 * 1. Create a folder in 'posts/' (e.g., 'posts/artificial-intelligence/').
 * 2. Create a .md file inside it.
 * 3. Add the path to that file in the list below.
 * 
 * The system will automatically:
 * - Create a tag named after the folder (e.g., "Artificial Intelligence").
 * - Create a directory category for it.
 * - Remove it if you delete the file/folder or remove it from this list.
 */

export const ARTICLE_PATHS = [
  '/posts/general/about.md',
  '/posts/telecommunication/intro-au-monde-de-la-telecommunication.md',
];

// Optional: Use this to override specific folder names if the auto-formatter isn't enough.
export const DIRECTORY_MAPPING: Record<string, string> = {
  'informatique': 'Informatique',
  'meca-flu': 'Méca Flu',
  'traitement-du-signal': 'Traitement du Signal',
  'mathematiques': 'Mathématiques',
  'electronique': 'Électronique',
  'sciences-humaines': 'Sciences Humaines',
  'general': 'Général',
  'telecommunication': 'Télécommunication',
};
