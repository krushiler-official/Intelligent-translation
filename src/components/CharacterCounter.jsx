import React, { useMemo } from 'react';

/**
 * CharacterCounter Component
 * Displays character usage and word count statistics.
 * 
 * @param {Object} props
 * @param {string} props.text - Current input text
 * @param {number} [props.maxLength] - Optional character limit
 */
export function CharacterCounter({ text = '', maxLength }) {
  const charCount = text.length;

  const wordCount = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(Boolean).length;
  }, [text]);

  const isOverLimit = maxLength && charCount > maxLength;

  return (
    <div className="flex items-center space-x-4 text-xs text-zinc-400 dark:text-zinc-500 font-medium select-none">
      {/* Word Count */}
      <span className="flex items-center">
        <span>{wordCount}</span>
        <span className="ml-1 text-zinc-300 dark:text-zinc-700">words</span>
      </span>

      {/* Character Count */}
      <span className="flex items-center">
        <span className={isOverLimit ? 'text-red-500 font-semibold' : ''}>
          {charCount}
        </span>
        {maxLength && (
          <>
            <span className="mx-0.5 text-zinc-300 dark:text-zinc-700">/</span>
            <span>{maxLength}</span>
          </>
        )}
        <span className="ml-1 text-zinc-300 dark:text-zinc-700">chars</span>
      </span>
    </div>
  );
}

export default CharacterCounter;
