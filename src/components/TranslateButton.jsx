import React from 'react';
import { FiLoader, FiChevronRight } from 'react-icons/fi';

/**
 * TranslateButton Component
 * Triggers translation request.
 * 
 * @param {Object} props
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.disabled - Disabled state
 * @param {Function} props.onClick - Click handler
 */
export function TranslateButton({ isLoading, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      type="button"
      className="w-full sm:w-auto relative inline-flex items-center justify-center px-6 py-3 rounded-xl
                 font-semibold text-sm text-white shadow-md shadow-indigo-500/10 cursor-pointer
                 bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600
                 hover:from-indigo-500 hover:via-indigo-500 hover:to-purple-500
                 active:scale-[0.98]
                 disabled:from-zinc-300 disabled:to-zinc-300 dark:disabled:from-zinc-800 dark:disabled:to-zinc-800
                 disabled:text-zinc-500 dark:disabled:text-zinc-600 disabled:shadow-none disabled:cursor-not-allowed
                 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-2 dark:focus:ring-offset-zinc-950
                 transition-all duration-200"
    >
      {isLoading ? (
        <span className="flex items-center space-x-2">
          <FiLoader className="w-4 h-4 animate-spin" />
          <span>Translating...</span>
        </span>
      ) : (
        <span className="flex items-center space-x-1.5">
          <span>Translate</span>
          <FiChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </span>
      )}
    </button>
  );
}

export default TranslateButton;
