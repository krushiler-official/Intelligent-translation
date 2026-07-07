import React from 'react';

/**
 * Footer Component
 * Renders the bottom metadata bar and keyboard shortcuts.
 */
export function Footer() {
  return (
    <footer className="w-full py-8 mt-auto border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white/20 dark:bg-zinc-950/20 text-zinc-500 dark:text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Tech Stack Info */}
        <div className="text-xs text-center md:text-left">
          <p>© {new Date().getFullYear()} LingoSaaS Inc. Built with React 19, Vite, and Tailwind CSS.</p>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="flex flex-wrap justify-center gap-4 text-xs font-medium">
          <div className="flex items-center space-x-1.5">
            <span className="px-1.5 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[10px]">
              Ctrl
            </span>
            <span>+</span>
            <span className="px-1.5 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[10px]">
              Enter
            </span>
            <span className="text-zinc-400 dark:text-zinc-500">Translate</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="px-1.5 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[10px]">
              ESC
            </span>
            <span className="text-zinc-400 dark:text-zinc-500">Clear Input</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
