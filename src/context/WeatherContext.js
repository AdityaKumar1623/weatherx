import React, { createContext, useContext, useReducer, useCallback } from "react";
import {
  fetchWeatherByCity,
  fetchForecastByCity,
  fetchWeatherByCoords,
  fetchForecastByCoords,
  fetchAQI,
} from "../utils/api";

const WeatherContext = createContext(null);

const initialState = {
  current: null,
  forecast: null,
  aqi: null,
  loading: false,
  error: null,
  unit: "C",
  tab: "overview",
  history: JSON.parse(localStorage.getItem("wx_history") || "[]"),
  compareWeather: null,
  compareAqi: null,
  compareLoading: false,
  compareError: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":      return { ...state, loading: action.payload, error: null };
    case "SET_ERROR":        return { ...state, error: action.payload, loading: false };
    case "SET_WEATHER":      return { ...state, current: action.payload, loading: false, error: null };
    case "SET_FORECAST":     return { ...state, forecast: action.payload };
    case "SET_AQI":          return { ...state, aqi: action.payload };
    case "SET_UNIT":         return { ...state, unit: action.payload };
    case "SET_TAB":          return { ...state, tab: action.payload };
    case "SET_HISTORY":      return { ...state, history: action.payload };
    case "SET_COMPARE":      return { ...state, compareWeather: action.weather, compareAqi: action.aqi, compareLoading: false, compareError: null };
    case "SET_COMPARE_LOAD": return { ...state, compareLoading: action.payload, compareError: null };
    case "SET_COMPARE_ERR":  return { ...state, compareError: action.payload, compareLoading: false };
    case "CLEAR_COMPARE":    return { ...state, compareWeather: null, compareAqi: null };
    default: return state;
  }
}

export function WeatherProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const saveHistory = useCallback((city) => {
    const updated = [city, ...(state.history.filter(h => h.toLowerCase() !== city.toLowerCase()))].slice(0, 6);
    dispatch({ type: "SET_HISTORY", payload: updated });
    localStorage.setItem("wx_history", JSON.stringify(updated));
  }, [state.history]);

  const loadCity = useCallback(async (city) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const [weather, forecast] = await Promise.all([
        fetchWeatherByCity(city),
        fetchForecastByCity(city),
      ]);
      dispatch({ type: "SET_WEATHER", payload: weather });
      dispatch({ type: "SET_FORECAST", payload: forecast });
      const aqiData = await fetchAQI(weather.coord.lat, weather.coord.lon);
      dispatch({ type: "SET_AQI", payload: aqiData });
      saveHistory(city);
    } catch (e) {
      dispatch({ type: "SET_ERROR", payload: e.message });
    }
  }, [saveHistory]);

  const loadByCoords = useCallback(async (lat, lon) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const [weather, forecast] = await Promise.all([
        fetchWeatherByCoords(lat, lon),
        fetchForecastByCoords(lat, lon),
      ]);
      dispatch({ type: "SET_WEATHER", payload: weather });
      dispatch({ type: "SET_FORECAST", payload: forecast });
      const aqiData = await fetchAQI(lat, lon);
      dispatch({ type: "SET_AQI", payload: aqiData });
    } catch (e) {
      dispatch({ type: "SET_ERROR", payload: e.message });
    }
  }, []);

  const loadCompare = useCallback(async (city) => {
    dispatch({ type: "SET_COMPARE_LOAD", payload: true });
    try {
      const weather = await fetchWeatherByCity(city);
      const aqiData = await fetchAQI(weather.coord.lat, weather.coord.lon);
      dispatch({ type: "SET_COMPARE", weather, aqi: aqiData });
    } catch (e) {
      dispatch({ type: "SET_COMPARE_ERR", payload: e.message });
    }
  }, []);

  const value = {
    ...state,
    dispatch,
    loadCity,
    loadByCoords,
    loadCompare,
  };

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeather() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("useWeather must be used inside WeatherProvider");
  return ctx;
}
