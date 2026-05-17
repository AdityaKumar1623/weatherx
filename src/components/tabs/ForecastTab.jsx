import React from "react";
import { useWeather } from "../../context/WeatherContext";
import { displayTemp, formatDay, formatTime } from "../../utils/helpers";
import GlassCard from "../ui/GlassCard";
import WeatherIcon from "../ui/WeatherIcon";

export default function ForecastTab({ theme }) {
  const { forecast, unit } = useWeather();

  // One entry per day (every 8th 3-hour slot = ~24h apart)
  const dailyForecast = forecast?.list?.filter((_, i) => i % 8 === 0).slice(0, 5) || [];
  const hourly        = forecast?.list?.slice(0, 12) || [];

  return (
    <div className="space-y-4">
      {/* 5-day cards */}
      <GlassCard className="p-6">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-5">
          5-Day Forecast
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {dailyForecast.map((day, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-4 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.09] transition-all"
            >
              <p className="text-xs text-white/45 font-semibold mb-3">
                {formatDay(day.dt, i)}
              </p>
              <WeatherIcon id={day.weather?.[0]?.id} size={34} />
              <p className="text-[10px] text-white/40 mt-2 capitalize text-center">
                {day.weather?.[0]?.description}
              </p>
              <div className="flex items-center gap-1.5 mt-3">
                <span
                  className="text-sm font-bold"
                  style={{ color: theme.accentHex }}
                >
                  {displayTemp(day.main?.temp_max, unit)}
                </span>
                <span className="text-white/25 text-xs">/</span>
                <span className="text-sm text-white/45">
                  {displayTemp(day.main?.temp_min, unit)}
                </span>
              </div>
              <div className="mt-2 text-xs text-white/30 flex items-center gap-1">
                💧 {day.main?.humidity}%
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Hourly scroll */}
      <GlassCard className="p-6">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-5">
          Hourly Breakdown
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {hourly.map((h, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-3 rounded-xl bg-white/[0.05] border border-white/[0.08] flex-shrink-0 w-[72px]"
            >
              <span className="text-[10px] text-white/40 mb-1">{formatTime(h.dt)}</span>
              <WeatherIcon id={h.weather?.[0]?.id} size={22} />
              <span
                className="text-xs font-bold mt-1"
                style={{ color: theme.accentHex }}
              >
                {displayTemp(h.main?.temp, unit)}
              </span>
              <span className="text-[10px] text-blue-400 mt-1">
                {Math.round((h.pop || 0) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Extended conditions table */}
      <GlassCard className="p-6">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
          Detailed Conditions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="text-white/35 text-xs">
                {["Time", "Condition", "Temp", "Humidity", "Wind", "Rain %"].map((h) => (
                  <th key={h} className="text-left pb-3 pr-4 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {forecast?.list?.slice(0, 8).map((item, i) => (
                <tr
                  key={i}
                  className="border-t border-white/[0.05] hover:bg-white/[0.03] transition-colors"
                >
                  <td className="py-2.5 pr-4 text-white/55 text-xs">{formatTime(item.dt)}</td>
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-1.5">
                      <WeatherIcon id={item.weather?.[0]?.id} size={16} />
                      <span className="text-white/65 text-xs capitalize">
                        {item.weather?.[0]?.description}
                      </span>
                    </div>
                  </td>
                  <td
                    className="py-2.5 pr-4 font-bold text-xs"
                    style={{ color: theme.accentHex }}
                  >
                    {displayTemp(item.main?.temp, unit)}
                  </td>
                  <td className="py-2.5 pr-4 text-white/65 text-xs">{item.main?.humidity}%</td>
                  <td className="py-2.5 pr-4 text-white/65 text-xs">{item.wind?.speed} m/s</td>
                  <td className="py-2.5 text-blue-400 text-xs">
                    {Math.round((item.pop || 0) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
