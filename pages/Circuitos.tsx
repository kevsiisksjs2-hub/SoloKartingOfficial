
import React, { useEffect, useState } from 'react';
import { MapPin, Info, Ruler, Zap, Building2, Target } from 'lucide-react';
import { storageService } from '../services/storageService';
import { Circuit, Association } from '../types';

const Circuitos: React.FC = () => {
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [associations, setAssociations] = useState<Association[]>([]);

  useEffect(() => {
    setCircuits(storageService.getCircuits());
    setAssociations(storageService.getAssociations());
  }, []);

  const getAssocsForCircuit = (circuitId: string) => {
    return associations.filter(a => a.circuitIds?.includes(circuitId));
  };

  return (
    <div className="bg-zinc-950 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h1 className="text-5xl font-black italic oswald uppercase text-white mb-4 tracking-tighter">
            Nuestros <span className="text-red-600">Kartódromos</span>
          </h1>
          <div className="w-24 h-2 bg-red-600 mb-6"></div>
          <p className="text-zinc-400 text-lg max-w-3xl leading-relaxed">
            Explora los circuitos de tierra más emblemáticos de la provincia. Escenarios donde la técnica de manejo y la pasión por el karting se encuentran en cada curva.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {circuits.map((c, i) => {
            const circuitAssocs = getAssocsForCircuit(c.id);
            return (
              <div key={c.id} className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 group hover:border-red-600/40 transition-all duration-500 shadow-2xl flex flex-col h-full">
                <div className="h-80 overflow-hidden relative shrink-0">
                  <img 
                    src={c.image} 
                    alt={c.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100 grayscale group-hover:grayscale-0" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                  <div className="absolute top-6 left-6 bg-red-600 text-white font-black px-4 py-2 rounded-lg text-sm oswald flex items-center gap-2 shadow-lg z-10">
                    <Ruler size={16} />
                    {c.length}
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                        <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Circuito de Competencia</span>
                      </div>
                      <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tight oswald group-hover:text-red-500 transition-colors">{c.name}</h3>
                      <div className="flex items-center gap-2 text-zinc-400 text-sm font-bold uppercase">
                        <MapPin size={16} className="text-red-600" />
                        {c.location}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-zinc-500 text-sm mb-8 leading-relaxed italic flex-grow">
                    "{c.description}"
                  </p>

                  <div className="flex flex-wrap gap-3 mb-8">
                    {c.features.map((f, idx) => (
                      <span key={idx} className="bg-zinc-800 text-zinc-300 text-[10px] font-black uppercase px-3 py-1.5 rounded-full border border-zinc-700 flex items-center gap-1.5">
                        <Zap size={10} className="text-red-600" />
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Asociaciones Federadas vinculadas */}
                  {circuitAssocs.length > 0 && (
                    <div className="mb-8 pt-6 border-t border-zinc-800/50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-3 flex items-center gap-2">
                        <Building2 size={12} /> Entidades Fiscalizadoras
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {circuitAssocs.map(a => (
                          <span key={a.id} className="px-3 py-1.5 bg-zinc-950 text-red-500 text-[9px] font-black uppercase rounded-lg border border-red-600/20 shadow-lg">
                            {a.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <button className="w-full mt-auto py-4 bg-zinc-800 hover:bg-red-600 text-white font-black uppercase text-xs rounded-xl transition-all flex items-center justify-center gap-3 group/btn shadow-xl border border-zinc-700 hover:border-red-600">
                    <Info size={18} />
                    Ver Detalles Técnicos
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 p-10 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5"><Target size={200} /></div>
          <div className="bg-red-600/10 p-6 rounded-full border border-red-600/20 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
            <Zap size={48} className="text-red-600" />
          </div>
          <div className="relative z-10">
            <h4 className="text-2xl font-black text-white uppercase oswald mb-2 tracking-tight">Competencia en Tierra</h4>
            <p className="text-zinc-400 max-w-2xl leading-relaxed">
              El karting sobre tierra requiere una preparación especial del chasis y una técnica de manejo única. Asegúrate de consultar el reglamento técnico sobre neumáticos y protecciones antes de cada fecha.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Circuitos;
