
import React, { useEffect, useState } from 'react';
import { Trophy, Star, Award, Calendar, ChevronRight, Zap } from 'lucide-react';
import { storageService } from '../services/storageService';
import { Championship } from '../types';

const HallOfFame = () => {
  const [championships, setChampionships] = useState<Championship[]>([]);

  useEffect(() => {
    setChampionships(storageService.getChampionships());
  }, []);

  return (
    <div className="bg-black py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-20 text-center">
          <div className="bg-yellow-400/10 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-yellow-400/20 shadow-[0_0_50px_rgba(250,204,21,0.2)]">
            <Star size={48} className="text-yellow-400" />
          </div>
          <h1 className="text-7xl font-black italic oswald uppercase text-white mb-4 tracking-tighter">Hall of <span className="text-yellow-400">Fame</span></h1>
          <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.5em]">El Legado Eterno de KDO - Kart Disciplina Oficial</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {championships.map((ch) => (
            <div key={ch.id} className="bg-zinc-900/50 border border-zinc-800 p-10 rounded-[3.5rem] relative overflow-hidden group hover:border-yellow-400/30 transition-all shadow-2xl">
               <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity"><Trophy size={140} /></div>
               <div className="flex items-center gap-4 mb-8">
                  <span className="bg-yellow-400 text-black px-4 py-1 rounded-xl text-[10px] font-black oswald">SEASON {ch.year}</span>
               </div>
               <h3 className="text-3xl font-black oswald uppercase text-white mb-8 italic tracking-tighter leading-none group-hover:text-yellow-400 transition-colors">{ch.name}</h3>
               
               <div className="space-y-6">
                  {ch.champions?.map((winner, idx) => (
                    <div key={idx} className="flex justify-between items-center py-4 border-b border-white/5">
                       <div>
                          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{winner.category}</p>
                          <p className="text-lg font-black oswald text-white uppercase tracking-tight">{winner.pilot}</p>
                       </div>
                       <div className="bg-black p-3 rounded-2xl text-yellow-400 shadow-xl border border-white/5"><Award size={20} /></div>
                    </div>
                  )) || (
                    <div className="py-10 text-center">
                       <Zap className="text-zinc-800 mx-auto mb-4" size={32} />
                       <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Competición en Curso</p>
                    </div>
                  )}
               </div>
               
               <button className="w-full mt-10 bg-black border border-zinc-800 hover:bg-yellow-400 hover:text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg">
                 Ver Estadísticas Completas <ChevronRight size={14} />
               </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HallOfFame;
