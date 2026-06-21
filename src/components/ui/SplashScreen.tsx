'use client';

import { motion } from 'framer-motion';

export default function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center gap-6 select-none"
    >
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 bg-blue-500/[0.02] blur-[150px] rounded-full scale-150 pointer-events-none" />
      
      <div className="flex flex-col items-center gap-5 relative z-10">
        {/* Animated Cloud Outline SVG */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Ambient Glow behind the cloud */}
          <div className="absolute inset-4 bg-blue-500/10 blur-xl rounded-full animate-pulse pointer-events-none" />
          
          <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
            {/* Background static dashed cloud path */}
            <path
              d="M25,60 A15,15 0 0,1 37,35 A20,20 0 0,1 68,35 A15,15 0 0,1 80,60 A12,12 0 0,1 75,72 L25,72 A12,12 0 0,1 25,60 Z"
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="2.5"
            />
            {/* Animated drawing cloud path */}
            <motion.path
              d="M25,60 A15,15 0 0,1 37,35 A20,20 0 0,1 68,35 A15,15 0 0,1 80,60 A12,12 0 0,1 75,72 L25,72 A12,12 0 0,1 25,60 Z"
              fill="none"
              stroke="rgb(59, 130, 246)"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0.25, pathOffset: 0 }}
              animate={{ 
                pathOffset: [0, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
          </svg>
        </div>

        {/* Small, Minimalist Monospace Text */}
        <p className="text-[10px] font-mono text-slate-500 tracking-[0.2em] lowercase pl-[0.2em] animate-pulse [animation-duration:2s]">
          menghubungkan ke satelit...
        </p>
      </div>
    </motion.div>
  );
}

