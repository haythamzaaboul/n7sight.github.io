import React from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '../context/ArticleContext';
import { Calendar, FolderOpen, ArrowRight, Loader2 } from 'lucide-react';

const Home: React.FC = () => {
  const { articles, isLoading } = useArticles();

  // Extract all unique tags for the widget
  const allTags = Array.from(new Set(articles.flatMap(a => a.tags)));

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-n7-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in pb-12">
      
      {/* Main Feed Column */}
      <div className="flex-1 space-y-4">
        
        {articles.map((article) => (
          <div 
            key={article.id} 
            className="group bg-white dark:bg-[#252529] rounded-xl p-6 border border-slate-200 dark:border-slate-800/60 hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-black/20 transition-all duration-300"
          >
            <div className="flex flex-col">
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-3 space-x-4">
                    <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        {new Date(article.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <Link 
                        to={`/directory/${encodeURIComponent(article.directory)}`}
                        className="flex items-center hover:text-n7-500 transition-colors"
                    >
                        <FolderOpen className="w-3.5 h-3.5 mr-1.5" />
                        {article.directory}
                    </Link>
                </div>

                <Link to={`/article/${article.slug}`} className="block group-hover:translate-x-1 transition-transform duration-300">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3 font-serif leading-tight group-hover:text-n7-600 dark:group-hover:text-n7-500 transition-colors">
                        {article.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
                        {article.excerpt}
                    </p>
                </Link>

                <div className="mt-5 flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                        {article.tags.slice(0, 3).map(tag => (
                            <Link 
                                to={`/tags/${encodeURIComponent(tag)}`}
                                key={tag} 
                                className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium hover:bg-n7-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                {tag}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        ))}

        {articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">Aucun article chargé. Vérifiez constants.ts.</p>
          </div>
        )}
      </div>

      {/* Right Sidebar Widgets */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        
        {/* Recently Updated Widget */}
        <div className="bg-white dark:bg-[#252529] rounded-xl p-5 border border-slate-200 dark:border-slate-800/60">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Récemment Mis à Jour</h3>
            <ul className="space-y-4">
                {articles.slice(0, 3).map(article => (
                    <li key={article.id} className="group">
                        <Link to={`/article/${article.slug}`} className="block">
                            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-n7-600 dark:group-hover:text-n7-400 transition-colors line-clamp-2">
                                {article.title}
                            </h4>
                            <span className="text-xs text-slate-400 mt-1 block">
                                {new Date(article.date).toLocaleDateString('fr-FR')}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>

        {/* Trending Tags Widget */}
        <div className="bg-white dark:bg-[#252529] rounded-xl p-5 border border-slate-200 dark:border-slate-800/60">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Tags Populaires</h3>
            <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                    <Link 
                        to={`/tags/${encodeURIComponent(tag)}`}
                        key={tag}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-n7-50 dark:hover:bg-slate-800 hover:border-n7-200 dark:hover:border-slate-600 cursor-pointer transition-all"
                    >
                        {tag}
                    </Link>
                ))}
            </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-n7-900 to-slate-900 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-white opacity-10 rounded-full blur-xl"></div>
            <h3 className="font-serif font-bold text-lg mb-2 relative z-10">Pourquoi N7sight ?</h3>
            <p className="text-xs text-slate-300 leading-relaxed relative z-10 opacity-90">
                Pour combler le fossé entre la théorie abstraite et l'intuition de l'ingénieur.
            </p>
            <Link to="/article/about" className="inline-flex items-center text-xs font-bold text-n7-300 mt-3 hover:text-white transition-colors relative z-10">
                Notre philosophie <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
        </div>

      </div>
    </div>
  );
};

export default Home;