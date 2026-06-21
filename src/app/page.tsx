'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Search, MapPin, Wind, Droplets, Sun, Eye, CloudRain, Clock, Calendar, AlertTriangle, Settings, Heart } from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';
import SkyBackground from '@/components/effects/SkyBackground';
import SideNav from '@/components/ui/SideNav';
import HourlyChart from '@/components/weather/HourlyChart';
import ForecastList from '@/components/weather/ForecastList';
import SplashScreen from '@/components/ui/SplashScreen';

export default function WeatherPage() {
  const { weather, loading, error, fetchWeather, detectLocation } = useWeather("Jakarta");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeView, setActiveView] = useState('dashboard');
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchCity = formData.get('city') as string;
    if (searchCity) {
      fetchWeather(searchCity);
      setActiveView('dashboard');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', { weekday: 'short', month: 'short', day: '2-digit' });
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      <div className="flex bg-slate-950 min-h-screen text-white overflow-hidden font-sans">
        {/* Side Navigation */}
        <SideNav onDetectLocation={detectLocation} onNavigate={setActiveView} />

        {/* Main Content */}
        <main className="flex-1 relative pr-20 h-screen overflow-hidden">
          <SkyBackground condition={weather?.condition || "clear"} />
          
          <div className="relative z-10 p-6 md:p-10 h-full flex flex-col gap-6 overflow-y-auto no-scrollbar">
            
            {/* Header Info */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex flex-col"
              >
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                    {weather?.city}, {weather?.country}
                  </h2>
                </div>
                <div className="flex items-center gap-4 text-slate-500 font-mono text-xs">
                  <span>{weather?.lat}° N, {weather?.lon}° E</span>
                </div>
                
                <div className="mt-6 flex flex-col">
                  <span className="text-6xl font-black tracking-tighter text-glow">
                    {formatTime(currentTime)}
                  </span>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em] mt-1 pl-1">
                    {formatDate(currentTime)} 2026
                  </span>
                </div>
              </motion.div>

              <motion.form 
                onSubmit={handleSearch}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-sm"
              >
                <div className="glass px-5 py-3 rounded-full flex items-center gap-4 group focus-within:bg-white/10 transition-all border border-white/5">
                  <Search className="w-4 h-4 text-slate-400 group-focus-within:text-white transition-colors" />
                  <input 
                    name="city"
                    type="text" 
                    placeholder="Cari Kota (Jakarta, Bandung...)" 
                    className="bg-transparent border-none outline-none w-full text-base text-white placeholder:text-slate-500"
                  />
                </div>
              </motion.form>
            </div>

            <AnimatePresence mode="wait">
              {activeView === 'dashboard' && (
                <motion.div 
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-6 flex-1"
                >
                  {/* Central Row */}
                  <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                    
                    {/* Main Temperature Card */}
                    <div className="relative flex-1 glass-dark rounded-[3rem] p-8 flex flex-col items-center justify-center overflow-hidden min-h-[350px]">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0" />
                      
                      <div className="relative z-10 flex flex-col items-center">
                         <span className="text-[10rem] md:text-[13rem] font-black text-white text-glow leading-none flex items-start -ml-4">
                           {weather?.temp}
                           <span className="text-3xl text-slate-400 mt-10 ml-2">°C</span>
                         </span>
                         
                         <div className="mt-4 flex flex-col items-center gap-4">
                            <motion.div
                               animate={{ y: [0, -10, 0] }}
                               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                               <Sun className="w-16 h-16 text-white relative z-10 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
                            </motion.div>
                            <div className="text-center">
                              <h3 className="text-2xl font-black uppercase tracking-tight">{weather?.condition}</h3>
                              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">TERASA SEPERTI {weather?.feelsLike}°C</p>
                            </div>
                         </div>
                      </div>
                    </div>

                    {/* Conditions List Card */}
                    <div className="w-full lg:w-72 glass p-8 rounded-[3rem] flex flex-col gap-6">
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Kondisi</h3>
                      <div className="flex flex-col gap-5">
                        <ConditionItem icon={Wind} label="Angin" value={`${weather?.windSpeed} km/h`} sub="BL" />
                        <ConditionItem icon={Droplets} label="Kelembaban" value={`${weather?.humidity}%`} sub="" />
                        <ConditionItem icon={Sun} label="Indeks UV" value={weather?.uvIndex.toString() || "0"} sub={weather && weather.uvIndex > 5 ? "Tinggi" : "Rendah"} />
                        <ConditionItem icon={Eye} label="Visibilitas" value={`${weather?.visibility} km`} sub="" />
                        <ConditionItem icon={CloudRain} label="Presipitasi" value={`${weather?.precipitation}%`} sub="" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="flex flex-col lg:flex-row gap-6 pb-10">
                     <div className="w-full lg:w-[35%] flex flex-col gap-3">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-4">Ramalan 5 Hari</h3>
                        <ForecastList forecast={weather?.forecast || []} />
                     </div>
                     
                     <div className="flex-1 flex flex-col gap-3">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-4">Tren Per Jam</h3>
                        <HourlyChart hourly={weather?.hourly || []} />
                     </div>
                  </div>
                </motion.div>
              )}

              {activeView === 'locations' && (
                <LocationsView key="locations" onSelect={(city) => { fetchWeather(city); setActiveView('dashboard'); }} />
              )}

              {activeView === 'alerts' && <AlertsView key="alerts" />}
              
              {activeView === 'settings' && <SettingsView key="settings" />}
            </AnimatePresence>

          </div>
        </main>
      </div>
    </>
  );
}

function ConditionItem({ icon: Icon, label, value, sub }: { icon: any, label: string, value: string, sub: string }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-white/5 group-hover:bg-blue-500/20 transition-all">
          <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
          <span className="text-base font-black tracking-tight">{value}</span>
        </div>
      </div>
      <span className="text-[8px] font-black text-slate-600 uppercase">{sub}</span>
    </div>
  );
}

/* SIDEBAR VIEWS */

function LocationsView({ onSelect }: { onSelect: (city: string) => void }) {
  const favorites = [
    { name: "Jakarta", region: "DKI Jakarta", temp: 32 },
    { name: "Bandung", region: "Jawa Barat", temp: 24 },
    { name: "Surabaya", region: "Jawa Timur", temp: 33 },
    { name: "Bali", region: "Denpasar", temp: 29 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col gap-8 p-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black uppercase tracking-tighter">Lokasi Disimpan</h2>
        <p className="text-slate-500 font-bold tracking-[0.2em] text-xs">PINTASAN CEPAT KOTA BESAR</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
        {favorites.map((city) => (
          <button 
            key={city.name}
            onClick={() => onSelect(city.name)}
            className="glass flex items-center justify-between p-6 rounded-[2rem] hover:bg-white/10 transition-all text-left"
          >
            <div className="flex flex-col">
              <span className="text-xl font-black uppercase text-white">{city.name}</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{city.region}</span>
            </div>
            <span className="text-3xl font-black text-blue-400">{city.temp}°</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function AlertsView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col gap-8 p-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-yellow-500">Peringatan Cuaca</h2>
        <p className="text-slate-500 font-bold tracking-[0.2em] text-xs">DATA REALTIME DARI SATELIT</p>
      </div>
      
      <div className="glass p-8 rounded-[2rem] border-yellow-500/20 max-w-2xl flex items-start gap-6">
        <div className="p-4 bg-yellow-500/10 rounded-2xl">
          <AlertTriangle className="w-8 h-8 text-yellow-500" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-black uppercase text-white">Gelombang Panas Terdeteksi</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Indeks UV di wilayah Anda saat ini mencapai level 8. Disarankan menggunakan tabir surya dan menghindari paparan matahari langsung hingga jam 16:00.
          </p>
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-2">DIPERBARUI 5 MENIT LALU</span>
        </div>
      </div>
    </motion.div>
  );
}

function SettingsView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col gap-8 p-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black uppercase tracking-tighter">Pengaturan</h2>
        <p className="text-slate-500 font-bold tracking-[0.2em] text-xs">KONFIGURASI DASHBOARD ANDA</p>
      </div>

      <div className="flex flex-col gap-4 max-w-xl">
        <div className="glass p-6 rounded-3xl flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500"><Sun className="w-5 h-5"/></div>
            <span className="font-bold uppercase tracking-widest text-sm">Satuan Suhu</span>
          </div>
          <div className="flex bg-black/40 p-1 rounded-full border border-white/5">
             <button className="px-4 py-1 rounded-full bg-blue-500 text-[10px] font-black">CELSIUS</button>
             <button className="px-4 py-1 rounded-full text-slate-500 text-[10px] font-black">FAHRENHEIT</button>
          </div>
        </div>
        
        <div className="glass p-6 rounded-3xl flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500"><Heart className="w-5 h-5"/></div>
            <span className="font-bold uppercase tracking-widest text-sm">Mode Cinematic</span>
          </div>
          <div className="w-12 h-6 bg-blue-500 rounded-full relative">
             <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
