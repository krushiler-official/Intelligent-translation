import axios from 'axios';

const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const API_HOST = import.meta.env.VITE_RAPIDAPI_HOST || 'google-translate1.p.rapidapi.com';

// Check if credentials are using the default placeholder
const IS_DEMO_MODE = !API_KEY || API_KEY === 'your_rapidapi_key_here';

const axiosClient = axios.create({
  baseURL: `https://${API_HOST}`,
  timeout: 10000, // 10 seconds timeout
});

/**
 * Exponential backoff helper for retrying failed requests.
 * @param {Function} fn - Request function to retry
 * @param {number} retries - Max retry attempts
 * @param {number} delay - Initial delay in ms
 * @returns {Promise<any>}
 */
const retryWithBackoff = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    const status = error.response?.status;
    const isNetworkError = error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED';
    const isRetryableStatus = status === 429 || (status >= 500 && status <= 599);

    if (retries > 0 && (isNetworkError || isRetryableStatus)) {
      console.warn(`Translation API call failed. Retrying in ${delay}ms... (${retries} attempts left). Error: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

/**
 * Translates text from source language to target language.
 * Handles timeouts, rate limits, network errors, and invalid credentials.
 * 
 * @param {Object} params
 * @param {string} params.text - The text to translate
 * @param {string} params.source - ISO code of the source language
 * @param {string} params.target - ISO code of the target language
 * @param {AbortSignal} [params.signal] - Abort controller signal for cancellation
 * @returns {Promise<string>} Translated text
 */
export const translateText = async ({ text, source, target, signal }) => {
  if (!text || text.trim() === '') {
    return '';
  }

  // If in Demo/Mock Mode, simulate network latency and return dummy translated text
  if (IS_DEMO_MODE) {
    await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        // Simple cancellation check
        if (signal?.aborted) {
          reject(new DOMException('Request aborted', 'AbortError'));
          return;
        }
        resolve();
      }, 1000);

      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(timeoutId);
          reject(new DOMException('Request aborted', 'AbortError'));
        });
      }
    });

    // Provide localized dummy translations for common phrases or wrap the text
    const lowerText = text.trim().toLowerCase();
    const mockDict = {
      en: {
        es: { hello: 'hola', goodbye: 'adiós', thanks: 'gracias', 'thank you': 'gracias', welcome: 'bienvenido' },
        fr: { hello: 'bonjour', goodbye: 'au revoir', thanks: 'merci', 'thank you': 'merci beaucoup', welcome: 'bienvenue' },
        de: { hello: 'hallo', goodbye: 'tschüss', thanks: 'danke', 'thank you': 'vielen dank', welcome: 'willkommen' },
      }
    };

    if (mockDict[source]?.[target]?.[lowerText]) {
      return mockDict[source][target][lowerText];
    }

    // Default mock response structure for demo purposes
    const targetLangNames = {
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      it: 'Italian',
      pt: 'Portuguese',
      zh: 'Chinese',
      ja: 'Japanese',
    };
    const langLabel = targetLangNames[target] || target.toUpperCase();
    return `[DEMO MODE - No API Key] (Translated to ${langLabel}): ${text}`;
  }

  // Standard API call execution with retry logic
  const requestFn = () => 
    axiosClient.post(
      '/language/translate/v2',
      new URLSearchParams({
        q: text,
        target: target,
        source: source,
      }),
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': API_HOST,
        },
        signal,
      }
    );

  try {
    const response = await retryWithBackoff(requestFn);
    
    if (response?.data?.data?.translations?.[0]?.translatedText) {
      // Decode HTML entities if returned by Google Translate (e.g. &#39; to ')
      const doc = new DOMParser().parseFromString(
        response.data.data.translations[0].translatedText,
        'text/html'
      );
      return doc.documentElement.textContent || response.data.data.translations[0].translatedText;
    }

    throw new Error('INVALID_RESPONSE');
  } catch (error) {
    if (axios.isCancel(error) || error.name === 'AbortError') {
      throw error; // Let the component ignore aborted requests
    }

    const status = error.response?.status;

    if (status === 401 || status === 403) {
      throw new Error('API_AUTH_ERROR');
    } else if (status === 429) {
      throw new Error('API_RATE_LIMIT');
    } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      throw new Error('API_TIMEOUT');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('API_NETWORK_ERROR');
    } else {
      throw new Error('API_UNKNOWN_ERROR');
    }
  }
};

/**
 * Returns whether the application is running in Demo Mode (no API Key configured).
 * @returns {boolean}
 */
export const isDemoMode = () => IS_DEMO_MODE;
