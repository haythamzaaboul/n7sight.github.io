import React, { createContext, useContext, useEffect, useState } from 'react';
import { Article } from '../types';
import { ARTICLE_PATHS } from '../constants';
import { fetchArticle } from '../utils/markdownParser';

interface ArticleContextType {
  articles: Article[];
  isLoading: boolean;
  error: string | null;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const ArticleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const promises = ARTICLE_PATHS.map(path => fetchArticle(path));
        const results = await Promise.all(promises);
        
        // Filter out nulls (failed loads) and sort by date descending
        const loadedArticles = results
          .filter((a): a is Article => a !== null)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
        setArticles(loadedArticles);
      } catch (err) {
        console.error(err);
        setError("Failed to load articles.");
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  return (
    <ArticleContext.Provider value={{ articles, isLoading, error }}>
      {children}
    </ArticleContext.Provider>
  );
};

export const useArticles = () => {
  const context = useContext(ArticleContext);
  if (context === undefined) {
    throw new Error('useArticles must be used within an ArticleProvider');
  }
  return context;
};