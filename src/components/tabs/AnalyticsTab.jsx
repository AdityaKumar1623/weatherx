import React from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useWeather } from "../../context/WeatherContext";
import { formatTime, displayTemp } from "../../utils/helpers";
import GlassCard from "../ui/GlassCard";

const TOOLTIP_STYLE = {
  contentStyle: {
    background: "rgba(10,14,30,0.95)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: "14px",
    fontSize: "12px",
    color: "#fff",
    padding: "10px 14px",
  },
  labelStyle: { color: "rgba(255,255,255,0.6)", marginBottom: 4 },
  itemStyle: { color: "rgba(255,255,255,0.85)" },
  cursor: { stroke: "rgba(255,255,255,0.08)" },
};

const AXIS_TICK = { fill: "rgba(255,255,255,0.38)", fontSize: 10 };
const GRID_COLOR = "rgba(255,255,255,0.05)";

export default function AnalyticsTab({ theme }) {
  const { forecast, unit } = useWeather();

  const raw = forecast?.list?.slice(0, 8) || [];

  const chartData = raw.map((item) => ({
    time:     formatTime(item.dt),
    temp:     Math.round(item.main?.temp ?? 0),
    feels:    Math.round(item.main?.feels_like ?? 0),
    humidity: item.main?.humidity ?? 0,
    wind:     Number((item.wind?.speed ?? 0).toFixed(1)),
    rain:     Math.round((item.pop ?? 0) * 100),
  }));

  const temps    = chartData.map((d) => d.temp);
  const maxTemp  = Math.max(...temps);
  const minTemp  = Math.min(...temps);
  const avgHum   = Math.round(chartData.reduce((a, d) => a + d.humidity, 0) / (chartData.length || 1));
  const maxWind  = Math.max(...chartData.map((d) => d.wind));

  const accent = theme.accentHex;

  return (
    <div className="space-y-4">
      {/* Temperature trend */}
      <GlassCard className="p-6">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-5">
          Temperature Trend — Next 24h
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ top: 5, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={accent} stopOpacity={0.45} />
                <stop offset="95%" stopColor={accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
            <XAxis dataKey="time" tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} unit="°" />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.5)", paddingTop: 8 }} />
            <Area
              type="monotone"
              dataKey="temp"
              name="Temperature (°)"
              stroke={accent}
              strokeWidth={2.5}
              fill="url(#tempGrad)"
              dot={{ r: 3, fill: accent, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="feels"
              name="Feels Like (°)"
              stroke="rgba(148,163,184,0.7)"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Humidity + Rain row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="p-6">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-5">
            Humidity (%)
          </h3>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={chartData} margin={{ top: 5, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
              <XAxis dataKey="time" tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar
                dataKey="humidity"
                name="Humidity %"
                fill="#60a5fa"
                fillOpacity={0.7}
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-5">
            Rain Probability (%)
          </h3>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={chartData} margin={{ top: 5, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
              <XAxis dataKey="time" tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Area
                type="monotone"
                dataKey="rain"
                name="Rain %"
                stroke="#38bdf8"
                strokeWidth={2}
                fill="url(#rainGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Wind speed */}
      <GlassCard className="p-6">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-5">
          Wind Speed (m/s)
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData} margin={{ top: 5, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
            <XAxis dataKey="time" tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} unit=" m/s" />
            <Tooltip {...TOOLTIP_STYLE} />
            <Line
              type="monotone"
              dataKey="wind"
              name="Wind Speed"
              stroke="#a78bfa"
              strokeWidth={2}
              dot={{ r: 3, fill: "#a78bfa", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: "🔺", label: "Max Temp",    val: displayTemp(maxTemp, unit) },
          { icon: "🔻", label: "Min Temp",    val: displayTemp(minTemp, unit) },
          { icon: "💧", label: "Avg Humidity", val: `${avgHum}%` },
          { icon: "💨", label: "Max Wind",    val: `${maxWind} m/s` },
        ].map((s) => (
          <GlassCard key={s.label} className="p-5 text-center">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-xl font-black" style={{ color: accent }}>{s.val}</div>
            <div className="text-xs text-white/40 mt-1">{s.label}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
