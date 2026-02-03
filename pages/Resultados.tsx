
import React, { useState, useEffect } from 'react';
import { Trophy, Activity, Zap, Shield, FileCheck, Calendar, FileDown, Search, AlertCircle, Clock, ChevronDown, ChevronUp, Timer } from 'lucide-react';
import { storageService } from '../services/storageService';
import { Pilot, Category, Status, RaceResult, Penalty, LapRecord } from '../types';
import { generateResultsPDF, generateChampionshipPDF } from '../utils/pdfGenerator';

const Resultados: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('');
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [historicalResults, setHistoricalResults] = useState<RaceResult[]>([]);
  const [view, setView] = useState<'ranking' | 'historial'>('ranking');
  const [expandedResult, setExpandedResult] = useState<string | null>(null);

  useEffect(() => {
    const loadedCats = storageService.getCategories();
    setCategories(loadedCats);
    if (loadedCats.length > 0) setSelectedCategory(loadedCats[0]);
    setPilots(storageService.getPilots());
    setPenalties(storageService.getPenalties());
    setHistoricalResults(storageService.getRaceResults());
  }, []);

  const rankingPilots = pilots
    .filter(p => p.category === selectedCategory && p.status === Status.CONFIRMADO)
    .sort((a, b) => (b.stats?.points || 0) - (a.stats?.points || 0));

  const filteredHistory = historicalResults.filter(r => r.category === selectedCategory);

  return (
    <div className="bg-black py-12 min-h-screen text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <header className="mb-16 border-b border-white/5 pb-12">
           <div className="flex flex-col lg:flex-row justify-between items-end gap-10">
              <div>
                 <div className="flex items-center gap-3 mb-4">
                    <Trophy className="text-yellow-400" size={24} />
                    <span className="text-[10px] font-black uppercase text-yellow-400 tracking-[0.4em] italic oswald">KDO Official Scoreboard</span>
                 </div>
                 <h1 className="text-6xl font-black italic oswald uppercase text-white mb-4 tracking-tighter leading-none">Resultados <span className="text-yellow-400">& Puntos</span></h1>
                 <div className="flex gap-4 mt-8">
                    <button onClick={() => setView('ranking')} className={`px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${view === 'ranking' ? 'bg-yellow-400 text-black shadow-xl shadow-yellow-400/20' : 'bg-zinc-900 text-zinc-600 hover:text-white'}`}>Campeonato 2026</button>
                    <button onClick={() => setView('historial')} className={`px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${view === 'historial' ? 'bg-yellow-400 text-black shadow-xl shadow-yellow-400/20' : 'bg-zinc-900 text-zinc-600 hover:text-white'}`}>Historial de Sesiones</button>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                 <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-zinc-900 border border-white/5 rounded-2xl py-5 px-10 text-[11px] font-black text-white uppercase outline-none focus:border-yellow-400 cursor-pointer appearance-none">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
                 <button onClick={() => window.open(storageService.getLiveUrl())} className="bg-yellow-400 text-black hover:bg-yellow-500 px-10 py-5 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-3 shadow-2xl transition-all transform hover:-translate-y-1">
                    <Zap size={18} fill="currentColor" /> Live Timing
                 </button>
              </div>
           </div>
        </header>

        {view === 'ranking' ? (
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              <div className="lg:col-span-3 bg-zinc-900/30 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
                 <div className="bg-black p-6 px-10 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white italic oswald">Ranking de Campeonato • {selectedCategory}</h3>
                    <button onClick={() => generateChampionshipPDF("Campeonato 2026", selectedCategory, rankingPilots)} className="text-[10px] font-black text-yellow-400 hover:text-white flex items-center gap-2 transition-colors"><FileDown size={14} /> Exportar Puntos</button>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-black text-zinc-600 text-[8px] font-black uppercase border-b border-white/5">
                          <tr>
                             <th className="px-10 py-5 text-center">Rank</th>
                             <th className="px-10 py-5">Piloto</th>
                             <th className="px-10 py-5 text-center">Kart</th>
                             <th className="px-10 py-5 text-center">Conducta</th>
                             <th className="px-10 py-5 text-right pr-10">Puntos Totales</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                          {rankingPilots.map((p, i) => (
                             <tr key={p.id} className="hover:bg-yellow-400/[0.03] transition-colors group">
                                <td className="px-10 py-6 text-center font-black oswald text-3xl italic text-yellow-400">0{i + 1}</td>
                                <td className="px-10 py-6">
                                   <p className="text-sm font-black text-white uppercase group-hover:text-yellow-400 transition-colors">{p.name}</p>
                                   <p className="text-[9px] text-zinc-600 font-bold uppercase">{p.association || 'KDO - Kart Disciplina Oficial'}</p>
                                </td>
                                <td className="px-10 py-6 text-center">
                                   <span className="bg-black border border-white/10 text-white font-black oswald px-4 py-1.5 rounded-xl text-lg tracking-tighter italic group-hover:text-yellow-400 transition-colors">#{p.number}</span>
                                </td>
                                <td className="px-10 py-6 text-center">
                                   <div className={`inline-flex flex-col items-center px-4 py-2 rounded-xl border ${p.conductPoints >= 8 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'}`}>
                                      <span className="oswald font-black text-sm">{p.conductPoints} PTOS</span>
                                   </div>
                                </td>
                                <td className="px-10 py-6 text-right pr-10">
                                   <span className="text-4xl font-black text-white oswald italic tracking-tighter group-hover:text-yellow-400 transition-colors">{(p.stats?.points || 0).toFixed(1)}</span>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>

              <div className="space-y-8">
                 <div className="bg-zinc-900 border border-white/5 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5"><Shield size={100} /></div>
                    <h3 className="text-xl font-black oswald uppercase text-white mb-8 italic">Veredictos de Torre</h3>
                    <div className="space-y-4">
                       {penalties.slice(0, 3).map(pen => (
                         <div key={pen.id} className="bg-black p-6 rounded-2xl border border-white/5">
                            <div className="flex justify-between items-start mb-2">
                               <p className="text-[9px] font-black text-yellow-400 uppercase tracking-widest">{pen.type}</p>
                               <span className="text-[8px] text-zinc-600 font-mono">{pen.date}</span>
                            </div>
                            <p className="text-xs font-bold text-zinc-300">#{pilots.find(p=>p.id===pen.pilotId)?.number} {pilots.find(p=>p.id===pen.pilotId)?.name}</p>
                            <p className="text-[10px] text-zinc-600 italic mt-2">"{pen.description}"</p>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        ) : (
           <div className="space-y-6">
              {filteredHistory.map(res => (
                <div key={res.id} className="bg-zinc-900 border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
                   <div 
                     onClick={() => setExpandedResult(expandedResult === res.id ? null : res.id)}
                     className="p-10 cursor-pointer flex flex-col md:flex-row justify-between items-center hover:bg-white/[0.02] transition-all group"
                   >
                      <div className="flex items-center gap-8">
                        <div className="bg-yellow-400 p-4 rounded-3xl text-black shadow-xl group-hover:scale-110 transition-transform"><Calendar size={24} /></div>
                        <div>
                           <h3 className="text-3xl font-black oswald uppercase text-white italic tracking-tighter">{res.sessionName} • {res.track}</h3>
                           <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mt-1">{res.category} • {res.date} • {res.data.length} Participantes</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 mt-6 md:mt-0">
                         <div className="text-right hidden md:block">
                            <p className="text-[8px] font-black text-zinc-600 uppercase">Mejor Vuelta Sesión</p>
                            <p className="text-xl font-black oswald text-yellow-400 italic">{res.data[0]?.bestLap}</p>
                         </div>
                         {expandedResult === res.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                      </div>
                   </div>

                   {expandedResult === res.id && (
                     <div className="border-t border-white/5 bg-black/40 p-10 animate-in slide-in-from-top-4 duration-300">
                        <table className="w-full text-left">
                           <thead className="bg-black text-zinc-600 text-[8px] font-black uppercase border-b border-zinc-800">
                              <tr>
                                 <th className="px-6 py-4 text-center">Pos</th>
                                 <th className="px-6 py-4">Piloto</th>
                                 <th className="px-6 py-4 text-center">Kart</th>
                                 <th className="px-6 py-4 text-right">Dif.</th>
                                 <th className="px-6 py-4 text-right">Mejor Vta.</th>
                                 <th className="px-6 py-4 text-center">Telemetría</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-white/5">
                              {res.data.map(d => (
                                <React.Fragment key={d.number}>
                                  <tr className="hover:bg-yellow-400/[0.02]">
                                     <td className="px-6 py-5 text-center font-black oswald text-xl italic text-zinc-500">0{d.pos}</td>
                                     <td className="px-6 py-5 font-black uppercase text-white text-xs">{d.name}</td>
                                     <td className="px-6 py-5 text-center"><span className="bg-zinc-800 px-3 py-1 rounded-lg text-[10px] font-black text-white">#{d.number}</span></td>
                                     <td className="px-6 py-5 text-right font-mono text-[10px]">{d.gap}</td>
                                     <td className="px-6 py-5 text-right font-black oswald text-yellow-400 italic">{d.bestLap}</td>
                                     <td className="px-6 py-5 text-center">
                                        {d.lapsHistory && d.lapsHistory.length > 0 ? (
                                           <div className="flex justify-center gap-1">
                                              {d.lapsHistory.slice(0, 10).map((l, i) => (
                                                <div key={i} className={`w-1.5 h-6 rounded-sm ${l.isPersonalBest ? 'bg-yellow-400' : 'bg-zinc-800'}`} title={`Vta ${l.lap}: ${l.time}`}></div>
                                              ))}
                                           </div>
                                        ) : '-'}
                                     </td>
                                  </tr>
                                </React.Fragment>
                              ))}
                           </tbody>
                        </table>
                        <div className="mt-8 flex justify-end">
                           {/* Fix: Pass res.data to generateResultsPDF */}
                           <button onClick={() => generateResultsPDF(res.sessionName, res.track, res.data)} className="bg-white text-black px-8 py-3 rounded-xl font-black uppercase text-[10px] flex items-center gap-2 hover:bg-yellow-400 transition-all shadow-xl">
                              <FileCheck size={16} /> Descargar Oficial Firmado
                           </button>
                        </div>
                     </div>
                   )}
                </div>
              ))}
              {filteredHistory.length === 0 && (
                 <div className="py-32 text-center border-2 border-dashed border-zinc-900 rounded-[3rem]">
                    <AlertCircle size={48} className="text-zinc-800 mx-auto mb-4 opacity-20" />
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">No hay registros de sesiones importadas para esta categoría</p>
                 </div>
              )}
           </div>
        )}
      </div>
    </div>
  );
};

export default Resultados;
