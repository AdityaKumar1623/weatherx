import React, { useState } from "react";
import { useWeather } from "../../context/WeatherContext";
import { displayTemp, aqiLabel, aqiColor } from "../../utils/helpers";
import GlassCard from "../ui/GlassCard";
import WeatherIcon from "../ui/WeatherIcon";

function CityCard({ weather, aqi, unit, accentHex, label }) {
  const aqiVal = aqi?.list?.[0]?.main?.aqi;
  const pm25   = aqi?.list?.[0]?.components?.pm2_5?.toFixed(1);
  const pm10   = aqi?.list?.[0]?.components?.pm10?.toFixed(1);

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-white/35 border border-white/15 px-2 py-0.5 rounded-md">
          {label}
        </span>
      </div>

      <h3 className="text-xl font-bold mb-1" style={{ color: accentHex }}>
        {weather.name}, {weather.sys?.country}
      </h3>

      <div className="flex items-center gap-4 my-5">
        <WeatherIcon id={weather.weather?.[0]?.id} size={52} />
        <div>
          <div className="text-4xl font-black leading-none">
            {displayTemp(weather.main?.temp, unit)}
          </div>
          <div className="text-sm text-white/50 capitalize mt-1">
            {weather.weather?.[0]?.description}
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {[
          ["Feels Like",  displayTemp(weather.main?.feels_like, unit)],
          ["Humidity",    `${weather.main?.humidity}%`],
          ["Wind Speed",  `${weather.wind?.speed} m/s`],
          ["Pressure",    `${weather.main?.pressure} hPa`],
          ["Visibility",  `${((weather.visibility || 0) / 1000).toFixed(1)} km`],
          ["AQI",         aqiVal ? `${aqiLabel(aqiVal)} (${aqiVal})` : "N/A"],
          ["PM2.5",       pm25 ? `${pm25} μg/m³` : "N/A"],
          ["PM10",        pm10 ? `${pm10} μg/m³` : "N/A"],
        ].map(([k, v]) => (
          <div
            key={k}
            className="flex justify-between items-center text-sm border-b border-white/[0.05] pb-2 last:border-0 last:pb-0"
          >
            <span className="text-white/40">{k}</span>
            <span
              className="font-medium"
              style={k === "AQI" ? { color: aqiColor(aqiVal) } : { color: "rgba(255,255,255,0.8)" }}
            >
              {v}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

export default function CompareTab({ theme }) {
  const { current, aqi, unit, compareWeather, compareAqi, compareLoading, compareError, loadCompare, dispatch } = useWeather();
  const [input, setInput] = useState("");

  const handleCompare = () => {
    if (input.trim()) loadCompare(input.trim());
  };

  return (
    <div className="space-y-4">
      {/* Search input */}
      <GlassCard className="p-4 flex flex-col sm:flex-row gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCompare()}
          placeholder="Enter a city to compare side-by-side…"
          className="flex-1 bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-white/25 transition-colors"
        />
        <div className="flex gap-2">
          <button
            onClick={handleCompare}
            disabled={compareLoading}
            className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80 disabled:opacity-50"
            style={{ background: theme.accentHex, color: "#000" }}
          >
            {compareLoading ? "Loading…" : "Compare"}
          </button>
          {compareWeather && (
            <button
              onClick={() => { dispatch({ type: "CLEAR_COMPARE" }); setInput(""); }}
              className="px-4 py-2.5 rounded-xl text-sm font-bold border border-white/15 text-white/50 hover:text-white hover:border-white/30 transition-all"
            >
              Clear
            </button>
          )}
        </div>
      </GlassCard>

      {compareError && (
        <GlassCard className="p-4 border-red-500/30 bg-red-500/10">
          <p className="text-red-400 text-sm">⚠️ {compareError}</p>
        </GlassCard>
      )}

      {/* Comparison grid */}
      {compareWeather ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CityCard
              weather={current}
              aqi={aqi}
              unit={unit}
              accentHex={theme.accentHex}
              label="City A"
            />
            <CityCard
              weather={compareWeather}
              aqi={compareAqi}
              unit={unit}
              accentHex="#a78bfa"
              label="City B"
            />
          </div>

          {/* Delta comparison bar */}
          <GlassCard className="p-6">
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
              Comparison Snapshot
            </h3>
            <div className="space-y-3">
              {[
                {
                  label: "Temperature",
                  a: current.main?.temp,
                  b: compareWeather.main?.temp,
                  fmt: (v) => displayTemp(v, unit),
                },
                {
                  label: "Humidity",
                  a: current.main?.humidity,
                  b: compareWeather.main?.humidity,
                  fmt: (v) => `${v}%`,
                  max: 100,
                },
                {
                  label: "Wind Speed",
                  a: current.wind?.speed,
                  b: compareWeather.wind?.speed,
                  fmt: (v) => `${v} m/s`,
                },
              ].map(({ label, a, b, fmt, max }) => {
                const total = max || Math.max(Math.abs(a), Math.abs(b), 1);
                const pctA = Math.min(100, (Math.abs(a) / total) * 100);
                const pctB = Math.min(100, (Math.abs(b) / total) * 100);
                return (
                  <div key={label}>
                    <div className="flex justify-between text-xs text-white/45 mb-1.5">
                      <span>{label}</span>
                      <span>
                        <span style={{ color: theme.accentHex }}>{fmt(a)}</span>
                        {" vs "}
                        <span style={{ color: "#a78bfa" }}>{fmt(b)}</span>
                      </span>
                    </div>
                    <div className="flex gap-1 h-2">
                      <div className="flex-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pctA}%`, background: theme.accentHex }}
                        />
                      </div>
                      <div className="flex-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pctB}%`, background: "#a78bfa" }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </>
      ) : (
        !compareLoading && (
          <GlassCard className="p-16 text-center">
            <div className="text-6xl mb-4">⚖️</div>
            <p className="text-white/40 text-sm">
              Enter a second city above to compare weather conditions side-by-side
            </p>
          </GlassCard>
        )
      )}

      {compareLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-72 rounded-2xl bg-white/[0.06] animate-pulse" />
          <div className="h-72 rounded-2xl bg-white/[0.06] animate-pulse" />
        </div>
      )}
    </div>
  );
}
