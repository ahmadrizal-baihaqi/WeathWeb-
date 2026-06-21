'use client';

import { useEffect, useState } from 'react';

export type TempUnit = 'celsius' | 'fahrenheit';
export type WindUnit = 'kmh' | 'ms' | 'mph';
export type TimeFormat = '24h' | '12h';

export interface AppSettings {
  tempUnit: TempUnit;
  windUnit: WindUnit;
  timeFormat: TimeFormat;
  cinematicMode: boolean;      // animated orbs / background effects
  autoRefresh: boolean;        // auto-refresh every 5 minutes
  showFeelsLike: boolean;      // show "feels like" row
  compactConditions: boolean;  // hide sub-labels in condition cards
}

const SETTINGS_KEY = 'skycast_settings';

const DEFAULTS: AppSettings = {
  tempUnit: 'celsius',
  windUnit: 'kmh',
  timeFormat: '24h',
  cinematicMode: true,
  autoRefresh: false,
  showFeelsLike: true,
  compactConditions: false,
};

function load(): AppSettings {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<AppSettings>) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function save(s: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);

  useEffect(() => {
    const loaded = load();
    const t = setTimeout(() => {
      setSettings(loaded);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      save(next);
      return next;
    });
  };

  return { settings, update };
}

// Conversion helpers
export function convertTemp(celsius: number, unit: TempUnit): number {
  if (unit === 'fahrenheit') return Math.round((celsius * 9) / 5 + 32);
  return celsius;
}

export function tempLabel(unit: TempUnit): string {
  return unit === 'fahrenheit' ? '°F' : '°C';
}

export function convertWind(kmh: number, unit: WindUnit): number {
  if (unit === 'ms') return Math.round(kmh / 3.6);
  if (unit === 'mph') return Math.round(kmh * 0.621371);
  return Math.round(kmh);
}

export function windLabel(unit: WindUnit): string {
  if (unit === 'ms') return 'm/s';
  if (unit === 'mph') return 'mph';
  return 'km/h';
}
