'use client';

import { motion } from 'framer-motion';
import { HourlyData } from '@/types/weather';
import { Cloud, Sun, CloudRain } from 'lucide-react';

interface HourlyChartProps {
  hourly: HourlyData[];
}

export default function HourlyChart({ hourly }: HourlyChartProps) {
  // Guard against empty data
  const dataToProcess = Array.isArray(hourly) ? hourly : [];
  if (dataToProcess.length === 0) {
    return <div className="glass p-8 rounded-[2.5rem] flex-1 flex items-center justify-center text-slate-600 uppercase text-[10px] font-black">Data tidak tersedia</div>;
  }

  // Take every 3 hours for display to avoid overcrowding
  const displayData = dataToProcess.filter((_, i) => i % 3 === 0).slice(0, 8);
  if (displayData.length < 2) {
    return <div className="glass p-8 rounded-[2.5rem] flex-1 flex items-center justify-center text-slate-600 uppercase text-[10px] font-black">Data tidak mencukupi</div>;
  }
  
  const minTemp = Math.min(...displayData.map(h => h.temp));
  const maxTemp = Math.max(...displayData.map(h => h.temp));
  const range = maxTemp - minTemp || 1;

  // Chart dimensions
  const width = 600;
  const height = 100;
  const padding = 20;

  const points = displayData.map((h, i) => ({
    x: (i * (width - padding * 2)) / (displayData.length - 1) + padding,
    y: (height - padding * 2) - ((h.temp - minTemp) / range) * (height - padding * 2) + padding
  }));

  const pathD = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
  const areaD = `${pathD} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;

  const getIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes("sunny") || c.includes("clear") || c.includes("cerah")) return Sun;
    if (c.includes("rain") || c.includes("hujan")) return CloudRain;
    return Cloud;
  };

  return (
    <div className="glass p-8 rounded-[2.5rem] flex-1">
      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6">Tren Per Jam</h3>
      
      <div className="relative h-32 w-full mt-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0.0)" />
            </linearGradient>
          </defs>
          
          {/* Gradient Area */}
          <motion.path
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            d={areaD}
            fill="url(#chartGradient)"
          />
          
          {/* Line */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            d={pathD}
            fill="none"
            stroke="rgb(59, 130, 246)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Points */}
          {points.map((p, i) => (
            <motion.circle
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="white"
              stroke="rgb(59, 130, 246)"
              strokeWidth="2"
            />
          ))}
        </svg>

        {/* Labels & Icons */}
        <div className="flex justify-between mt-4 px-2">
          {displayData.map((h, i) => {
            const Icon = getIcon(h.condition);
            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500">{h.time}</span>
                <Icon className="w-4 h-4 text-slate-300" />
                <span className="text-xs font-bold text-white">{Math.round(h.temp)}°</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
