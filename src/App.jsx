import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import TranslationCard from './components/TranslationCard';
import OutputCard from './components/OutputCard';
import SwapButton from './components/SwapButton';
import TranslateButton from './components/TranslateButton';
import HistoryPanel from './components/HistoryPanel';
import { SUPPORTED_LANGUAGES, DEFAULT_SOURCE_LANGUAGE, DEFAULT_TARGET_LANGUAGE } from './constants/languages';
import { translateText, isDemoMode } from './services/api';
import useLocalStorage from './hooks/useLocalStorage';
import useTextToSpeech from './hooks/useTextToSpeech';
import useSpeechToText from './hooks/useSpeechToText';
import { FiInfo } from 'react-icons/fi';

export function App() {
  // Sync state with local storage
  const [sourceLang, setSourceLang] = useLocalStorage('lingo_source_lang', DEFAULT_SOURCE_LANGUAGE);
  const [targetLang, setTargetLang] = useLocalStorage('lingo_target_lang', DEFAULT_TARGET_LANGUAGE);
  const [darkMode, setDarkMode] = useLocalStorage('lingo_dark_mode', false);
  const [history, setHistory] = useLocalStorage('lingo_history', []);
  const [favorites, setFavorites] = useLocalStorage('lingo_favorites', []);

  // Normal React states
  const [inputText, setInputText] = React.useState('');
  const [translatedText, setTranslatedText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);

  // References
  const abortControllerRef = useRef(null);

  // TTS and STT custom hooks
  const { speak, stop: stopSpeaking, isSpeaking, isSupported: isTtsSupported } = useTextToSpeech();
  const { isListening, startListening, stopListening, isSupported: isSttSupported } = useSpeechToText();

  // Initialize Dark Mode class on mount/change
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Display toast warning if API key is not configured (Demo Mode)
  useEffect(() => {
    if (isDemoMode()) {
      toast(
        () => (
          <div className="flex items-start space-x-2">
            <FiInfo className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-50 text-xs">Demo Mode Active</p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Translations are simulated. Configure <code>VITE_RAPIDAPI_KEY</code> in <code>.env</code> for live translations.
              </p>
            </div>
          </div>
        ),
        {
          duration: 6000,
          position: 'bottom-right',
          id: 'demo-mode-warning',
          style: {
            padding: '12px',
            borderRadius: '16px',
            background: darkMode ? '#18181b' : '#ffffff',
            border: darkMode ? '1px solid #27272a' : '1px solid #e4e4e7',
          },
        }
      );
    }
  }, [darkMode]);

  // Core translation execution
  const handleTranslate = useCallback(async () => {
    if (!inputText || inputText.trim() === '') {
      setTranslatedText('');
      return;
    }

    // Cancel any ongoing translation requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    stopSpeaking(); // stop reading out previous translation

    try {
      const result = await translateText({
        text: inputText,
        source: sourceLang,
        target: targetLang,
        signal: controller.signal,
      });

      setTranslatedText(result);

      // Save request to history
      const newHistoryItem = {
        id: Date.now().toString(),
        text: inputText.trim(),
        translation: result,
        source: sourceLang,
        target: targetLang,
        timestamp: new Date().toISOString(),
      };

      setHistory((prev) => {
        // Prevent duplicate consecutive translations in history
        const lastItem = prev[0];
        if (lastItem && lastItem.text === newHistoryItem.text && lastItem.source === newHistoryItem.source && lastItem.target === newHistoryItem.target) {
          return prev;
        }
        return [newHistoryItem, ...prev].slice(0, 50); // limit to 50 items
      });

    } catch (err) {
      if (err.name === 'AbortError' || err.message === 'canceled') {
        // Ignored cancellation
        return;
      }
      console.error('Translation error:', err.message);
      setError(err.message || 'API_UNKNOWN_ERROR');
      toast.error('Translation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [inputText, sourceLang, targetLang, stopSpeaking, setHistory]);

  // Swaps the source & target languages
  const handleSwap = useCallback(() => {
    // Cancel speaking if active
    stopSpeaking();
    stopListening();

    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);

    // Swap text values for convenience
    const tempText = inputText;
    setInputText(translatedText);
    setTranslatedText(tempText);

    // Automatically trigger translation if the new input text is not empty
    if (translatedText && translatedText.trim() !== '') {
      // We set timeout to let states update before triggering translation
      setTimeout(() => {
        setIsLoading(true);
      }, 50);
    }
  }, [sourceLang, targetLang, inputText, translatedText, stopSpeaking, stopListening, setSourceLang, setTargetLang]);

  // Auto trigger translation when target lang shifts while input is present
  useEffect(() => {
    if (inputText && inputText.trim() !== '' && !isLoading) {
      const delayDebounce = setTimeout(() => {
        handleTranslate();
      }, 500); // 500ms debounce to prevent flooding when clicking language options
      return () => clearTimeout(delayDebounce);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetLang]);

  // Handle keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + Enter translates
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (inputText.trim() && !isLoading) {
          e.preventDefault();
          handleTranslate();
        }
      }
      // ESC clears input if search dropdown is not active
      if (e.key === 'Escape') {
        const activeEl = document.activeElement;
        const isSearchBox = activeEl && activeEl.getAttribute('aria-label') === 'Search languages filter';
        if (!isSearchBox && inputText) {
          e.preventDefault();
          setInputText('');
          setTranslatedText('');
          stopSpeaking();
          stopListening();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputText, isLoading, handleTranslate, stopSpeaking, stopListening]);

  // Check if current translation is favorited
  const currentTranslationIsFavorite = useMemo(() => {
    if (!inputText || !translatedText) return false;
    return favorites.some(
      (f) =>
        f.text.trim().toLowerCase() === inputText.trim().toLowerCase() &&
        f.source === sourceLang &&
        f.target === targetLang
    );
  }, [inputText, translatedText, sourceLang, targetLang, favorites]);

  // Toggle saving translation to favorites list
  const handleToggleFavorite = () => {
    if (!inputText || !translatedText) return;

    if (currentTranslationIsFavorite) {
      // Remove from favorites
      setFavorites((prev) =>
        prev.filter(
          (f) =>
            !(
              f.text.trim().toLowerCase() === inputText.trim().toLowerCase() &&
              f.source === sourceLang &&
              f.target === targetLang
            )
        )
      );
      toast.success('Removed from favorites', { id: 'fav-toggle' });
    } else {
      // Add to favorites
      const favItem = {
        id: Date.now().toString(),
        text: inputText.trim(),
        translation: translatedText,
        source: sourceLang,
        target: targetLang,
        timestamp: new Date().toISOString(),
      };
      setFavorites((prev) => [favItem, ...prev]);
      toast.success('Saved to favorites', { id: 'fav-toggle' });
    }
  };

  // Restore history / favorite item back to main dashboard
  const handleRestore = (item) => {
    setSourceLang(item.source);
    setTargetLang(item.target);
    setInputText(item.text);
    setTranslatedText(item.translation);
  };

  // Speech-to-text triggers
  const handleStartSTT = () => {
    startListening(
      sourceLang,
      (result) => {
        setInputText((prev) => (prev ? prev.trim() + ' ' + result : result));
      },
      () => {
        // Recognition ended
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Toast Alert Config */}
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'glass-dropdown border border-zinc-200/50 dark:border-zinc-800/50 text-sm font-medium text-zinc-900 dark:text-zinc-50',
          style: {
            borderRadius: '12px',
            background: darkMode ? 'rgba(24, 24, 27, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
          },
        }}
      />

      {/* Header section */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col justify-center">
        
        {/* Title branding text */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-700 dark:from-zinc-50 dark:via-zinc-200 dark:to-zinc-400">
            Intelligent translation. Minimal footprint.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
            Translate documents and messages smoothly with state-of-the-art accuracy, voice recognition, and accent feedback.
          </p>
        </div>

        {/* Translation Cards Container */}
        <div className="w-full flex flex-col items-stretch space-y-4 lg:space-y-0 lg:flex-row lg:space-x-4 mb-6">
          {/* Input Source Card */}
          <div className="flex-1 min-h-[290px]">
            <TranslationCard
              text={inputText}
              setText={setInputText}
              selectedLanguage={sourceLang}
              onLanguageSelect={setSourceLang}
              languages={SUPPORTED_LANGUAGES}
              targetLanguage={targetLang}
              isListening={isListening}
              onStartListening={handleStartSTT}
              onStopListening={stopListening}
              isSpeechSupported={isSttSupported}
            />
          </div>

          {/* Intermediary Swapping Column */}
          <div className="flex items-center justify-center py-2 lg:py-0 shrink-0">
            <SwapButton onClick={handleSwap} disabled={isLoading} />
          </div>

          {/* Output Target Card */}
          <div className="flex-1 min-h-[290px]">
            <OutputCard
              translatedText={translatedText}
              selectedLanguage={targetLang}
              onLanguageSelect={setTargetLang}
              languages={SUPPORTED_LANGUAGES}
              sourceLanguage={sourceLang}
              isLoading={isLoading}
              error={error}
              onRetry={handleTranslate}
              isSpeaking={isSpeaking}
              onStartSpeaking={speak}
              onStopSpeaking={stopSpeaking}
              isTtsSupported={isTtsSupported}
              isFavorite={currentTranslationIsFavorite}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        </div>

        {/* Floating Core Action Center */}
        <div className="flex justify-center mb-10">
          <TranslateButton
            isLoading={isLoading}
            disabled={!inputText.trim()}
            onClick={handleTranslate}
          />
        </div>
      </main>

      {/* Sliding Drawer Panel */}
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        favorites={favorites}
        onRestore={handleRestore}
        onClearHistory={() => {
          setHistory([]);
          toast.success('History cleared');
        }}
        onDeleteHistoryItem={(id) => {
          setHistory((prev) => prev.filter((item) => item.id !== id));
        }}
        onDeleteFavoriteItem={(id) => {
          setFavorites((prev) => prev.filter((item) => item.id !== id));
          toast.success('Removed from favorites');
        }}
        languages={SUPPORTED_LANGUAGES}
      />

      {/* Footer component */}
      <Footer />
    </div>
  );
}

export default App;
