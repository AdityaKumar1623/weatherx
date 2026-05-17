import React, { useState, useRef, useEffect } from "react";
import { useWeather } from "../context/WeatherContext";
import { fetchCitySuggestions } from "../utils/api";
import { useDebounce } from "../hooks/useDebounce";

export default function SearchBar({ theme }) {
  const { loadCity, history } = useWeather();
  const [query, setQuery]               = useState("");
  const [suggestions, setSuggestions]   = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapRef = useRef(null);
  const debounced = useDebounce(query, 380);

  // Fetch autocomplete suggestions
  useEffect(() => {
    if (debounced.length < 2) { setSuggestions([]); return; }
    fetchCitySuggestions(debounced)
      .then((s) => { setSuggestions(s); setShowDropdown(s.length > 0); })
      .catch(() => setSuggestions([]));
  }, [debounced]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const submit = (city) => {
    const c = city || query.trim();
    if (!c) return;
    loadCity(c);
    setQuery(c);
    setShowDropdown(false);
    setSuggestions([]);
  };

  return (
    <div className="mb-6" ref={wrapRef}>
      {/* Search input */}
      <div className="relative">
        <div className="glass rounded-2xl flex items-center gap-3 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <span className="text-white/35 text-lg select-none">🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            onFocus={() => suggestions.length && setShowDropdown(true)}
            placeholder="Search any city worldwide..."
            className="flex-1 bg-transparent outline-none text-white placeholder-white/30 text-sm"
            aria-label="Search city"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); setSuggestions([]); setShowDropdown(false); }}
              className="text-white/30 hover:text-white/60 transition-colors text-lg leading-none"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
          <button
            onClick={() => submit()}
            className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-80 flex-shrink-0"
            style={{ background: theme.accentHex, color: "#000" }}
          >
            Search
          </button>
        </div>

        {/* Autocomplete dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute top-full mt-2 w-full z-50 glass rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => submit(s.city)}
                className="w-full text-left px-4 py-2.5 text-sm text-white/75 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2 border-b border-white/5 last:border-0"
              >
                <span className="text-white/35 text-xs">📍</span>
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Recent city history pills */}
      {history.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-3">
          <span className="text-xs text-white/30">Recent:</span>
          {history.map((city) => (
            <button
              key={city}
              onClick={() => submit(city)}
              className="px-3 py-1 rounded-full text-xs border border-white/10 bg-white/5 hover:bg-white/15 text-white/55 hover:text-white transition-all"
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
