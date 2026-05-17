// ─── Temperature ─────────────────────────────────────────────────────────────
export const celsiusToF = (c) => Math.round((c * 9) / 5 + 32);

export function displayTemp(t, unit) {
  if (t == null) return "--";
  return unit === "C" ? `${Math.round(t)}°C` : `${celsiusToF(t)}°F`;
}

// ─── Date / Time ─────────────────────────────────────────────────────────────
export const formatTime = (ts) =>
  new Date(ts * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const formatDay = (ts, index) => {
  if (index === 0) return "Today";
  return new Date(ts * 1000).toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export const formatFullDate = () =>
  new Date().toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// ─── AQI ─────────────────────────────────────────────────────────────────────
export const AQI_LABELS = ["", "Good", "Fair", "Moderate", "Poor", "Hazardous"];
export const AQI_COLORS = ["", "#22c55e", "#84cc16", "#eab308", "#f97316", "#ef4444"];

export const aqiLabel = (v) => AQI_LABELS[v] || "N/A";
export const aqiColor = (v) => AQI_COLORS[v] || "#6b7280";

// ─── Weather Icon (emoji) ─────────────────────────────────────────────────────
export function getWeatherEmoji(id) {
  if (!id) return "🌡️";
  if (id >= 200 && id < 300) return "⛈️";
  if (id >= 300 && id < 400) return "🌦️";
  if (id >= 500 && id < 600) return "🌧️";
  if (id >= 600 && id < 700) return "❄️";
  if (id >= 700 && id < 800) return "🌫️";
  if (id === 800) return "☀️";
  if (id === 801) return "🌤️";
  if (id === 802) return "⛅";
  return "☁️";
}

// ─── Dynamic Theme ────────────────────────────────────────────────────────────
export function getWeatherTheme(weatherId, isNight) {
  if (isNight) return {
    bg: "from-[#0a0e1a] via-[#111827] to-[#0a0e1a]",
    accent: "#818cf8",
    accentHex: "#818cf8",
    glow: "rgba(129,140,248,0.15)",
    name: "night",
  };
  if (!weatherId) return {
    bg: "from-[#0c1445] via-[#1a3a6b] to-[#2c5364]",
    accent: "#38bdf8",
    accentHex: "#38bdf8",
    glow: "rgba(56,189,248,0.15)",
    name: "default",
  };
  if (weatherId >= 200 && weatherId < 300) return {
    bg: "from-[#0d1117] via-[#1a1f35] to-[#2d1b4e]",
    accent: "#a78bfa",
    accentHex: "#a78bfa",
    glow: "rgba(167,139,250,0.2)",
    name: "storm",
  };
  if (weatherId >= 300 && weatherId < 700) return {
    bg: "from-[#0f172a] via-[#1e3a5f] to-[#0f4c75]",
    accent: "#60a5fa",
    accentHex: "#60a5fa",
    glow: "rgba(96,165,250,0.2)",
    name: "rain",
  };
  if (weatherId >= 700 && weatherId < 800) return {
    bg: "from-[#1f2937] via-[#374151] to-[#4b5563]",
    accent: "#9ca3af",
    accentHex: "#9ca3af",
    glow: "rgba(156,163,175,0.15)",
    name: "fog",
  };
  if (weatherId === 800) return {
    bg: "from-[#0c1445] via-[#1a3a6b] to-[#c2410c]",
    accent: "#fbbf24",
    accentHex: "#fbbf24",
    glow: "rgba(251,191,36,0.2)",
    name: "sunny",
  };
  return {
    bg: "from-[#1e293b] via-[#334155] to-[#475569]",
    accent: "#94a3b8",
    accentHex: "#94a3b8",
    glow: "rgba(148,163,184,0.15)",
    name: "cloudy",
  };
}
