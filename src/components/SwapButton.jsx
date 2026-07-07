import React from 'react';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';

/**
 * SwapButton Component
 * Action button to swap source and target language selections.
 * 
 * @param {Object} props
 * @param {Function} props.onClick - Swap callback handler
 * @param {boolean} [props.disabled] - Disabled state
 */
export function SwapButton({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type="button"
      className="p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60
                 bg-white/40 dark:bg-zinc-900/40 text-zinc-500 dark:text-zinc-400
                 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-900
                 disabled:opacity-40 disabled:cursor-not-allowed
                 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500
                 group transition-all duration-200 shadow-sm cursor-pointer"
      aria-label="Swap source and target languages"
    >
      <HiOutlineSwitchHorizontal 
        className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" 
      />
    </button>
  );
}

export default SwapButton;
