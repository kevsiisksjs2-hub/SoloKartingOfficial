
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { Pilot, Category, TrackFlag, Regulation, Status, RegulationCategory } from '../types';
import { 
  Users, LogOut, Trash2, X, Layers, 
  Search, Settings, Sparkles, FileText, 
  Plus, CheckCircle, Upload, Loader2,
  AlertTriangle, FilePlus, HardDrive,
  Download, Filter, BookOpen
} from 'lucide-react';
import { generatePilotsPDF } from '../utils/pdfGenerator';

type Tab = 'inscriptos' | 'reglamentos' | 'ajustes';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('inscriptos');
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [regSearchTerm, setRegSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  // Modal Reglamentos
  const [showRegModal, setShowRegModal] = useState(false);
  const [newReg, setNewReg] = useState({ 
    title: '', 
    description: '', 
    category: 'Técnico' as RegulationCategory,
    fileData: '', 
    fileName: '' 
  });

  // IA OCR Modal
  const [showAI, setShowAI] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiData, setAiData] = useState<any[]>([]);

  useEffect(() => {
    if (!storageService.getAuth()) {
      navigate('/AdminKDO');
      return;
    }
    refreshData();
  }, [navigate]);

  const refreshData = () => {
    setPilots(storageService.getPilots());
    setCategories(storageService.getCategories());
    setRegulations(storageService.getRegulations());
  };

  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusChange = (id: string, newStatus: Status) => {
    const updated = pilots.map(p => p.id === id ? { ...p, status: newStatus } : p);
    storageService.savePilots(updated);
    setPilots(updated);
    notify(`Estado: ${newStatus}`);
  };

  const handleDeletePilot = (p: Pilot) => {
    if (window.confirm(`¿Eliminar a ${p.name.toUpperCase()}?`)) {
      const upd = pilots.filter(x => x.id !== p.id);
      storageService.savePilots(upd);
      setPilots(upd);
      notify("Piloto eliminado", "error");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNewReg({
        ...newReg,
        fileData: reader.result as string,
        fileName: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveRegulation = () => {
    if (!newReg.title || !newReg.fileData) {
      notify("Título y archivo obligatorios", "error");
      return;
    }
    const reg: Regulation = {
      id: Math.random().toString(36).substr(2, 9),
      title: newReg.title,
      description: newReg.description,
      category: newReg.category,
      fileData: newReg.fileData,
      fileName: newReg.fileName,
      fileSize: (newReg.fileData.length / 1024 / 1024).toFixed(1) + ' MB',
      date: new Date().toLocaleDateString()
    };
    const updated = [reg, ...regulations];
    storageService.saveRegulations(updated);
    setRegulations(updated);
    setShowRegModal(false);
    setNewReg({ title: '', description: '', category: 'Técnico', fileData: '', fileName: '' });
    notify("Documento publicado con éxito");
  };

  const handleDeleteReg = (id: string) => {
    if (window.confirm("¿Eliminar este reglamento? Los pilotos ya no podrán verlo.")) {
      const updated = regulations.filter(r => r.id !== id);
      storageService.saveRegulations(updated);
      setRegulations(updated);
      notify("Documento removido", "error");
    }
  };

  const handleAIUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64String = (reader.result as string).split(',')[1];
        const data = await aiService.extractRankings(base64String, file.type);
        setAiData(data);
      } catch (err) {
        notify("Error IA", "error");
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const filteredPilots = pilots.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.number.includes(searchTerm);
    const matchesCategory = categoryFilter === 'Todas' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredRegs = regulations.filter(r => 
    r.title.toLowerCase().includes(regSearchTerm.toLowerCase()) || 
    r.category.toLowerCase().includes(regSearchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-400 overflow-hidden font-sans">
      {toast && (
        <div className={`fixed top-8 right-8 px-6 py-4 rounded-2xl z-[300] font-black oswald flex items-center gap-3 shadow-2xl animate-in slide-in-from-right-8 duration-300 ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.msg.toUpperCase()}
        </div>
      )}
      
      <aside className="w-72 bg-[#0a0a0a] border-r border-zinc-900 flex flex-col shrink-0">
        <div className="p-8 border-b border-zinc-900">
          <div className="bg-red-600 p-2 rounded italic font-black text-white text-2xl oswald mb-2 text-center shadow-lg">
            ADMIN <span className="text-black bg-white px-1 rounded-sm text-sm">KDO</span>
          </div>
        </div>

        <nav className="flex-grow p-6 space-y-2">
          {[
            { id: 'inscriptos', icon: Users, label: 'Pilotos e Inscripciones' },
            { id: 'reglamentos', icon: FileText, label: 'Documentos y Leyes' },
            { id: 'ajustes', icon: Settings, label: 'Configuración Web' },
          ].map(t => (
            <button 
              key={t.id} 
              onClick={() => setActiveTab(t.id as Tab)} 
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-red-600 text-white shadow-xl shadow-red-600/10' : 'hover:bg-zinc-900 text-zinc-500 hover:text-white'}`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-zinc-900">
          <button onClick={() => { storageService.setAuth(null); navigate('/AdminKDO'); }} className="w-full flex items-center justify-center gap-3 bg-zinc-900 text-zinc-600 px-4 py-4 rounded-xl text-[10px] font-black uppercase transition-all">
            <LogOut size={16} /> Salir
          </button>
        </div>
      </aside>

      <main className="flex-grow flex flex-col bg-black overflow-hidden relative">
        <header className="h-24 border-b border-zinc-900 flex items-center justify-between px-10 bg-zinc-950/50 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-4">
             <div className="h-10 w-1 bg-red-600 rounded-full"></div>
             <h2 className="text-3xl font-black oswald uppercase text-white italic tracking-tighter">
                {activeTab === 'inscriptos' ? 'Gestión de Pilotos' : activeTab === 'reglamentos' ? 'Biblioteca de Reglamentos' : 'Ajustes de Sistema'}
             </h2>
          </div>
        </header>

        <div className="flex-grow overflow-auto p-10 custom-scrollbar">
          
          {activeTab === 'inscriptos' && (
            <div className="space-y-10">
              <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
                 <div className="flex gap-4 w-full lg:w-auto">
                    <div className="relative flex-grow lg:w-80">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                       <input 
                         type="text" 
                         placeholder="BUSCAR PILOTO..." 
                         value={searchTerm}
                         onChange={e => setSearchTerm(e.target.value)}
                         className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white text-xs font-bold outline-none"
                       />
                    </div>
                 </div>
                 
                 <div className="flex gap-4 w-full lg:w-auto">
                    <button onClick={() => setShowAI(true)} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] flex items-center gap-3 shadow-lg">
                       <Sparkles size={16} /> IA Vision Ranking
                    </button>
                    <button onClick={() => navigate('/AdminKDO/nuevo-piloto')} className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] flex items-center gap-3 shadow-lg">
                       <Plus size={16} /> Nuevo Piloto
                    </button>
                 </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-black/50 text-[9px] font-black uppercase text-zinc-500 border-b border-zinc-800 tracking-widest">
                    <tr><th className="px-10 py-6">Kart</th><th className="px-10 py-6">Piloto</th><th className="px-10 py-6">Categoría</th><th className="px-10 py-6">Estado</th><th className="px-10 py-6 text-right">Acciones</th></tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {filteredPilots.map(p => (
                      <tr key={p.id} className="hover:bg-white/5 transition-all">
                        <td className="px-10 py-6"><span className="text-2xl font-black text-red-600 oswald italic">#{p.number}</span></td>
                        <td className="px-10 py-6 font-black text-white uppercase text-sm">{p.name}</td>
                        <td className="px-10 py-6 text-[10px] text-zinc-500 font-bold uppercase">{p.category}</td>
                        <td className="px-10 py-6">
                           <select 
                             value={p.status}
                             onChange={(e) => handleStatusChange(p.id, e.target.value as Status)}
                             className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-xl border outline-none cursor-pointer ${
                               p.status === Status.CONFIRMADO ? 'bg-emerald-600/10 text-emerald-500 border-emerald-500/20' : 'bg-yellow-600/10 text-yellow-500 border-yellow-500/20'
                             }`}
                           >
                              <option value={Status.CONFIRMADO}>Confirmado</option>
                              <option value={Status.PENDIENTE}>Pendiente</option>
                           </select>
                        </td>
                        <td className="px-10 py-6 text-right">
                           <button onClick={() => handleDeletePilot(p)} className="p-3 text-zinc-700 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reglamentos' && (
            <div className="space-y-8">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                 <div className="flex items-center gap-4">
                    <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800"><HardDrive className="text-red-500" /></div>
                    <div>
                       <h3 className="text-xl font-black oswald text-white uppercase">Oficina Legal y Técnica</h3>
                       <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{regulations.length} Archivos Legislativos</p>
                    </div>
                 </div>
                 
                 <div className="flex gap-4 w-full lg:w-auto">
                    <div className="relative lg:w-64">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                       <input 
                         type="text" 
                         placeholder="BUSCAR DOCUMENTO..." 
                         value={regSearchTerm}
                         onChange={e => setRegSearchTerm(e.target.value)}
                         className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white text-[10px] font-bold uppercase outline-none focus:border-red-600 transition-all"
                       />
                    </div>
                    <button onClick={() => setShowRegModal(true)} className="bg-red-600 text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] flex items-center gap-3 shadow-lg">
                       <FilePlus size={16} /> Publicar Ley
                    </button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredRegs.map(reg => (
                   <div key={reg.id} className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] relative group hover:border-red-600 transition-all flex flex-col h-full overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-red-600 group-hover:w-2 transition-all"></div>
                      <div className="flex justify-between items-start mb-6">
                         <div className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase border ${
                            reg.category === 'Técnico' ? 'bg-red-600/10 text-red-500 border-red-600/20' : 
                            reg.category === 'Deportivo' ? 'bg-blue-600/10 text-blue-500 border-blue-600/20' : 
                            'bg-zinc-950 text-zinc-500 border-zinc-800'
                         }`}>
                            {reg.category}
                         </div>
                         <button onClick={() => handleDeleteReg(reg.id)} className="text-zinc-800 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      </div>
                      <h4 className="text-lg font-black oswald text-white uppercase mb-2 tracking-tight italic">{reg.title}</h4>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase mb-8 line-clamp-2 leading-relaxed">{reg.description || 'Sin descripción adicional.'}</p>
                      
                      <div className="mt-auto pt-6 border-t border-zinc-800 flex justify-between items-center">
                         <div className="flex flex-col">
                            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{reg.fileName.slice(0, 15)}...</span>
                            <span className="text-[8px] font-bold text-zinc-700 uppercase">{reg.date} • {reg.fileSize}</span>
                         </div>
                         <a href={reg.fileData} download={reg.fileName} className="text-zinc-500 hover:text-white transition-colors bg-zinc-950 p-3 rounded-xl border border-zinc-800"><Download size={14} /></a>
                      </div>
                   </div>
                 ))}
                 {filteredRegs.length === 0 && (
                   <div className="col-span-full py-24 text-center border-2 border-dashed border-zinc-900 rounded-[3rem]">
                      <BookOpen size={48} className="text-zinc-800 mx-auto mb-4 opacity-20" />
                      <p className="text-zinc-600 font-black uppercase tracking-widest text-[10px]">No se encontraron documentos en la búsqueda</p>
                   </div>
                 )}
              </div>
            </div>
          )}

          {activeTab === 'ajustes' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-zinc-900 border border-zinc-800 p-10 rounded-[3rem] shadow-2xl">
                   <h3 className="text-xl font-black oswald uppercase text-white mb-10 flex items-center gap-3 italic">Enlaces Externos</h3>
                   <div className="space-y-6">
                      {['Mylaps Live', 'Archivo Resultados', 'Streaming'].map(label => (
                        <div key={label}>
                           <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">{label}</label>
                           <input className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none" placeholder="https://" />
                        </div>
                      ))}
                      <button className="w-full bg-white text-black font-black uppercase py-5 rounded-2xl shadow-xl text-[10px] tracking-widest">Actualizar Portal Público</button>
                   </div>
                </div>
             </div>
          )}
        </div>
      </main>

      {/* MODAL REGLAMENTOS MEJORADO */}
      {showRegModal && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[300] flex items-center justify-center p-6">
          <div className="bg-zinc-900 w-full max-w-xl rounded-[3rem] border border-zinc-800 p-12 relative animate-in zoom-in-95 duration-300 shadow-[0_0_100px_rgba(220,38,38,0.1)]">
            <button onClick={() => setShowRegModal(false)} className="absolute top-10 right-10 text-zinc-500 hover:text-white bg-zinc-950 p-2 rounded-full"><X size={20}/></button>
            <div className="flex items-center gap-4 mb-10">
               <div className="bg-red-600 p-3 rounded-2xl shadow-lg"><FilePlus className="text-white" size={24} /></div>
               <h3 className="text-3xl font-black oswald text-white uppercase italic tracking-tighter leading-none">Nueva Publicación</h3>
            </div>
            
            <div className="space-y-6">
               <div>
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-2 ml-1">Título Oficial</label>
                  <input type="text" placeholder="Ej: Reglamento Técnico 150cc Power 2025" value={newReg.title} onChange={e => setNewReg({...newReg, title: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-white text-sm font-bold uppercase outline-none focus:border-red-600 transition-all" />
               </div>

               <div>
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-2 ml-1">Categoría del Documento</label>
                  <div className="grid grid-cols-3 gap-2">
                     {['Técnico', 'Deportivo', 'Anexo', 'Calendario', 'Institucional'].map(cat => (
                        <button 
                          key={cat} 
                          onClick={() => setNewReg({...newReg, category: cat as RegulationCategory})}
                          className={`py-3 rounded-xl text-[8px] font-black uppercase transition-all border ${newReg.category === cat ? 'bg-red-600 text-white border-red-600' : 'bg-zinc-950 text-zinc-600 border-zinc-800 hover:text-white'}`}
                        >
                           {cat}
                        </button>
                     ))}
                  </div>
               </div>

               <div>
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-2 ml-1">Nota Adicional (Opcional)</label>
                  <textarea placeholder="Resumen de cambios o alcance..." value={newReg.description} onChange={e => setNewReg({...newReg, description: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-white text-xs h-24 outline-none focus:border-red-600 transition-all" />
               </div>
               
               <label className="block border-2 border-dashed border-zinc-800 rounded-[2rem] p-10 text-center cursor-pointer hover:border-red-600 hover:bg-red-600/5 transition-all group">
                  <Upload size={32} className="mx-auto mb-4 text-zinc-700 group-hover:text-red-600" />
                  <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">{newReg.fileName || 'Seleccionar Archivo (PDF/IMG)'}</p>
                  <p className="text-[8px] font-bold text-zinc-600 uppercase italic">Máximo recomendado: 25MB</p>
                  <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,image/*" />
               </label>

               <button onClick={handleSaveRegulation} className="w-full bg-red-600 text-white py-6 rounded-2xl font-black uppercase oswald tracking-widest shadow-2xl shadow-red-600/20 transform active:scale-95 transition-all text-xl italic">Publicar en el Portal</button>
            </div>
          </div>
        </div>
      )}

      {/* IA MODAL */}
      {showAI && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[300] flex items-center justify-center p-10">
          <div className="bg-zinc-900 w-full max-w-4xl rounded-[4rem] border border-zinc-800 p-12 relative flex flex-col max-h-[90vh]">
            <button onClick={() => { setShowAI(false); setAiData([]); }} className="absolute top-12 right-12 text-zinc-500 hover:text-white bg-zinc-950 p-3 rounded-full"><X size={28}/></button>
            <div className="flex items-center gap-6 mb-12">
               <div className="bg-emerald-600 p-4 rounded-[1.5rem] shadow-2xl"><Sparkles className="text-white" size={40} /></div>
               <h3 className="text-4xl font-black oswald uppercase text-white italic tracking-tighter">Ranking AI Vision</h3>
            </div>
            
            {!aiData.length ? (
              <label className="flex-grow border-2 border-dashed border-zinc-800 rounded-[3rem] flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition-all">
                {isProcessing ? <Loader2 size={64} className="animate-spin text-emerald-500" /> : <Upload size={64} className="text-zinc-800" />}
                <p className="mt-4 text-[11px] font-black uppercase tracking-widest text-zinc-600">{isProcessing ? 'Procesando...' : 'Subir Foto de Planilla'}</p>
                <input type="file" className="hidden" onChange={handleAIUpload} accept="image/*" disabled={isProcessing} />
              </label>
            ) : (
              <div className="flex-grow flex flex-col overflow-hidden">
                <div className="flex-grow overflow-auto border border-zinc-800 rounded-3xl bg-black/50 mb-10">
                  <table className="w-full text-left text-[11px]">
                    <thead className="sticky top-0 bg-zinc-900 border-b border-zinc-800 text-zinc-600 uppercase font-black tracking-widest">
                      <tr><th className="px-8 py-5">POS</th><th className="px-8 py-5">KART</th><th className="px-8 py-5">PILOTO</th></tr>
                    </thead>
                    <tbody>
                      {aiData.map((d, i) => (
                        <tr key={i} className="border-b border-zinc-900">
                          <td className="px-8 py-4 text-emerald-500 font-black oswald text-xl italic">0{d.ranking}</td>
                          <td className="px-8 py-4 text-red-500 font-black text-lg">#{d.number}</td>
                          <td className="px-8 py-4 text-white uppercase font-bold">{d.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button onClick={() => { notify("Base de datos de ranking actualizada"); setShowAI(false); }} className="w-full bg-emerald-600 text-white py-6 rounded-2xl font-black oswald uppercase text-xl shadow-2xl">Confirmar e Importar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
