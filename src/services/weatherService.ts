import type { WeatherData, WeatherLocation } from "../types/weather";

function buildWeatherUrl(location: WeatherLocation): URL {
  const url = new URL("https://api.open-meteo.com/v1/forecast");

  url.searchParams.set("latitude", String(location.latitude));
  url.searchParams.set("longitude", String(location.longitude));
  url.searchParams.set(
    "current",
    "temperature_2m,wind_speed_10m,weather_code"
  );
  url.searchParams.set("timezone", "auto");

  return url;
}

export function getWeatherDescription(weatherCode: number): string {
  switch (weatherCode) {
    case 0:
      return "Ciel degage";
    case 1:
      return "Principalement clair";
    case 2:
      return "Partiellement nuageux";
    case 3:
      return "Couvert";
    case 45:
    case 48:
      return "Brouillard";
    case 51:
    case 53:
    case 55:
      return "Bruine";
    case 61:
    case 63:
    case 65:
      return "Pluie";
    case 71:
    case 73:
    case 75:
      return "Neige";
    case 80:
    case 81:
    case 82:
      return "Averses";
    case 95:
      return "Orage";
    default:
      return "Conditions inconnues";
  }
}

export async function fetchWeather(
  location: WeatherLocation
): Promise<WeatherData> {
  const url = buildWeatherUrl(location);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erreur meteo HTTP ${response.status}`);
  }

  const data = await response.json();

  if (!data.current) {
    throw new Error("Reponse meteo invalide : champ current manquant.");
  }

  const current = data.current;
  const weatherCode = current.weather_code;

  return {
    temperature: current.temperature_2m,
    windSpeed: current.wind_speed_10m,
    weatherCode,
    description: getWeatherDescription(weatherCode),
    time: current.time,
  };
}
