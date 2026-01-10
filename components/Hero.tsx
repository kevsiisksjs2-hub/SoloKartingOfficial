
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative h-[650px] flex items-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1547631618-f29792042761?q=80&w=2071&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-10 h-[2px] bg-red-600"></span>
            <h2 className="text-red-600 font-black uppercase tracking-[0.4em] text-[10px] oswald italic">KDO - Karting Disciplina Oficial</h2>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic oswald text-white mb-6 uppercase leading-[0.9] tracking-tighter">
            DOMINA LA <br />
            <span className="text-red-600">TIERRA</span>
          </h1>
          <p className="text-lg text-zinc-400 mb-10 leading-relaxed font-medium max-w-lg">
            Noticias, Competencias, Rankings y los mejores circuitos federados del país. 
            Toda la adrenalina del karting nacional bajo fiscalización oficial.
          </p>
          <div className="flex flex-wrap gap-5">
            <Link 
              to="/campeonatos" 
              className="bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs flex items-center gap-3 transition-all transform hover:-translate-y-1 shadow-2xl shadow-red-600/20"
            >
              Ver Campeonatos
              <ChevronRight size={18} />
            </Link>
            <Link 
              to="/campeonatos" 
              className="bg-zinc-900/50 hover:bg-white hover:text-black backdrop-blur-xl text-white border border-white/10 px-10 py-5 rounded-2xl font-black uppercase text-xs flex items-center gap-3 transition-all"
            >
              <CalendarIcon size={18} />
              Calendario 2024
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decoración inferior */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-zinc-950 to-transparent z-10"></div>
    </div>
  );
};

export default Hero;
