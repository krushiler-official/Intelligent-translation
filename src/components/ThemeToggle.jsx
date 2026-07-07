import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

/**
 * ThemeToggle Component
 * Toggles dark mode state on the document.documentElement.
 * 
 * @param {Object} props
 * @param {boolean} props.darkMode - Current theme state
 * @param {Function} props.setDarkMode - Theme state setter
 */
export function ThemeToggle({ darkMode, setDarkMode }) {
  const toggleTheme = () => {
    const nextTheme = !darkMode;
    setDarkMode(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 
                 bg-white/40 dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400
                 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-900
                 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500
                 transition-all duration-300 shadow-sm"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        {/* Sun Icon */}
        <FiSun 
          className={`w-5 h-5 absolute transition-all duration-500 transform 
            ${darkMode ? 'translate-y-8 rotate-90 opacity-0' : 'translate-y-0 rotate-0 opacity-100'}`}
        />
        {/* Moon Icon */}
        <FiMoon 
          className={`w-5 h-5 absolute transition-all duration-500 transform 
            ${darkMode ? 'translate-y-0 rotate-0 opacity-100' : '-translate-y-8 -rotate-90 opacity-0'}`}
        />
      </div>
    </button>
  );
}

export default ThemeToggle;
