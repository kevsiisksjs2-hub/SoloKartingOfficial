
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Radio, Activity, Shield } from 'lucide-react';
import { storageService } from '../services/storageService';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [streamingUrl, setStreamingUrl] = useState('#');
  const location = useLocation();

  useEffect(() => {
    setStreamingUrl(storageService.getStreamingUrl());
  }, []);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Resultados', path: '/resultados' },
    { name: 'Reglamentos', path: '/reglamentos' },
    { name: 'Circuitos', path: '/circuitos' },
    { name: 'Pilotos', path: '/pilotos' },
    { name: 'Inscribirse', path: '/inscripciones' },
  ];

  return (
    <nav className="bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-900 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-red-600 p-1.5 rounded italic font-black text-white text-xl oswald tracking-tighter transition-transform group-hover:scale-105">
                KDO <span className="text-black bg-white px-1 rounded-sm text-sm">KARTING DISCIPLINA OFICIAL</span>
              </div>
            </Link>
          </div>

          <div className="hidden lg:flex items-center">
            <div className="flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    location.pathname === link.path 
                      ? 'text-red-500' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="ml-6 pl-6 border-l border-zinc-800 flex items-center gap-4">
              <a
                href="https://speedhive.mylaps.com/LiveTiming"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-400 hover:text-emerald-500 transition-colors text-[10px] font-black uppercase tracking-widest"
              >
                <Activity size={14} />
                Crono
              </a>
              <a
                href={streamingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 transition-all shadow-xl shadow-red-600/20"
              >
                <Radio size={14} className="animate-pulse" />
                Streaming
              </a>
              <Link to="/AdminKDO" className="text-zinc-600 hover:text-white transition-colors" title="Admin">
                <Shield size={16} />
              </Link>
            </div>
          </div>

          <div className="lg:hidden flex items-center gap-4">
             <a href={streamingUrl} target="_blank" className="p-2 bg-red-600 rounded-lg text-white">
                <Radio size={20} className="animate-pulse" />
             </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-900 transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-zinc-950 border-t border-zinc-900 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-4 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest ${
                  location.pathname === link.path 
                    ? 'text-red-500 bg-red-600/10' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-zinc-900 mt-4">
              <a href="https://speedhive.mylaps.com/LiveTiming" target="_blank" className="flex items-center justify-center gap-2 bg-zinc-900 text-white py-4 rounded-xl text-xs font-black uppercase">
                <Activity size={16} /> Crono
              </a>
              <Link to="/AdminKDO" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 bg-zinc-900 text-white py-4 rounded-xl text-xs font-black uppercase">
                <Shield size={16} /> Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
