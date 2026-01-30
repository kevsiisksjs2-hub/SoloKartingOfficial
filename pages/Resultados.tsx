
import React, { useState, useEffect } from 'react';
import { Trophy, Download, FileText, ChevronRight, Activity, Zap, Globe, ListChecks, Award } from 'lucide-react';
import { storageService } from '../services/storageService';
import { Pilot, Category, Status } from '../types';
import { generateResultsPDF, generateChampionshipPDF } from '../utils/pdfGenerator';

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
    setHistoryUrl(storageService.getLiveUrl().replace('LiveTiming', 'Results'));
  }, []);

  // Pilotos confirmados de la categoría seleccionada (usados para el ranking)
  const categoryPilots = pilots
    .filter(p => p.category === selectedCategory && p.status === Status.CONFIRMADO)
    .sort((a, b) => {
      const scoreA = (a.stats?.wins || 0) * 25 + (a.stats?.podiums || 0) * 15 + (a.stats?.poles || 0) * 5;
      const scoreB = (b.stats?.wins || 0) * 25 + (b.stats?.podiums || 0) * 15 + (b.stats?.poles || 0) * 5;
      return scoreB - scoreA;
    });

  const handleDownloadResults = () => {
    if (categoryPilots.length === 0) return alert("No hay datos");
    generateResultsPDF(`CLASIFICACION FINAL - ${selectedCategory}`, "KARTODROMO OFICIAL", categoryPilots);
  };

  const handleDownloadChampionship = () => {
    if (categoryPilots.length === 0) return alert("No hay datos");
    generateChampionshipPDF("CAMPEONATO PKN 2024", selectedCategory, categoryPilots);
  };

  return (
    <div className="bg-[#050505] py-12 min-h-screen font-sans text-zinc-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16 border-b border-white/5 pb-12 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg"><Activity className="text-white" size={24} /></div>
              <span className="text-[10px] font-black uppercase text-blue-500 tracking-[0.4em]">PKN OFFICIAL TIMING</span>
            </div>
            <h1 className="text-6xl font-black italic oswald uppercase text-white mb-4 tracking-tighter">Resultados <span className="text-blue-600">& Ranking</span></h1>
            <p className="text-zinc-500 text-[10px] uppercase font-black tracking-[0.3em]">Cálculo automático de campeonato por categoría</p>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 relative z-10">
            <a href={liveUrl} target="_blank" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-3 shadow-xl transform hover:-translate-y-1">
              <Zap size={18} fill="white" className="animate-pulse" /> Live Timing
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Panel de Control y Selección */}
           <div className="lg:col-span-1 space-y-8">
              <div className="bg-[#0c0c0c] border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl">
                 <h3 className="text-xl font-black oswald uppercase text-white mb-6">Selección</h3>
                 <div className="space-y-6">
                    <div>
                       <label className="text-zinc-600 text-[9px] font-black uppercase mb-3 block">Categoría de Competencia</label>
                       <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-[11px] font-black text-white outline-none focus:border-blue-600 uppercase appearance-none cursor-pointer">
                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                    </div>
                    
                    <div className="space-y-3">
                       <button onClick={handleDownloadResults} className="w-full bg-white text-black hover:bg-blue-600 hover:text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-3 transition-all">
                          <FileText size={16} /> Descargar Resultados
                       </button>
                       <button onClick={handleDownloadChampionship} className="w-full bg-zinc-800 hover:bg-emerald-600 text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-3 transition-all">
                          <Trophy size={16} /> Descargar Ranking
                       </button>
                    </div>
                 </div>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-[2rem]">
                 <div className="flex items-center gap-3 mb-4">
                    <Award className="text-blue-600" />
                    <span className="text-[10px] font-black uppercase text-white">SISTEMA DE PUNTOS PKN</span>
                 </div>
                 <ul className="text-[9px] font-bold text-zinc-500 space-y-2 uppercase">
                    <li className="flex justify-between"><span>Victoria Final:</span> <span className="text-white">+25 PTS</span></li>
                    <li className="flex justify-between"><span>Podio (2do/3er):</span> <span className="text-white">+15 PTS</span></li>
                    <li className="flex justify-between"><span>Pole Position:</span> <span className="text-white">+5 PTS</span></li>
                 </ul>
              </div>
           </div>

           {/* Tabla de Ranking Automatizada */}
           <div className="lg:col-span-2">
              <div className="bg-[#0c0c0c] border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                 <div className="bg-zinc-950 p-6 border-b border-zinc-800">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Ranking Actual - {selectedCategory}</h3>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-zinc-950 text-zinc-600 text-[8px] font-black uppercase border-b border-zinc-900">
                          <tr>
                             <th className="px-10 py-5 w-20 text-center">POS</th>
                             <th className="px-10 py-5">PILOTO</th>
                             <th className="px-10 py-5 text-center">KART</th>
                             <th className="px-10 py-5 text-right pr-10">PUNTOS</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-zinc-800/50">
                          {categoryPilots.map((p, i) => {
                             const points = (p.stats?.wins || 0) * 25 + (p.stats?.podiums || 0) * 15 + (p.stats?.poles || 0) * 5;
                             return (
                                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                                   <td className="px-10 py-5 text-center font-black oswald text-2xl italic text-blue-600">0{i + 1}</td>
                                   <td className="px-10 py-5">
                                      <p className="text-xs font-black text-white uppercase">{p.name}</p>
                                      <p className="text-[8px] text-zinc-600 font-black uppercase">{p.association || 'PKN Pilotos'}</p>
                                   </td>
                                   <td className="px-10 py-5 text-center">
                                      <span className="bg-zinc-950 border border-zinc-800 text-white font-black oswald px-3 py-1 rounded">#{p.number}</span>
                                   </td>
                                   <td className="px-10 py-5 text-right pr-10">
                                      <span className="text-2xl font-black text-white oswald">{points.toFixed(1)}</span>
                                   </td>
                                </tr>
                             );
                          })}
                          {categoryPilots.length === 0 && (
                            <tr><td colSpan={4} className="py-20 text-center text-zinc-700 text-[10px] font-black uppercase">Sin datos de ranking confirmados</td></tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Resultados;
