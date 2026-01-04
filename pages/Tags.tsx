import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useArticles } from '../context/ArticleContext';
import { Tag, Calendar, ArrowRight, Loader2 } from 'lucide-react';

const Tags: React.FC = () => {
  const { tag } = useParams<{ tag: string }>();
  const { articles, isLoading } = useArticles();
  
  const decodedTag = tag ? decodeURIComponent(tag) : undefined;

  const allTags = Array.from(new Set(articles.flatMap(a => a.tags))).sort();
  
  const filteredArticles = decodedTag 
    ? articles.filter(a => a.tags.includes(decodedTag))
    : [];

  if (isLoading) {
    return <div className="p-12 text-center"><Loader2 className="animate-spin w-6 h-6 inline text-n7-600"/></div>;
  }

  return (
    <div className="pb-12 animate-fade-in">
      <div className="flex items-center mb-8 pb-8 border-b border-slate-200 dark:border-slate-800/60">
        <div className="p-4 bg-white dark:bg-[#252529] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 mr-6">
          <Tag className="w-10 h-10 text-n7-600" />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
            {decodedTag ? `#${decodedTag}` : 'Tous les Tags'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            {decodedTag 
              ? `${filteredArticles.length} article${filteredArticles.length > 1 ? 's' : ''} trouvé${filteredArticles.length > 1 ? 's' : ''}`
              : 'Explorez les articles par thématiques'
            }
          </p>
        </div>
      </div>

      {!decodedTag ? (
        <div className="flex flex-wrap gap-4">
          {allTags.map(t => (
            <Link 
              key={t} 
              to={`/tags/${encodeURIComponent(t)}`}
              className="px-6 py-3 bg-white dark:bg-[#252529] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 hover:border-n7-500 dark:hover:border-n7-500 hover:text-n7-600 dark:hover:text-n7-400 transition-all shadow-sm hover:shadow-md"
            >
              #{t} <span className="ml-2 text-xs text-slate-400">({articles.filter(a => a.tags.includes(t)).length})</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredArticles.map((article) => (
            <div key={article.id} className="flex flex-col rounded-xl overflow-hidden bg-white dark:bg-[#252529] border border-slate-200 dark:border-slate-800/60 hover:border-n7-300 dark:hover:border-slate-600 hover:shadow-lg transition-all duration-300 group">
              <div className="flex-shrink-0 h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                <img className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src={article.coverImage} alt={article.title} />
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-n7-600 dark:text-n7-400 bg-n7-50 dark:bg-n7-900/20 px-2 py-1 rounded">
                      {article.directory}
                    </span>
                  </div>
                  <Link to={`/article/${article.slug}`} className="block">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 font-serif group-hover:text-n7-600 dark:group-hover:text-n7-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </Link>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                   <div className="flex items-center text-xs text-slate-400">
                       <Calendar className="w-3 h-3 mr-1.5" /> 
                       {new Date(article.date).toLocaleDateString('fr-FR')}
                   </div>
                   <Link to={`/article/${article.slug}`} className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-n7-600 transition-all">
                     <ArrowRight className="w-4 h-4" />
                   </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tags;