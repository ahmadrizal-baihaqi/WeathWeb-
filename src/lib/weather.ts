import { WeatherData, ForecastDay, HourlyData } from "@/types/weather";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = "https://api.weatherapi.com/v1";

export async function getWeatherData(query: string): Promise<WeatherData> {
  // If no API key, return detailed mock data for development
  if (!API_KEY || API_KEY === "YOUR_API_KEY" || !API_KEY.trim()) {
    console.warn("WeatherAPI key not found. Returning mock data.");
    
    // Determine city name from query for mock feel
    const mockCity = query.includes(',') ? "Lokasi Saya" : query.charAt(0).toUpperCase() + query.slice(1);

    const mockHourly: HourlyData[] = Array.from({ length: 24 }).map((_, i) => ({
      time: `${String(i).padStart(2, '0')}:00`,
      temp: 28 + Math.sin(i / 4) * 3,
      condition: i > 6 && i < 18 ? "Cerah" : "Cerah Berawan",
      icon: i > 6 && i < 18 ? "sunny" : "clear"
    }));

    return {
      city: mockCity === "Jakarta" ? "Jakarta" : mockCity,
      country: "Indonesia",
      lat: -6.2,
      lon: 106.8,
      temp: 30,
      condition: "Cerah Berawan",
      description: "Cerah Berawan",
      humidity: 75,
      windSpeed: 10,
      uvIndex: 8,
      visibility: 10,
      precipitation: 5,
      feelsLike: 33,
      icon: "cloudy",
      forecast: [
        { date: "Besok", maxTemp: 32, minTemp: 25, condition: "Hujan Ringan", icon: "rain" },
        { date: "Sen", maxTemp: 31, minTemp: 24, condition: "Cerah Berawan", icon: "cloudy" },
        { date: "Sel", maxTemp: 33, minTemp: 26, condition: "Cerah", icon: "sunny" },
        { date: "Rab", maxTemp: 30, minTemp: 24, condition: "Hujan", icon: "rain" },
        { date: "Kam", maxTemp: 31, minTemp: 25, condition: "Berawan", icon: "cloudy" },
      ],
      hourly: mockHourly
    };
  }

  try {
    // Added lang=id for Indonesian response from API
    const res = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${query}&days=5&aqi=no&alerts=yes&lang=id`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.error?.message || "Gagal mengambil data cuaca");

    const forecast: ForecastDay[] = data.forecast.forecastday.map((day: any) => ({
      date: new Date(day.date).toLocaleDateString('id-ID', { weekday: 'short' }),
      maxTemp: Math.round(day.day.maxtemp_c),
      minTemp: Math.round(day.day.mintemp_c),
      condition: day.day.condition.text,
      icon: day.day.condition.icon
    }));

    const hourly: HourlyData[] = data.forecast.forecastday[0].hour.map((h: any) => ({
      time: h.time.split(' ')[1],
      temp: Math.round(h.temp_c),
      condition: h.condition.text,
      icon: h.condition.icon
    }));

    return {
      city: data.location.name,
      country: data.location.country,
      lat: data.location.lat,
      lon: data.location.lon,
      temp: Math.round(data.current.temp_c),
      condition: data.current.condition.text,
      description: data.current.condition.text,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_kph,
      uvIndex: data.current.uv,
      visibility: data.current.vis_km,
      precipitation: data.current.precip_mm,
      feelsLike: Math.round(data.current.feelslike_c),
      icon: data.current.condition.icon,
      forecast: forecast,
      hourly: hourly
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
}
