'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getWeatherData } from '@/lib/weather';
import { WeatherData } from '@/types/weather';

export function useWeather(initialCity: string = "Jakarta") {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFirstLoad = useRef(true);

  const fetchWeather = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherData(query);
      setWeather(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Gagal mengambil data cuaca";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByCoords = useCallback((lat: number, lon: number) => {
    fetchWeather(`${lat},${lon}`);
  }, [fetchWeather]);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolokasi tidak didukung oleh browser Anda");
      fetchWeather(initialCity);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchByCoords(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.warn("Akses geolokasi ditolak:", error.message);
        fetchWeather(initialCity);
      }
    );
  }, [fetchByCoords, fetchWeather, initialCity]);

  useEffect(() => {
    if (isFirstLoad.current) {
      fetchWeather(initialCity);
      isFirstLoad.current = false;
    }
  }, [fetchWeather, initialCity]);

  return { 
    weather, 
    loading, 
    error, 
    fetchWeather, 
    detectLocation 
  };
}
