import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FolderOpen, Tag, Info, Github, Linkedin, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Sidebar: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <Link
      to={to}
      onClick={onClose}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
        isActive(to)
          ? 'bg-n7-600/10 text-n7-600 dark:text-n7-400 font-medium'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive(to) ? 'text-n7-600 dark:text-n7-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
      <span className="text-sm tracking-wide">{label}</span>
    </Link>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#1b1b1e] border-r border-slate-200 dark:border-slate-800 w-full">
      {/* Profile Section */}
      <div className="flex flex-col items-center px-6 pt-10 pb-8 text-center">
        <div className="relative w-32 h-32 mb-6 group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-n7-600 to-indigo-600 blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative w-full h-full rounded-full bg-slate-200 dark:bg-slate-800 p-1">
                <img 
                    src="https://ui-avatars.com/api/?name=N7sight&background=0f172a&color=fff&size=256" 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-700"
                />
            </div>
        </div>
        <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          N7sight
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
          Étudiant Ingénieur <br/>
          <span className="text-n7-600 dark:text-n7-400">@ENSEEIHT</span>
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide">
        <NavItem to="/" icon={Home} label="ACCUEIL" />
        <NavItem to="/directory" icon={FolderOpen} label="CATÉGORIES" />
        <NavItem to="/tags" icon={Tag} label="TAGS" /> 
        <NavItem to="/article/about" icon={Info} label="À PROPOS" />
      </nav>

      {/* Footer / Socials */}
      <div className="p-6 border-t border-slate-200 dark:border-slate-800/50">
        <div className="flex justify-center space-x-6">
            <button 
                onClick={toggleTheme}
                className="text-slate-400 hover:text-n7-600 dark:hover:text-n7-400 transition-colors"
                aria-label="Toggle Theme"
            >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <a href="#" className="text-slate-400 hover:text-n7-600 dark:hover:text-n7-400 transition-colors">
                <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-n7-600 dark:hover:text-n7-400 transition-colors">
                <Linkedin className="w-5 h-5" />
            </a>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-6 opacity-60">
            © 2024 N7sight
        </p>
      </div>
    </div>
  );
};

export default Sidebar;