
import React, { useEffect, useState } from 'react';
import { FileText, Download, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { storageService } from '../services/storageService';
import { Regulation } from '../types';

const Reglamentos: React.FC = () => {
  const [regulations, setRegulations] = useState<Regulation[]>([]);

  useEffect(() => {
    setRegulations(storageService.getRegulations());
  }, []);

  const handleDownload = (reg: Regulation) => {
    const link = document.createElement('a');
    link.href = reg.fileData;
    link.download = reg.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const defaultReglamentos = [
    { title: 'Reglamento Deportivo 2024', desc: 'Lineamientos generales, penalidades y procedimientos de competencia.', size: '2.4 MB' },
    { title: 'Reglamento Técnico 150cc KDO', desc: 'Especificaciones de motor, peso, combustible y chasis para la categoría principal.', size: '1.8 MB' },
    { title: 'Anexo Neumáticos Oficiales', desc: 'Marca, compuesto y presión máxima permitida por reglamento.', size: '0.5 MB' },
    { title: 'Protocolo de Seguridad Paddock', desc: 'Normativa para equipos y acompañantes en zona de boxes.', size: '1.2 MB' },
  ];

  return (
    <div className="bg-zinc-950 py-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-16 text-center">
          <div className="bg-blue-600 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-600/20">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h1 className="text-6xl font-black italic oswald uppercase text-white mb-6 tracking-tighter">Centro de <span className="text-blue-600">Reglamentos</span></h1>
          <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em]">Documentación oficial homologada por FRAD 3</p>
        </header>

        <div className="space-y-6">
          {/* Documentos Cargados por Admin */}
          {regulations.map((reg) => (
            <div key={reg.id} className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-8 hover:border-blue-600/50 transition-all group shadow-2xl">
              <div className="flex items-center gap-6 text-center md:text-left">
                <div className="bg-zinc-950 p-5 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform border border-zinc-800">
                  <FileText size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black oswald uppercase text-white mb-2 italic tracking-tighter">{reg.title}</h3>
                  <p className="text-zinc-500 text-xs font-bold leading-relaxed">{reg.description || 'Documento oficial vigente para la temporada actual.'}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDownload(reg)}
                className="bg-zinc-950 border border-zinc-800 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-2xl flex items-center gap-3 transition-all text-zinc-400 group/btn shrink-0"
              >
                <span className="text-[10px] font-black uppercase tracking-widest">Descargar {reg.fileSize}</span>
                <Download size={18} className="group-hover/btn:translate-y-1 transition-transform" />
              </button>
            </div>
          ))}

          {/* Documentos de Ejemplo (Solo se muestran si no hay reales) */}
          {regulations.length === 0 && defaultReglamentos.map((reg, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-8 opacity-60 hover:opacity-100 transition-all group">
              <div className="flex items-center gap-6 text-center md:text-left">
                <div className="bg-zinc-950 p-5 rounded-2xl text-blue-600">
                  <FileText size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black oswald uppercase text-white mb-2">{reg.title}</h3>
                  <p className="text-zinc-500 text-xs font-bold leading-relaxed">{reg.desc}</p>
                </div>
              </div>
              <button className="bg-zinc-950 border border-zinc-800 px-8 py-4 rounded-2xl flex items-center gap-3 text-zinc-700 cursor-not-allowed">
                <span className="text-[10px] font-black uppercase tracking-widest">Demo {reg.size}</span>
                <Download size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-blue-600/5 border border-blue-600/20 p-10 rounded-[3rem] relative overflow-hidden shadow-xl">
           <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={100} /></div>
           <div className="flex items-start gap-6">
              <AlertCircle className="text-blue-600 shrink-0" size={32} />
              <div>
                 <h4 className="text-white font-black oswald uppercase tracking-widest mb-4 italic">Avisos Técnicos de Último Momento</h4>
                 <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-medium">Cualquier anexo o modificación técnica comunicada por el Comisariato Técnico en pista tendrá validez sobre los reglamentos aquí publicados.</p>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Sin modificaciones pendientes este fin de semana</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Reglamentos;
