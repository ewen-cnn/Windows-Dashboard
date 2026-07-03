import { useEffect, useState } from "react";
import type { WeatherData } from "../../types/weather";
import { fetchWeather } from "../../services/weatherService";

const hourlyForecast = [
  ["16", "22"],
  ["17", "20"],
  ["18", "19"],
  ["19", "18"],
  ["18:14", "17"],
];

const dailyForecast = [
  ["Sun", "14", "24"],
  ["Mon", "15", "22"],
  ["Tue", "15", "23"],
  ["Wed", "13", "26"],
  ["Thu", "15", "22"],
];

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWeather() {
      try {
        const data = await fetchWeather({
          latitude: 48.3904,
          longitude: -4.4861,
          city: "Brest",
        });

        setWeather(data);
      } catch (error) {
        console.error(error);
        setError("Meteo indisponible");
      }
    }

    loadWeather();
  }, []);

  const temperature = weather ? Math.round(weather.temperature) : 22;
  const description = weather?.description ?? "Mostly Cloudy";

  return (
    <div className="weather-widget">
      <div className="weather-current">
        <div>
          <span>Brest</span>
          <strong>{temperature}&deg;</strong>
        </div>
        <p>{error ?? description}</p>
      </div>

      <div className="hourly-weather" aria-label="Previsions horaires">
        {hourlyForecast.map(([hour, temp]) => (
          <span key={hour}>
            <b>{hour}</b>
            <i aria-hidden="true" />
            {temp}&deg;
          </span>
        ))}
      </div>

      <div className="daily-weather" aria-label="Previsions quotidiennes">
        {dailyForecast.map(([day, low, high]) => (
          <p key={day}>
            <b>{day}</b>
            <span>{low}&deg;</span>
            <i aria-hidden="true" />
            <strong>{high}&deg;</strong>
          </p>
        ))}
      </div>
    </div>
  );
}
