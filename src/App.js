import React from "react";
import { WeatherProvider } from "./context/WeatherContext";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <WeatherProvider>
      <Dashboard />
    </WeatherProvider>
  );
}
