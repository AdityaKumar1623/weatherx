/**
 * WeatherX Intelligence Engine
 * Generates human-like insights and activity suggestions from raw weather data.
 */

// ─── Smart Insights ───────────────────────────────────────────────────────────
export function generateInsights(current, aqi) {
  if (!current) return [];
  const insights = [];

  const temp = current.main?.temp;
  const humidity = current.main?.humidity;
  const windSpeed = current.wind?.speed;
  const weatherId = current.weather?.[0]?.id;
  const visibility = current.visibility;
  const aqiVal = aqi?.list?.[0]?.main?.aqi;

  // Temperature-based
  if (temp != null) {
    if (temp > 38)
      insights.push({ icon: "🔥", level: "danger", text: "Extreme heat alert! Stay indoors, keep hydrated, and avoid direct sun between 11am–4pm." });
    else if (temp > 33)
      insights.push({ icon: "☀️", level: "warn", text: "High heat today. Drink water regularly, apply SPF 50+ sunscreen, and wear light colours." });
    else if (temp < 2)
      insights.push({ icon: "🥶", level: "danger", text: "Near-freezing temperatures. Dress in heavy thermal layers and watch for icy surfaces." });
    else if (temp < 10)
      insights.push({ icon: "🧥", level: "warn", text: "Cold conditions expected. A warm coat and gloves are strongly recommended." });
    else if (temp >= 20 && temp <= 27)
      insights.push({ icon: "✅", level: "good", text: "Perfect weather today! Comfortable temperature — ideal for outdoor activities." });
  }

  // Weather condition–based
  if (weatherId != null) {
    if (weatherId >= 200 && weatherId < 300)
      insights.push({ icon: "⛈️", level: "danger", text: "Thunderstorm expected. Avoid open spaces and elevated areas. Stay indoors where possible." });
    else if (weatherId >= 300 && weatherId < 400)
      insights.push({ icon: "🌦️", level: "info", text: "Light drizzle in the area. A waterproof jacket would be handy." });
    else if (weatherId >= 500 && weatherId < 600)
      insights.push({ icon: "☔", level: "warn", text: "Rainfall detected. Carry an umbrella and allow extra travel time on wet roads." });
    else if (weatherId >= 600 && weatherId < 700)
      insights.push({ icon: "❄️", level: "warn", text: "Snowfall conditions. Drive carefully, wear insulated footwear, and allow extra journey time." });
    else if (weatherId >= 700 && weatherId < 800)
      insights.push({ icon: "🌫️", level: "info", text: "Reduced visibility due to fog or haze. Use fog lights and slow down when driving." });
    else if (weatherId === 800)
      insights.push({ icon: "🌞", level: "good", text: "Clear skies all day! Great visibility and pleasant sunshine — enjoy the outdoors." });
  }

  // Humidity
  if (humidity != null) {
    if (humidity > 85)
      insights.push({ icon: "💧", level: "warn", text: "Very high humidity — feels muggy. Choose light, breathable fabrics and stay cool." });
    else if (humidity < 25)
      insights.push({ icon: "🌵", level: "warn", text: "Dry air today. Stay well hydrated and use moisturiser to protect skin." });
  }

  // Wind
  if (windSpeed != null) {
    if (windSpeed > 15)
      insights.push({ icon: "💨", level: "danger", text: "Strong winds detected. Secure loose outdoor items and avoid cycling or walking in exposed areas." });
    else if (windSpeed > 8)
      insights.push({ icon: "🌬️", level: "info", text: "Moderate winds today. The perceived temperature feels cooler than actual — layer up." });
  }

  // Visibility
  if (visibility != null && visibility < 1000)
    insights.push({ icon: "👁️", level: "warn", text: "Very low visibility (<1 km). Take extra precautions while driving; consider delaying travel." });

  // Air Quality
  if (aqiVal != null) {
    if (aqiVal >= 5)
      insights.push({ icon: "☣️", level: "danger", text: "Hazardous air quality! Wear N95 masks outdoors, keep windows closed, and avoid exercise outside." });
    else if (aqiVal === 4)
      insights.push({ icon: "😷", level: "danger", text: "Poor air quality. Sensitive groups should stay indoors. Everyone should limit outdoor exposure." });
    else if (aqiVal === 3)
      insights.push({ icon: "🏭", level: "warn", text: "Moderate air pollution today. Limit prolonged strenuous outdoor activity." });
    else if (aqiVal <= 1)
      insights.push({ icon: "🌿", level: "good", text: "Excellent air quality! A perfect day for outdoor exercise and enjoying fresh air." });
  }

  if (insights.length === 0)
    insights.push({ icon: "🌤️", level: "info", text: "Conditions look comfortable overall — a pleasant day ahead!" });

  return insights.slice(0, 6);
}

// ─── Activity Suggestions ────────────────────────────────────────────────────
export function getActivitySuggestions(current, aqi) {
  if (!current) return [];
  const temp = current.main?.temp;
  const weatherId = current.weather?.[0]?.id;
  const windSpeed = current.wind?.speed ?? 0;
  const aqiVal = aqi?.list?.[0]?.main?.aqi ?? 1;

  const isRaining = weatherId >= 300 && weatherId < 700;
  const isStormy  = weatherId >= 200 && weatherId < 300;
  const isSnowy   = weatherId >= 600 && weatherId < 700;
  const goodAir   = aqiVal <= 2;
  const goodTemp  = temp > 14 && temp < 35;

  return [
    {
      icon: "🏃", label: "Morning Run", cat: "Outdoor",
      ok: !isRaining && !isStormy && !isSnowy && goodTemp && goodAir && windSpeed < 12,
      reason: isRaining ? "Wet roads" : !goodAir ? "Poor air" : !goodTemp ? "Extreme temp" : "Perfect conditions",
    },
    {
      icon: "🚴", label: "Cycling", cat: "Outdoor",
      ok: !isRaining && !isStormy && windSpeed < 10 && goodTemp,
      reason: windSpeed >= 10 ? "Too windy" : isRaining ? "Wet roads" : "Great day to ride",
    },
    {
      icon: "⚽", label: "Football", cat: "Outdoor",
      ok: !isRaining && !isStormy && temp > 8 && temp < 35,
      reason: isRaining ? "Muddy pitch" : temp <= 8 ? "Too cold" : "Perfect pitch conditions",
    },
    {
      icon: "🗺️", label: "Sightseeing", cat: "Travel",
      ok: !isStormy && temp > 10 && temp < 38 && goodAir,
      reason: isStormy ? "Dangerous weather" : !goodAir ? "Poor air quality" : "Enjoy the views",
    },
    {
      icon: "🏕️", label: "Picnic", cat: "Outdoor",
      ok: !isRaining && !isStormy && temp > 16 && temp < 32 && goodAir,
      reason: isRaining ? "Pack an umbrella" : temp > 32 ? "Too hot" : "Ideal picnic weather",
    },
    {
      icon: "☕", label: "Café Visit", cat: "Indoor",
      ok: true,
      reason: "Always a good idea",
    },
    {
      icon: "🏊", label: "Indoor Pool", cat: "Indoor",
      ok: true,
      reason: "Weather-proof activity",
    },
    {
      icon: "✈️", label: "Travel", cat: "Travel",
      ok: !isStormy && windSpeed < 15,
      reason: isStormy ? "Storm warning" : windSpeed >= 15 ? "High winds" : "Clear skies for travel",
    },
  ];
}
