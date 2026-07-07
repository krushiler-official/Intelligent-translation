import { useState, useEffect, useCallback, useRef } from 'react';

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
 * Custom hook to interface with the browser's SpeechSynthesis API.
 * 
 * @returns {Object} TTS control utilities and states
 */
export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef(window.speechSynthesis || null);
  const utteranceRef = useRef(null);

  // Stop any active speak
  const stop = useCallback(() => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback((text, lang) => {
    if (!synthRef.current) {
      console.warn('Speech synthesis is not supported in this browser.');
      return;
    }

    // Stop current speech first
    stop();

    if (!text || text.trim() === '') return;

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Set voice locale based on target language
    const locale = LOCALE_MAP[lang] || lang;
    utterance.lang = locale;

    // Select the best voice match for the locale
    const voices = synthRef.current.getVoices();
    const matchingVoice = voices.find(v => v.lang.toLowerCase() === locale.toLowerCase() || v.lang.toLowerCase().startsWith(lang.toLowerCase()));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      // Don't log error for manual cancellations
      if (e.error !== 'interrupted') {
        console.error('Speech synthesis error:', e);
      }
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  }, [stop]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    const synth = synthRef.current;
    return () => {
      if (synth) {
        synth.cancel();
      }
    };
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported: !!synthRef.current,
  };
}

export default useTextToSpeech;
