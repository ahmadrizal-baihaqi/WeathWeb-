export interface HourlyData {
  time: string;
  temp: number;
  condition: string;
  icon: string;
}

export interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  icon: string;
}

export interface WeatherData {
  city: string;
  country: string;
  lat: number;
  lon: number;
  temp: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  visibility: number;
  precipitation: number;
  feelsLike: number;
  icon: string;
  forecast: ForecastDay[];
  hourly: HourlyData[];
  region: string;
  tzId: string;
}
