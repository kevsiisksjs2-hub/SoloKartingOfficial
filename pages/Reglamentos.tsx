
import React, { useEffect, useState } from 'react';
import { FileText, Download, ShieldCheck, Zap, AlertCircle, HardDrive, Filter, BookOpen, Calendar, Info } from 'lucide-react';
import { storageService } from '../services/storageService';
import { Regulation, RegulationCategory } from '../types';

const Reglamentos: React.FC = () => {
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [activeFilter, setActiveFilter] = useState<'Todos' | RegulationCategory>('Todos');

  useEffect(() => {
    const loaded = storageService.getRegulations();
    setRegulations(loaded);
  }, []);

  const filters: ('Todos' | RegulationCategory)[] = ['Todos', 'Técnico', 'Deportivo', 'Calendario', 'Anexo', 'Institucional'];

  const filteredRegs = activeFilter === 'Todos' 
    ? regulations 
    : regulations.filter(r => r.category === activeFilter);

  const getCategoryColor = (cat: RegulationCategory) => {
    switch (cat) {
      case 'Técnico': return 'text-red-600 border-red-600/20 bg-red-600/5';
      case 'Deportivo': return 'text-blue-600 border-blue-600/20 bg-blue-600/5';
      case 'Calendario': return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5';
      case 'Anexo': return 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5';
      default: return 'text-zinc-500 border-zinc-800 bg-zinc-900';
    }
  };

  const getCategoryIcon = (cat: RegulationCategory) => {
    switch (cat) {
      case 'Técnico': return <Zap size={20} />;
      case 'Deportivo': return <ShieldCheck size={20} />;
      case 'Calendario': return <Calendar size={20} />;
      case 'Anexo': return <Info size={20} />;
      default: return <FileText size={20} />;
    }
  };

  return (
    <div className="bg-zinc-950 py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera Principal */}
        <header className="mb-20 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600/10 blur-[100px] rounded-full"></div>
          <div className="relative z-10">
            <div className="bg-red-600 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-600/30 transform -rotate-6">
              <BookOpen size={48} className="text-white" />
            </div>
            <h1 className="text-7xl font-black italic oswald uppercase text-white mb-4 tracking-tighter">Leyes <span className="text-red-600">&</span> Reglamentos</h1>
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.5em] flex items-center justify-center gap-4">
               <span className="h-px w-12 bg-zinc-900"></span>
               Normativa Oficial de Competición KDO
               <span className="h-px w-12 bg-zinc-900"></span>
            </p>
          </div>
        </header>

        {/* Barra de Filtros */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {filters.map(f => (
            <button 
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-8 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all border ${
                activeFilter === f 
                ? 'bg-red-600 text-white border-red-600 shadow-xl shadow-red-600/20' 
                : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid de Documentos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRegs.map((reg) => (
            <div key={reg.id} className="bg-zinc-900/40 border border-zinc-800 rounded-[3rem] p-10 flex flex-col justify-between hover:border-red-600/40 transition-all group relative overflow-hidden h-full shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform pointer-events-none">
                {getCategoryIcon(reg.category)}
              </div>
              
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-8 shadow-xl ${getCategoryColor(reg.category)}`}>
                  {getCategoryIcon(reg.category)}
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                   <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${getCategoryColor(reg.category)}`}>
                     {reg.category}
                   </span>
                </div>
                
                <h3 className="text-2xl font-black oswald uppercase text-white mb-4 italic tracking-tight group-hover:text-red-500 transition-colors leading-none">
                  {reg.title}
                </h3>
                <p className="text-zinc-600 text-[10px] font-bold leading-relaxed mb-10 uppercase tracking-wide line-clamp-3">
                  {reg.description || 'Descarga la normativa oficial vigente para la presente temporada fiscalizada por KDO.'}
                </p>
              </div>

              <div className="relative z-10 pt-8 border-t border-zinc-800/50 flex justify-between items-end">
                 <div className="flex flex-col gap-1">
                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                       <Calendar size={10} className="text-red-600" /> Emitido: {reg.date}
                    </p>
                    <p className="text-[8px] font-bold text-zinc-700 uppercase flex items-center gap-2">
                       <HardDrive size={10} /> Peso: {reg.fileSize}
                    </p>
                 </div>
                 <a 
                   href={reg.fileData} 
                   download={reg.fileName}
                   className="bg-white text-black px-6 py-4 rounded-2xl font-black uppercase text-[9px] tracking-widest flex items-center gap-3 hover:bg-red-600 hover:text-white transition-all shadow-xl group/btn"
                 >
                   Descargar <Download size={14} className="group-hover/btn:animate-bounce" />
                 </a>
              </div>
            </div>
          ))}

          {filteredRegs.length === 0 && (
            <div className="col-span-full py-40 text-center bg-zinc-900/20 border-2 border-dashed border-zinc-900 rounded-[4rem]">
               <BookOpen size={64} className="text-zinc-800 mx-auto mb-6 opacity-20" />
               <p className="text-zinc-600 font-black uppercase tracking-[0.4em] text-xs">No se encontraron leyes en esta categoría</p>
               <button onClick={() => setActiveFilter('Todos')} className="mt-4 text-red-600 font-black uppercase text-[10px] underline tracking-widest">Ver todos los archivos</button>
            </div>
          )}
        </div>

        {/* Footer Informativo */}
        <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-zinc-900/50 border border-zinc-800 p-12 rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row items-center gap-8">
              <div className="bg-red-600/10 p-6 rounded-[2rem] border border-red-600/20">
                 <AlertCircle className="text-red-600" size={40} />
              </div>
              <div>
                 <h4 className="text-xl font-black oswald uppercase text-white mb-2 italic tracking-tight">Validez Legal</h4>
                 <p className="text-zinc-500 text-[10px] leading-relaxed font-bold uppercase">Todos los reglamentos aquí publicados han sido homologados por FRAD 3. Cualquier cambio será notificado vía "Anexo" en esta plataforma oficial.</p>
              </div>
           </div>
           
           <div className="bg-zinc-900/50 border border-zinc-800 p-12 rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row items-center gap-8">
              <div className="bg-blue-600/10 p-6 rounded-[2rem] border border-blue-600/20">
                 <ShieldCheck className="text-blue-600" size={40} />
              </div>
              <div>
                 <h4 className="text-xl font-black oswald uppercase text-white mb-2 italic tracking-tight">Revisiones Técnicas</h4>
                 <p className="text-zinc-500 text-[10px] leading-relaxed font-bold uppercase">Es responsabilidad del concurrente contar con una copia física o digital actualizada para las verificaciones previas en boxes.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Reglamentos;
