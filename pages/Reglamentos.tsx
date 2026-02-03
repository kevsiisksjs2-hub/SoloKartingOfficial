
import React, { useEffect, useState } from 'react';
import { FileText, Download, ShieldCheck, Zap, BookOpen, Calendar, HardDrive, Info } from 'lucide-react';
import { storageService } from '../services/storageService';
import { Regulation, RegulationCategory } from '../types';

const Reglamentos: React.FC = () => {
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [activeFilter, setActiveFilter] = useState<'Todos' | RegulationCategory>('Todos');

  useEffect(() => {
    // Solo mostrar reglamentos que no sean borradores
    const loaded = storageService.getRegulations().filter(r => !r.isDraft);
    setRegulations(loaded);
  }, []);

  const filters: ('Todos' | RegulationCategory)[] = ['Todos', 'Técnico', 'Deportivo', 'Calendario', 'Anexo'];

  const filteredRegs = activeFilter === 'Todos' 
    ? regulations 
    : regulations.filter(r => r.category === activeFilter);

  return (
    <div className="bg-black py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-20 text-center">
          <div className="bg-yellow-400 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-yellow-400/30">
            <BookOpen size={48} className="text-black" />
          </div>
          <h1 className="text-7xl font-black italic oswald uppercase text-white mb-4 tracking-tighter">Reglamentos</h1>
          <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.5em]">Normativa Oficial de Competición KDO</p>
        </header>

        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {filters.map(f => (
            <button 
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-8 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all border ${
                activeFilter === f ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-white hover:border-yellow-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRegs.map((reg) => (
            <div key={reg.id} className="bg-zinc-900/40 border border-zinc-800 rounded-[3rem] p-10 flex flex-col justify-between hover:border-yellow-400 transition-all group h-full shadow-2xl relative">
              <div className="absolute top-8 right-8 text-zinc-800 font-black oswald text-4xl opacity-5 group-hover:opacity-10 transition-opacity">v{reg.version}</div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                   <span className="bg-yellow-400/10 text-yellow-400 text-[8px] font-black uppercase px-3 py-1 rounded-lg border border-yellow-400/20">{reg.category}</span>
                   <span className="bg-black text-zinc-500 text-[8px] font-black uppercase px-3 py-1 rounded-lg border border-zinc-800">Versión {reg.version}</span>
                </div>
                <h3 className="text-2xl font-black oswald uppercase text-white mb-4 italic leading-none group-hover:text-yellow-400 transition-colors">{reg.title}</h3>
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-wide leading-relaxed mb-10">{reg.description}</p>
              </div>

              <div className="pt-8 border-t border-zinc-800 flex justify-between items-end">
                 <div className="space-y-1">
                    <p className="text-[8px] font-black text-zinc-500 uppercase flex items-center gap-2"><Calendar size={10} /> {reg.date}</p>
                    <p className="text-[8px] font-black text-zinc-500 uppercase flex items-center gap-2"><HardDrive size={10} /> {reg.fileSize}</p>
                 </div>
                 <a href={reg.fileData} download className="bg-white text-black px-6 py-4 rounded-2xl font-black uppercase text-[9px] hover:bg-yellow-400 transition-all shadow-xl flex items-center gap-2">
                   Descargar <Download size={14} />
                 </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reglamentos;
