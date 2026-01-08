
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { Pilot, Status } from '../types';
// Added missing Users icon from lucide-react
import { Search, Trophy, ShieldAlert, Award, Star, X, Filter, Users } from 'lucide-react';

const Pilotos: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPilot, setSelectedPilot] = useState<Pilot | null>(null);
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'Todas');

  useEffect(() => {
    setPilots(storageService.getPilots());
  }, []);

  const categories = ['Todas', ...storageService.getCategories()];

  const filteredPilots = pilots.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.number.includes(searchTerm);
    const matchesCategory = categoryFilter === 'Todas' || p.category === categoryFilter;
    return p.status !== Status.BAJA && matchesSearch && matchesCategory;
  });

  const handleCategoryChange = (cat: string) => {
    setCategoryFilter(cat);
    if (cat === 'Todas') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-zinc-950 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-16 border-b border-zinc-900 pb-12">
          <div>
            <h1 className="text-6xl font-black italic oswald uppercase text-white mb-2 tracking-tighter">Pasaporte <span className="text-red-600">Piloto</span></h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Base de datos de palmarés y conducta deportiva oficial</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative flex-grow sm:w-80">
              <Search className="absolute left-4 top-4 text-zinc-600" size={20} />
              <input 
                type="text" 
                placeholder="BUSCAR PILOTO O DORSAL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white font-bold focus:border-red-600 outline-none transition-all uppercase text-xs"
              />
            </div>
            
            <div className="relative sm:w-64">
              <Filter className="absolute left-4 top-4 text-zinc-600" size={18} />
              <select 
                value={categoryFilter}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-white font-bold focus:border-red-600 outline-none appearance-none uppercase text-xs cursor-pointer"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredPilots.map((p) => (
            <div 
              key={p.id} 
              onClick={() => setSelectedPilot(p)}
              className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 hover:border-red-600 transition-all group cursor-pointer shadow-2xl relative overflow-hidden flex flex-col h-full"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-15 transition-all duration-500">
                <Trophy size={100} />
              </div>

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="bg-red-600 text-white font-black italic oswald text-4xl px-5 py-2.5 rounded-2xl shadow-xl transform -skew-x-12 group-hover:scale-110 transition-transform">
                  #{p.number}
                </div>
                <div className={`p-3 rounded-2xl border ${p.conductPoints && p.conductPoints > 7 ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-red-500 border-red-500/20 bg-red-500/5'}`}>
                  <ShieldAlert size={20} />
                </div>
              </div>

              <div className="relative z-10 flex-grow">
                <h3 className="text-2xl font-black text-white uppercase oswald leading-none mb-2 group-hover:text-red-500 transition-colors tracking-tight italic">{p.name}</h3>
                <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em] mb-8">{p.category}</p>
              </div>
              
              <div className="relative z-10 pt-8 border-t border-zinc-800 grid grid-cols-2 gap-4">
                 <div className="text-center">
                    <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Victorias</p>
                    <p className="text-2xl font-black text-white oswald italic">{p.stats?.wins || 0}</p>
                 </div>
                 <div className="text-center border-l border-zinc-800">
                    <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Podios</p>
                    <p className="text-2xl font-black text-white oswald italic">{p.stats?.podiums || 0}</p>
                 </div>
              </div>
            </div>
          ))}
          
          {filteredPilots.length === 0 && (
            <div className="col-span-full py-32 text-center bg-zinc-900/30 border-2 border-dashed border-zinc-900 rounded-[3rem]">
               {/* Fixed: Use the imported Users icon */}
               <Users size={64} className="text-zinc-800 mx-auto mb-6 opacity-20" />
               <p className="text-zinc-600 font-black uppercase tracking-widest text-xs">No se encontraron pilotos con los filtros seleccionados</p>
               <button onClick={() => handleCategoryChange('Todas')} className="mt-4 text-red-500 font-black uppercase text-[10px] underline">Limpiar filtros</button>
            </div>
          )}
        </div>

        {selectedPilot && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/98 backdrop-blur-2xl">
             <div className="bg-zinc-900 w-full max-w-2xl rounded-[3rem] border border-zinc-800 p-12 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                <button onClick={() => setSelectedPilot(null)} className="absolute top-10 right-10 text-zinc-500 hover:text-white transition-colors bg-zinc-950 p-2 rounded-full"><X size={24}/></button>
                
                <div className="flex items-center gap-10 mb-12">
                   <div className="bg-red-600 w-36 h-36 rounded-[2.5rem] flex items-center justify-center text-7xl font-black italic oswald text-white shadow-2xl transform rotate-3 relative overflow-hidden">
                     <span className="relative z-10">#{selectedPilot.number}</span>
                     <div className="absolute inset-0 bg-white/10 -rotate-45 translate-y-1/2"></div>
                   </div>
                   <div>
                      <h2 className="text-5xl md:text-6xl font-black oswald uppercase text-white leading-none mb-3 tracking-tighter italic">{selectedPilot.name}</h2>
                      <div className="flex items-center gap-3">
                        <span className="bg-zinc-800 text-red-500 font-black uppercase tracking-[0.3em] text-[10px] px-3 py-1.5 rounded-xl border border-red-600/20">{selectedPilot.category}</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                   <div className="bg-zinc-950 p-8 rounded-[2rem] border border-zinc-800 text-center group hover:border-red-600 transition-all">
                      <Star className="text-yellow-500 mx-auto mb-4 group-hover:scale-110 transition-transform" size={32} />
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Puntos Conducta</p>
                      <p className="text-4xl font-black oswald text-white">{selectedPilot.conductPoints || 10}/10</p>
                   </div>
                   <div className="bg-zinc-950 p-8 rounded-[2rem] border border-zinc-800 text-center group hover:border-red-600 transition-all">
                      <Award className="text-emerald-500 mx-auto mb-4 group-hover:scale-110 transition-transform" size={32} />
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Victorias</p>
                      <p className="text-4xl font-black oswald text-white">{selectedPilot.stats?.wins || 0}</p>
                   </div>
                   <div className="bg-zinc-950 p-8 rounded-[2rem] border border-zinc-800 text-center group hover:border-red-600 transition-all">
                      <Trophy className="text-zinc-600 mx-auto mb-4 group-hover:scale-110 transition-transform" size={32} />
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Podios Totales</p>
                      <p className="text-4xl font-black oswald text-white">{selectedPilot.stats?.podiums || 0}</p>
                   </div>
                </div>

                <div className="bg-zinc-800/20 p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-3xl rounded-full"></div>
                   <h4 className="text-white font-black oswald uppercase tracking-widest flex items-center gap-3 mb-4 relative z-10">
                     <ShieldAlert className="text-red-600" /> Historial de Comisariato
                   </h4>
                   <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest italic relative z-10">Sin sanciones graves reportadas en la presente temporada por la FRAD 3.</p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pilotos;
