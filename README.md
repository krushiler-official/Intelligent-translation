# LingoSaaS — Professional AI-Powered Translation Platform

LingoSaaS is a production-quality, responsive translation application built with React 19, Vite, and Tailwind CSS v4. It features a minimal, glassmorphic layout inspired by Linear, Google Translate, and Vercel Dashboard, making it a portfolio-ready demonstration of senior frontend practices.

---

## 🚀 Key Features

*   **Premium SaaS UI/UX**: Engineered with a minimal aesthetic, soft shadows, rounded container cards, glassmorphism filters, and smooth responsive transitions.
*   **Dynamic Translation**: Powered by the RapidAPI Google Translate (or Deep Translate) backend with robust Axios wrappers.
*   **Smart State & Interactions**:
    *   **Swap Languages**: Swaps source/target selections and mirrors active text values.
    *   **Character & Word Counters**: Dynamic typing feedback.
    *   **Auto-Resizing Input**: Textareas expand dynamically based on input length.
    *   **Debounced Requests**: Avoids duplicate request cycles on language modifications.
*   **Advanced Web Speech Integrations (Bonus)**:
    *   🎤 **Speech-to-Text (STT)**: Dictate source sentences using the browser's Web Speech Recognition.
    *   🔊 **Text-to-Speech (TTS)**: Listen to native accent playback using Web Speech Synthesis.
*   **Offline Storage & Library (Bonus)**:
    *   💾 **State Retention**: Retains your last selected languages via `localStorage`.
    *   📖 **History Logging**: Track up to 50 recent translation cycles with individual/bulk clear options.
    *   ⭐ **Favorites Library**: Mark translation results to save them for quick access.
*   **Accessibility & Speed**:
    *   ⌨️ **Keyboard Shortcuts**: `Ctrl + Enter` to translate, `ESC` to clear.
    *   ♿ **Full Accessibility**: Built with semantic HTML, ARIA tags, visible focus outlines, and fully-keyboard navigable language selectors.
*   **Dark Mode**: Supports class-based dark mode toggles with custom visual assets.

---

## 🛠️ Tech Stack

*   **Core**: React 19, Vite, JavaScript
*   **Styling**: Tailwind CSS v4 (using `@tailwindcss/vite` CSS-first engine)
*   **HTTP Layer**: Axios (configured with request timeouts and cancellation handlers)
*   **Notifications**: React Hot Toast
*   **Icons**: React Icons (Feather & Boxicons packages)

---

## 📂 Folder Structure

```
slab-1/
├── src/
│   ├── assets/             # Branding icons & illustrations
│   ├── components/         # Atomic modular components
│   │   ├── CharacterCounter.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── HistoryPanel.jsx      # Slide-out history & favorites list
│   │   ├── LanguageSelector.jsx  # Accessible dropdown with search
│   │   ├── OutputCard.jsx        # Output viewer, TTS, Favorite triggers
│   │   ├── SwapButton.jsx
│   │   ├── ThemeToggle.jsx
│   │   ├── TranslateButton.jsx
│   │   └── TranslationCard.jsx   # Input area, clear button, STT microphone
│   ├── constants/          # Application configs
│   │   └── languages.js    # 30+ supported language objects with emojis
│   ├── hooks/              # Encapsulated state/API hooks
│   │   ├── useLocalStorage.js
│   │   ├── useSpeechToText.js
│   │   └── useTextToSpeech.js
│   ├── services/           # Service connectors
│   │   └── api.js          # Axios API handler with exponential backoff
│   ├── App.jsx             # Root layout and state controller
│   ├── index.css           # Tailwind v4 imports and animation keyframes
│   └── main.jsx            # React 19 mount point
├── .env                    # Active local environment variables
├── .env.example            # Environment variables templates
├── index.html              # Core HTML file with SEO tags
├── package.json            # Dependencies configuration
└── vite.config.js          # Vite config & Tailwind compiler setup
```

---

## ⚡ Setup & Installation

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### 2. Scaffolding Installation
Clone the workspace files or extract them to your local project folder, then run:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file at the root folder (or duplicate `.env.example`):
```env
VITE_RAPIDAPI_KEY=your_rapidapi_key_here
VITE_RAPIDAPI_HOST=google-translate1.p.rapidapi.com
```

> [!NOTE]
> **Demo / Sandbox Mode**: If the `VITE_RAPIDAPI_KEY` is empty or left as the placeholder, the application automatically activates **Demo Mode**. This simulates API latency and returns mocked translations, allowing you to test the complete UI flow immediately without having a RapidAPI account!

### 4. Running the Development Server
Start the local server by executing:
```bash
npm run dev
```
Open your browser and navigate to the printed URL (typically `http://localhost:5173`).

---

## 🌎 API Subscription Details
This application connects to the standard Google Translate translation endpoint via the RapidAPI gateway.
1. Sign up on [RapidAPI](https://rapidapi.com/).
2. Subscribe to the [Google Translate API](https://rapidapi.com/googlecloud/api/google-translate1).
3. Copy your API Key (`X-RapidAPI-Key`) from the developer console and insert it into your `.env` file.

---

## 🚀 Building & Deploying

### Production Build
Generate optimized static files inside the `dist/` directory:
```bash
npm run build
```

### Preview
Test the production build output locally:
```bash
npm run preview
```

### Deployment Recipes
The compiled output is completely static and can be deployed instantly to cloud providers:
*   **Vercel / Netlify**: Connect your Git repository, set the build command to `npm run build` and output folder to `dist`. Add your environment variables under Settings.
*   **GitHub Pages**: Configure GitHub Actions to compile and deploy the `dist/` folder to the `gh-pages` branch.
