import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useArticles } from '../context/ArticleContext';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { Calendar, Clock, User, Tag, FolderOpen, Loader2 } from 'lucide-react';
import AiAssistant from '../components/AiAssistant';

const ArticleView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { articles, isLoading } = useArticles();
  
  const article = articles.find(a => a.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-n7-600" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-4">Article Non Trouvé</h2>
        <Link to="/" className="text-n7-600 hover:text-n7-700 font-medium">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
             <Link to={`/directory/${encodeURIComponent(article.directory)}`} className="flex items-center hover:text-n7-500 transition-colors uppercase tracking-wider text-xs font-bold">
               <FolderOpen className="w-3.5 h-3.5 mr-1.5" />
               {article.directory}
             </Link>
             <span>•</span>
             <span className="flex items-center">
               <Calendar className="w-3.5 h-3.5 mr-1.5" />
               {new Date(article.date).toLocaleDateString('fr-FR')}
             </span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-slate-600 dark:text-slate-400 text-sm border-b border-slate-200 dark:border-slate-800 pb-8">
            <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3 text-indigo-600 dark:text-indigo-400">
                    <User className="w-4 h-4" />
                </div>
                <div>
                    <span className="block text-xs text-slate-400 uppercase tracking-wide">Écrit par</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200">{article.author}</span>
                </div>
            </div>
            <div className="flex items-center pl-6 border-l border-slate-200 dark:border-slate-800">
                <Clock className="w-4 h-4 mr-2" />
                {article.readTime} de lecture
            </div>
        </div>
      </div>

      {/* Hero Image (contained) */}
      <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-12 shadow-lg">
          <img 
            className="w-full h-full object-cover" 
            src={article.coverImage} 
            alt={article.title} 
          />
      </div>

      {/* Content */}
      <div className="max-w-4xl">
        <div className="bg-transparent">
          <MarkdownRenderer content={article.content} />

          {/* Tags Footer */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/60">
             <div className="flex items-center flex-wrap gap-2">
               <Tag className="w-4 h-4 text-slate-400 mr-2" />
               {article.tags.map(tag => (
                 <Link 
                   to={`/tags/${encodeURIComponent(tag)}`}
                   key={tag} 
                   className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm hover:bg-n7-50 dark:hover:bg-slate-700 hover:text-n7-600 transition-colors cursor-pointer border border-transparent hover:border-n7-200 dark:hover:border-slate-600"
                 >
                   #{tag}
                 </Link>
               ))}
             </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Floating Widget */}
      <AiAssistant articleContent={article.content} />
    </div>
  );
};

export default ArticleView;