
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { storageService } from '../services/storageService';
import { 
  Radio, 
  Activity, 
  FileText, 
  Trophy, 
  Zap,
  ChevronRight,
  Target,
  MapPin,
  Users
} from 'lucide-react';

const Home: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [streamingUrl, setStreamingUrl] = useState('#');
  
  useEffect(() => {
    setCategories(storageService.getCategories());
    setStreamingUrl(storageService.getStreamingUrl());
  }, []);

  const sponsors = [
    { name: 'KDO Motors', logo: 'https://placehold.co/200x100/1a1a1a/ffffff?text=KDO+MOTORS' },
    { name: 'FRAD 3', logo: 'https://placehold.co/200x100/1a1a1a/ffffff?text=FRAD+3' },
    { name: 'PR Tires', logo: 'https://placehold.co/200x100/1a1a1a/ffffff?text=PR+TIRES' },
    { name: 'Speed Racing', logo: 'https://placehold.co/200x100/1a1a1a/ffffff?text=SPEED+RACING' },
    { name: 'Chassis Tech', logo: 'https://placehold.co/200x100/1a1a1a/ffffff?text=CHASSIS+TECH' },
    { name: 'Blink Energy', logo: 'https://placehold.co/200x100/1a1a1a/ffffff?text=BLINK+ENERGY' },
  ];

  return (
    <div className="bg-zinc-950">
      <Hero />

      {/* Ticker Dinámico */}
      <div className="bg-red-600 py-3 border-y border-red-700 overflow-hidden">
        <div className="whitespace-nowrap animate-marquee flex gap-12 items-center">
          {[1,2,3].map(i => (
            <span key={i} className="text-[10px] font-black uppercase text-white tracking-[0.2em] flex items-center gap-4">
              <Zap size={12} fill="white" /> PRÓXIMA FECHA: KARTÓDROMO DE ZÁRATE • INSCRIPCIONES ABIERTAS KDO
              <Zap size={12} fill="white" /> STREAMING: TRANSMISIÓN OFICIAL KDO DOMINGO DESDE LAS 10:00 AM
              <Zap size={12} fill="white" /> REGLAMENTO: ACTUALIZACIÓN TÉCNICA PESO MÍNIMO CLASE 1
            </span>
          ))}
        </div>
      </div>

      {/* Portal Informativo - Accesos Directos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <a href={streamingUrl} target="_blank" rel="noopener noreferrer" className="group bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl transition-all hover:border-red-600 hover:bg-zinc-900">
            <Radio className="text-red-600 mb-6 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-xl font-black oswald uppercase text-white mb-2 italic">KDO Streaming</h3>
            <p className="text-zinc-500 text-[10px] font-bold uppercase mb-6 leading-relaxed">Transmisión oficial de todas las series y finales fiscalizadas.</p>
            <span className="text-[9px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">Ir al canal <ChevronRight size={14} /></span>
          </a>

          <a href="https://speedhive.mylaps.com/LiveTiming" target="_blank" rel="noopener noreferrer" className="group bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl transition-all hover:border-emerald-600 hover:bg-zinc-900">
            <Activity className="text-emerald-500 mb-6 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-xl font-black oswald uppercase text-white mb-2 italic">KDO Live Timing</h3>
            <p className="text-zinc-500 text-[10px] font-bold uppercase mb-6 leading-relaxed">Cronometraje federado en vivo integrado con Mylaps.</p>
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">Abrir Crono <ChevronRight size={14} /></span>
          </a>

          <Link to="/reglamentos" className="group bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl transition-all hover:border-blue-600 hover:bg-zinc-900">
            <FileText className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-xl font-black oswald uppercase text-white mb-2 italic">Reglamentos</h3>
            <p className="text-zinc-500 text-[10px] font-bold uppercase mb-6 leading-relaxed">Documentación técnica y deportiva oficial KDO 2024.</p>
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">Ver documentos <ChevronRight size={14} /></span>
          </Link>

          <Link to="/circuitos" className="group bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl transition-all hover:border-yellow-600 hover:bg-zinc-900">
            <MapPin className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-xl font-black oswald uppercase text-white mb-2 italic">Circuitos</h3>
            <p className="text-zinc-500 text-[10px] font-bold uppercase mb-6 leading-relaxed">Los trazados oficiales donde se disputa el calendario KDO.</p>
            <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest flex items-center gap-2">Explorar pistas <ChevronRight size={14} /></span>
          </Link>
        </div>
      </section>

      {/* Sección Categorías y Pilotos */}
      <section className="bg-zinc-900/20 py-24 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
              <div>
                <h2 className="text-5xl font-black italic oswald uppercase text-white tracking-tighter">Categorías <span className="text-red-600">KDO</span></h2>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">La élite del karting nacional bajo normas oficiales</p>
              </div>
              <Link to="/pilotos" className="bg-zinc-900 border border-zinc-800 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Ver todos los pilotos</Link>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.slice(0, 4).map(cat => (
                <Link to={`/pilotos?category=${cat}`} key={cat} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl hover:border-red-600 transition-all group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Trophy size={80} /></div>
                   <h4 className="text-white font-black uppercase oswald italic text-lg tracking-tight mb-4">{cat}</h4>
                   <div className="flex items-center gap-2 text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                      <Users size={12} className="text-red-600" /> +30 Pilotos Registrados
                   </div>
                </Link>
              ))}
           </div>
        </div>
      </section>

      {/* Sección de Sponsors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center mb-20">
           <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-12 bg-zinc-800"></span>
              <h2 className="text-xs font-black oswald uppercase text-zinc-500 tracking-[0.5em] italic">Main Sponsors KDO</h2>
              <span className="h-px w-12 bg-zinc-800"></span>
           </div>
           <h3 className="text-3xl font-black text-white uppercase oswald italic tracking-tighter">Marcas que <span className="text-red-600">Potencian</span> la Disciplina</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
           {sponsors.map((s, i) => (
             <div key={i} className="flex items-center justify-center p-8 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900 transition-all grayscale opacity-50 hover:grayscale-0 hover:opacity-100 cursor-default group">
                <img src={s.logo} alt={s.name} className="max-h-12 w-auto object-contain transition-transform group-hover:scale-110" />
             </div>
           ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-red-600 py-16">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <div>
               <h3 className="text-4xl font-black oswald uppercase text-white italic tracking-tighter mb-2 leading-none">Únete a la grilla oficial KDO</h3>
               <p className="text-white/80 font-bold uppercase text-[10px] tracking-widest">Inscripciones abiertas para la próxima fecha federada</p>
            </div>
            <Link to="/inscripciones" className="bg-white text-black px-12 py-5 rounded-2xl font-black uppercase text-xs shadow-2xl hover:scale-105 transition-all">Formulario de Inscripción</Link>
         </div>
      </section>
    </div>
  );
};

export default Home;
