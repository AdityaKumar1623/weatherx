# 🌐 WeatherX — Weather Intelligence Dashboard

A production-grade, SaaS-style weather dashboard built with **React**, **Tailwind CSS**, and **Recharts**. Powered by the **OpenWeatherMap API**.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🌡️ Real-time weather | Temp, humidity, wind, pressure, visibility |
| 📍 Auto geolocation | Detects your city on load |
| 🔍 City search | Autocomplete via OpenWeather Geocoding API |
| 🕒 5-day forecast | Daily + hourly breakdown |
| 📊 Analytics charts | Temperature, humidity, rain, wind (Recharts) |
| 🏭 Air Quality Index | PM2.5, PM10, color-coded severity |
| 🧠 Intelligence Engine | Smart human-like weather insights |
| 🎯 Activity Suggestions | Running, cycling, travel, indoor/outdoor |
| ⚖️ City Comparison | Side-by-side weather + comparison bars |
| 🕘 Search history | Recent cities stored in localStorage |
| 🎨 Dynamic themes | Background changes with weather conditions |
| 📱 Responsive | Mobile-first, works on all screen sizes |
| 💀 Skeleton loader | Smooth loading state UX |

---

## 🚀 Quick Start

### 1. Clone & install

```bash
git clone <your-repo-url>
cd weatherx
npm install
```

### 2. Get your API key

1. Go to [openweathermap.org](https://openweathermap.org/api)
2. Sign up for a free account
3. Copy your API key from the dashboard

> **Free tier** includes: Current Weather, 5-day Forecast, Geocoding, and Air Pollution APIs — everything WeatherX uses.

### 3. Configure your API key

```bash
cp .env.example .env
```

Open `.env` and replace the placeholder:

```env
REACT_APP_OPENWEATHER_API_KEY=your_actual_api_key_here
```

> ⚠️ **Never commit your `.env` file** — it's already in `.gitignore`.

### 4. Run the app

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```bash
npm run build
```

---

## 📁 Project Structure

```
weatherx/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Main layout shell
│   │   ├── Header.jsx             # Logo + unit toggle
│   │   ├── SearchBar.jsx          # Search + autocomplete + history
│   │   ├── TabNav.jsx             # Tab navigation
│   │   ├── tabs/
│   │   │   ├── OverviewTab.jsx    # Current weather + insights
│   │   │   ├── ForecastTab.jsx    # 5-day + hourly forecast
│   │   │   ├── AnalyticsTab.jsx   # Recharts graphs
│   │   │   └── CompareTab.jsx     # Side-by-side city comparison
│   │   └── ui/
│   │       ├── GlassCard.jsx      # Reusable glassmorphism card
│   │       ├── WeatherIcon.jsx    # Emoji weather icons
│   │       ├── SkeletonLoader.jsx # Loading skeleton UI
│   │       ├── ErrorBanner.jsx    # Error display
│   │       └── EmptyState.jsx     # Empty/initial state
│   ├── context/
│   │   └── WeatherContext.js      # Global state (useReducer)
│   ├── hooks/
│   │   ├── useGeoLocation.js      # Browser geolocation hook
│   │   └── useDebounce.js         # Debounce hook for search
│   ├── utils/
│   │   ├── api.js                 # All OpenWeather API calls
│   │   ├── helpers.js             # Formatting, theme, AQI utils
│   │   └── intelligence.js        # Weather Intelligence Engine
│   ├── App.js
│   ├── index.js
│   └── index.css                  # Tailwind + global styles
├── .env                           # Your API key (git-ignored)
├── .env.example                   # Template for new devs
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🧠 Intelligence Engine

The `src/utils/intelligence.js` module analyses live weather data and generates human-readable insights:

```js
// Example outputs:
"🔥 Extreme heat alert! Stay indoors and avoid direct sun between 11am–4pm."
"☔ Rainfall detected. Carry an umbrella and allow extra travel time."
"🌿 Excellent air quality! A perfect day for outdoor exercise."
"💨 Strong winds detected. Secure loose outdoor items."
```

---

## 🎨 Dynamic Themes

The background gradient and accent colour change automatically based on the current weather:

| Condition | Theme |
|---|---|
| ☀️ Sunny | Golden-blue gradient |
| 🌧️ Rainy | Deep navy blue |
| ⛈️ Stormy | Dark purple-indigo |
| 🌫️ Foggy | Slate grey |
| ☁️ Cloudy | Soft grey-blue |
| 🌙 Night | Deep dark blue |

---

## 🛠 Tech Stack

- **React 18** — UI framework
- **Tailwind CSS 3** — Utility-first styling
- **Recharts** — Temperature, humidity, wind charts
- **OpenWeatherMap API** — Weather, forecast, AQI, geocoding
- **React Context + useReducer** — State management

---

## 📝 License

MIT — free to use, modify, and distribute.
