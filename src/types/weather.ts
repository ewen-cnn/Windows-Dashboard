export type WeatherLocation = {
  latitude: number;
  longitude: number;
  city?: string;
};

export type WeatherData = {
  temperature: number;
  windSpeed: number;
  weatherCode: number;
  description: string;
  time: string;
};