import React, { useState } from 'react';
import { FiX, FiTrash2, FiClock, FiStar, FiChevronRight, FiFolder } from 'react-icons/fi';

/**
 * HistoryPanel Component
 * Slide-out drawer displaying recent and favorited translations.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Panel open state
 * @param {Function} props.onClose - Close panel trigger
 * @param {Array} props.history - List of recent translations
 * @param {Array} props.favorites - List of favorited translations
 * @param {Function} props.onRestore - Callback when restoring a translation item
 * @param {Function} props.onClearHistory - Clear all history callback
 * @param {Function} props.onDeleteHistoryItem - Delete individual history item
 * @param {Function} props.onDeleteFavoriteItem - Remove item from favorites
 * @param {Array} props.languages - List of supported languages for display mapping
 */
export function HistoryPanel({
  isOpen,
  onClose,
  history = [],
  favorites = [],
  onRestore,
  onClearHistory,
  onDeleteHistoryItem,
  onDeleteFavoriteItem,
  languages
}) {
  const [activeTab, setActiveTab] = useState('recent'); // 'recent' | 'favorites'

  if (!isOpen) return null;

  // Helper to map language code to name
  const getLanguageName = (code) => {
    const lang = languages.find((l) => l.code === code);
    return lang ? `${lang.flag} ${lang.name}` : code.toUpperCase();
  };

  const currentList = activeTab === 'recent' ? history : favorites;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/30 dark:bg-zinc-950/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Sliding panel content */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md transform transition-all duration-300 animate-slide-up sm:duration-400">
          <div className="h-full flex flex-col bg-white dark:bg-zinc-950 border-l border-zinc-200/60 dark:border-zinc-800/60 shadow-2xl">
            
            {/* Drawer Header */}
            <div className="px-5 py-5 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50 flex items-center space-x-2">
                <FiFolder className="w-5 h-5 text-indigo-500" />
                <span>Translation Library</span>
              </h2>
              <button
                onClick={onClose}
                type="button"
                className="p-2 rounded-xl text-zinc-400 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200
                           hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                aria-label="Close library drawer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Toggles */}
            <div className="px-5 pt-3 flex border-b border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/10">
              <button
                onClick={() => setActiveTab('recent')}
                className={`flex-1 py-3 text-sm font-semibold border-b-2 flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  activeTab === 'recent'
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                <FiClock className="w-4 h-4" />
                <span>Recent ({history.length})</span>
              </button>
              
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex-1 py-3 text-sm font-semibold border-b-2 flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  activeTab === 'favorites'
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                <FiStar className="w-4 h-4" />
                <span>Favorites ({favorites.length})</span>
              </button>
            </div>

            {/* List scrollable section */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {currentList.length > 0 ? (
                currentList.map((item) => (
                  <div
                    key={item.id}
                    className="relative group rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-4 
                               bg-zinc-50/40 dark:bg-zinc-900/20 hover:bg-white dark:hover:bg-zinc-900/50
                               hover:shadow-xs transition-all duration-200 cursor-pointer"
                    onClick={() => {
                      onRestore(item);
                      onClose();
                    }}
                  >
                    {/* Language map summary */}
                    <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
                      <span>{getLanguageName(item.source)}</span>
                      <FiChevronRight className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700" />
                      <span>{getLanguageName(item.target)}</span>
                    </div>

                    {/* Content previews */}
                    <div className="space-y-1.5 pr-8">
                      <p className="text-sm text-zinc-800 dark:text-zinc-200 line-clamp-2">
                        {item.text}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 bg-zinc-100/50 dark:bg-zinc-900/40 p-2 rounded-lg mt-1">
                        {item.translation}
                      </p>
                    </div>

                    {/* Delete item button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activeTab === 'recent') {
                          onDeleteHistoryItem(item.id);
                        } else {
                          onDeleteFavoriteItem(item.id);
                        }
                      }}
                      type="button"
                      className="absolute right-3 top-3 p-2 rounded-lg opacity-0 group-hover:opacity-100
                                 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-zinc-100 
                                 dark:hover:bg-zinc-800/50 transition-all cursor-pointer"
                      title={activeTab === 'recent' ? 'Delete history item' : 'Unfavorite item'}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 select-none">
                  {activeTab === 'recent' ? (
                    <FiClock className="w-10 h-10 text-zinc-300 dark:text-zinc-800 mb-3" />
                  ) : (
                    <FiStar className="w-10 h-10 text-zinc-300 dark:text-zinc-800 mb-3" />
                  )}
                  <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    {activeTab === 'recent' ? 'No recent translations' : 'No favorites saved'}
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-600 max-w-[200px]">
                    {activeTab === 'recent' 
                      ? 'Your translated text will appear here.' 
                      : 'Click the star icon on any translation to save it here.'}
                  </p>
                </div>
              )}
            </div>

            {/* Clear All Footer Actions */}
            {activeTab === 'recent' && history.length > 0 && (
              <div className="p-4 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/30 dark:bg-zinc-950/20">
                <button
                  onClick={onClearHistory}
                  type="button"
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl border border-red-200 dark:border-red-950
                             bg-red-50/50 dark:bg-red-950/10 text-red-600 dark:text-red-400 hover:bg-red-100/50 dark:hover:bg-red-950/20
                             text-sm font-semibold transition-all cursor-pointer"
                >
                  <FiTrash2 className="w-4 h-4" />
                  <span>Clear All History</span>
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryPanel;
