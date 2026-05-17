import React, { useEffect } from "react";
import { useWeather } from "../context/WeatherContext";
import { useGeoLocation } from "../hooks/useGeoLocation";
import { getWeatherTheme } from "../utils/helpers";
import Header from "./Header";
import SearchBar from "./SearchBar";
import TabNav from "./TabNav";
import OverviewTab from "./tabs/OverviewTab";
import ForecastTab from "./tabs/ForecastTab";
import AnalyticsTab from "./tabs/AnalyticsTab";
import CompareTab from "./tabs/CompareTab";
import SkeletonLoader from "./ui/SkeletonLoader";
import ErrorBanner from "./ui/ErrorBanner";
import EmptyState from "./ui/EmptyState";

export default function Dashboard() {
  useGeoLocation();

  const { current, loading, error, tab } = useWeather();

  const weatherId = current?.weather?.[0]?.id;
  const now = Date.now() / 1000;
  const isNight = current
    ? now > current.sys?.sunset || now < current.sys?.sunrise
    : false;
  const theme = getWeatherTheme(weatherId, isNight);

  // Persist accent CSS variable for charts
  useEffect(() => {
    document.documentElement.style.setProperty("--wx-accent", theme.accentHex);
  }, [theme.accentHex]);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.bg} text-white transition-all duration-1000`}
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Ambient glow orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-40 -left-40 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-20 transition-all duration-1000"
          style={{ background: theme.accentHex }}
        />
        <div
          className="absolute top-1/2 -right-40 w-80 h-80 rounded-full blur-3xl opacity-15 transition-all duration-1000"
          style={{ background: theme.accentHex }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full blur-3xl opacity-10 transition-all duration-1000"
          style={{ background: theme.accentHex }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Header theme={theme} />
        <SearchBar theme={theme} />

        {error && <ErrorBanner message={error} />}

        {loading && <SkeletonLoader />}

        {!loading && current && (
          <>
            <TabNav theme={theme} />
            {tab === "overview"  && <OverviewTab  theme={theme} />}
            {tab === "forecast"  && <ForecastTab  theme={theme} />}
            {tab === "analytics" && <AnalyticsTab theme={theme} />}
            {tab === "compare"   && <CompareTab   theme={theme} />}
          </>
        )}

        {!loading && !current && !error && <EmptyState />}

        <footer className="mt-12 pb-4 text-center text-xs text-white/20">
          WeatherX &nbsp;·&nbsp; Powered by OpenWeatherMap &nbsp;·&nbsp; Built with React + Recharts
        </footer>
      </div>
    </div>
  );
}
