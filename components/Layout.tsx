import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X, Search, ChevronRight } from 'lucide-react';
import Sidebar from './Sidebar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Helper to get breadcrumb name
  const getPageTitle = () => {
    if (location.pathname === '/') return 'Accueil';
    if (location.pathname.startsWith('/directory')) return 'Catégories';
    if (location.pathname.startsWith('/article')) return 'Article';
    if (location.pathname.startsWith('/tags')) return 'Tags';
    return 'Page';
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-[#151518] text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[280px] flex-shrink-0 z-30 relative shadow-xl">
        <Sidebar />
      </aside>

      {/* Mobile Drawer */}
      <div className={`md:hidden fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
        <div className="relative w-72 h-full shadow-2xl">
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-2 right-2 p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white z-50"
          >
            <X className="w-6 h-6" />
          </button>
          <Sidebar onClose={() => setMobileMenuOpen(false)} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#1b1b1e]">
        
        {/* Top Header / Breadcrumbs */}
        <header className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-800/60 bg-white/50 dark:bg-[#1b1b1e]/50 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center">
            <button 
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden mr-4 text-slate-500 dark:text-slate-400"
            >
                <Menu className="w-6 h-6" />
            </button>
            <nav className="hidden sm:flex text-sm font-medium text-slate-500 dark:text-slate-400 items-center">
                <Link to="/" className="hover:text-n7-600 transition-colors">N7sight</Link>
                <ChevronRight className="w-4 h-4 mx-2 text-slate-300 dark:text-slate-600" />
                <span className="text-slate-800 dark:text-slate-200">{getPageTitle()}</span>
            </nav>
          </div>

          <div className="flex items-center">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-n7-600 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    className="pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-[#252529] border border-transparent focus:border-n7-600/50 rounded-full text-sm w-40 sm:w-64 outline-none transition-all text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:bg-white dark:focus:bg-black/20 focus:ring-2 focus:ring-n7-600/10"
                />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent p-4 sm:p-8">
          <div className="max-w-6xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;