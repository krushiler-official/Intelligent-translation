import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FiChevronDown, FiSearch, FiCheck } from 'react-icons/fi';

/**
 * LanguageSelector Component
 * Custom accessible dropdown for choosing a language with search filtering.
 * 
 * @param {Object} props
 * @param {string} props.selectedLanguage - Code of currently selected language
 * @param {Function} props.onSelect - Callback on language selection
 * @param {Array} props.languages - List of supported language objects
 * @param {string} [props.excludeLanguage] - Language code to filter out
 * @param {string} props.label - ARIA label/identifier
 */
export function LanguageSelector({ selectedLanguage, onSelect, languages, excludeLanguage, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);

  // Find currently active language details
  const activeLanguage = useMemo(() => {
    return languages.find((lang) => lang.code === selectedLanguage);
  }, [selectedLanguage, languages]);

  // Filter languages based on search query
  const filteredLanguages = useMemo(() => {
    return languages.filter((lang) => {
      if (lang.code === excludeLanguage) return false;
      return (
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [languages, searchQuery, excludeLanguage]);

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(-1);
  }, [searchQuery]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Small timeout to guarantee DOM is rendered before focusing
      const timer = setTimeout(() => {
        searchInputRef.current.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation within list
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1 >= filteredLanguages.length ? 0 : prev + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 < 0 ? filteredLanguages.length - 1 : prev - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < filteredLanguages.length) {
          onSelect(filteredLanguages[activeIndex].code);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'Tab':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[activeIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  return (
    <div className="relative inline-block w-full" ref={dropdownRef}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        type="button"
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl
                   bg-white/50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 
                   text-zinc-800 dark:text-zinc-200 text-sm font-medium shadow-sm hover:bg-white dark:hover:bg-zinc-900
                   focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                   transition-all duration-150 cursor-pointer"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`${label}, currently ${activeLanguage?.name || 'Select'}`}
      >
        <span className="flex items-center space-x-2">
          {activeLanguage ? (
            <>
              <span className="text-base leading-none" aria-hidden="true">{activeLanguage.flag}</span>
              <span>{activeLanguage.name}</span>
            </>
          ) : (
            <span className="text-zinc-400">Select language...</span>
          )}
        </span>
        <FiChevronDown className={`w-4 h-4 text-zinc-400 dark:text-zinc-500 transition-transform duration-250 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 z-50 rounded-2xl glass-dropdown overflow-hidden animate-slide-up origin-top">
          {/* Search box */}
          <div className="p-2 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center space-x-2">
            <FiSearch className="w-4 h-4 text-zinc-400 ml-2 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              className="w-full bg-transparent border-0 text-sm py-1.5 focus:outline-none focus:ring-0
                         text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
              placeholder="Search language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search languages filter"
            />
          </div>

          {/* List items */}
          <ul
            ref={listRef}
            className="max-h-60 overflow-y-auto py-1"
            role="listbox"
            aria-label="Languages list"
          >
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang, index) => {
                const isSelected = lang.code === selectedLanguage;
                const isActive = index === activeIndex;

                return (
                  <li
                    key={lang.code}
                    onClick={() => {
                      onSelect(lang.code);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex items-center justify-between px-4 py-2 text-sm cursor-pointer select-none
                      transition-colors duration-100
                      ${isSelected ? 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-medium' : ''}
                      ${isActive ? 'bg-zinc-100/70 dark:bg-zinc-800/60 text-zinc-950 dark:text-zinc-50' : 'text-zinc-700 dark:text-zinc-300'}
                    `}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span className="flex items-center space-x-2.5">
                      <span className="text-base leading-none" aria-hidden="true">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                    {isSelected && <FiCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-3 text-sm text-zinc-400 text-center dark:text-zinc-500 select-none">
                No languages found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
