import React, { useState } from 'react';
import { FiCopy, FiCheck, FiVolume2, FiVolumeX, FiStar, FiDownload, FiRefreshCw } from 'react-icons/fi';
import { BiErrorCircle } from 'react-icons/bi';
import LanguageSelector from './LanguageSelector';
import toast from 'react-hot-toast';

/**
 * OutputCard Component
 * Displays the translated text with output utilities.
 * 
 * @param {Object} props
 * @param {string} props.translatedText - Translated text output
 * @param {string} props.selectedLanguage - Selected target language code
 * @param {Function} props.onLanguageSelect - Callback on target language change
 * @param {Array} props.languages - Supported languages
 * @param {string} props.sourceLanguage - Selected source language code (to exclude from selector)
 * @param {boolean} props.isLoading - API loading state
 * @param {string} props.error - API error code
 * @param {Function} props.onRetry - API retry handler
 * @param {boolean} props.isSpeaking - TTS speaking state
 * @param {Function} props.onStartSpeaking - TTS speak command
 * @param {Function} props.onStopSpeaking - TTS cancel command
 * @param {boolean} props.isTtsSupported - TTS support state
 * @param {boolean} props.isFavorite - Favorite state
 * @param {Function} props.onToggleFavorite - Toggle favorite action
 */
export function OutputCard({
  translatedText,
  selectedLanguage,
  onLanguageSelect,
  languages,
  sourceLanguage,
  isLoading,
  error,
  onRetry,
  isSpeaking,
  onStartSpeaking,
  onStopSpeaking,
  isTtsSupported,
  isFavorite,
  onToggleFavorite
}) {
  const [copied, setCopied] = useState(false);

  // Copy output to clipboard
  const handleCopy = async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      toast.success('Translation copied', { id: 'copy-out-toast', duration: 2000 });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy translation');
    }
  };

  // Toggle voice playback
  const handleVoiceToggle = () => {
    if (!isTtsSupported) {
      toast.error('Text-to-Speech is not supported on this browser.');
      return;
    }
    if (isSpeaking) {
      onStopSpeaking();
    } else {
      onStartSpeaking(translatedText, selectedLanguage);
    }
  };

  // Download translation as TXT file
  const handleDownload = () => {
    if (!translatedText) return;
    try {
      const element = document.createElement('a');
      const file = new Blob([translatedText], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = `lingo_translation_${selectedLanguage}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success('Download started');
    } catch {
      toast.error('Download failed');
    }
  };

  // Translate API error code to human readable text
  const getErrorMessage = () => {
    switch (error) {
      case 'API_AUTH_ERROR':
        return 'Authentication failed. Please check if your RapidAPI Key is correctly set in your environment file (.env).';
      case 'API_RATE_LIMIT':
        return 'Rate limit exceeded. Too many requests. Please wait a moment before trying again.';
      case 'API_TIMEOUT':
        return 'The request timed out. Please check your network connection and speed.';
      case 'API_NETWORK_ERROR':
        return 'A network error occurred. Please check your internet connectivity.';
      default:
        return 'Failed to translate. An unexpected server error occurred.';
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[290px] rounded-2xl bg-zinc-50/70 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/40 p-5 transition-all duration-300">
      
      {/* Card Header (Target selection) */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="w-56">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onSelect={onLanguageSelect}
            languages={languages}
            excludeLanguage={sourceLanguage}
            label="Target language selection dropdown"
          />
        </div>
      </div>

      {/* Output Content Area */}
      <div className="flex-1 py-4 flex flex-col justify-start">
        {isLoading ? (
          /* Skeleton Loader */
          <div className="space-y-3.5 py-2 animate-pulse">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-[85%]" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-[95%]" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-[60%]" />
          </div>
        ) : error ? (
          /* Error State Card */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 rounded-xl bg-red-50/40 dark:bg-red-950/5 border border-red-200/40 dark:border-red-900/20 my-2">
            <BiErrorCircle className="w-9 h-9 text-red-500 mb-2 shrink-0" />
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">
              Translation Failed
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[280px] mb-3 leading-relaxed">
              {getErrorMessage()}
            </p>
            <button
              onClick={onRetry}
              type="button"
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold
                         bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300
                         hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-xs"
            >
              <FiRefreshCw className="w-3 h-3" />
              <span>Retry Translation</span>
            </button>
          </div>
        ) : translatedText ? (
          /* Success Output */
          <div className="text-zinc-900 dark:text-zinc-100 text-base whitespace-pre-wrap select-text break-words animate-fade-in pr-2 leading-relaxed">
            {translatedText}
          </div>
        ) : (
          /* Empty/Initial State */
          <div className="text-zinc-400 dark:text-zinc-600 text-base italic select-none">
            Translation will appear here...
          </div>
        )}
      </div>

      {/* Card Footer (Actions) */}
      {!isLoading && !error && translatedText && (
        <div className="flex items-center justify-between pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
          {/* Left Actions */}
          <div className="flex items-center space-x-2">
            {/* Play Text-to-Speech */}
            {isTtsSupported && (
              <button
                onClick={handleVoiceToggle}
                type="button"
                className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSpeaking
                    ? 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                    : 'bg-white/40 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/60 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title={isSpeaking ? 'Stop listening' : 'Listen to translation (Text-to-Speech)'}
                aria-label={isSpeaking ? 'Stop text-to-speech voice' : 'Start text-to-speech voice'}
              >
                {isSpeaking ? <FiVolumeX className="w-4 h-4" /> : <FiVolume2 className="w-4 h-4" />}
              </button>
            )}

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              type="button"
              className="p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60
                         bg-white/40 dark:bg-zinc-900/40 text-zinc-500 dark:text-zinc-400
                         hover:text-zinc-900 dark:hover:text-zinc-200 transition-all cursor-pointer"
              title="Copy translation"
              aria-label="Copy translation output to clipboard"
            >
              {copied ? <FiCheck className="w-4 h-4 text-green-500" /> : <FiCopy className="w-4 h-4" />}
            </button>

            {/* Toggle Favorite */}
            <button
              onClick={onToggleFavorite}
              type="button"
              className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                isFavorite
                  ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 text-amber-500 hover:text-amber-600'
                  : 'bg-white/40 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/60 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={isFavorite ? 'Remove translation from favorites' : 'Add translation to favorites'}
            >
              <FiStar className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Right Actions */}
          <div>
            {/* Download TXT */}
            <button
              onClick={handleDownload}
              type="button"
              className="p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60
                         bg-white/40 dark:bg-zinc-900/40 text-zinc-500 dark:text-zinc-400
                         hover:text-zinc-900 dark:hover:text-zinc-200 transition-all cursor-pointer"
              title="Download as text file (.txt)"
              aria-label="Download translation as text file"
            >
              <FiDownload className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OutputCard;
