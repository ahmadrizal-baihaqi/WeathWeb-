'use client';

import { motion } from 'framer-motion';
import { ForecastDay } from '@/types/weather';
import { Cloud, Sun, CloudRain } from 'lucide-react';

interface ForecastListProps {
  forecast: ForecastDay[];
}

export default function ForecastList({ forecast }: ForecastListProps) {
  return (
    <div className="glass p-8 rounded-[2.5rem] h-full flex flex-col justify-between overflow-hidden">
      <div className="grid grid-cols-5 md:grid-cols-5 gap-2 h-full">
        {forecast.map((day, index) => (
          <ForecastCard key={day.date} day={day} index={index} />
        ))}
      </div>
    </div>
  );
}

function ForecastCard({ day, index }: { day: ForecastDay, index: number }) {
  const getIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes("sunny") || c.includes("clear")) return <Sun className="w-6 h-6 text-yellow-400" />;
    if (c.includes("rain")) return <CloudRain className="w-6 h-6 text-blue-400" />;
    return <Cloud className="w-6 h-6 text-slate-300" />;
  };

  const isActive = index === 2; // Mimic the highlight in the photo for "Sat"

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`flex flex-col items-center justify-between py-4 px-1 rounded-2xl transition-all ${
        isActive ? 'bg-white/10 border border-white/10 shadow-lg' : 'hover:bg-white/5'
      }`}
    >
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{day.date}</span>
      <div className="my-2">
        {getIcon(day.condition)}
      </div>
      <div className="flex flex-col items-center">
        <span className="text-sm font-black">{day.maxTemp}°</span>
        <span className="text-[10px] font-bold text-slate-500">{day.minTemp}°</span>
      </div>
    </motion.div>
  );
}
