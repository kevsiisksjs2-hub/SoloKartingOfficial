
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Radio, Activity, Shield, Flag, Zap, Trophy } from 'lucide-react';
import { storageService } from '../services/storageService';
import { TrackFlag, SystemSettings } from '../types';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [trackStatus, setTrackStatus] = useState<TrackFlag>(storageService.getTrackStatus());
  const [settings, setSettings] = useState<SystemSettings>(storageService.getSettings());
  const location = useLocation();

  const LOGO_URL = "https://api.mundopiloto.com.ar/archivos/2/IMAGENES/ASOCIACIONES/logo_asociacion_2025-06-11T201534737Z.jpg";

  useEffect(() => {
    const interval = setInterval(() => {
      setTrackStatus(storageService.getTrackStatus());
      setSettings(storageService.getSettings());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Resultados', path: '/resultados' },
    { name: 'Reglamentos', path: '/reglamentos' },
    { name: 'Circuitos', path: '/circuitos' },
    { name: 'Pilotos', path: '/pilotos' },
    { name: 'Historia', path: '/historia' },
    { name: 'Inscribirse', path: '/inscripciones' },
  ];

  const flagColors: Record<TrackFlag, string> = {
    [TrackFlag.VERDE]: 'bg-emerald-500 shadow-emerald-500/50',
    [TrackFlag.AMARILLA]: 'bg-yellow-400 shadow-yellow-400/50',
    [TrackFlag.ROJA]: 'bg-red-600 shadow-red-600/50',
    [TrackFlag.AZUL]: 'bg-blue-600 shadow-blue-600/50',
    [TrackFlag.CUADROS]: 'bg-white shadow-white/50',
  };

  return (
    <>
      <div className="bg-yellow-400 py-2 border-b border-yellow-500 overflow-hidden relative z-[60]">
        <div className="whitespace-nowrap animate-marquee flex gap-12 items-center">
          {[1,2,3,4].map(i => (
            <span key={i} className="text-[10px] font-black uppercase text-black tracking-[0.2em] flex items-center gap-4">
              <Zap size={12} fill="black" /> {settings.paddockTicker}
            </span>
          ))}
        </div>
      </div>

      <nav className="bg-black/90 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <Link to="/" className="flex items-center gap-4 group">
              <img src={LOGO_URL} alt="KDO Logo" className="w-14 h-14 rounded-full border-2 border-yellow-400 shadow-lg group-hover:scale-110 transition-transform bg-white object-contain p-1" />
              <div className="bg-yellow-400 px-3 py-1.5 rounded-lg italic font-black text-black text-xl oswald tracking-tighter transition-transform hidden sm:block">
                KDO <span className="text-white bg-black px-1.5 rounded-sm text-[10px] ml-1 uppercase">Disciplina Oficial</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      location.pathname === link.path ? 'text-yellow-400 bg-yellow-400/5' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="ml-6 pl-6 border-l border-white/5 flex items-center gap-4">
                <div className="flex items-center gap-3 bg-zinc-900 px-4 py-2 rounded-2xl border border-white/5">
                   <div className={`w-3 h-3 rounded-full ${flagColors[trackStatus]} animate-pulse`}></div>
                   <span className="text-[9px] font-black uppercase text-white">{trackStatus}</span>
                </div>
                <Link to="/AdminKDO" className="text-zinc-700 hover:text-yellow-400 transition-colors"><Shield size={18} /></Link>
              </div>
            </div>

            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-zinc-500"><Menu size={28} /></button>
          </div>
        </div>
        
        {isOpen && (
          <div className="lg:hidden bg-black border-b border-white/5 px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-yellow-400"
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
