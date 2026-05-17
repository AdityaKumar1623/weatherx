import React from "react";
import { getWeatherEmoji } from "../../utils/helpers";

export default function WeatherIcon({ id, size = 48, className = "" }) {
  return (
    <span
      role="img"
      aria-label="weather icon"
      style={{ fontSize: size, lineHeight: 1 }}
      className={className}
    >
      {getWeatherEmoji(id)}
    </span>
  );
}
