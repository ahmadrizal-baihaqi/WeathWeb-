'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SkyBackgroundProps {
  condition: string;
}

export default function SkyBackground({ condition }: SkyBackgroundProps) {
  const lowerCondition = condition.toLowerCase();
  let gradient = "from-slate-900/30 via-slate-950 to-black";

  if (lowerCondition.includes("sun") || lowerCondition.includes("clear")) {
    gradient = "from-blue-600/20 via-slate-950 to-black";
  } else if (lowerCondition.includes("cloud")) {
    gradient = "from-blue-900/30 via-slate-950 to-black";
  } else if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle")) {
    gradient = "from-slate-900/40 via-slate-950 to-black";
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={gradient}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
        />
      </AnimatePresence>
      
      {/* Texture Layer */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Decorative Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ willChange: "transform, opacity" }}
        className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/20 blur-[120px] rounded-full transform-gpu"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.1, 0.05],
          x: [0, -40, 0],
          y: [0, 40, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{ willChange: "transform, opacity" }}
        className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[100px] rounded-full transform-gpu"
      />
    </div>
  );
}
