import React from "react";
import { useWeather } from "../../context/WeatherContext";
import { displayTemp, formatTime, formatFullDate, aqiLabel, aqiColor } from "../../utils/helpers";
import { generateInsights, getActivitySuggestions } from "../../utils/intelligence";
import GlassCard from "../ui/GlassCard";
import WeatherIcon from "../ui/WeatherIcon";

export default function OverviewTab({ theme }) {
  const { current, aqi, unit } = useWeather();

  const weatherId = current.weather?.[0]?.id;
  const aqiVal    = aqi?.list?.[0]?.main?.aqi;
  const pm25      = aqi?.list?.[0]?.components?.pm2_5?.toFixed(1);
  const pm10      = aqi?.list?.[0]?.components?.pm10?.toFixed(1);
  const insights  = generateInsights(current, aqi);
  const activities = getActivitySuggestions(current, aqi);

  const INSIGHT_STYLES = {
    danger: "bg-red-500/10 border-red-500/25",
    warn:   "bg-yellow-500/10 border-yellow-500/25",
    good:   "bg-green-500/10 border-green-500/25",
    info:   "bg-blue-500/10 border-blue-500/25",
  };

  return (
    <div className="space-y-4">
      {/* ── Hero row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Main card */}
        <GlassCard className="lg:col-span-2 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold leading-tight">
                {current.name},{" "}
                <span className="text-white/50 font-medium">{current.sys?.country}</span>
              </h2>
              <p className="text-white/35 text-sm mt-1">📅 {formatFullDate()}</p>
            </div>
            <WeatherIcon id={weatherId} size={64} />
          </div>

          {/* Temperature */}
          <div className="flex items-end gap-5 mb-6">
            <div
              className="text-7xl font-black tracking-tighter leading-none"
              style={{ color: theme.accentHex }}
            >
              {displayTemp(current.main?.temp, unit)}
            </div>
            <div className="mb-1">
              <p className="text-lg font-medium capitalize text-white/80">
                {current.weather?.[0]?.description}
              </p>
              <p className="text-sm text-white/40">
                Feels like {displayTemp(current.main?.feels_like, unit)}
              </p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: "💧", label: "Humidity",    val: `${current.main?.humidity}%` },
              { icon: "💨", label: "Wind",         val: `${current.wind?.speed} m/s` },
              { icon: "🌡️", label: "Pressure",    val: `${current.main?.pressure} hPa` },
              { icon: "👁️", label: "Visibility",  val: `${((current.visibility || 0) / 1000).toFixed(1)} km` },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/[0.05] border border-white/[0.07] rounded-xl p-3"
              >
                <div className="text-lg mb-1">{s.icon}</div>
                <div className="text-sm font-semibold text-white/90">{s.val}</div>
                <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Sunrise / Sunset */}
          <div className="flex gap-5 mt-4 pt-4 border-t border-white/[0.06]">
            <span className="text-sm text-white/45 flex items-center gap-1.5">
              🌅 Sunrise{" "}
              <span className="text-white/75 font-medium">{formatTime(current.sys?.sunrise)}</span>
            </span>
            <span className="text-sm text-white/45 flex items-center gap-1.5">
              🌇 Sunset{" "}
              <span className="text-white/75 font-medium">{formatTime(current.sys?.sunset)}</span>
            </span>
          </div>
        </GlassCard>

        {/* AQI card */}
        <GlassCard className="p-6 flex flex-col">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
            Air Quality Index
          </h3>

          <div className="text-center mb-2">
            <div
              className="text-6xl font-black leading-none mb-1"
              style={{ color: aqiColor(aqiVal) }}
            >
              {aqiVal || "--"}
            </div>
            <div className="text-base font-semibold" style={{ color: aqiColor(aqiVal) }}>
              {aqiLabel(aqiVal)}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden my-4">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(100, (aqiVal || 0) * 20)}%`,
                background: `linear-gradient(90deg, #22c55e, ${aqiColor(aqiVal)})`,
              }}
            />
          </div>

          {/* Pollutants */}
          <div className="space-y-2 mb-4">
            {[
              ["PM2.5", pm25, "μg/m³"],
              ["PM10",  pm10, "μg/m³"],
            ].map(([name, val, u]) => (
              <div key={name} className="flex justify-between items-center">
                <span className="text-xs text-white/40">{name}</span>
                <span className="text-sm font-semibold text-white/80">
                  {val || "--"}{" "}
                  <span className="text-white/30 text-xs">{u}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="mt-auto p-3 rounded-xl text-xs text-white/45 bg-white/[0.05] border border-white/[0.06] leading-relaxed">
            💡{" "}
            {aqiVal >= 4
              ? "Limit all outdoor activity"
              : aqiVal === 3
              ? "Sensitive groups stay indoors"
              : aqiVal <= 1
              ? "Ideal for outdoor exercise"
              : "Acceptable conditions today"}
          </div>
        </GlassCard>
      </div>

      {/* ── Insights ── */}
      <GlassCard className="p-6">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
          🧠 Weather Intelligence
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {insights.map((ins, i) => (
            <div
              key={i}
              className={`flex gap-3 p-3 rounded-xl border ${INSIGHT_STYLES[ins.level]}`}
            >
              <span className="text-2xl flex-shrink-0 mt-0.5">{ins.icon}</span>
              <p className="text-sm text-white/80 leading-relaxed">{ins.text}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* ── Activities ── */}
      <GlassCard className="p-6">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
          🎯 Activity Recommendations
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {activities.map((act, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border text-center transition-all ${
                act.ok
                  ? "bg-green-500/10 border-green-500/25"
                  : "bg-red-500/[0.07] border-red-500/15 opacity-65"
              }`}
            >
              <div className="text-2xl mb-1.5">{act.icon}</div>
              <div className="text-xs font-semibold text-white/85">{act.label}</div>
              <div
                className={`text-xs mt-1 font-bold ${
                  act.ok ? "text-green-400" : "text-red-400"
                }`}
              >
                {act.ok ? "✓ Suitable" : "✗ Avoid"}
              </div>
              <div className="text-[10px] text-white/30 mt-0.5">{act.cat}</div>
              <div className="text-[10px] text-white/25 mt-1 italic leading-tight">
                {act.reason}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
