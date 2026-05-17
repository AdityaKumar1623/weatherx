import React from "react";
import { useWeather } from "../context/WeatherContext";

export default function Header({ theme }) {
  const { unit, dispatch } = useWeather();

  const toggleUnit = () =>
    dispatch({ type: "SET_UNIT", payload: unit === "C" ? "F" : "C" });

  return (
    <header className="flex items-center justify-between mb-8">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{
            background: `${theme.accentHex}25`,
            border: `1px solid ${theme.accentHex}45`,
          }}
        >
          🌐
        </div>
        <div>
          <h1
            className="text-2xl font-black tracking-tight leading-none"
            style={{ color: theme.accentHex }}
          >
            WeatherX
          </h1>
          <p className="text-[11px] text-white/35 mt-0.5">
            Weather Intelligence Dashboard
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Unit toggle */}
        <button
          onClick={toggleUnit}
          className="px-3 py-1.5 rounded-lg text-sm font-bold border border-white/15 bg-white/5 hover:bg-white/10 transition-all"
          style={{ color: theme.accentHex }}
          aria-label="Toggle temperature unit"
        >
          °{unit === "C" ? "F" : "C"}
        </button>

        {/* Live badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-white/50">Live</span>
        </div>
      </div>
    </header>
  );
}
