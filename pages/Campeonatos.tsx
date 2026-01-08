
import React, { useEffect, useState } from 'react';
import { Trophy, Calendar, MapPin, Search, ChevronRight, Award, Star, ListOrdered, Download } from 'lucide-react';
import { storageService } from '../services/storageService';
import { Championship, Pilot, Category } from '../types';
import { generateChampionshipPDF } from '../utils/pdfGenerator';

const Campeonatos: React.FC = () => {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('');
  const [activeTab, setActiveTab] = useState<'torneos' | 'posiciones'>('torneos');

  useEffect(() => {
    const loadedChamps = storageService.getChampionships();
    const loadedPilots = storageService.getPilots();
    const loadedCats = storageService.getCategories();
    
    setChampionships(loadedChamps);
    setPilots(loadedPilots);
    setCategories(loadedCats);
    if (loadedCats.length > 0) setSelectedCategory(loadedCats[0]);
  }, []);

  const standingsPilots = pilots
    .filter(p => p.category === selectedCategory && p.status === 'Confirmado')
    .sort((a, b) => {
        const scoreA = (a.stats?.wins || 0) * 25 + (a.stats?.podiums || 0) * 15 + (a.stats?.poles || 0) * 5;
        const scoreB = (b.stats?.wins || 0) * 25 + (b.stats?.podiums || 0) * 15 + (b.stats?.poles || 0) * 5;
        return scoreB - scoreA;
    });

  const getPilotScore = (p: Pilot) => {
    return (p.stats?.wins || 0) * 25 + (p.stats?.podiums || 0) * 15 + (p.stats?.poles || 0) * 5;
  };

  const handleDownloadStandings = () => {
    if (standingsPilots.length === 0) {
      alert("No hay datos para esta categoría.");
      return;
    }
    generateChampionshipPDF("Torneo Oficial 2024", selectedCategory, standingsPilots);
  };

  return (
    <div className="bg-zinc-950 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <header className="mb-16 border-b border-zinc-900 pb-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
               <h1 className="text-5xl font-black italic oswald uppercase text-white mb-4 tracking-tighter">Temporada <span className="text-red-600">2024</span></h1>
               <div className="flex gap-4">
                  <button onClick={() => setActiveTab('torneos')} className={`px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'torneos' ? 'bg-red-600 text-white shadow-xl shadow-red-600/20' : 'text-zinc-500 hover:text-white'}`}>Torneos Activos</button>
                  <button onClick={() => setActiveTab('posiciones')} className={`px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'posiciones' ? 'bg-red-600 text-white shadow-xl shadow-red-600/20' : 'text-zinc-500 hover:text-white'}`}>Tabla de Posiciones</button>
               </div>
            </div>
            {activeTab === 'posiciones' && (
              <div className="flex items-center gap-4 w-full md:w-auto">
                 <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="bg-zinc-900 border border-zinc-800 text-white text-[11px] font-black uppercase rounded-xl px-6 py-4 outline-none focus:border-red-600 transition-all flex-grow md:flex-none appearance-none cursor-pointer">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
                 <button onClick={handleDownloadStandings} className="bg-white text-black hover:bg-red-600 hover:text-white p-4 rounded-xl transition-all shadow-xl"><Download size={20} /></button>
              </div>
            )}
          </div>
        </header>

        {activeTab === 'torneos' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {championships.map((ch) => (
              <div key={ch.id} className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl hover:border-red-600/30 transition-all group relative">
                <div className="md:w-1/3 h-64 md:h-auto overflow-hidden relative">
                  <img src={ch.image} alt={ch.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-transparent to-transparent hidden md:block"></div>
                </div>
                <div className="p-10 flex-grow flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${ch.status === 'En curso' ? 'bg-emerald-600/10 text-emerald-500 border-emerald-500/20' : 'bg-blue-600/10 text-blue-500 border-blue-500/20'}`}>{ch.status}</span>
                  </div>
                  <h3 className="text-4xl font-black oswald uppercase text-white mb-6 group-hover:text-red-500 transition-colors">{ch.name}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                    <div className="flex items-center gap-3"><Calendar size={18} className="text-red-600" /> {ch.dates}</div>
                    <div className="flex items-center gap-3"><MapPin size={18} className="text-red-600" /> {ch.tracks}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'posiciones' && (
          <div className="animate-in fade-in slide-in-from-right-2 duration-500">
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="bg-zinc-950 p-6 px-10 border-b border-zinc-800 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <ListOrdered className="text-red-600" size={20} />
                    <span className="text-xs font-black uppercase tracking-widest text-white">Standings Oficiales • {selectedCategory}</span>
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-zinc-950 text-zinc-600 text-[8px] font-black uppercase tracking-[0.3em] border-b border-zinc-800">
                       <tr>
                          <th className="px-10 py-5 w-20 text-center">Rank</th>
                          <th className="px-10 py-5 w-24 text-center">Kart</th>
                          <th className="px-10 py-5">Piloto</th>
                          <th className="px-10 py-5 text-center">Wins</th>
                          <th className="px-10 py-5 text-center">Podiums</th>
                          <th className="px-10 py-5 text-right pr-10">Puntos</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                       {standingsPilots.map((p, i) => (
                          <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                             <td className="px-10 py-5 text-center">
                                <span className={`text-2xl font-black oswald italic ${i === 0 ? 'text-red-600' : i < 3 ? 'text-zinc-200' : 'text-zinc-700'}`}>0{i + 1}</span>
                             </td>
                             <td className="px-10 py-5 text-center">
                                <span className="bg-zinc-950 border border-zinc-800 text-white font-black oswald px-3 py-1 rounded text-base">#{p.number}</span>
                             </td>
                             <td className="px-10 py-5">
                                <p className="text-xs font-black text-white uppercase group-hover:text-red-500 transition-all">{p.name}</p>
                                <p className="text-[8px] text-zinc-600 uppercase font-black">{p.association}</p>
                             </td>
                             <td className="px-10 py-5 text-center text-xs font-black text-white oswald">{p.stats?.wins || 0}</td>
                             <td className="px-10 py-5 text-center text-xs font-black text-zinc-400 oswald">{p.stats?.podiums || 0}</td>
                             <td className="px-10 py-5 text-right pr-10">
                                <span className="text-2xl font-black text-emerald-500 oswald">{getPilotScore(p).toFixed(1)}</span>
                             </td>
                          </tr>
                       ))}
                       {standingsPilots.length === 0 && (
                          <tr>
                             <td colSpan={6} className="py-24 text-center">
                                <Award size={48} className="text-zinc-800 mx-auto mb-4 opacity-20" />
                                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Sin datos de competencia para esta categoría</p>
                             </td>
                          </tr>
                       )}
                    </tbody>
                 </table>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2rem] flex items-center gap-6">
                  <div className="bg-zinc-950 p-4 rounded-2xl text-red-600"><Star size={24} /></div>
                  <div>
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Cálculo Pole</p>
                    <p className="text-sm font-black text-white uppercase oswald">+5 Puntos</p>
                  </div>
               </div>
               <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2rem] flex items-center gap-6">
                  <div className="bg-zinc-950 p-4 rounded-2xl text-emerald-500"><Award size={24} /></div>
                  <div>
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Cálculo Final</p>
                    <p className="text-sm font-black text-white uppercase oswald">+25 Puntos (P1)</p>
                  </div>
               </div>
               <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2rem] flex items-center gap-6">
                  <div className="bg-zinc-950 p-4 rounded-2xl text-blue-500"><Trophy size={24} /></div>
                  <div>
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Cálculo Podio</p>
                    <p className="text-sm font-black text-white uppercase oswald">+15 Puntos (P2/P3)</p>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Campeonatos;
