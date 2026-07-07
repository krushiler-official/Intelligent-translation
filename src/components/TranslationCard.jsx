import React, { useRef, useEffect } from 'react';
import { FiX, FiMic, FiMicOff, FiCopy, FiCheck } from 'react-icons/fi';
import LanguageSelector from './LanguageSelector';
import CharacterCounter from './CharacterCounter';
import toast from 'react-hot-toast';

/**
 * TranslationCard Component
 * Wraps the source text input area, language selector, and input utilities.
 * 
 * @param {Object} props
 * @param {string} props.text - Input text state
 * @param {Function} props.setText - Text state setter
 * @param {string} props.selectedLanguage - Selected source language code
 * @param {Function} props.onLanguageSelect - Callback on language selection
 * @param {Array} props.languages - List of supported languages
 * @param {string} props.targetLanguage - Selected target language code (to exclude from selection list)
 * @param {boolean} props.isListening - Recording state (STT)
 * @param {Function} props.onStartListening - STT trigger
 * @param {Function} props.onStopListening - STT stop action
 * @param {boolean} props.isSpeechSupported - STT support state
 */
export function TranslationCard({
  text,
  setText,
  selectedLanguage,
  onLanguageSelect,
  languages,
  targetLanguage,
  isListening,
  onStartListening,
  onStopListening,
  isSpeechSupported
}) {
  const textareaRef = useRef(null);
  const [copied, setCopied] = React.useState(false);

  // Auto-resize textarea to fit content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(textarea.scrollHeight, 140)}px`;
    }
  }, [text]);

  // Handle manual clean clear text
  const handleClear = () => {
    setText('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
    toast.success('Input cleared', { id: 'input-cleared-toast', duration: 1500 });
  };

  // Copy source text to clipboard
  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Text copied to clipboard', { id: 'copy-toast', duration: 2000 });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy text');
    }
  };

  // Toggle microphone recording state
  const handleMicToggle = () => {
    if (!isSpeechSupported) {
      toast.error('Speech-to-Text is not supported on this browser. Try Chrome/Edge.');
      return;
    }
    if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl glass-panel p-5 transition-all duration-300 shadow-sm
                    focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/10">
      
      {/* Card Header (Language selection) */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="w-56">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onSelect={onLanguageSelect}
            languages={languages}
            excludeLanguage={targetLanguage}
            label="Source language selection dropdown"
          />
        </div>

        {/* Top actions */}
        <div className="flex items-center space-x-1">
          {text && (
            <button
              onClick={handleClear}
              type="button"
              className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 
                         rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
              aria-label="Clear source text input"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Text Area Body */}
      <div className="flex-1 py-4 relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-transparent border-0 resize-none text-zinc-900 dark:text-zinc-100 
                     text-base placeholder-zinc-400 dark:placeholder-zinc-600 focus:ring-0 focus:outline-none
                     min-h-[140px] pr-8 textarea-transition"
          placeholder="Enter text to translate..."
          aria-label="Text to translate"
          autoFocus
        />
      </div>

      {/* Card Footer (Actions & Counters) */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
        {/* Left Side: Speech/Record, Copy */}
        <div className="flex items-center space-x-2">
          {/* Speech to text */}
          {isSpeechSupported && (
            <button
              onClick={handleMicToggle}
              type="button"
              className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                isListening
                  ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 animate-pulse'
                  : 'bg-white/40 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/60 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
              title={isListening ? 'Stop listening' : 'Start speech-to-text (Web Speech API)'}
              aria-label={isListening ? 'Stop listening' : 'Start speech-to-text'}
            >
              {isListening ? <FiMicOff className="w-4 h-4" /> : <FiMic className="w-4 h-4" />}
            </button>
          )}

          {/* Copy Button */}
          {text && (
            <button
              onClick={handleCopy}
              type="button"
              className="p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60
                         bg-white/40 dark:bg-zinc-900/40 text-zinc-500 dark:text-zinc-400 
                         hover:text-zinc-900 dark:hover:text-zinc-200 transition-all cursor-pointer"
              title="Copy text"
              aria-label="Copy input text to clipboard"
            >
              {copied ? <FiCheck className="w-4 h-4 text-green-500" /> : <FiCopy className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Right Side: Word/Char Counters */}
        <CharacterCounter text={text} maxLength={5000} />
      </div>
    </div>
  );
}

export default TranslationCard;
