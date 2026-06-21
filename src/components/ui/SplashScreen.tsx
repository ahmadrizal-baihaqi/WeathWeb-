'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Sun, CloudRain } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 5000; // 5 seconds splash
    const interval = 50;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center gap-12 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-blue-500/5 blur-[150px] rounded-full scale-150" />
      
      <div className="relative flex flex-col items-center gap-8">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-blue-400/20 blur-3xl rounded-full animate-pulse" />
          <Cloud className="w-32 h-32 text-white relative z-10" />
          <motion.div
            animate={{ x: [20, -20, 20], y: [10, -10, 10] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -top-4 -right-4"
          >
            <Sun className="w-16 h-16 text-yellow-500" />
          </motion.div>
        </motion.div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-black text-white tracking-[0.3em] uppercase italic">
            SkyCast<span className="text-blue-500">Extreme</span>
          </h1>
          <p className="text-slate-500 font-bold tracking-[0.5em] uppercase text-[10px]">
            Atmospheric Weather Dashboard
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden relative">
        <motion.div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-cyan-400"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest animate-pulse">
        Menghubungkan ke Satelit... {Math.round(progress)}%
      </div>
    </motion.div>
  );
}
