
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { Pilot, Championship, Category, Status } from '../types';
import { 
  Users, LogOut, Trash2, X, Layers, 
  Trophy, Search, Download, Radio, Settings, 
  LayoutDashboard, Scale, ListOrdered, Upload, 
  ImageIcon, Loader2, Sparkles, FileText, CheckCircle2,
  Play, Square, Signal, AlertCircle, Save, Plus,
  Shield, Key, Link as LinkIcon, Globe, FileCheck, ClipboardList
} from 'lucide-react';
import { 
  generatePilotsPDF, 
  generateChampionshipPDF, 
  generateResultsPDF, 
  generateLapByLapPDF 
} from '../utils/pdfGenerator';

type ActiveTab = 'inscriptos' | 'tecnica' | 'campeonatos' | 'live_feed' | 'ajustes';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTab>('inscriptos');
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  
  // Live Feed Simulation
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [liveData, setLiveData] = useState<any[]>([]);
  const [connectionQuality, setConnectionQuality] = useState(100);

  // Ranking Import states
  const [showRankingModal, setShowRankingModal] = useState(false);
  const [rankCategory, setRankCategory] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);

  // Championship Edit states
  const [newChamp, setNewChamp] = useState({ name: '', status: 'En curso', dates: '', tracks: '' });

  // Settings states
  const [newCategory, setNewCategory] = useState('');
  const [urls, setUrls] = useState({ live: '', history: '' });

  useEffect(() => {
    const auth = storageService.getAuth();
    if (!auth) { navigate('/Administracion19216811'); return; }
    setCurrentUser(auth);
    refreshData();
  }, [navigate]);

  const refreshData = () => {
    setPilots(storageService.getPilots());
    const loadedCats = storageService.getCategories();
    setCategories(loadedCats);
    if (loadedCats.length > 0) setRankCategory(loadedCats[0]);
    setChampionships(storageService.getChampionships());
    setAdminUsers(storageService.getUsers());
    setUrls({
      live: storageService.getLiveUrl(),
      history: storageService.getHistoryUrl()
    });
  };

  // Live Timing Simulator logic
  useEffect(() => {
    let interval: any;
    if (isLiveConnected) {
      setLiveData(pilots.slice(0, 12).map((p, i) => ({
        ...p,
        laps: 8,
        lastLap: (48.2 + Math.random()).toFixed(3),
        bestLap: (48.1 + Math.random() * 0.4).toFixed(3),
        status: Math.random() > 0.15 ? 'Pista' : 'Boxes'
      })));

      interval = setInterval(() => {
        setLiveData(prev => prev.map(p => ({
          ...p,
          lastLap: (48 + Math.random() * 2).toFixed(3),
          laps: p.status === 'Pista' ? p.laps + 1 : p.laps,
          status: Math.random() > 0.9 ? (p.status === 'Pista' ? 'Boxes' : 'Pista') : p.status
        })));
        setConnectionQuality(Math.floor(92 + Math.random() * 8));
      }, 2500);
    } else {
      setLiveData([]);
    }
    return () => clearInterval(interval);
  }, [isLiveConnected, pilots]);

  const handleLogout = () => { storageService.setAuth(null); navigate('/Administracion19216811'); };

  const handleToggleTech = (pilotId: string) => {
    const updated = pilots.map(p => {
      if (p.id === pilotId) {
        return { ...p, status: p.status === Status.CONFIRMADO ? Status.PENDIENTE : Status.CONFIRMADO };
      }
      return p;
    });
    setPilots(updated);
    storageService.savePilots(updated);
  };

  const handleAddChampionship = () => {
    if (!newChamp.name) return;
    const champ: Championship = {
      id: Date.now().toString(),
      name: newChamp.name,
      status: newChamp.status,
      dates: newChamp.dates || 'TBD',
      tracks: newChamp.tracks || 'TBD',
      image: 'https://images.unsplash.com/photo-1547631618-f29792042761?w=800'
    };
    const updated = [...championships, champ];
    setChampionships(updated);
    storageService.saveChampionships(updated);
    setNewChamp({ name: '', status: 'En curso', dates: '', tracks: '' });
  };

  const deleteChamp = (id: string) => {
    const updated = championships.filter(c => c.id !== id);
    setChampionships(updated);
    storageService.saveChampionships(updated);
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    const updated = [...categories, newCategory.trim()];
    setCategories(updated);
    storageService.saveCategories(updated);
    setNewCategory('');
  };

  const handleDeleteCategory = (cat: string) => {
    const updated = categories.filter(c => c !== cat);
    setCategories(updated);
    storageService.saveCategories(updated);
  };

  const handleSaveUrls = () => {
    storageService.saveLiveUrl(urls.live);
    storageService.saveHistoryUrl(urls.history);
    alert("Enlaces de integración actualizados.");
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

  const deletePilot = (id: string) => {
    if (window.confirm('¿Eliminar piloto?')) {
      const updated = pilots.filter(p => p.id !== id);
      setPilots(updated);
      storageService.savePilots(updated);
    }
  };

  // Report Generators
  const exportClassification = () => {
    if (liveData.length === 0) {
      alert("Conecte el Monitor Live para obtener datos de sesión.");
      return;
    }
    generateResultsPDF("Clasificación General", "Circuito de Zárate", liveData);
  };

  const exportLaps = () => {
    if (liveData.length === 0) {
      alert("Conecte el Monitor Live para obtener datos de sesión.");
      return;
    }
    generateLapByLapPDF("Historial de Vueltas", "Circuito de Zárate", liveData);
  };

  const exportChampionshipPoints = (champ: Championship) => {
    // Filtrar pilotos por una categoría representativa para el demo
    const categoryToExport = categories[0] || '150cc KDO Power';
    const pilotsForStandings = pilots.filter(p => p.category === categoryToExport);
    generateChampionshipPDF(champ.name, categoryToExport, pilotsForStandings);
  };

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-300 overflow-hidden font-mono selection:bg-red-600">
      <aside className="w-64 bg-[#0a0a0a] border-r border-zinc-800 flex flex-col shrink-0 z-40">
        <div className="p-6 bg-zinc-950 border-b border-zinc-800 mb-4">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
               <LayoutDashboard size={18} className="text-white" />
             </div>
             <div>
                <span className="text-[10px] font-black uppercase text-white tracking-widest oswald italic block">SOLO KARTING</span>
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em]">ADMIN CORE v5.5</span>
             </div>
           </div>
        </div>

        <nav className="flex-grow overflow-y-auto px-4 space-y-1 custom-scrollbar">
          {[
            { id: 'inscriptos', label: 'Inscriptos', icon: Users },
            { id: 'tecnica', label: 'Verif. Técnica', icon: Scale },
            { id: 'campeonatos', label: 'Campeonatos', icon: Trophy },
            { id: 'live_feed', label: 'Monitor Live', icon: Radio },
            { id: 'ajustes', label: 'Ajustes', icon: Settings },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as ActiveTab)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-[10px] font-bold uppercase tracking-tight ${activeTab === tab.id ? 'bg-red-600 text-white shadow-xl shadow-red-600/10' : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900'}`}>
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
              <LogOut size={12} /> SALIR
           </button>
        </div>
      </aside>

      <main className="flex-grow flex flex-col bg-black overflow-hidden relative">
        <header className="bg-[#0c0c0c] border-b border-zinc-800 h-16 flex items-center px-8 justify-between shrink-0">
           <h2 className="text-xl font-black oswald uppercase text-white tracking-widest italic">{activeTab.toUpperCase().replace('_', ' ')}</h2>
           {activeTab === 'live_feed' && (
             <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase flex items-center gap-2 ${isLiveConnected ? 'bg-emerald-600/10 border-emerald-500/20 text-emerald-500' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}>
                   <Signal size={10} /> Calidad: {connectionQuality}%
                </div>
             </div>
           )}
        </header>

        <div className="flex-grow overflow-auto p-8 custom-scrollbar">
          
          {activeTab === 'inscriptos' && (
            <div className="animate-in fade-in duration-300">
               <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-3.5 text-zinc-600" size={16} />
                    <input type="text" placeholder="BUSCAR PILOTO..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-[11px] font-bold text-white uppercase" />
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setShowRankingModal(true)}
                      className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                    >
                      <Sparkles size={14} /> Importar Rankings (IA)
                    </button>
                    <button onClick={() => generatePilotsPDF(pilots, 'LISTADO')} className="bg-zinc-900 border border-zinc-800 text-zinc-400 px-6 py-3 rounded-2xl font-black uppercase text-[10px] flex items-center gap-2 hover:text-white transition-all">
                      <Download size={14} /> Exportar Inscriptos
                    </button>
                  </div>
               </div>
               <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                  <table className="w-full text-left">
                     <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-500 text-[8px] font-black uppercase tracking-[0.2em]">
                        <tr><th className="px-8 py-5">#</th><th className="px-8 py-5">Piloto</th><th className="px-8 py-5">Categoría</th><th className="px-8 py-5 text-right">Acciones</th></tr>
                     </thead>
                     <tbody className="divide-y divide-zinc-800/50">
                        {pilots.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.number.includes(searchTerm)).map(p => (
                           <tr key={p.id} className="hover:bg-white/5">
                              <td className="px-8 py-5 font-black text-red-600 oswald text-xl italic">#{p.number}</td>
                              <td className="px-8 py-5 text-xs font-black text-white uppercase">{p.name}</td>
                              <td className="px-8 py-5"><span className="text-[9px] font-black uppercase bg-zinc-950 px-2 py-1 rounded text-zinc-400">{p.category}</span></td>
                              <td className="px-8 py-5 text-right"><button onClick={() => deletePilot(p.id)} className="p-2.5 bg-zinc-950 border border-zinc-800 text-zinc-600 hover:text-red-500 rounded-xl transition-all"><Trash2 size={14}/></button></td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === 'tecnica' && (
            <div className="animate-in fade-in duration-300 space-y-8">
               <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <table className="w-full text-left">
                     <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-500 text-[8px] font-black uppercase tracking-[0.2em]">
                        <tr>
                           <th className="px-8 py-5">Kart</th>
                           <th className="px-8 py-5">Piloto</th>
                           <th className="px-8 py-5">Precinto Motor</th>
                           <th className="px-8 py-5">Licencias</th>
                           <th className="px-8 py-5 text-right">Estado Técnico</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-zinc-800/50">
                        {pilots.map(p => (
                           <tr key={p.id} className="hover:bg-white/5">
                              <td className="px-8 py-5 font-black text-white oswald">#{p.number}</td>
                              <td className="px-8 py-5">
                                 <p className="text-xs font-black text-zinc-200 uppercase">{p.name}</p>
                                 <p className="text-[8px] font-black text-zinc-600 uppercase">{p.category}</p>
                              </td>
                              <td className="px-8 py-5 text-[10px] font-mono text-zinc-500">M-{p.number}-SK24</td>
                              <td className="px-8 py-5">
                                 <div className="flex gap-2">
                                    <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">MED OK</span>
                                    <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">DEP OK</span>
                                 </div>
                              </td>
                              <td className="px-8 py-5 text-right">
                                 <button 
                                    onClick={() => handleToggleTech(p.id)}
                                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${p.status === Status.CONFIRMADO ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-500 hover:bg-red-600 hover:text-white'}`}
                                 >
                                    {p.status === Status.CONFIRMADO ? 'APROBADO' : 'PENDIENTE'}
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === 'campeonatos' && (
            <div className="animate-in fade-in duration-300 space-y-10">
               <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="bg-red-600 p-3 rounded-2xl"><Plus className="text-white" size={24} /></div>
                     <h3 className="text-xl font-black oswald uppercase text-white">Crear Nuevo Campeonato</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                     <input type="text" placeholder="NOMBRE" value={newChamp.name} onChange={e => setNewChamp({...newChamp, name: e.target.value})} className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 text-xs font-bold uppercase text-white outline-none focus:border-red-600" />
                     <input type="text" placeholder="FECHAS" value={newChamp.dates} onChange={e => setNewChamp({...newChamp, dates: e.target.value})} className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 text-xs font-bold uppercase text-white outline-none focus:border-red-600" />
                     <input type="text" placeholder="CIRCUITOS" value={newChamp.tracks} onChange={e => setNewChamp({...newChamp, tracks: e.target.value})} className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 text-xs font-bold uppercase text-white outline-none focus:border-red-600" />
                     <select value={newChamp.status} onChange={e => setNewChamp({...newChamp, status: e.target.value})} className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 text-xs font-bold uppercase text-white outline-none">
                        <option value="En curso">En curso</option>
                        <option value="Próximamente">Próximamente</option>
                        <option value="Finalizado">Finalizado</option>
                     </select>
                  </div>
                  <button onClick={handleAddChampionship} className="w-full bg-white text-black hover:bg-red-600 hover:text-white py-4 rounded-xl font-black uppercase text-xs transition-all">Registrar Campeonato</button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {championships.map(c => (
                     <div key={c.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] flex justify-between items-center group">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden">
                              <img src={c.image} className="w-full h-full object-cover grayscale" alt={c.name} />
                           </div>
                           <div>
                              <h4 className="text-white font-black oswald uppercase">{c.name}</h4>
                              <p className="text-[9px] text-zinc-500 uppercase tracking-widest">{c.status} • {c.dates}</p>
                           </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => exportChampionshipPoints(c)}
                            className="p-3 bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-emerald-500 rounded-xl transition-all"
                            title="Exportar Puntos de Campeonato"
                          >
                            <FileCheck size={18}/>
                          </button>
                          <button 
                            onClick={() => deleteChamp(c.id)} 
                            className="p-3 text-zinc-700 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18}/>
                          </button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'live_feed' && (
            <div className="animate-in fade-in duration-300 space-y-8">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className={`col-span-1 border rounded-[2rem] p-8 flex flex-col justify-between transition-all ${isLiveConnected ? 'bg-emerald-600/5 border-emerald-500/20' : 'bg-zinc-900/50 border-zinc-800'}`}>
                    <div>
                      <h3 className="text-xs font-black uppercase text-white oswald tracking-widest mb-2">MyLaps Integration</h3>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase leading-relaxed tracking-tight">Servidor de telemetría KDO activo.</p>
                    </div>
                    <button onClick={() => setIsLiveConnected(!isLiveConnected)} className={`mt-8 w-full py-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-3 transition-all ${isLiveConnected ? 'bg-zinc-950 text-emerald-500 border border-emerald-500/30' : 'bg-red-600 text-white shadow-xl shadow-red-600/20'}`}>
                      {isLiveConnected ? <><Square size={14} fill="currentColor" /> Desconectar</> : <><Play size={14} fill="currentColor" /> Conectar Feed</>}
                    </button>
                  </div>
                  <div className="col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-[2rem] p-8">
                    <div className="flex justify-between items-start mb-6">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                          <p className="text-[9px] font-black text-white uppercase tracking-widest">Sincronización Zárate Loop-A</p>
                       </div>
                       <div className="flex gap-2">
                          <button 
                            onClick={exportClassification}
                            className="bg-zinc-950 border border-zinc-800 text-[9px] font-black uppercase px-4 py-2 rounded-lg hover:border-white transition-all flex items-center gap-2"
                          >
                            <FileText size={12}/> Clasificación
                          </button>
                          <button 
                            onClick={exportLaps}
                            className="bg-zinc-950 border border-zinc-800 text-[9px] font-black uppercase px-4 py-2 rounded-lg hover:border-white transition-all flex items-center gap-2"
                          >
                            <ClipboardList size={12}/> Vueltas (VvV)
                          </button>
                       </div>
                    </div>
                    <div className="flex items-center justify-between">
                       <p className="text-xl font-black text-white oswald uppercase tracking-tighter italic">Telemetría en Tiempo Real</p>
                       <div className="flex gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                       </div>
                    </div>
                  </div>
               </div>

               <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <table className="w-full text-left">
                    <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-500 text-[8px] font-black uppercase tracking-[0.2em]">
                       <tr><th className="px-8 py-5">P</th><th className="px-8 py-5">Dorsal</th><th className="px-8 py-5">Piloto</th><th className="px-8 py-5">Vtas</th><th className="px-8 py-5 text-right">Mejor</th><th className="px-8 py-5 text-center">Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                       {isLiveConnected ? liveData.map((p, i) => (
                          <tr key={p.id} className="hover:bg-white/5 tabular-nums">
                             <td className="px-8 py-4 font-black text-zinc-600">{i + 1}</td>
                             <td className="px-8 py-4 font-black oswald text-red-500 text-lg">#{p.number}</td>
                             <td className="px-8 py-4 text-xs font-black text-zinc-300 uppercase">{p.name}</td>
                             <td className="px-8 py-4 text-xs font-bold text-zinc-600">{p.laps}</td>
                             <td className="px-8 py-4 text-right text-xs font-black text-emerald-500">{p.bestLap}</td>
                             <td className="px-8 py-4 text-center">
                                <span className={`text-[7px] font-black px-2 py-0.5 rounded border ${p.status === 'Pista' ? 'bg-emerald-600/10 text-emerald-500 border-emerald-500/20' : 'bg-red-600/10 text-red-500 border-red-500/20'}`}>{p.status.toUpperCase()}</span>
                             </td>
                          </tr>
                       )) : (
                          <tr><td colSpan={6} className="py-24 text-center text-zinc-800 font-black uppercase text-xs tracking-widest">Feed Desconectado</td></tr>
                       )}
                    </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === 'ajustes' && (
            <div className="animate-in fade-in duration-300 space-y-10">
               <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="bg-red-600 p-3 rounded-2xl"><Layers className="text-white" size={20} /></div>
                        <h3 className="text-lg font-black oswald uppercase text-white">Categorías Federadas</h3>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                        {categories.map(cat => (
                           <div key={cat} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex justify-between items-center group">
                              <span className="text-[10px] font-black text-zinc-400 uppercase truncate">{cat}</span>
                              <button onClick={() => handleDeleteCategory(cat)} className="text-zinc-800 hover:text-red-500"><X size={14}/></button>
                           </div>
                        ))}
                     </div>
                     <div className="flex gap-2">
                        <input type="text" placeholder="Nueva categoría..." value={newCategory} onChange={e => setNewCategory(e.target.value)} className="flex-grow bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-[10px] font-bold text-white uppercase outline-none focus:border-red-600" />
                        <button onClick={handleAddCategory} className="bg-white text-black p-3 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Plus size={18}/></button>
                     </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="bg-blue-600 p-3 rounded-2xl"><LinkIcon className="text-white" size={20} /></div>
                        <h3 className="text-lg font-black oswald uppercase text-white">Integración Speedhive</h3>
                     </div>
                     <div className="space-y-4">
                        <div>
                           <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1 block">Live Timing URL</label>
                           <input type="text" value={urls.live} onChange={e => setUrls({...urls, live: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-[10px] font-bold text-white outline-none focus:border-blue-600" />
                        </div>
                        <div>
                           <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1 block">Archivo de Resultados URL</label>
                           <input type="text" value={urls.history} onChange={e => setUrls({...urls, history: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-[10px] font-bold text-white outline-none focus:border-blue-600" />
                        </div>
                        <button onClick={handleSaveUrls} className="w-full bg-zinc-800 hover:bg-blue-600 text-white py-3 rounded-xl font-black uppercase text-[10px] transition-all">Sincronizar Enlaces</button>
                     </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 xl:col-span-2">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="bg-zinc-100 p-3 rounded-2xl"><Shield className="text-black" size={20} /></div>
                        <h3 className="text-lg font-black oswald uppercase text-white">Usuarios del Sistema</h3>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {adminUsers.map(user => (
                           <div key={user.id} className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl flex justify-between items-center group">
                              <div>
                                 <p className="text-xs font-black text-white uppercase">{user.username}</p>
                                 <p className="text-[8px] font-black text-zinc-600 uppercase">{user.role}</p>
                              </div>
                              <Key size={14} className="text-zinc-800" />
                           </div>
                        ))}
                     </div>
                     <div className="bg-zinc-950/50 border border-zinc-800 border-dashed p-6 rounded-[2rem] text-center">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Creación de usuarios restringida a Administrador Root</p>
                     </div>
                  </div>
               </div>
            </div>
          )}

        </div>
      </main>

      {showRankingModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
          <div className="bg-zinc-900 w-full max-w-2xl rounded-[3rem] border border-zinc-800 p-10 shadow-2xl relative">
            <button onClick={() => setShowRankingModal(false)} className="absolute top-8 right-8 text-zinc-500 hover:text-white"><X size={24} /></button>
            <div className="flex items-center gap-4 mb-8">
               <div className="bg-emerald-600 p-3 rounded-2xl"><Sparkles className="text-white" size={24} /></div>
               <h3 className="text-2xl font-black oswald uppercase text-white">Scanner de Rankings (IA)</h3>
            </div>
            <div className="space-y-6">
               <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block">Categoría Destino</label>
                    <select value={rankCategory} onChange={e => setRankCategory(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-6 py-4 text-white font-bold uppercase outline-none">
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block">Cargar Planilla</label>
                    <label className="w-full flex items-center justify-center gap-3 bg-zinc-950 border border-zinc-800 rounded-xl px-6 py-4 text-zinc-400 font-bold text-xs uppercase cursor-pointer hover:border-emerald-600 transition-all">
                      <ImageIcon size={18} /> Seleccionar
                      <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
               </div>
               <div className="bg-zinc-950 border border-zinc-800 rounded-2xl h-80 overflow-y-auto p-6 relative custom-scrollbar">
                  {isProcessing ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/50 backdrop-blur-sm">
                       <Loader2 className="animate-spin text-emerald-500" size={48} />
                       <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">IA Analizando...</p>
                    </div>
                  ) : previewData.length > 0 ? (
                    <table className="w-full text-left">
                       <thead className="text-[8px] font-black text-zinc-600 uppercase border-b border-zinc-800">
                          <tr><th className="pb-3">Pos</th><th className="pb-3">Kart</th><th className="pb-3">Nombre</th></tr>
                       </thead>
                       <tbody className="divide-y divide-zinc-900">
                          {previewData.map((row, i) => (
                             <tr key={i} className="text-xs font-bold text-zinc-300"><td className="py-2 text-emerald-500">{row.ranking}</td><td className="py-2">{row.number}</td><td className="py-2 uppercase">{row.name}</td></tr>
                          ))}
                       </tbody>
                    </table>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-700 gap-4"><FileText size={48} /><p className="text-[9px] font-black uppercase tracking-widest">Sin datos</p></div>
                  )}
               </div>
               <button disabled={previewData.length === 0} onClick={confirmImport} className="w-full bg-white text-black hover:bg-emerald-600 hover:text-white disabled:opacity-30 py-5 rounded-2xl font-black uppercase text-xs transition-all shadow-xl">Confirmar Ranking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
