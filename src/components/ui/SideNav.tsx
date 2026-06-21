'use client';

import { motion } from 'framer-motion';
import { LayoutGrid, MapPin, Bell, Crosshair, Settings, User } from 'lucide-react';
import { useState } from 'react';

interface SideNavProps {
  onDetectLocation: () => void;
  onNavigate: (view: string) => void;
}

export default function SideNav({ onDetectLocation, onNavigate }: SideNavProps) {
  const [active, setActive] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { id: 'locations', icon: MapPin, label: 'Locations' },
    { id: 'alerts', icon: Bell, label: 'Alerts' },
    { id: 'locate', icon: Crosshair, label: 'Locate', action: onDetectLocation },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="fixed right-0 top-0 h-screen w-20 flex flex-col items-center py-8 gap-8 border-l border-white/5 bg-black/20 backdrop-blur-xl z-50">
      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/50 mb-4">
        <User className="w-5 h-5 text-blue-400" />
      </div>

      <nav className="flex flex-col gap-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.action) {
                item.action();
              } else {
                setActive(item.id);
                onNavigate(item.id);
              }
            }}
            className={`p-3 rounded-2xl transition-all relative group ${
              active === item.id ? 'bg-blue-500/20 text-blue-400' : 'text-slate-500 hover:text-white'
            }`}
          >
            <item.icon className="w-6 h-6" />
            
            {/* Tooltip */}
            <span className="absolute right-full mr-4 px-2 py-1 rounded bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
              {item.label}
            </span>

            {active === item.id && (
              <motion.div
                layoutId="nav-glow"
                className="absolute inset-0 rounded-2xl border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              />
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto">
         {/* Unit Switcher or Profile toggle could go here */}
      </div>
    </aside>
  );
}
