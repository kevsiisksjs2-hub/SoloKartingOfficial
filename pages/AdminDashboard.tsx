
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { Pilot, Championship, Category, TrackFlag, Regulation } from '../types';
import { 
  Users, LogOut, Trash2, X, Layers, 
  Trophy, Search, Download, Radio, Settings, 
  ImageIcon, Loader2, Sparkles, FileText,
  Plus, Calendar, MapPin, Filter, FileDown,
  Activity, Play, Square, Signal, Save, Globe, Flag,
  FileUp, File
} from 'lucide-react';
import { 
  generatePilotsPDF, 
  generateChampionshipPDF, 
  generateResultsPDF, 
  generateLapByLapPDF 
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

  // Monitor Live States
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [liveData, setLiveData] = useState<any[]>([]);
  const [sessionTime, setSessionTime] = useState(0);

  // Settings States
  const [urls, setUrls] = useState({ live: '', history: '' });
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

  // IA Ranking States
  const [showRankingModal, setShowRankingModal] = useState(false);
  const [rankCategory, setRankCategory] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);

  useEffect(() => {
    const auth = storageService.getAuth();
    if (!auth) { navigate('/AdminKDO'); return; }
    setCurrentUser(auth);
    refreshData();
  }, [navigate]);

  // Simulation Logic for Live Monitor
  useEffect(() => {
    let interval: any;
    if (isLiveConnected) {
      const initialLive = pilots.slice(0, 10).map((p, i) => ({
        ...p,
        pos: i + 1,
        laps: 0,
        lastLap: '-',
        bestLap: (48.1 + Math.random() * 2).toFixed(3),
        gap: i === 0 ? '-' : `+${(i * 0.432).toFixed(3)}`,
        status: 'Pista'
      }));
      setLiveData(initialLive);

      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
        setLiveData(prev => prev.map(p => {
          if (Math.random() > 0.8) {
            const newLast = (48 + Math.random() * 2).toFixed(3);
            return {
              ...p,
              laps: p.laps + 1,
              lastLap: newLast,
              bestLap: parseFloat(newLast) < parseFloat(p.bestLap) ? newLast : p.bestLap
            };
          }
          return p;
        }).sort((a, b) => b.laps - a.laps || parseFloat(a.bestLap) - parseFloat(b.bestLap)));
      }, 1000);
    } else {
      setSessionTime(0);
      setLiveData([]);
    }
    return () => clearInterval(interval);
  }, [isLiveConnected, pilots]);

  const refreshData = () => {
    setPilots(storageService.getPilots());
    const loadedCats = storageService.getCategories();
    setCategories(loadedCats);
    if (loadedCats.length > 0) setRankCategory(loadedCats[0]);
    setChampionships(storageService.getChampionships());
    setRegulations(storageService.getRegulations());
    setUrls({
      live: storageService.getLiveUrl(),
      history: storageService.getHistoryUrl()
    });
    setTrackStatus(storageService.getTrackStatus());
  };

  const handleLogout = () => { 
    storageService.setAuth(null); 
    navigate('/AdminKDO'); 
  };

  const handleAddChampionship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChamp.name) return;
    const champ: Championship = { id: Date.now().toString(), ...newChamp };
    const updated = [champ, ...championships];
    setChampionships(updated);
    storageService.saveChampionships(updated);
    setNewChamp({ name: '', status: 'En curso', dates: '', tracks: '', image: 'https://images.unsplash.com/photo-1547631618-f29792042761?w=800' });
  };

  const deleteChamp = (id: string) => {
    if (window.confirm('¿Eliminar este campeonato definitivamente?')) {
      const updated = championships.filter(c => c.id !== id);
      setChampionships(updated);
      storageService.saveChampionships(updated);
    }
  };

  const handleUploadRegulation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFile || !newReg.title) return;
    setIsUploadingReg(true);
    
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const fileSize = (regFile.size / 1024 / 1024).toFixed(1) + ' MB';
      
      const reg: Regulation = {
        id: Date.now().toString(),
        title: newReg.title,
        description: newReg.description,
        fileData: base64,
        fileName: regFile.name,
        fileSize: fileSize,
        date: new Date().toLocaleDateString('es-AR')
      };
      
      const updated = [reg, ...regulations];
      setRegulations(updated);
      storageService.saveRegulations(updated);
      setNewReg({ title: '', description: '' });
      setRegFile(null);
      setIsUploadingReg(false);
      alert("Reglamento cargado con éxito.");
    };
    reader.readAsDataURL(regFile);
  };

  const deleteRegulation = (id: string) => {
    if (window.confirm('¿Eliminar este reglamento?')) {
      const updated = regulations.filter(r => r.id !== id);
      setRegulations(updated);
      storageService.saveRegulations(updated);
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    const updated = [...categories, newCategory.trim()];
    setCategories(updated);
    storageService.saveCategories(updated);
    setNewCategory('');
  };

  const handleDeleteCategory = (cat: string) => {
    if (window.confirm(`¿Eliminar la categoría ${cat}?`)) {
      const updated = categories.filter(c => c !== cat);
      setCategories(updated);
      storageService.saveCategories(updated);
    }
  };

  const handleSaveSettings = () => {
    storageService.saveLiveUrl(urls.live);
    storageService.saveHistoryUrl(urls.history);
    storageService.saveTrackStatus(trackStatus);
    alert("Configuración guardada correctamente.");
  };

  const filteredPilots = pilots.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.number.includes(searchTerm);
    const matchesCategory = categoryFilter === 'Todas' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleExportPDF = () => {
    const title = categoryFilter === 'Todas' ? 'LISTADO GENERAL DE INSCRIPTOS' : `INSCRIPTOS - ${categoryFilter}`;
    generatePilotsPDF(filteredPilots, title, categoryFilter === 'Todas' ? undefined : categoryFilter);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const extracted = await aiService.extractRankingsFromImage(base64, file.type);
        setPreviewData(extracted);
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      alert("Error procesando con IA.");
      setIsProcessing(false);
    }
  };

  const confirmImport = () => {
    if (previewData.length > 0) {
      storageService.saveCategoryRankings(rankCategory, previewData);
      alert(`Ranking de ${rankCategory} actualizado.`);
      setShowRankingModal(false);
      setPreviewData([]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-zinc-800 flex flex-col shrink-0 z-40">
        <div className="p-6 bg-zinc-950 border-b border-zinc-800 mb-4 text-center">
          <div className="bg-red-600 p-1 rounded italic font-black text-white text-xl oswald tracking-tighter mb-2">
            ADMIN <span className="text-black bg-white px-1 rounded-sm">KDO</span>
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

      {/* Main Content */}
      <main className="flex-grow flex flex-col bg-black overflow-hidden relative">
        <header className="bg-[#0c0c0c] border-b border-zinc-800 h-16 flex items-center px-8 justify-between shrink-0">
          <h2 className="text-xl font-black oswald uppercase text-white tracking-widest italic">{activeTab.toUpperCase().replace('_', ' ')}</h2>
        </header>

        <div className="flex-grow overflow-auto p-8 custom-scrollbar">
          
          {/* INSCRIPTOS */}
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
                
                <div className="flex gap-4 w-full lg:w-auto">
                  <button onClick={() => setShowRankingModal(true)} className="flex-grow lg:flex-none bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
                    <Sparkles size={14} /> Importar Rankings (IA)
                  </button>
                  <button onClick={handleExportPDF} className="flex-grow lg:flex-none bg-white text-black px-6 py-3 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all shadow-xl">
                    <FileDown size={14} /> Descargar {categoryFilter === 'Todas' ? 'General' : categoryFilter}
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
                      <th className="px-8 py-5">Asociación</th>
                      <th className="px-8 py-5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {filteredPilots.map(p => (
                      <tr key={p.id} className="hover:bg-white/5 transition-all">
                        <td className="px-8 py-5 font-black text-red-600 oswald text-xl italic">#{p.number}</td>
                        <td className="px-8 py-5 text-xs font-black text-white uppercase">{p.name}</td>
                        <td className="px-8 py-5">
                          <span className="text-[9px] font-black uppercase bg-zinc-950 px-2 py-1 rounded text-zinc-400 border border-zinc-800">{p.category}</span>
                        </td>
                        <td className="px-8 py-5 text-[10px] font-bold text-zinc-500 uppercase">{p.association}</td>
                        <td className="px-8 py-5 text-right">
                          <button onClick={() => {
                             if(window.confirm('¿Eliminar piloto del registro?')) {
                               const upd = pilots.filter(x => x.id !== p.id);
                               setPilots(upd);
                               storageService.savePilots(upd);
                             }
                          }} className="p-2.5 bg-zinc-950 border border-zinc-800 text-zinc-600 hover:text-red-500 rounded-xl transition-all">
                            <Trash2 size={14}/>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CAMPEONATOS */}
          {activeTab === 'campeonatos' && (
            <div className="animate-in fade-in duration-300 grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-1">
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl sticky top-0">
                  <h3 className="text-xl font-black oswald uppercase text-white mb-8">Nuevo Torneo</h3>
                  <form onSubmit={handleAddChampionship} className="space-y-6">
                    <input required type="text" value={newChamp.name} onChange={e => setNewChamp({...newChamp, name: e.target.value})} placeholder="NOMBRE DEL CAMPEONATO" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 text-white font-bold uppercase text-[11px] outline-none focus:border-red-600" />
                    <input type="text" value={newChamp.dates} onChange={e => setNewChamp({...newChamp, dates: e.target.value})} placeholder="FECHAS (EJ: MAR-DIC)" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 text-white font-bold uppercase text-[11px] outline-none focus:border-red-600" />
                    <textarea value={newChamp.tracks} onChange={e => setNewChamp({...newChamp, tracks: e.target.value})} placeholder="CIRCUITOS ASOCIADOS" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 text-white font-bold uppercase text-[11px] outline-none h-24 resize-none focus:border-red-600" />
                    <button type="submit" className="w-full bg-red-600 text-white font-black uppercase py-5 rounded-2xl shadow-xl hover:bg-red-700 transition-all">Crear Campeonato</button>
                  </form>
                </div>
              </div>
              <div className="xl:col-span-2 space-y-4">
                {championships.map(champ => (
                  <div key={champ.id} className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 flex justify-between items-center group hover:border-red-600/30 transition-all shadow-xl">
                    <div>
                      <h3 className="text-xl font-black oswald uppercase text-white mb-1 italic tracking-tighter">{champ.name}</h3>
                      <p className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest">{champ.dates} • {champ.tracks}</p>
                    </div>
                    <button onClick={() => deleteChamp(champ.id)} className="p-4 bg-zinc-950 rounded-2xl text-zinc-600 hover:text-red-500 border border-zinc-800 transition-all"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REGLAMENTOS (NUEVO) */}
          {activeTab === 'reglamentos' && (
            <div className="animate-in fade-in duration-300 grid grid-cols-1 xl:grid-cols-3 gap-8">
               <div className="xl:col-span-1">
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl sticky top-0">
                  <h3 className="text-xl font-black oswald uppercase text-white mb-8 flex items-center gap-2">
                    <FileUp size={20} className="text-red-600" /> Cargar PDF
                  </h3>
                  <form onSubmit={handleUploadRegulation} className="space-y-6">
                    <input required type="text" value={newReg.title} onChange={e => setNewReg({...newReg, title: e.target.value})} placeholder="TÍTULO REGLAMENTO" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 text-white font-bold uppercase text-[11px] outline-none focus:border-red-600" />
                    <textarea value={newReg.description} onChange={e => setNewReg({...newReg, description: e.target.value})} placeholder="BREVE DESCRIPCIÓN" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 text-white font-bold uppercase text-[11px] outline-none h-20 resize-none focus:border-red-600" />
                    
                    <label className="w-full flex items-center justify-center gap-3 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-8 text-zinc-500 font-black text-[10px] uppercase cursor-pointer hover:border-red-600 transition-all border-dashed">
                      <File size={20} /> {regFile ? regFile.name : 'SELECCIONAR ARCHIVO PDF'}
                      <input type="file" accept="application/pdf" className="hidden" onChange={e => setRegFile(e.target.files?.[0] || null)} />
                    </label>

                    <button disabled={!regFile || isUploadingReg} type="submit" className="w-full bg-white text-black font-black uppercase py-5 rounded-2xl shadow-xl hover:bg-red-600 hover:text-white transition-all disabled:opacity-30">
                      {isUploadingReg ? 'Procesando...' : 'Cargar Reglamento'}
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
                {regulations.length === 0 && (
                   <div className="py-24 text-center bg-zinc-900/50 border border-dashed border-zinc-800 rounded-[3rem]">
                    <FileText size={48} className="text-zinc-800 mx-auto mb-4 opacity-20" />
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">No hay reglamentos cargados.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MONITOR LIVE */}
          {activeTab === 'live_feed' && (
            <div className="animate-in fade-in duration-300 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] flex items-center justify-between shadow-xl">
                  <div>
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Decodificador KDO</p>
                    <div className="flex items-center gap-2">
                       <div className={`w-3 h-3 rounded-full ${isLiveConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-600'}`}></div>
                       <p className="text-xl font-black text-white uppercase oswald">{isLiveConnected ? 'VIVO' : 'OFFLINE'}</p>
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
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Protocolo KDO-Net</p>
                      <p className="text-xl font-black text-white uppercase oswald tracking-tighter">UDP 16000 Sincronizado</p>
                   </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] flex items-center gap-6 shadow-xl">
                   <div className="bg-zinc-950 p-4 rounded-2xl text-blue-500 border border-zinc-800"><Activity size={24} /></div>
                   <div>
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Temporizador Sesión</p>
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
                      <th className="px-8 py-4 text-right">Diferencia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {liveData.map((row, idx) => (
                      <tr key={row.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-8 py-3 font-black text-zinc-500 italic">{idx + 1}</td>
                        <td className="px-8 py-3 text-red-600 font-black">#{row.number}</td>
                        <td className="px-8 py-3 text-[10px] font-bold uppercase text-white">{row.name}</td>
                        <td className="px-8 py-3 text-zinc-400">{row.laps}</td>
                        <td className="px-8 py-3 text-white">{row.lastLap}</td>
                        <td className="px-8 py-3 text-emerald-500 font-bold">{row.bestLap}</td>
                        <td className="px-8 py-3 text-right text-zinc-600 text-[10px]">{row.gap}</td>
                      </tr>
                    ))}
                    {!isLiveConnected && (
                      <tr>
                        <td colSpan={7} className="py-24 text-center text-zinc-700 text-[10px] font-black uppercase tracking-widest">
                          Conecte el decodificador oficial KDO para recibir datos
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AJUSTES */}
          {activeTab === 'ajustes' && (
            <div className="animate-in fade-in duration-300 space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-zinc-900 border border-zinc-800 p-10 rounded-[3rem] shadow-2xl">
                  <h3 className="text-xl font-black oswald uppercase text-white mb-8 flex items-center gap-3 italic">
                    <Globe size={20} className="text-red-600" /> Integración Cronometraje
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-2 ml-1">URL Mylaps Live</label>
                      <input type="text" value={urls.live} onChange={e => setUrls({...urls, live: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-6 py-4 text-white text-[11px] font-bold outline-none focus:border-red-600" />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-2 ml-1">URL Historial Resultados</label>
                      <input type="text" value={urls.history} onChange={e => setUrls({...urls, history: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-6 py-4 text-white text-[11px] font-bold outline-none focus:border-red-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-10 rounded-[3rem] shadow-2xl">
                  <h3 className="text-xl font-black oswald uppercase text-white mb-8 flex items-center gap-3 italic">
                    <Flag size={20} className="text-red-600" /> Protocolo de Pista
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[TrackFlag.VERDE, TrackFlag.AMARILLA, TrackFlag.ROJA, TrackFlag.AZUL, TrackFlag.CUADROS].map(flag => (
                      <button 
                        key={flag}
                        onClick={() => setTrackStatus(flag)}
                        className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${trackStatus === flag ? 'bg-white text-black border-white shadow-lg' : 'bg-zinc-950 text-zinc-600 border-zinc-800 hover:border-zinc-700'}`}
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
                    <Layers size={20} className="text-red-600" /> Categorías Federadas
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

              <div className="flex justify-end">
                 <button onClick={handleSaveSettings} className="bg-red-600 hover:bg-red-700 text-white px-12 py-5 rounded-2xl font-black uppercase text-xs shadow-2xl flex items-center gap-3 transition-all transform hover:scale-[1.02]">
                    <Save size={18} /> Guardar Configuración KDO
                 </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MODAL SCANNER RANKING IA */}
      {showRankingModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
          <div className="bg-zinc-900 w-full max-w-2xl rounded-[3rem] border border-zinc-800 p-10 shadow-2xl relative">
            <button onClick={() => setShowRankingModal(false)} className="absolute top-8 right-8 text-zinc-500 hover:text-white bg-zinc-950 p-2 rounded-full"><X size={24} /></button>
            <div className="flex items-center gap-4 mb-8">
               <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg"><Sparkles className="text-white" size={24} /></div>
               <h3 className="text-2xl font-black oswald uppercase text-white italic">Scanner Inteligente de Rankings</h3>
            </div>
            <div className="space-y-6">
               <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block">Categoría Destino</label>
                    <select value={rankCategory} onChange={e => setRankCategory(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-6 py-4 text-white font-bold uppercase outline-none text-xs focus:border-emerald-600 cursor-pointer">
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block">Subir Planilla</label>
                    <label className="w-full flex items-center justify-center gap-3 bg-zinc-950 border border-zinc-800 rounded-xl px-6 py-4 text-zinc-400 font-bold text-xs uppercase cursor-pointer hover:border-emerald-600 transition-all border-dashed">
                      <ImageIcon size={18} /> Seleccionar Imagen
                      <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
               </div>
               <div className="bg-zinc-950 border border-zinc-800 rounded-2xl h-80 overflow-y-auto p-6 relative custom-scrollbar">
                  {isProcessing ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/50 backdrop-blur-sm">
                       <Loader2 className="animate-spin text-emerald-500" size={48} />
                       <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">IA Procesando Planilla...</p>
                    </div>
                  ) : previewData.length > 0 ? (
                    <table className="w-full text-left">
                       <thead className="text-[8px] font-black text-zinc-600 uppercase border-b border-zinc-800">
                          <tr><th className="pb-3">Pos</th><th className="pb-3">Kart</th><th className="pb-3">Nombre</th></tr>
                       </thead>
                       <tbody className="divide-y divide-zinc-900">
                          {previewData.map((row, i) => (
                             <tr key={i} className="text-xs font-bold text-zinc-300"><td className="py-2 text-emerald-500">{row.ranking}</td><td className="py-2">#{row.number}</td><td className="py-2 uppercase">{row.name}</td></tr>
                          ))}
                       </tbody>
                    </table>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-700 gap-4">
                      <FileText size={48} />
                      <p className="text-[9px] font-black uppercase tracking-widest">Sin datos para previsualizar</p>
                    </div>
                  )}
               </div>
               <button disabled={previewData.length === 0} onClick={confirmImport} className="w-full bg-white text-black hover:bg-emerald-600 hover:text-white disabled:opacity-30 py-5 rounded-2xl font-black uppercase text-xs transition-all shadow-xl tracking-widest">Confirmar Importación</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
