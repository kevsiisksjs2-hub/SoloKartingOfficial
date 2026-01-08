
import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Download, FileText, ChevronRight, Search, Activity, Gauge, Timer, Zap, ExternalLink, Globe, ListChecks } from 'lucide-react';
import { storageService } from '../services/storageService';
import { Pilot, Category } from '../types';
import { generateResultsPDF, generateLapByLapPDF } from '../utils/pdfGenerator';

const Resultados: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('');
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [liveUrl, setLiveUrl] = useState('');
  const [historyUrl, setHistoryUrl] = useState('');

  useEffect(() => {
    const loadedCats = storageService.getCategories();
    setCategories(loadedCats);
    if (loadedCats.length > 0) setSelectedCategory(loadedCats[0]);
    setPilots(storageService.getPilots());
    setLiveUrl(storageService.getLiveUrl());
    setHistoryUrl(storageService.getHistoryUrl());
  }, []);

  // Filtrar pilotos por la categoría seleccionada
  const categoryPilots = pilots
    .filter(p => p.category === selectedCategory && p.status === 'Confirmado')
    .sort((a, b) => a.ranking - b.ranking);

  const handleDownloadPDF = () => {
    if (categoryPilots.length === 0) {
      alert("No hay pilotos confirmados en esta categoría para generar el PDF.");
      return;
    }
    generateResultsPDF(`Clasificación ${selectedCategory}`, "Kartódromo de Zárate", categoryPilots);
  };

  const handleDownloadLapByLap = () => {
    if (categoryPilots.length === 0) {
      alert("No hay pilotos confirmados en esta categoría para generar el reporte de vueltas.");
      return;
    }
    generateLapByLapPDF(`Historial Vueltas ${selectedCategory}`, "Kartódromo de Zárate", categoryPilots);
  };

  return (
    <div className="bg-[#050505] py-12 min-h-screen font-sans text-zinc-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER DE SECCIÓN CON IMPORTACIÓN EN VIVO */}
        <div className="mb-16 flex flex-col lg:flex-row justify-between items-end gap-10 border-b border-white/5 pb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5"><Activity size={180} /></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-600 p-2 rounded-lg"><Activity className="text-white" size={24} /></div>
              <span className="text-[10px] font-black uppercase text-red-500 tracking-[0.4em]">Live Stream Results</span>
            </div>
            <h1 className="text-6xl font-black italic oswald uppercase text-white mb-4 tracking-tighter">Resultados <span className="text-red-600">Oficiales</span></h1>
            <p className="text-zinc-500 text-[10px] uppercase font-black tracking-[0.3em]">Importación directa de decodificadores Orbits v5.0</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto relative z-10">
            <a 
              href={liveUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-red-600/20 transform hover:-translate-y-1"
            >
              <Zap size={18} fill="white" className="animate-pulse" /> Ver en Vivo
            </a>
            <a 
              href={historyUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white px-10 py-4 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-3 transition-all"
            >
              <Globe size={18} /> Archivo Completo
            </a>
          </div>
        </div>

        {/* SECCIÓN DE DESCARGA CATEGORÍA POR CATEGORÍA */}
        <div className="grid grid-cols-1 gap-12">
           
           <div className="bg-[#0c0c0c] border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><Download size={140} /></div>
              
              <div className="max-w-xl relative z-10">
                 <h2 className="text-3xl font-black oswald uppercase text-white mb-2 leading-tight">Reportes de <span className="text-red-600">Competencia</span></h2>
                 <p className="text-zinc-500 text-[10px] uppercase font-black tracking-[0.2em] mb-10">Generación de planillas PDF oficiales por categoría</p>
                 
                 <div className="space-y-8">
                    <div>
                       <label className="text-zinc-600 text-[9px] font-black uppercase mb-3 block tracking-[0.3em]">Seleccione Categoría</label>
                       <div className="relative mb-6">
                          <select 
                             value={selectedCategory} 
                             onChange={(e) => setSelectedCategory(e.target.value)}
                             className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-[11px] font-black text-white outline-none focus:border-red-600 transition-all uppercase appearance-none cursor-pointer"
                          >
                             {categories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-700">
                             <ChevronRight className="rotate-90" size={16} />
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <button 
                            onClick={handleDownloadPDF}
                            className="bg-white text-black hover:bg-red-600 hover:text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-3 transition-all shadow-2xl border border-white/5"
                          >
                             <FileText size={16} /> Clasificación Final
                          </button>
                          <button 
                            onClick={handleDownloadLapByLap}
                            className="bg-zinc-800 hover:bg-red-600 text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-3 transition-all shadow-2xl border border-white/5"
                          >
                             <ListChecks size={16} /> Vuelta por Vuelta
                          </button>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="mt-12 flex items-center gap-6 border-t border-zinc-900 pt-8">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-[9px] font-black text-zinc-500 uppercase">Firma Digital FRAD 3</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-[9px] font-black text-zinc-500 uppercase">Homologado</span>
                 </div>
              </div>
           </div>

           {/* INFO DE TIEMPOS DE REFERENCIA */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2rem] flex items-center gap-6 shadow-xl relative overflow-hidden group">
                 <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform"><Clock size={100} /></div>
                 <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-red-600"><Timer size={28} /></div>
                 <div>
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Timing Server</p>
                    <p className="text-3xl font-black text-white tabular-nums oswald">ONLINE</p>
                 </div>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2rem] flex items-center gap-6 shadow-xl relative overflow-hidden group">
                 <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform"><Activity size={100} /></div>
                 <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-blue-500"><Activity size={28} /></div>
                 <div>
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Status Sincronía</p>
                    <p className="text-2xl font-black text-white oswald uppercase">Sincronizado RJ45</p>
                 </div>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2rem] flex items-center gap-6 shadow-xl relative overflow-hidden group">
                 <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform"><Trophy size={100} /></div>
                 <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-emerald-500"><Zap size={28} /></div>
                 <div>
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Próximo GP</p>
                    <p className="text-2xl font-black text-white oswald uppercase tracking-tighter">Kart. Zárate</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Resultados;
