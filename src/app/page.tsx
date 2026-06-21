'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Search, Wind, Droplets, Sun, Eye, CloudRain, Star, Trash2,
  LucideIcon, RefreshCw, Clapperboard, Clock, Thermometer, Gauge,
  LayoutList, SlidersHorizontal,
} from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';
import { useSettings, convertTemp, tempLabel, convertWind, windLabel, AppSettings } from '@/hooks/useSettings';
import SkyBackground from '@/components/effects/SkyBackground';
import SideNav from '@/components/ui/SideNav';
import HourlyChart from '@/components/weather/HourlyChart';
import ForecastList from '@/components/weather/ForecastList';
import SplashScreen from '@/components/ui/SplashScreen';

/* ─── Saved Cities helpers ─── */
const SAVED_CITIES_KEY = 'skycast_saved_cities';
interface SavedCity { name: string; region: string; }

function loadSavedCities(): SavedCity[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_CITIES_KEY);
    return raw ? (JSON.parse(raw) as SavedCity[]) : [];
  } catch { return []; }
}
function persistCities(cities: SavedCity[]) {
  localStorage.setItem(SAVED_CITIES_KEY, JSON.stringify(cities));
}

/* ─── Page ─── */
export default function WeatherPage() {
  const { weather, loading, fetchWeather, detectLocation } = useWeather('Jakarta');
  const { settings, update } = useSettings();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeView, setActiveView] = useState('dashboard');
  const [showSplash, setShowSplash] = useState(true);
  const [isMinTimeElapsed, setIsMinTimeElapsed] = useState(false);
  const [savedCities, setSavedCities] = useState<SavedCity[]>([]);
  const autoRefreshRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Load saved cities */
  useEffect(() => { setSavedCities(loadSavedCities()); }, []);

  /* Clock */
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* Splash minimum time */
  useEffect(() => {
    const t = setTimeout(() => setIsMinTimeElapsed(true), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading && isMinTimeElapsed) setShowSplash(false);
  }, [loading, isMinTimeElapsed]);

  /* Auto-refresh every 5 min */
  useEffect(() => {
    if (autoRefreshRef.current) clearInterval(autoRefreshRef.current);
    if (settings.autoRefresh && weather?.city) {
      autoRefreshRef.current = setInterval(() => {
        fetchWeather(weather.city);
      }, 5 * 60 * 1000);
    }
    return () => { if (autoRefreshRef.current) clearInterval(autoRefreshRef.current); };
  }, [settings.autoRefresh, weather?.city, fetchWeather]);

  /* Handlers */
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchCity = formData.get('city') as string;
    if (searchCity.trim()) { fetchWeather(searchCity.trim()); setActiveView('dashboard'); e.currentTarget.reset(); }
  };

  const tz = weather?.tzId || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour12: settings.timeFormat === '12h',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      timeZone: tz,
    });
  }, [tz, settings.timeFormat]);

  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString('id-ID', { weekday: 'long', month: 'short', day: '2-digit', timeZone: tz });
  }, [tz]);

  const isCitySaved = weather ? savedCities.some(c => c.name.toLowerCase() === weather.city.toLowerCase()) : false;

  const toggleSaveCity = () => {
    if (!weather) return;
    const updated = isCitySaved
      ? savedCities.filter(c => c.name.toLowerCase() !== weather.city.toLowerCase())
      : [...savedCities, { name: weather.city, region: weather.region }];
    setSavedCities(updated);
    persistCities(updated);
  };

  const removeCity = (cityName: string) => {
    const updated = savedCities.filter(c => c.name.toLowerCase() !== cityName.toLowerCase());
    setSavedCities(updated);
    persistCities(updated);
  };

  /* Derived display values */
  const displayTemp = (c: number | undefined) => c != null ? convertTemp(c, settings.tempUnit) : '--';
  const unit = tempLabel(settings.tempUnit);
  const displayWind = (v: number | undefined) => v != null ? convertWind(v, settings.windUnit) : '--';
  const wUnit = windLabel(settings.windUnit);

  return (
    <>
      <AnimatePresence>{showSplash && <SplashScreen />}</AnimatePresence>

      <div className="flex bg-slate-950 min-h-screen text-white overflow-hidden font-sans">
        <SideNav onDetectLocation={detectLocation} onNavigate={setActiveView} />

        <main className="flex-1 relative pr-20 h-screen overflow-hidden">
          <SkyBackground condition={weather?.condition || 'clear'} showEffects={settings.cinematicMode} />

          <div className="relative z-10 p-6 md:p-10 h-full flex flex-col gap-6 overflow-y-auto no-scrollbar">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                    {weather?.city}{weather?.country ? `, ${weather.country}` : ''}
                  </h2>
                  <button
                    onClick={toggleSaveCity}
                    title={isCitySaved ? 'Hapus dari simpanan' : 'Simpan kota ini'}
                    className={`p-1.5 rounded-xl transition-all ${isCitySaved ? 'text-yellow-400 hover:text-yellow-300' : 'text-slate-600 hover:text-slate-400'}`}
                  >
                    <Star className={`w-5 h-5 ${isCitySaved ? 'fill-yellow-400' : ''}`} />
                  </button>
                  {settings.autoRefresh && (
                    <span className="flex items-center gap-1 text-[9px] font-black text-blue-500 uppercase tracking-widest">
                      <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} /> Live
                    </span>
                  )}
                </div>
                {weather?.region && <div className="text-slate-500 font-mono text-xs mb-1">{weather.region}</div>}
                <div className="flex items-center gap-4 text-slate-600 font-mono text-xs">
                  <span>{weather?.lat?.toFixed(2)}° N, {weather?.lon?.toFixed(2)}° E</span>
                </div>

                <div className="mt-6 flex flex-col">
                  <span className="text-6xl font-black tracking-tighter text-glow tabular-nums">
                    {formatTime(currentTime)}
                  </span>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em] mt-1 pl-1">
                    {formatDate(currentTime)}
                  </span>
                  {weather?.tzId && (
                    <span className="text-[10px] font-mono text-slate-600 mt-1 pl-1 tracking-widest">
                      {weather.tzId.replace('_', ' ')}
                    </span>
                  )}
                </div>
              </motion.div>

              <motion.form onSubmit={handleSearch} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-sm">
                <div className="glass px-5 py-3 rounded-full flex items-center gap-4 group focus-within:bg-white/10 transition-all border border-white/5">
                  <Search className="w-4 h-4 text-slate-400 group-focus-within:text-white transition-colors" />
                  <input name="city" type="text" placeholder="Cari Kota (Jakarta, Tokyo...)"
                    className="bg-transparent border-none outline-none w-full text-base text-white placeholder:text-slate-500" />
                </div>
              </motion.form>
            </div>

            <AnimatePresence mode="wait">
              {/* ── Dashboard ── */}
              {activeView === 'dashboard' && (
                <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-6 flex-1">
                  <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                    {/* Temperature Card */}
                    <div className="relative flex-1 glass-dark rounded-[3rem] p-8 flex flex-col items-center justify-center overflow-hidden min-h-[350px]">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0" />
                      <div className="relative z-10 flex flex-col items-center">
                        <span className="text-[10rem] md:text-[13rem] font-black text-white text-glow leading-none flex items-start -ml-4 tabular-nums">
                          {displayTemp(weather?.temp)}
                          <span className="text-3xl text-slate-400 mt-10 ml-2">{unit}</span>
                        </span>
                        <div className="mt-4 flex flex-col items-center gap-4">
                          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                            <Sun className="w-16 h-16 text-white relative z-10 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
                          </motion.div>
                          <div className="text-center">
                            <h3 className="text-2xl font-black uppercase tracking-tight">{weather?.condition}</h3>
                            {settings.showFeelsLike && (
                              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">
                                TERASA SEPERTI {displayTemp(weather?.feelsLike)}{unit}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Conditions Card */}
                    <div className={`w-full lg:w-72 glass p-8 rounded-[3rem] flex flex-col ${settings.compactConditions ? 'gap-3' : 'gap-6'}`}>
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Kondisi</h3>
                      <div className={`flex flex-col ${settings.compactConditions ? 'gap-3' : 'gap-5'}`}>
                        <ConditionItem compact={settings.compactConditions} icon={Wind} label="Angin" value={`${displayWind(weather?.windSpeed)} ${wUnit}`} sub="BL" />
                        <ConditionItem compact={settings.compactConditions} icon={Droplets} label="Kelembaban" value={`${weather?.humidity ?? '--'}%`} sub="" />
                        <ConditionItem compact={settings.compactConditions} icon={Sun} label="Indeks UV" value={weather?.uvIndex?.toString() ?? '0'} sub={weather && weather.uvIndex > 5 ? 'Tinggi' : 'Rendah'} />
                        <ConditionItem compact={settings.compactConditions} icon={Eye} label="Visibilitas" value={`${weather?.visibility ?? '--'} km`} sub="" />
                        <ConditionItem compact={settings.compactConditions} icon={CloudRain} label="Presipitasi" value={`${weather?.precipitation ?? '--'}%`} sub="" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="flex flex-col lg:flex-row gap-6 pb-10">
                    <div className="w-full lg:w-[35%] flex flex-col gap-3">
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-4">Ramalan 5 Hari</h3>
                      <ForecastList forecast={weather?.forecast || []} tempUnit={settings.tempUnit} />
                    </div>
                    <div className="flex-1 flex flex-col gap-3">
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-4">Tren Per Jam</h3>
                      <HourlyChart hourly={weather?.hourly || []} tempUnit={settings.tempUnit} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Locations ── */}
              {activeView === 'locations' && (
                <LocationsView key="locations" savedCities={savedCities}
                  onSelect={(city) => { fetchWeather(city); setActiveView('dashboard'); }}
                  onRemove={removeCity} />
              )}

              {/* ── Settings ── */}
              {activeView === 'settings' && (
                <SettingsView key="settings" settings={settings} update={update} />
              )}
            </AnimatePresence>

          </div>
        </main>
      </div>
    </>
  );
}

/* ─── ConditionItem ─── */
function ConditionItem({ icon: Icon, label, value, sub, compact }: { icon: LucideIcon; label: string; value: string; sub: string; compact?: boolean; }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className={`${compact ? 'p-1.5' : 'p-2'} rounded-xl bg-white/5 group-hover:bg-blue-500/20 transition-all`}>
          <Icon className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} text-slate-400 group-hover:text-blue-400`} />
        </div>
        <div className="flex flex-col">
          {!compact && <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{label}</span>}
          <span className={`${compact ? 'text-sm' : 'text-base'} font-black tracking-tight`}>{value}</span>
        </div>
      </div>
      {!compact && <span className="text-[8px] font-black text-slate-600 uppercase">{sub}</span>}
    </div>
  );
}

/* ─── LocationsView ─── */
function LocationsView({ savedCities, onSelect, onRemove }: { savedCities: SavedCity[]; onSelect: (city: string) => void; onRemove: (city: string) => void; }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col gap-8 p-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black uppercase tracking-tighter">Lokasi Disimpan</h2>
        <p className="text-slate-500 font-bold tracking-[0.2em] text-xs">
          {savedCities.length === 0 ? 'BELUM ADA LOKASI TERSIMPAN' : `${savedCities.length} KOTA TERSIMPAN`}
        </p>
      </div>
      {savedCities.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="glass p-10 rounded-[2rem] max-w-md flex flex-col items-center gap-4 text-center">
          <Star className="w-12 h-12 text-slate-700" />
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Cari kota lalu tekan ★ untuk menyimpannya</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
          <AnimatePresence>
            {savedCities.map((city) => (
              <motion.div key={city.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} layout
                className="glass flex items-center justify-between p-6 rounded-[2rem] group">
                <button onClick={() => onSelect(city.name)} className="flex flex-col text-left flex-1">
                  <span className="text-xl font-black uppercase text-white group-hover:text-blue-400 transition-colors">{city.name}</span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{city.region}</span>
                </button>
                <button onClick={() => onRemove(city.name)} title="Hapus dari simpanan"
                  className="p-2 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-all ml-3 flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

/* ─── SettingsView ─── */
type UpdateFn = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;

function SettingsView({ settings, update }: { settings: AppSettings; update: UpdateFn }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col gap-8 p-4 pb-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black uppercase tracking-tighter">Pengaturan</h2>
        <p className="text-slate-500 font-bold tracking-[0.2em] text-xs">KONFIGURASI DASHBOARD ANDA</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">

        <SettingsCard icon={<Thermometer className="w-5 h-5" />} label="Satuan Suhu" description="Tampilan suhu di seluruh dashboard">
          <SegmentControl
            options={[{ label: '°C Celsius', value: 'celsius' }, { label: '°F Fahrenheit', value: 'fahrenheit' }]}
            value={settings.tempUnit}
            onChange={(v) => update('tempUnit', v as AppSettings['tempUnit'])}
          />
        </SettingsCard>

        <SettingsCard icon={<Wind className="w-5 h-5" />} label="Satuan Kecepatan Angin" description="Satuan kecepatan angin yang ditampilkan">
          <SegmentControl
            options={[{ label: 'km/h', value: 'kmh' }, { label: 'm/s', value: 'ms' }, { label: 'mph', value: 'mph' }]}
            value={settings.windUnit}
            onChange={(v) => update('windUnit', v as AppSettings['windUnit'])}
          />
        </SettingsCard>

        <SettingsCard icon={<Clock className="w-5 h-5" />} label="Format Jam" description="Format tampilan waktu di header">
          <SegmentControl
            options={[{ label: '24 Jam', value: '24h' }, { label: '12 Jam (AM/PM)', value: '12h' }]}
            value={settings.timeFormat}
            onChange={(v) => update('timeFormat', v as AppSettings['timeFormat'])}
          />
        </SettingsCard>

        <SettingsCard icon={<Clapperboard className="w-5 h-5" />} label="Mode Cinematic" description="Animasi orbs latar belakang yang bergerak">
          <Toggle value={settings.cinematicMode} onChange={(v) => update('cinematicMode', v)} />
        </SettingsCard>

        <SettingsCard icon={<RefreshCw className="w-5 h-5" />} label="Refresh Otomatis" description="Perbarui data cuaca setiap 5 menit">
          <Toggle value={settings.autoRefresh} onChange={(v) => update('autoRefresh', v)} />
        </SettingsCard>

        <SettingsCard icon={<Gauge className="w-5 h-5" />} label="Tampilkan Terasa Seperti" description="Suhu feels-like di bawah suhu utama">
          <Toggle value={settings.showFeelsLike} onChange={(v) => update('showFeelsLike', v)} />
        </SettingsCard>

        <SettingsCard icon={<LayoutList className="w-5 h-5" />} label="Tampilan Kondisi Ringkas" description="Menyembunyikan label dan sub-teks di kartu kondisi">
          <Toggle value={settings.compactConditions} onChange={(v) => update('compactConditions', v)} />
        </SettingsCard>

        {/* Reset tile */}
        <button
          onClick={() => {
            update('tempUnit', 'celsius');
            update('windUnit', 'kmh');
            update('timeFormat', '24h');
            update('cinematicMode', true);
            update('autoRefresh', false);
            update('showFeelsLike', true);
            update('compactConditions', false);
          }}
          className="glass p-6 rounded-[2rem] flex flex-col gap-3 text-left hover:bg-red-400/5 hover:border-red-400/20 border border-white/5 transition-all group"
        >
          <div className="p-2 bg-red-500/10 rounded-xl text-red-400 w-fit">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-black uppercase tracking-widest text-sm text-slate-400 group-hover:text-red-400 transition-colors">Reset ke Default</span>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">Kembalikan semua pengaturan</span>
          </div>
        </button>

      </div>
    </motion.div>
  );
}

/* ─── Settings Sub-components ─── */


function SettingsCard({ icon, label, description, children }: { icon: React.ReactNode; label: string; description: string; children: React.ReactNode }) {
  return (
    <div className="glass p-6 rounded-[2rem] flex flex-col gap-4 border border-white/5">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 flex-shrink-0">{icon}</div>
        <div className="flex flex-col">
          <span className="font-black uppercase tracking-widest text-sm text-white">{label}</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{description}</span>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      aria-pressed={value}
      className={`relative w-14 h-7 rounded-full transition-all duration-300 ${value ? 'bg-blue-500' : 'bg-white/10'}`}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md ${value ? 'left-8' : 'left-1'}`}
      />
    </button>
  );
}

function SegmentControl({ options, value, onChange }: { options: { label: string; value: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex bg-black/40 p-1 rounded-full border border-white/5 gap-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
            value === opt.value ? 'bg-blue-500 text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
