import React from 'react';
import { FiGlobe } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';

/**
 * Header Component
 * Renders the top navigation bar with branding and theme actions.
 * 
 * @param {Object} props
 * @param {boolean} props.darkMode
 * @param {Function} props.setDarkMode
 * @param {Function} props.onOpenHistory - Opens recent/favorites panel
 */
export function Header({ darkMode, setDarkMode, onOpenHistory }) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Branding Logo */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-600 
                          flex items-center justify-center text-white shadow-md shadow-indigo-500/10">
            <FiGlobe className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-50 dark:to-zinc-300">
              Lingo<span className="text-indigo-600 dark:text-indigo-400">SaaS</span>
            </span>
            <span className="ml-1.5 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
              v1.0
            </span>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenHistory}
            type="button"
            className="px-3.5 py-2 rounded-xl text-sm font-medium border border-zinc-200/60 dark:border-zinc-800/60
                       bg-white/40 dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400
                       hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-900
                       focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500
                       transition-all duration-200"
          >
            History & Favorites
          </button>
          
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </div>
    </header>
  );
}

export default Header;
