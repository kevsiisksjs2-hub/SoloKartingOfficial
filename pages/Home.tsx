
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
    { name: 'PKN Motors', logo: 'https://placehold.co/200x100/1a1a1a/ffffff?text=PKN+MOTORS' },
    { name: 'Norte Tierra', logo: 'https://placehold.co/200x100/1a1a1a/ffffff?text=NORTE+TIERRA' },
    { name: 'PR Tires', logo: 'https://placehold.co/200x100/1a1a1a/ffffff?text=PR+TIRES' },
    { name: 'Speed Racing', logo: 'https://placehold.co/200x100/1a1a1a/ffffff?text=SPEED+RACING' },
    { name: 'Chassis Tech', logo: 'https://placehold.co/200x100/1a1a1a/ffffff?text=CHASSIS+TECH' },
    { name: 'Blink Energy', logo: 'https://placehold.co/200x100/1a1a1a/ffffff?text=BLINK+ENERGY' },
  ];

  return (
    <div className="bg-zinc-950">
      <Hero />

      <div className="bg-blue-600 py-3 border-y border-blue-700 overflow-hidden">
        <div className="whitespace-nowrap animate-marquee flex gap-12 items-center">
          {[1,2,3].map(i => (
            <span key={i} className="text-[10px] font-black uppercase text-white tracking-[0.2em] flex items-center gap-4">
              <Zap size={12} fill="white" /> PKN: PILOTOS KARTING DEL NORTE • INSCRIPCIONES ABIERTAS PRÓXIMA FECHA
              <Zap size={12} fill="white" /> TRANSMISIÓN EN VIVO: DOMINGO DESDE LAS 10:00 AM PORTAL PKN
              <Zap size={12} fill="white" /> REGLAMENTO: ACTUALIZACIÓN TÉCNICA CLASE 150cc POWER DISPONIBLE
            </span>
          ))}
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <a href={streamingUrl} target="_blank" rel="noopener noreferrer" className="group bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl transition-all hover:border-blue-600 hover:bg-zinc-900">
            <Radio className="text-blue-600 mb-6 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-xl font-black oswald uppercase text-white mb-2 italic">PKN Live Stream</h3>
            <p className="text-zinc-500 text-[10px] font-bold uppercase mb-6 leading-relaxed">Transmisión oficial de Pilotos Karting del Norte.</p>
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">Ir al vivo <ChevronRight size={14} /></span>
          </a>

          <a href="https://speedhive.mylaps.com/LiveTiming" target="_blank" rel="noopener noreferrer" className="group bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl transition-all hover:border-emerald-600 hover:bg-zinc-900">
            <Activity className="text-emerald-500 mb-6 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-xl font-black oswald uppercase text-white mb-2 italic">Timing Online</h3>
            <p className="text-zinc-500 text-[10px] font-bold uppercase mb-6 leading-relaxed">Cronometraje federado PKN con Mylaps.</p>
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">Ver tiempos <ChevronRight size={14} /></span>
          </a>

          <Link to="/reglamentos" className="group bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl transition-all hover:border-blue-600 hover:bg-zinc-900">
            <FileText className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-xl font-black oswald uppercase text-white mb-2 italic">Reglamentos</h3>
            <p className="text-zinc-500 text-[10px] font-bold uppercase mb-6 leading-relaxed">Normativa técnica Pilotos Karting del Norte.</p>
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">Descargar <ChevronRight size={14} /></span>
          </Link>

          <Link to="/circuitos" className="group bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl transition-all hover:border-yellow-600 hover:bg-zinc-900">
            <MapPin className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-xl font-black oswald uppercase text-white mb-2 italic">Trazados</h3>
            <p className="text-zinc-500 text-[10px] font-bold uppercase mb-6 leading-relaxed">Los circuitos oficiales de la zona norte.</p>
            <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest flex items-center gap-2">Ver pistas <ChevronRight size={14} /></span>
          </Link>
        </div>
      </section>

      <section className="bg-zinc-900/20 py-24 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
              <div>
                <h2 className="text-5xl font-black italic oswald uppercase text-white tracking-tighter">Ranking <span className="text-blue-600">PKN</span></h2>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Pilotos Karting del Norte - Grilla Oficial</p>
              </div>
              <Link to="/pilotos" className="bg-zinc-900 border border-zinc-800 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Explorar grilla</Link>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.slice(0, 4).map(cat => (
                <Link to={`/pilotos?category=${cat}`} key={cat} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl hover:border-blue-600 transition-all group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Trophy size={80} /></div>
                   <h4 className="text-white font-black uppercase oswald italic text-lg tracking-tight mb-4">{cat}</h4>
                   <div className="flex items-center gap-2 text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                      <Users size={12} className="text-blue-600" /> +30 Pilotos Registrados
                   </div>
                </Link>
              ))}
           </div>
        </div>
      </section>

      <section className="bg-blue-600 py-16">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <div>
               <h3 className="text-4xl font-black oswald uppercase text-white italic tracking-tighter mb-2 leading-none">Únete a Pilotos Karting del Norte</h3>
               <p className="text-white/80 font-bold uppercase text-[10px] tracking-widest">Formulario oficial de inscripción federada</p>
            </div>
            <Link to="/inscripciones" className="bg-white text-black px-12 py-5 rounded-2xl font-black uppercase text-xs shadow-2xl hover:scale-105 transition-all">Quiero Inscribirme</Link>
         </div>
      </section>
    </div>
  );
};

export default Home;
