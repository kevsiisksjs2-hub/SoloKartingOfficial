
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import { Category, Pilot, Association } from '../types';
import { storageService } from '../services/storageService';
import { 
  ChevronRight, 
  Users, 
  Clock, 
  Zap, 
  CloudSun,
  Download,
  Trophy,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 4, minutes: 28 });
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    setPilots(storageService.getPilots());
    setCategories(storageService.getCategories());
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1 };
        return prev;
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleDownload = (type: string) => {
    setDownloading(type);
    setTimeout(() => setDownloading(null), 3000);
  };

  const handleSeeCategory = (cat: string) => {
    navigate(`/pilotos?category=${encodeURIComponent(cat)}`);
  };

  return (
    <div className="bg-zinc-950">
      <Hero />

      {/* Ticker de Noticias */}
      <Link to="/noticias" className="block bg-red-600 py-3 overflow-hidden border-y border-red-700 hover:bg-red-700 transition-colors">
        <div className="whitespace-nowrap animate-marquee flex gap-10 items-center">
          {[1,2,3].map(i => (
            <span key={i} className="text-[10px] font-black uppercase text-white tracking-[0.2em] flex items-center gap-4">
              <Zap size={12} fill="white" /> INSCRIPCIONES ABIERTAS PARA LA 8VA FECHA EN ZÁRATE • ULTIMOS CUPOS DISPONIBLES
              <Zap size={12} fill="white" /> REGLAMENTO: ACTUALIZACIÓN TÉCNICA EN PESO MÍNIMO CATEGORÍA MASTER
              <Zap size={12} fill="white" /> CLIMA: SE ESPERAN TORMENTAS AISLADAS PARA EL DOMINGO • REVISAR NEUMÁTICOS
            </span>
          ))}
        </div>
      </Link>

      {/* Widgets y Acceso Rápido */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Clock size={80} className="text-red-600" />
            </div>
            <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-4">Próxima Fecha</p>
            <h3 className="text-xl font-black text-white oswald uppercase mb-6 leading-tight italic">GP Coronación<br/><span className="text-red-600">Kart. Zárate</span></h3>
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-2xl font-black text-white oswald leading-none">{timeLeft.days}</p>
                <p className="text-[8px] text-zinc-500 font-bold uppercase">Días</p>
              </div>
              <div className="text-center border-l border-zinc-800 pl-4">
                <p className="text-2xl font-black text-white oswald leading-none">{timeLeft.hours}</p>
                <p className="text-[8px] text-zinc-500 font-bold uppercase">Hrs</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 shadow-2xl flex flex-col justify-between group cursor-help">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">Estado de Pista</p>
                <h4 className="text-white font-bold text-sm uppercase">Cielo Despejado</h4>
              </div>
              <CloudSun className="text-yellow-500 group-hover:animate-bounce" size={32} />
            </div>
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-tighter">Pista Seca y Compactada</span>
              </div>
              <p className="text-4xl font-black text-white oswald italic">24°C</p>
            </div>
          </div>

          <Link to="/pilotos" className="group relative h-full rounded-[2rem] overflow-hidden border border-zinc-800 shadow-xl lg:col-span-1">
              <img src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format" alt="Pilotos" className="absolute inset-0 w-full h-full object-cover grayscale transition-all group-hover:grayscale-0 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between text-white font-black uppercase tracking-tight">
                <span className="oswald text-2xl italic tracking-tighter">Ranking Pilotos</span>
                <Users size={24} className="text-red-500" />
              </div>
          </Link>

          <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 shadow-2xl overflow-hidden flex flex-col">
            <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-4">Líderes de Campeonato</p>
            <div className="space-y-3 flex-grow">
              {[
                { pos: 1, name: 'Juan Acosta', pts: '154.5' },
                { pos: 2, name: 'Pedro Ramirez', pts: '142.0' },
                { pos: 3, name: 'Martin Garcia', pts: '138.5' }
              ].map(p => (
                <div key={p.pos} className="flex items-center justify-between bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-800 hover:border-red-600/30 transition-all group cursor-default">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 flex items-center justify-center bg-zinc-800 group-hover:bg-red-600 rounded text-[10px] font-black text-zinc-500 group-hover:text-white transition-colors">{p.pos}</span>
                    <span className="text-[10px] font-black text-white uppercase">{p.name}</span>
                  </div>
                  <span className="text-[10px] font-black text-red-500">{p.pts}</span>
                </div>
              ))}
            </div>
            <Link to="/campeonatos" className="mt-4 text-[9px] font-black text-center text-zinc-600 hover:text-white uppercase tracking-widest underline">Ver Posiciones Completas</Link>
          </div>
        </div>
      </section>

      {/* Planillas Oficiales */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
         <div className="flex flex-col md:flex-row md:items-center gap-4 mb-16">
           <div className="flex items-center gap-4">
             <Trophy className="text-red-600" size={36} />
             <h2 className="text-5xl font-black italic oswald uppercase text-white tracking-tighter">Planillas <span className="text-red-600">Oficiales</span></h2>
           </div>
           <div className="flex-grow h-px bg-zinc-800 hidden md:block"></div>
           <Link to="/inscripciones" className="bg-white text-black hover:bg-red-600 hover:text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all shadow-xl">Inscribirme ahora</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {categories.slice(0, 6).map((cat) => (
             <div key={cat} className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden hover:border-red-600 transition-all shadow-2xl group flex flex-col h-full">
               <div className="bg-zinc-800/40 p-6 border-b border-zinc-800 flex justify-between items-center group-hover:bg-zinc-800 transition-colors">
                  <h4 className="text-white font-black uppercase text-xs tracking-wider oswald italic">{cat}</h4>
                  <span className="bg-zinc-950 text-red-500 text-[10px] font-black px-3 py-1.5 rounded-xl border border-zinc-800 uppercase shadow-inner">OFICIAL</span>
               </div>
               <div className="p-12 text-center flex-grow flex flex-col justify-center items-center">
                 <div className="bg-zinc-950 w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8 border border-zinc-800 group-hover:border-red-600/50 group-hover:scale-110 transition-all duration-500 shadow-inner">
                   <Users className="text-zinc-700 group-hover:text-red-600 transition-colors" size={40} />
                 </div>
                 <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 leading-relaxed">Listado completo de pilotos registrados y verificados por técnica.</p>
                 <button 
                  onClick={() => handleSeeCategory(cat)}
                  className="w-full bg-zinc-800 hover:bg-red-600 text-white font-black py-5 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl"
                 >
                   Ver Planilla
                 </button>
               </div>
             </div>
           ))}
        </div>
      </section>

      {/* Reglamento Center */}
      <section className="bg-[#0c0c0c] py-24 border-y border-zinc-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 relative z-10">
            <h2 className="text-5xl font-black oswald uppercase text-white mb-8 leading-none italic tracking-tighter">Centro de <span className="text-red-600">Reglamentos</span></h2>
            <p className="text-zinc-500 mb-10 leading-relaxed font-bold text-sm uppercase tracking-tight">Descargue los lineamientos técnicos y deportivos vigentes para la temporada 2024. Manténgase actualizado con las últimas notificaciones de la FRAD 3.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Deportivo 2024', 'Técnico Motor KDO', 'Técnico Chasis', 'Anexo Gomas PR'].map(item => (
                <button 
                  key={item} 
                  onClick={() => handleDownload(item)}
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all group ${downloading === item ? 'bg-emerald-600/10 border-emerald-500 text-emerald-500' : 'bg-zinc-950 border-zinc-800 hover:border-red-600 text-zinc-400'}`}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">{item}</span>
                  {downloading === item ? <CheckCircle2 size={18} /> : <Download size={18} className="group-hover:text-red-500" />}
                </button>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 relative h-[450px] w-full rounded-[3rem] overflow-hidden border border-zinc-800 shadow-2xl group">
            <img src="https://images.unsplash.com/photo-1547631618-f29792042761?w=800&auto=format" className="w-full h-full object-cover grayscale opacity-30 transition-all duration-1000 group-hover:scale-105 group-hover:opacity-60" alt="Reglamentos" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <ShieldCheck size={160} className="text-red-600/20 group-hover:text-red-600/40 transition-colors" />
            </div>
            <div className="absolute bottom-10 left-10 right-10 p-6 bg-red-600/10 backdrop-blur-md border border-red-600/20 rounded-2xl">
              <p className="text-white font-black oswald uppercase italic text-center tracking-widest text-lg">Documentación Federada</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Notificación flotante de descarga */}
      {downloading && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-zinc-900 border border-emerald-500/30 text-emerald-500 px-8 py-4 rounded-2xl font-black uppercase text-[10px] flex items-center gap-3 shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
          <Zap size={16} className="animate-pulse" /> Preparando descarga: {downloading}...
        </div>
      )}
    </div>
  );
};

export default Home;
