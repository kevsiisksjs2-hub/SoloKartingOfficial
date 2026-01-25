
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { Pilot, Championship, Category, TrackFlag, Regulation, Status } from '../types';
import { 
  Users, LogOut, Trash2, X, Layers, 
  Trophy, Search, Radio, Settings, 
  ImageIcon, Loader2, Sparkles, FileText,
  Plus, Filter, FileDown,
  Activity, Play, Square, Signal, Save, Globe, Flag,
  FileUp, File, UserPlus, Youtube,
  FileStack, Printer, CheckCircle, AlertTriangle, Upload
} from 'lucide-react';
import { 
  generatePilotsPDF, 
} from '../utils/pdfGenerator';

type ActiveTab = 'inscriptos' | 'campeonatos' | 'reglamentos' | 'live_feed' | 'ajustes';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTab>('inscriptos');
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // IA Ranking States
  const [showAIModal, setShowAIModal] = useState(false);
  const [rankCategory, setRankCategory] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiPreviewData, setAiPreviewData] = useState<any[]>([]);

  // Monitor Live States
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [liveData, setLiveData] = useState<any[]>([]);
  const [sessionTime, setSessionTime] = useState(0);

  // Settings States
  const [urls, setUrls] = useState({ live: '', history: '', streaming: '' });
  const [newCategory, setNewCategory] = useState('');
  const [trackStatus, setTrackStatus] = useState<TrackFlag>(TrackFlag.VERDE);

  // Championship States
  const [newChamp, setNewChamp] = useState({
    name: '',
    status: 'En curso',
    dates: '',
    tracks: '',
    image: 'https://images.unsplash.com/photo-1547631618-f29792042761?w=800'
  });

  // Regulation States
  const [newReg, setNewReg] = useState({ title: '', description: '' });
  const [regFile, setRegFile] = useState<File | null>(null);
  const [isUploadingReg, setIsUploadingReg] = useState(false);

  // Export Modal States
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    const auth = storageService.getAuth();
    if (!auth) { navigate('/AdminKDO'); return; }
    setCurrentUser(auth);
    refreshData();
  }, [navigate]);

  // Lógica de Simulación de Carrera en Monitor Live
  useEffect(() => {
    let interval: any;
    if (isLiveConnected) {
      const confirmedPilots = pilots.filter(p => p.status === Status.CONFIRMADO);
      if (liveData.length === 0 && confirmedPilots.length > 0) {
        setLiveData(confirmedPilots.slice(0, 12).map((p, i) => ({
          ...p,
          pos: i + 1,
          laps: 0,
          lastLap: '-',
          bestLap: (48.0 + Math.random() * 2).toFixed(3),
          gap: i === 0 ? '-' : `+${(i * 0.432).toFixed(3)}`
        })));
      }

      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
        setLiveData(prev => {
          const updated = prev.map(p => {
            if (Math.random() > 0.7) {
              const lapTime = (47.5 + Math.random() * 3).toFixed(3);
              const isBest = parseFloat(lapTime) < parseFloat(p.bestLap);
              return {
                ...p,
                laps: p.laps + 1,
                lastLap: lapTime,
                bestLap: isBest ? lapTime : p.bestLap
              };
            }
            return p;
          });
          
          return [...updated].sort((a, b) => {
            if (b.laps !== a.laps) return b.laps - a.laps;
            return parseFloat(a.bestLap) - parseFloat(b.bestLap);
          }).map((p, i) => ({
            ...p,
            pos: i + 1,
            gap: i === 0 ? '-' : (updated[i].laps < updated[0].laps ? `+${updated[0].laps - updated[i].laps} Vta` : `+${(i * 0.215).toFixed(3)}`)
          }));
        });
      }, 1000);
    } else {
      setSessionTime(0);
      setLiveData([]);
    }
    return () => clearInterval(interval);
  }, [isLiveConnected, pilots]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const refreshData = () => {
    setPilots(storageService.getPilots());
    const loadedCats = storageService.getCategories();
    setCategories(loadedCats);
    if (loadedCats.length > 0 && !rankCategory) setRankCategory(loadedCats[0]);
    setChampionships(storageService.getChampionships());
    setRegulations(storageService.getRegulations());
    setUrls({
      live: storageService.getLiveUrl(),
      history: storageService.getHistoryUrl(),
      streaming: storageService.getStreamingUrl()
    });
    setTrackStatus(storageService.getTrackStatus());
  };

  const handleLogout = () => {
    storageService.setAuth(null);
    navigate('/AdminKDO');
  };

  // --- CONFIRMACIONES DE SEGURIDAD ---
  const handleDeletePilot = (p: Pilot) => {
    const confirmMsg = `🚨 ELIMINACIÓN DEFINITIVA 🚨\n\n¿Está seguro de eliminar al piloto ${p.name.toUpperCase()} (Kart #${p.number})?\n\nEsta acción es ABSOLUTAMENTE IRREVERSIBLE y borrará todos sus registros de la base de datos oficial.`;
    
    if (window.confirm(confirmMsg)) {
      const updated = pilots.filter(x => x.id !== p.id);
      setPilots(updated);
      storageService.savePilots(updated);
      showNotification(`PILOTO ${p.name.toUpperCase()} ELIMINADO`);
    }
  };

  const deleteChamp = (id: string) => {
    const champ = championships.find(c => c.id === id);
    if (window.confirm(`¿Eliminar permanentemente el campeonato "${champ?.name.toUpperCase()}"? Se perderán todos los datos vinculados.`)) {
      const updated = championships.filter(c => c.id !== id);
      setChampionships(updated);
      storageService.saveChampionships(updated);
      showNotification('Campeonato eliminado');
    }
  };

  // --- REGLAMENTOS (PDF UPLOAD) ---
  const handleUploadRegulation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFile || !newReg.title) {
      showNotification('Complete el título y seleccione un archivo', 'error');
      return;
    }
    
    setIsUploadingReg(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const reg: Regulation = {
          id: Date.now().toString(),
          title: newReg.title.toUpperCase(),
          description: newReg.description,
          fileData: base64,
          fileName: regFile.name,
          fileSize: (regFile.size / 1024 / 1024).toFixed(1) + ' MB',
          date: new Date().toLocaleDateString('es-AR')
        };
        
        const updated = [reg, ...regulations];
        setRegulations(updated);
        storageService.saveRegulations(updated);
        setNewReg({ title: '', description: '' });
        setRegFile(null);
        setIsUploadingReg(false);
        showNotification('Reglamento publicado correctamente');
      };
      reader.readAsDataURL(regFile);
    } catch (err) {
      showNotification('Error al procesar el archivo', 'error');
      setIsUploadingReg(false);
    }
  };

  const deleteRegulation = (id: string) => {
    if (window.confirm('¿Desea eliminar definitivamente este reglamento del portal público?')) {
      const updated = regulations.filter(r => r.id !== id);
      setRegulations(updated);
      storageService.saveRegulations(updated);
      showNotification('Documento eliminado');
    }
  };

  // --- AJUSTES Y CATEGORÍAS ---
  const handleSaveSettings = () => {
    storageService.saveLiveUrl(urls.live);
    storageService.saveHistoryUrl(urls.history);
    storageService.saveStreamingUrl(urls.streaming);
    storageService.saveTrackStatus(trackStatus);
    showNotification('Ajustes del sistema guardados');
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    const updated = [...categories, newCategory.trim()];
    setCategories(updated);
    storageService.saveCategories(updated);
    setNewCategory('');
    showNotification('Categoría añadida');
  };

  const handleDeleteCategory = (cat: string) => {
    if (window.confirm(`¿Desea eliminar la categoría ${cat}?`)) {
      const updated = categories.filter(c => c !== cat);
      setCategories(updated);
      storageService.saveCategories(updated);
      showNotification('Categoría eliminada');
    }
  };

  // --- IA RANKING IMPORT ---
  const handleFileUploadIA = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingAI(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const data = await aiService.extractRankingsFromImage(base64, file.type);
        setAiPreviewData(data);
        setIsProcessingAI(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      showNotification("Error de lectura con IA", "error");
      setIsProcessingAI(false);
    }
  };

  const confirmAIImport = () => {
    if (!rankCategory || aiPreviewData.length === 0) return;
    storageService.saveCategoryRankings(rankCategory, aiPreviewData);
    showNotification(`Ranking de ${rankCategory} actualizado`);
    setShowAIModal(false);
    setAiPreviewData([]);
  };

  const filteredPilots = pilots.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.number.includes(searchTerm);
    const matchesCategory = categoryFilter === 'Todas' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans">
      {/* Notificaciones Toast */}
      {toast && (
        <div className="fixed top-8 right-8 z-[300] animate-in slide-in-from-right-8 duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-400' : 'bg-red-950/90 border-red-500/30 text-red-400'} backdrop-blur-xl`}>
             {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
             <span className="text-[10px] font-black uppercase tracking-widest">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Sidebar de Navegación */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-zinc-800 flex flex-col shrink-0 z-40">
        <div className="p-6 bg-zinc-950 border-b border-zinc-800 mb-4 text-center">
          <div className="bg-red-600 p-1 rounded italic font-black text-white text-xl oswald tracking-tighter mb-2">
            ADMIN <span className="text-black bg-white px-1 rounded-sm text-sm">KDO</span>
          </div>
          <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em]">Gestión Federada</span>
        </div>

        <nav className="flex-grow overflow-y-auto px-4 space-y-1 custom-scrollbar">
          {[
            { id: 'inscriptos', label: 'Inscriptos', icon: Users },
            { id: 'campeonatos', label: 'Campeonatos', icon: Trophy },
            { id: 'reglamentos', label: 'Reglamentos', icon: FileText },
            { id: 'live_feed', label: 'Monitor Live', icon: Radio },
            { id: 'ajustes', label: 'Ajustes', icon: Settings },
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as ActiveTab)} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-[10px] font-bold uppercase tracking-tight ${activeTab === tab.id ? 'bg-red-600 text-white shadow-xl shadow-red-600/10' : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900'}`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-6 bg-zinc-950 border-t border-zinc-800">
          <div className="flex items-center gap-3 mb-4 bg-zinc-900/50 p-2 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[8px] font-black text-white uppercase truncate">{currentUser?.username || 'ADMIN'}</span>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-zinc-700 hover:text-red-500 text-[9px] font-black uppercase transition-colors">
            <LogOut size={12} /> SALIR DEL SISTEMA
          </button>
        </div>
      </aside>

      {/* Área de Contenido Principal */}
      <main className="flex-grow flex flex-col bg-black overflow-hidden relative">
        <header className="bg-[#0c0c0c] border-b border-zinc-800 h-16 flex items-center px-8 justify-between shrink-0">
          <h2 className="text-xl font-black oswald uppercase text-white tracking-widest italic">{activeTab.toUpperCase().replace('_', ' ')}</h2>
        </header>

        <div className="flex-grow overflow-auto p-8 custom-scrollbar">
          
          {/* SECCIÓN INSCRIPTOS */}
          {activeTab === 'inscriptos' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8">
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-4 top-3.5 text-zinc-600" size={16} />
                    <input 
                      type="text" 
                      placeholder="BUSCAR PILOTO..." 
                      value={searchTerm} 
                      onChange={e => setSearchTerm(e.target.value)} 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-[11px] font-bold text-white uppercase outline-none focus:border-red-600" 
                    />
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Filter className="absolute left-4 top-3.5 text-zinc-600" size={16} />
                    <select 
                      value={categoryFilter} 
                      onChange={e => setCategoryFilter(e.target.value)} 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-[11px] font-bold text-white uppercase outline-none appearance-none cursor-pointer focus:border-red-600"
                    >
                      <option value="Todas">Todas las Categorías</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 w-full lg:w-auto justify-end">
                  <button onClick={() => setShowAIModal(true)} className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
                    <Sparkles size={14} /> Importar Ranking IA
                  </button>
                  <button onClick={() => navigate('/AdminKDO/nuevo-piloto')} className="bg-red-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all">
                    <UserPlus size={14} /> Nuevo Piloto
                  </button>
                  <button onClick={() => { generatePilotsPDF(pilots, 'LISTADO GENERAL'); showNotification('Planilla PDF generada'); }} className="bg-white text-black px-6 py-3 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all shadow-xl">
                    <FileDown size={14} /> Exportar
                  </button>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                  <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-500 text-[8px] font-black uppercase tracking-[0.2em]">
                    <tr>
                      <th className="px-8 py-5">#</th>
                      <th className="px-8 py-5">Piloto</th>
                      <th className="px-8 py-5">Categoría</th>
                      <th className="px-8 py-5">Estado</th>
                      <th className="px-8 py-5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {filteredPilots.map(p => (
                      <tr key={p.id} className="hover:bg-white/5 transition-all group">
                        <td className="px-8 py-5 font-black text-red-600 oswald text-xl italic">#{p.number}</td>
                        <td className="px-8 py-5 text-xs font-black text-white uppercase">{p.name}</td>
                        <td className="px-8 py-5">
                          <span className="text-[9px] font-black uppercase bg-zinc-950 px-2 py-1 rounded text-zinc-400 border border-zinc-800">{p.category}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`text-[8px] font-black uppercase px-2 py-1 rounded ${p.status === Status.CONFIRMADO ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'}`}>{p.status}</span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button onClick={() => handleDeletePilot(p)} className="p-2.5 bg-zinc-950 border border-zinc-800 text-zinc-600 hover:text-red-500 rounded-xl transition-all shadow-lg hover:border-red-600/50">
                            <Trash2 size={14}/>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredPilots.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-20 text-center text-zinc-700 text-[10px] font-black uppercase tracking-widest">Sin inscriptos registrados</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECCIÓN REGLAMENTOS */}
          {activeTab === 'reglamentos' && (
            <div className="animate-in fade-in duration-300 grid grid-cols-1 xl:grid-cols-3 gap-8">
               <div className="xl:col-span-1">
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl sticky top-0">
                  <h3 className="text-xl font-black oswald uppercase text-white mb-8 italic flex items-center gap-3">
                    <FileUp size={20} className="text-red-600" /> Publicar PDF
                  </h3>
                  <form onSubmit={handleUploadRegulation} className="space-y-6">
                    <input required type="text" value={newReg.title} onChange={e => setNewReg({...newReg, title: e.target.value})} placeholder="TÍTULO DEL DOCUMENTO" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 text-white font-bold uppercase text-[11px] outline-none focus:border-red-600" />
                    <textarea value={newReg.description} onChange={e => setNewReg({...newReg, description: e.target.value})} placeholder="BREVE DESCRIPCIÓN" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 text-white font-bold uppercase text-[11px] outline-none h-24 resize-none focus:border-red-600" />
                    
                    <label className="w-full flex items-center justify-center gap-3 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-8 text-zinc-500 font-black text-[10px] uppercase cursor-pointer hover:border-red-600 transition-all border-dashed">
                      <File size={20} /> {regFile ? regFile.name : 'SELECCIONAR ARCHIVO PDF'}
                      <input type="file" accept="application/pdf" className="hidden" onChange={e => setRegFile(e.target.files?.[0] || null)} />
                    </label>

                    <button disabled={!regFile || isUploadingReg} type="submit" className="w-full bg-white text-black font-black uppercase py-5 rounded-2xl shadow-xl hover:bg-red-600 hover:text-white transition-all disabled:opacity-30">
                      {isUploadingReg ? 'Procesando...' : 'Publicar Reglamento'}
                    </button>
                  </form>
                </div>
              </div>
              <div className="xl:col-span-2 space-y-4">
                {regulations.map(reg => (
                  <div key={reg.id} className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 flex justify-between items-center group hover:border-red-600/30 transition-all shadow-xl">
                    <div className="flex items-center gap-6">
                       <div className="bg-zinc-950 p-4 rounded-xl text-red-600 border border-zinc-800">
                          <FileText size={24} />
                       </div>
                       <div>
                          <h3 className="text-xl font-black oswald uppercase text-white mb-1 italic tracking-tighter">{reg.title}</h3>
                          <p className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest">{reg.date} • {reg.fileSize}</p>
                       </div>
                    </div>
                    <button onClick={() => deleteRegulation(reg.id)} className="p-4 bg-zinc-950 rounded-2xl text-zinc-600 hover:text-red-500 border border-zinc-800 transition-all"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MONITOR LIVE (SIMULADOR) */}
          {activeTab === 'live_feed' && (
            <div className="animate-in fade-in duration-300 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] flex items-center justify-between shadow-xl">
                  <div>
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Race Control Simulator</p>
                    <div className="flex items-center gap-2">
                       <div className={`w-3 h-3 rounded-full ${isLiveConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-600'}`}></div>
                       <p className="text-xl font-black text-white uppercase oswald">{isLiveConnected ? 'TRANSMITIENDO' : 'OFFLINE'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsLiveConnected(!isLiveConnected)}
                    className={`p-4 rounded-2xl transition-all shadow-lg ${isLiveConnected ? 'bg-red-600 text-white' : 'bg-white text-black'}`}
                  >
                    {isLiveConnected ? <Square size={24} /> : <Play size={24} />}
                  </button>
                </div>
                
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] flex items-center gap-6 shadow-xl">
                   <div className="bg-zinc-950 p-4 rounded-2xl text-red-600 border border-zinc-800"><Signal size={24} /></div>
                   <div>
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Canal de Datos</p>
                      <p className="text-xl font-black text-white uppercase oswald tracking-tighter">UDP Orbits Protocol</p>
                   </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] flex items-center gap-6 shadow-xl">
                   <div className="bg-zinc-950 p-4 rounded-2xl text-blue-500 border border-zinc-800"><Activity size={24} /></div>
                   <div>
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Tiempo de Sesión</p>
                      <p className="text-xl font-black text-white tabular-nums oswald tracking-tighter">{formatTime(sessionTime)}</p>
                   </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <table className="w-full text-left font-mono">
                  <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-600 text-[8px] font-black uppercase tracking-widest">
                    <tr>
                      <th className="px-8 py-4">P</th>
                      <th className="px-8 py-4">Kart</th>
                      <th className="px-8 py-4">Nombre</th>
                      <th className="px-8 py-4">Vtas</th>
                      <th className="px-8 py-4">Última</th>
                      <th className="px-8 py-4">Mejor</th>
                      <th className="px-8 py-4 text-right">GAP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {liveData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="px-8 py-3 font-black text-zinc-500 italic">{idx + 1}</td>
                        <td className="px-8 py-3 text-red-600 font-black">#{row.number}</td>
                        <td className="px-8 py-3 text-[10px] font-bold uppercase text-white">{row.name}</td>
                        <td className="px-8 py-3 text-zinc-400">{row.laps}</td>
                        <td className="px-8 py-3 text-white">{row.lastLap}</td>
                        <td className="px-8 py-3 text-emerald-500 font-bold">{row.bestLap}</td>
                        <td className="px-8 py-3 text-right text-zinc-600 text-[10px]">{row.gap}</td>
                      </tr>
                    ))}
                    {liveData.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-20 text-center text-zinc-700 text-[10px] font-black uppercase tracking-widest">Active la transmisión para iniciar simulación</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AJUSTES GLOBALES */}
          {activeTab === 'ajustes' && (
            <div className="animate-in fade-in duration-300 space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-zinc-900 border border-zinc-800 p-10 rounded-[3rem] shadow-2xl">
                  <h3 className="text-xl font-black oswald uppercase text-white mb-8 flex items-center gap-3 italic">
                    <Globe size={20} className="text-red-600" /> Enlaces de Sistema
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-2 ml-1">Mylaps Live Timing URL</label>
                      <input type="text" value={urls.live} onChange={e => setUrls({...urls, live: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-6 py-4 text-white text-[11px] font-bold outline-none focus:border-red-600 transition-all" />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-2 ml-1">Streaming YouTube URL</label>
                      <input type="text" value={urls.streaming} onChange={e => setUrls({...urls, streaming: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-6 py-4 text-white text-[11px] font-bold outline-none focus:border-red-600 transition-all" />
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-10 rounded-[3rem] shadow-2xl">
                  <h3 className="text-xl font-black oswald uppercase text-white mb-8 flex items-center gap-3 italic">
                    <Flag size={20} className="text-red-600" /> Señalización de Pista
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[TrackFlag.VERDE, TrackFlag.AMARILLA, TrackFlag.ROJA, TrackFlag.AZUL, TrackFlag.CUADROS].map(flag => (
                      <button 
                        key={flag}
                        onClick={() => setTrackStatus(flag)}
                        className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${trackStatus === flag ? 'bg-white text-black border-white shadow-lg shadow-white/5' : 'bg-zinc-950 text-zinc-600 border-zinc-800 hover:border-zinc-700'}`}
                      >
                        {flag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-10 rounded-[3rem] shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-black oswald uppercase text-white flex items-center gap-3 italic">
                    <Layers size={20} className="text-red-600" /> Categorías Oficiales
                  </h3>
                  <div className="flex gap-4">
                    <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="NUEVA CATEGORÍA..." className="bg-zinc-950 border border-zinc-800 rounded-xl px-6 py-3 text-white text-[10px] font-bold outline-none uppercase focus:border-emerald-600" />
                    <button onClick={handleAddCategory} className="bg-emerald-600 p-3 rounded-xl hover:bg-emerald-700 text-white shadow-lg transition-all"><Plus size={20} /></button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categories.map(cat => (
                    <div key={cat} className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl flex justify-between items-center group hover:border-red-600/30 transition-all">
                      <span className="text-[10px] font-black uppercase text-zinc-400">{cat}</span>
                      <button onClick={() => handleDeleteCategory(cat)} className="text-zinc-800 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><X size={14}/></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pb-12">
                 <button onClick={handleSaveSettings} className="bg-red-600 hover:bg-red-700 text-white px-12 py-5 rounded-2xl font-black uppercase text-xs shadow-2xl flex items-center gap-3 transition-all transform hover:scale-[1.02]">
                    <Save size={18} /> Aplicar Cambios Globales
                 </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* IA MODAL (REUTILIZADO) */}
      {showAIModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/98 backdrop-blur-2xl animate-in fade-in duration-300">
           <div className="bg-zinc-900 w-full max-w-4xl rounded-[3rem] border border-zinc-800 p-12 shadow-2xl relative flex flex-col max-h-[90vh]">
              <button onClick={() => { setShowAIModal(false); setAiPreviewData([]); }} className="absolute top-10 right-10 text-zinc-500 hover:text-white transition-colors bg-zinc-950 p-2 rounded-full"><X size={24}/></button>
              
              <div className="flex items-center gap-6 mb-12">
                 <div className="bg-emerald-600 p-4 rounded-[1.5rem] shadow-xl shadow-emerald-600/20"><Sparkles className="text-white" size={32} /></div>
                 <div>
                    <h3 className="text-3xl font-black oswald uppercase text-white italic tracking-tighter">Importación IA</h3>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Escanee planillas para automatizar resultados históricos</p>
                 </div>
              </div>

              {!aiPreviewData.length ? (
                <div className="flex-grow flex flex-col items-center justify-center space-y-10">
                   <div className="w-full max-w-md">
                      <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-4 ml-2 text-center">Suba una foto de la planilla</label>
                      <label className="flex flex-col items-center justify-center w-full h-64 bg-zinc-950 border-2 border-dashed border-zinc-800 rounded-[2.5rem] cursor-pointer hover:border-emerald-600 transition-all group overflow-hidden relative">
                         {isProcessingAI ? (
                           <div className="flex flex-col items-center gap-4">
                              <Loader2 size={48} className="text-emerald-500 animate-spin" />
                              <p className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.3em] animate-pulse">Analizando Planilla...</p>
                           </div>
                         ) : (
                           <div className="flex flex-col items-center gap-4">
                              <Upload size={48} className="text-zinc-800 group-hover:text-emerald-500 transition-colors" />
                              <p className="text-[10px] font-black uppercase text-zinc-600 group-hover:text-white tracking-widest">Subir Imagen (JPG/PNG)</p>
                           </div>
                         )}
                         <input type="file" className="hidden" accept="image/*" onChange={handleFileUploadIA} disabled={isProcessingAI} />
                      </label>
                   </div>
                </div>
              ) : (
                <div className="flex-grow flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                   <div className="flex justify-between items-center mb-6">
                      <h4 className="text-xs font-black uppercase text-emerald-500 tracking-widest flex items-center gap-2">
                        <CheckCircle size={14} /> Resultados Detectados ({aiPreviewData.length} Pilotos)
                      </h4>
                   </div>
                   <div className="flex-grow overflow-y-auto border border-zinc-800 rounded-3xl bg-zinc-950 custom-scrollbar mb-8">
                      <table className="w-full text-left">
                         <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-600 text-[8px] font-black uppercase tracking-widest sticky top-0">
                            <tr>
                               <th className="px-8 py-4">Pos</th>
                               <th className="px-8 py-4">Kart</th>
                               <th className="px-8 py-4">Nombre</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-zinc-900">
                            {aiPreviewData.map((p, i) => (
                              <tr key={i} className="hover:bg-white/5 transition-colors">
                                 <td className="px-8 py-4 font-black text-zinc-500 oswald italic">{p.ranking}</td>
                                 <td className="px-8 py-4 font-black text-red-500">#{p.number}</td>
                                 <td className="px-8 py-4 text-[10px] font-bold uppercase text-white">{p.name}</td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                   <div className="flex justify-end gap-4 pb-4">
                      <button onClick={() => setAiPreviewData([])} className="px-8 py-4 rounded-2xl font-black uppercase text-[10px] text-zinc-600 hover:text-white transition-colors">Descartar</button>
                      <button onClick={confirmAIImport} className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs shadow-xl flex items-center gap-3 transition-all transform hover:scale-[1.02]">
                         <Save size={18} /> Confirmar en {rankCategory}
                      </button>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
