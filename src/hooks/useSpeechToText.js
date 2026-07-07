import { useState, useEffect, useRef, useCallback } from 'react';

const LOCALE_MAP = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  it: 'it-IT',
  pt: 'pt-PT',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
  ru: 'ru-RU',
  ar: 'ar-SA',
  hi: 'hi-IN',
  bn: 'bn-IN',
  nl: 'nl-NL',
  el: 'el-GR',
  he: 'he-IL',
  id: 'id-ID',
  pl: 'pl-PL',
  sv: 'sv-SE',
  tr: 'tr-TR',
  vi: 'vi-VN',
  th: 'th-TH',
  ms: 'ms-MY',
  fa: 'fa-IR',
  uk: 'uk-UA',
  ro: 'ro-RO',
  no: 'no-NO',
  fi: 'fi-FI',
  da: 'da-DK',
  cs: 'cs-CZ'
};

/**
 * Custom hook to interface with Web Speech SpeechRecognition API.
 * 
 * @returns {Object} STT states and controllers
 */
export function useSpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  // Check browser support
  const isSupported = typeof window !== 'undefined' && 
    !!(window.SpeechRecognition || 
       window.webkitSpeechRecognition || 
       window.mozSpeechRecognition || 
       window.msSpeechRecognition);

  const startListening = useCallback((lang, onResult, onEndCallback) => {
    if (!isSupported) {
      setError('NOT_SUPPORTED');
      return;
    }

    // Abort active recognition first
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Safe check
      }
    }

    const SpeechRecognition = window.SpeechRecognition || 
                              window.webkitSpeechRecognition || 
                              window.mozSpeechRecognition || 
                              window.msSpeechRecognition;
                              
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = LOCALE_MAP[lang] || lang;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      const resultText = event.results[0][0].transcript;
      if (onResult) {
        onResult(resultText);
      }
    };

    recognition.onerror = (event) => {
      // Ignore 'no-speech' error to prevent noisy debug messages
      if (event.error !== 'no-speech') {
        console.error('Speech recognition error event:', event.error);
        setError(event.error);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (onEndCallback) {
        onEndCallback();
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
      setError('START_ERROR');
      setIsListening(false);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Safe check
      }
    }
    setIsListening(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    const recognition = recognitionRef.current;
    return () => {
      if (recognition) {
        try {
          recognition.abort();
        } catch {
          // Safe check
        }
      }
    };
  }, []);

  return {
    isListening,
    error,
    startListening,
    stopListening,
    isSupported,
  };
}

export default useSpeechToText;
