const API_KEY = "ffb2795b4064afc50142f5a5489587ad";
const BASE = "https://api.openweathermap.org";

function checkKey() {
  if (!API_KEY || API_KEY === "your_api_key_here") {
    throw new Error("API key missing — add REACT_APP_OPENWEATHER_API_KEY to your .env file");
  }
}

export async function fetchWeatherByCity(city) {
  checkKey();
  const res = await fetch(
    `${BASE}/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
  );
  if (!res.ok) throw new Error(res.status === 404 ? `City "${city}" not found` : "Weather fetch failed");
  return res.json();
}

export async function fetchForecastByCity(city) {
  checkKey();
  const res = await fetch(
    `${BASE}/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
  );
  if (!res.ok) throw new Error("Forecast unavailable");
  return res.json();
}

export async function fetchWeatherByCoords(lat, lon) {
  checkKey();
  const res = await fetch(
    `${BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  if (!res.ok) throw new Error("Location weather fetch failed");
  return res.json();
}

export async function fetchForecastByCoords(lat, lon) {
  checkKey();
  const res = await fetch(
    `${BASE}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  if (!res.ok) throw new Error("Forecast unavailable");
  return res.json();
}

export async function fetchAQI(lat, lon) {
  checkKey();
  const res = await fetch(
    `${BASE}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );
  if (!res.ok) return null;
  return res.json();
}

export async function fetchCitySuggestions(query) {
  checkKey();
  const res = await fetch(
    `${BASE}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.map((c) => ({
    label: `${c.name}${c.state ? ", " + c.state : ""}, ${c.country}`,
    city: c.name,
    country: c.country,
  }));
}
