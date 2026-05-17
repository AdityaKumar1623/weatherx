import React from "react";
import { useWeather } from "../context/WeatherContext";

const TABS = ["overview", "forecast", "analytics", "compare"];

export default function TabNav({ theme }) {
  const { tab, dispatch } = useWeather();

  return (
    <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10 w-fit mb-6 overflow-x-auto scrollbar-thin">
      {TABS.map((t) => (
        <button
          key={t}
          onClick={() => dispatch({ type: "SET_TAB", payload: t })}
          className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all whitespace-nowrap ${
            tab === t ? "font-bold" : "text-white/45 hover:text-white/75"
          }`}
          style={tab === t ? { background: theme.accentHex, color: "#000" } : {}}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
