import { useEffect } from "react";
import { useWeather } from "../context/WeatherContext";

/**
 * On mount, requests the browser's geolocation.
 * Falls back to London if permission is denied or unavailable.
 */
export function useGeoLocation() {
  const { loadByCoords, loadCity } = useWeather();

  useEffect(() => {
    if (!navigator.geolocation) {
      loadCity("London");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => loadByCoords(coords.latitude, coords.longitude),
      ()           => loadCity("London"),
      { timeout: 8000, maximumAge: 300000 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
