
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { 
  Pilot, AuditLog, Status, AdminUser, UserRole, Regulation, RegulationCategory, Championship, PressRelease, LapTime, RaceResultDetail, ChampionshipEvent
} from '../types';
import { 
  Users, Settings, LogOut, Trash2, Search, Plus, XCircle, 
  IdCard, UserCog, UserPlus, ShieldCheck, Activity, Terminal, CheckCircle, Sparkles,
  Trophy, Newspaper, Download, Edit3, Calendar, ListChecks, FileDown,
  Flag, Upload, User, ArrowUpDown, ChevronDown, ChevronUp, AlertCircle, CalendarRange,
  Loader2, FileText, ClipboardList, Clock, Layers, Users2
} from 'lucide-react';
import { 
  generatePilotCredential, 
  generateOfficialResultsPDF,
  generateInscriptosSimplePDF,
  generateInscriptosLicenciasPDF,
  generateInscriptosCronologicoPDF,
  generateInscriptosPorCategoriaPDF,
  generateGruposPistaPDF
} from '../utils/pdfGenerator';

type AdminTab = 'padrón' | 'eventos' | 'resultados' | 'normativas' | 'noticias' | 'campeonatos' | 'staff' | 'auditoría' | 'ajustes';
type ResultViewMode = 'racefull' | 'laps';

const SESSIONS = ['Pruebas Libres', 'Entrenamiento 1', 'Entrenamiento 2', 'Clasificación', 'Súper Clasificación', 'Serie 1', 'Serie 2', 'Final'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('padrón');
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [news, setNews] = useState<PressRelease[]>([]);
  const [settings, setSettings] = useState(storageService.getSettings());
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  // Filtros Padrón
  const [searchTerm, setSearchTerm] = useState('');
  const [catFilter, setCatFilter] = useState('Todas');

  // Estados de Resultados
  const [resultViewMode, setResultViewMode] = useState<ResultViewMode>('racefull');
  const [resCatFilter, setResCatFilter] = useState('KDO Power');
  const [selectedSession, setSelectedSession] = useState('Final');
  const [detailedResults, setDetailedResults] = useState<RaceResultDetail[]>([]);
  const [expandedPilotId, setExpandedPilotId] = useState<string | null>(null);
  const [lapSort, setLapSort] = useState<{ field: keyof LapTime, order: 'asc' | 'desc' }>({ field: 'lap', order: 'asc' });
  
  // Selección de Campeonato/Evento
  const [selectedChampionshipId, setSelectedChampionshipId] = useState<string>('');
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  // Modales
  const [showRegModal, setShowRegModal] = useState(false);
  const [editingReg, setEditingReg] = useState<Partial<Regulation>>({ title: '', category: 'Técnico', version: '1.0' });
  const [regFile, setRegFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showNewsModal, setShowNewsModal] = useState(false);
  const [newsForm, setNewsForm] = useState<Partial<PressRelease>>({ title: '', content: '', category: 'Oficial' });

  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffForm, setStaffForm] = useState<Partial<AdminUser>>({ username: '', name: '', role: 'Comisario Deportivo', password: '' });

  const [showChampModal, setShowChampModal] = useState(false);
  const [champForm, setChampForm] = useState<Partial<Championship>>({ name: '', year: 2026, status: 'Programado', champions: [] });

  const [showEventModal, setShowEventModal] = useState(false);
  const [eventForm, setEventForm] = useState<Partial<ChampionshipEvent>>({ name: '', round: 1, status: 'Programada', track: '' });
  const [eventErrors, setEventErrors] = useState<string[]>([]);

  const [auditAnalysis, setAuditAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const auth = storageService.getAuth();
    if (!auth) { navigate('/AdminKDO'); return; }
    setCurrentUser(auth);
    refreshData();
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'resultados') {
      generateMockDetailedResults();
    }
  }, [activeTab, resCatFilter, selectedSession, pilots]);

  const refreshData = () => {
    const pilotsData = storageService.getPilots();
    setPilots(pilotsData);
    setLogs(storageService.getAuditLogs());
    setAdminUsers(storageService.getAdminUsers());
    setRegulations(storageService.getRegulations());
    const loadedChamps = storageService.getChampionships();
    setChampionships(loadedChamps);
    setNews(storageService.getPressReleases());
    setSettings(storageService.getSettings());

    if (loadedChamps.length > 0 && !selectedChampionshipId) {
      setSelectedChampionshipId(loadedChamps[0].id);
      if (loadedChamps[0].events && loadedChamps[0].events.length > 0) {
        setSelectedEventId(loadedChamps[0].events[0].id);
      }
    }
  };

  const handleLogout = () => { storageService.setAuth(null); navigate('/'); };

  // --- CHAMPIONSHIP CRUD ---
  const saveChampionship = () => {
    if (!champForm.name || !champForm.year) { alert("Nombre y Año requeridos."); return; }
    const newChamp: Championship = {
      id: champForm.id || Math.random().toString(36).substr(2, 9),
      name: champForm.name,
      year: Number(champForm.year),
      status: champForm.status || 'Programado',
      dates: champForm.dates || `Temporada ${champForm.year}`,
      tracks: champForm.tracks || 'Varios',
      image: champForm.image || 'https://images.unsplash.com/photo-1547631618-f29792042761?w=800',
      champions: champForm.champions || [],
      events: champForm.events || []
    };
    const updated = champForm.id ? championships.map(c => c.id === champForm.id ? newChamp : c) : [newChamp, ...championships];
    storageService.saveChampionships(updated);
    storageService.addLog('CAMPEONATO', `${champForm.id ? 'Editado' : 'Creado'}: ${newChamp.name}`);
    setShowChampModal(false);
    refreshData();
  };

  const deleteChampionship = (id: string) => {
    if (confirm("¿Eliminar este campeonato permanentemente?")) {
      storageService.saveChampionships(championships.filter(c => c.id !== id));
      storageService.addLog('CAMPEONATO', `Eliminado ID: ${id}`);
      refreshData();
    }
  };

  // --- EVENT CRUD ---
  const openEventModal = (event?: ChampionshipEvent) => {
    setEventErrors([]);
    if (event) setEventForm(event);
    else setEventForm({ name: '', round: (currentChampionship?.events?.length || 0) + 1, status: 'Programada', track: '' });
    setShowEventModal(true);
  };

  const saveEvent = () => {
    if (!eventForm.name) { setEventErrors(["Nombre requerido."]); return; }
    const newEvent: ChampionshipEvent = {
      id: eventForm.id || Math.random().toString(36).substr(2, 9),
      name: eventForm.name,
      round: Number(eventForm.round) || 1,
      status: (eventForm.status as any) || 'Programada',
      track: eventForm.track || '',
      date: eventForm.date || new Date().toISOString().split('T')[0],
      briefingSigned: eventForm.briefingSigned || [],
      technicalScrutiny: eventForm.technicalScrutiny || {}
    };
    const updatedChamps = championships.map(c => {
      if (c.id === selectedChampionshipId) {
        const events = c.events || [];
        return { ...c, events: eventForm.id ? events.map(e => e.id === eventForm.id ? newEvent : e) : [...events, newEvent] };
      }
      return c;
    });
    storageService.saveChampionships(updatedChamps);
    storageService.addLog('EVENTO', `${eventForm.id ? 'Editado' : 'Agregado'}: ${newEvent.name}`);
    setShowEventModal(false);
    refreshData();
  };

  const deleteEvent = (id: string) => {
    if (confirm("¿Remover esta fecha?")) {
      const updatedChamps = championships.map(c => {
        if (c.id === selectedChampionshipId) return { ...c, events: (c.events || []).filter(e => e.id !== id) };
        return c;
      });
      storageService.saveChampionships(updatedChamps);
      storageService.addLog('EVENTO', `Eliminada fecha ID: ${id}`);
      refreshData();
    }
  };

  // --- RESULTADOS OFICIALES ---
  const generateMockDetailedResults = () => {
    const catPilots = pilots.filter(p => p.category === resCatFilter && p.status === Status.CONFIRMADO);
    if (catPilots.length === 0) {
      setDetailedResults([]);
      return;
    }
    const mockResults: RaceResultDetail[] = catPilots.map((p, idx) => {
      const lapsCount = selectedSession.includes('Clasificación') ? 3 : 12;
      const baseTime = 47.0 + Math.random() * 2;
      const lapTimes: LapTime[] = Array.from({ length: lapsCount }, (_, i) => ({ 
        lap: i + 1, time: (baseTime + Math.random() * 0.5).toFixed(3) 
      }));
      const best = Math.min(...lapTimes.map(l => parseFloat(l.time)));
      lapTimes.find(l => parseFloat(l.time) === best)!.isBest = true;
      return {
        pos: idx + 1, no: p.number, pilotName: p.name, laps: lapsCount,
        totalTime: (lapsCount * (baseTime + 0.2)).toFixed(3),
        gap: idx === 0 ? '-' : `+${(idx * 0.85).toFixed(3)}`,
        interval: idx === 0 ? '-' : '+0.850',
        bestLap: best.toFixed(3), bestLapNo: lapTimes.findIndex(l => l.isBest) + 1, lapTimes
      };
    });
    setDetailedResults(mockResults);
  };

  // --- REGLAMENTOS PDF ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setRegFile(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const saveReg = () => {
    if (!editingReg.title || (!editingReg.id && !regFile)) { alert("Título y Archivo requeridos."); return; }
    const newReg: Regulation = {
      id: editingReg.id || Date.now().toString(),
      title: editingReg.title || '',
      description: editingReg.description || '',
      category: editingReg.category as RegulationCategory,
      version: editingReg.version || '1.0',
      date: new Date().toLocaleDateString('es-AR'),
      fileSize: regFile ? `${(regFile.length / 1024 / 1024).toFixed(2)} MB` : (editingReg.fileSize || '0 MB'),
      fileData: regFile || editingReg.fileData || '',
      isDraft: false
    };
    const updated = editingReg.id ? regulations.map(r => r.id === editingReg.id ? newReg : r) : [newReg, ...regulations];
    storageService.saveRegulations(updated);
    storageService.addLog('PDF', `Publicado: ${newReg.title}`);
    setShowRegModal(false);
    setRegFile(null);
    refreshData();
  };

  const deleteReg = (id: string) => {
    if (confirm("¿Eliminar este reglamento?")) {
      const updated = regulations.filter(r => r.id !== id);
      storageService.saveRegulations(updated);
      storageService.addLog('PDF', `Eliminado ID: ${id}`);
      refreshData();
    }
  };

  // --- STAFF ---
  const saveStaff = () => {
    if (!staffForm.username || (!staffForm.id && !staffForm.password)) { alert("Datos insuficientes."); return; }
    const newUser: AdminUser = {
      id: staffForm.id || Math.random().toString(36).substr(2, 9),
      username: staffForm.username?.toLowerCase() || '',
      password: staffForm.password,
      name: staffForm.name || '',
      role: staffForm.role as UserRole,
      permissions: ['READ', 'WRITE']
    };
    const updated = staffForm.id ? adminUsers.map(u => u.id === staffForm.id ? newUser : u) : [...adminUsers, newUser];
    storageService.saveAdminUsers(updated);
    storageService.addLog('STAFF', `Oficial: ${newUser.name}`);
    setShowStaffModal(false);
    refreshData();
  };

  const deleteStaff = (id: string) => {
    if (id === currentUser?.id) { alert("No puedes eliminar tu propio usuario."); return; }
    if (confirm("¿Revocar acceso a este oficial?")) {
      const updated = adminUsers.filter(u => u.id !== id);
      storageService.saveAdminUsers(updated);
      storageService.addLog('STAFF', `Acceso revocado ID: ${id}`);
      refreshData();
    }
  };

  // --- PRENSA ---
  const saveNews = () => {
    if (!newsForm.title || !newsForm.content) { alert("Complete los campos."); return; }
    const newEntry: PressRelease = {
      id: newsForm.id || Date.now().toString(),
      title: newsForm.title,
      content: newsForm.content,
      category: newsForm.category as any,
      date: new Date().toLocaleDateString('es-AR'),
      author: currentUser?.name || 'Admin KDO'
    };
    const updated = newsForm.id ? news.map(n => n.id === newsForm.id ? newEntry : n) : [newEntry, ...news];
    storageService.savePressReleases(updated);
    storageService.addLog('PRENSA', `Publicado: ${newEntry.title}`);
    setShowNewsModal(false);
    refreshData();
  };

  const deleteNews = (id: string) => {
    if (confirm("¿Eliminar este comunicado?")) {
      const updated = news.filter(n => n.id !== id);
      storageService.savePressReleases(updated);
      storageService.addLog('PRENSA', `Eliminado ID: ${id}`);
      refreshData();
    }
  };

  // --- AJUSTES ---
  const saveSystemSettings = () => {
    storageService.saveSettings(settings);
    storageService.addLog('AJUSTES', 'Configuración de sistema actualizada');
    alert("Ajustes guardados correctamente.");
  };

  const currentChampionship = championships.find(c => c.id === selectedChampionshipId);
  const currentEvent = currentChampionship?.events?.find(e => e.id === selectedEventId);
  const officialCats = storageService.getCategories();

  const filteredPilots = pilots.filter(p => (catFilter === 'Todas' || p.category === catFilter) && (p.name.includes(searchTerm.toUpperCase()) || p.number.includes(searchTerm)));

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-400 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-80 admin-sidebar-glass flex flex-col shrink-0 z-50">
        <div className="p-10 border-b border-white/5">
           <div className="flex items-center gap-4 mb-8">
              <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg"><ShieldCheck size={28} className="text-white" /></div>
              <div>
                 <h2 className="text-2xl font-black oswald uppercase text-white italic tracking-tighter">COMMAND</h2>
                 <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-1">KDO OS v10.5</p>
              </div>
           </div>
        </div>
        
        <nav className="flex-grow p-6 space-y-1 overflow-y-auto custom-scrollbar">
          {[
            { id: 'padrón', icon: Users, label: 'Padrón Federado' },
            { id: 'eventos', icon: CheckCircle, label: 'Control de Evento' },
            { id: 'resultados', icon: ListChecks, label: 'Resultados Oficiales' },
            { id: 'campeonatos', icon: Trophy, label: 'Campeonatos' },
            { id: 'normativas', icon: FileDown, label: 'Repositorio PDF' },
            { id: 'noticias', icon: Newspaper, label: 'Prensa KDO' },
            { id: 'staff', icon: UserCog, label: 'Cuerpo Técnico' },
            { id: 'auditoría', icon: Terminal, label: 'Auditoría Logs' },
            { id: 'ajustes', icon: Settings, label: 'Sistemas' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as AdminTab)} className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl' : 'hover:bg-white/5 text-zinc-600 hover:text-zinc-300'}`}>
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5">
          <button onClick={handleLogout} className="w-full py-5 bg-zinc-900 text-red-500 font-black uppercase text-[10px] rounded-2xl hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-3">
            <LogOut size={16} /> Finalizar Sesión
          </button>
        </div>
      </aside>

      {/* WORKSPACE */}
      <main className="flex-grow flex flex-col overflow-hidden">
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-12 bg-black/40 backdrop-blur-3xl shrink-0 z-40">
           <h2 className="text-4xl font-black oswald uppercase text-white italic tracking-tighter leading-none">{activeTab}</h2>
           <div className="flex items-center gap-4 group">
             <div className="text-right">
                <p className="text-[10px] font-black text-white uppercase leading-none">{currentUser?.name}</p>
                <p className="text-[8px] font-bold text-zinc-600 uppercase mt-1">{currentUser?.role}</p>
             </div>
             <div className="w-12 h-12 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center text-blue-500 font-black oswald text-xl shadow-xl">{currentUser?.name?.[0] || 'A'}</div>
           </div>
        </header>

        <div className="flex-grow overflow-auto p-12 custom-scrollbar">
          
          {/* TAB: PADRÓN */}
          {activeTab === 'padrón' && (
            <div className="space-y-10 animate-in fade-in">
               
               {/* NUEVO: PANEL DE REPORTES PDF */}
               <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] shadow-xl">
                  <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                    <FileText size={14} className="text-blue-500" /> Exportación de Planillas Oficiales de Carrera
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                     <button onClick={() => generateInscriptosSimplePDF(filteredPilots)} className="flex flex-col items-center gap-3 p-6 bg-black/40 border border-white/5 rounded-3xl hover:bg-blue-600 hover:text-white transition-all group">
                        <Users2 size={24} className="text-blue-500 group-hover:text-white" />
                        <span className="text-[9px] font-black uppercase text-center">Inscriptos Simple</span>
                     </button>
                     <button onClick={() => generateInscriptosLicenciasPDF(filteredPilots)} className="flex flex-col items-center gap-3 p-6 bg-black/40 border border-white/5 rounded-3xl hover:bg-blue-600 hover:text-white transition-all group">
                        <ClipboardList size={24} className="text-blue-500 group-hover:text-white" />
                        <span className="text-[9px] font-black uppercase text-center">Planilla de Firmas</span>
                     </button>
                     <button onClick={() => generateInscriptosCronologicoPDF(filteredPilots)} className="flex flex-col items-center gap-3 p-6 bg-black/40 border border-white/5 rounded-3xl hover:bg-blue-600 hover:text-white transition-all group">
                        <Clock size={24} className="text-blue-500 group-hover:text-white" />
                        <span className="text-[9px] font-black uppercase text-center">Orden de Llegada</span>
                     </button>
                     <button onClick={() => generateInscriptosPorCategoriaPDF(filteredPilots, officialCats)} className="flex flex-col items-center gap-3 p-6 bg-black/40 border border-white/5 rounded-3xl hover:bg-blue-600 hover:text-white transition-all group">
                        <Layers size={24} className="text-blue-500 group-hover:text-white" />
                        <span className="text-[9px] font-black uppercase text-center">Por Categoría</span>
                     </button>
                     <button onClick={() => generateGruposPistaPDF(filteredPilots, officialCats)} className="flex flex-col items-center gap-3 p-6 bg-black/40 border border-white/5 rounded-3xl hover:bg-blue-600 hover:text-white transition-all group">
                        <Activity size={24} className="text-blue-500 group-hover:text-white" />
                        <span className="text-[9px] font-black uppercase text-center">Grupos de Pista</span>
                     </button>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  <div className="lg:col-span-6 glass-panel p-5 rounded-[1.5rem] flex items-center gap-6">
                    <Search className="text-zinc-700" size={20} />
                    <input type="text" placeholder="BUSCAR PILOTO O DORSAL..." className="w-full bg-transparent border-none text-white font-black text-[10px] uppercase outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
                  <div className="lg:col-span-3">
                    <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="w-full h-full bg-zinc-900 border border-white/5 rounded-2xl px-5 text-[9px] font-black uppercase text-white outline-none">
                       <option value="Todas">Todas las Categorías</option>
                       {officialCats.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="lg:col-span-3 flex gap-3">
                    <button onClick={() => navigate('/AdminKDO/nuevo-piloto')} className="flex-grow bg-blue-600 text-white px-6 rounded-[1.5rem] font-black uppercase text-[9px] flex items-center justify-center gap-3 shadow-xl hover:bg-white hover:text-blue-600 transition-all">
                      <UserPlus size={16} /> Alta Piloto
                    </button>
                  </div>
               </div>
               
               <div className="glass-panel rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
                  <table className="w-full text-left">
                    <thead className="bg-black/40 text-[8px] font-black uppercase text-zinc-700 border-b border-white/5">
                       <tr><th className="px-8 py-5">Piloto / Dorsal</th><th className="px-8 py-5">Categoría</th><th className="px-8 py-5 text-center">Conducta</th><th className="px-8 py-5 text-right pr-8">Acciones</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                       {filteredPilots.map(p => (
                         <tr key={p.id} className="hover:bg-blue-600/[0.02] group">
                            <td className="px-8 py-6 flex items-center gap-6"><div className="w-12 h-12 bg-zinc-950 border border-white/5 rounded-2xl flex items-center justify-center font-black oswald text-xl text-blue-500 italic shadow-xl">#{p.number}</div><p className="text-white font-black text-xs uppercase">{p.name}</p></td>
                            <td className="px-8 py-6"><span className="text-[9px] font-black text-zinc-400 uppercase">{p.category}</span></td>
                            <td className="px-8 py-6 text-center"><span className={`text-xl font-black oswald italic ${p.conductPoints > 7 ? 'text-emerald-500' : 'text-red-500'}`}>{p.conductPoints}/10</span></td>
                            <td className="px-8 py-6 text-right pr-8">
                               <div className="flex justify-end gap-3">
                                  <button title="Credencial" onClick={() => generatePilotCredential(p)} className="p-3 bg-zinc-950 rounded-xl text-zinc-600 hover:text-blue-500 border border-white/5 transition-all"><IdCard size={14}/></button>
                                  <button title="Editar" onClick={() => navigate(`/AdminKDO/nuevo-piloto?edit=${p.id}`)} className="p-3 bg-zinc-950 rounded-xl text-zinc-600 hover:text-yellow-500 border border-white/5 transition-all"><Edit3 size={14}/></button>
                                  <button title="Eliminar" onClick={() => { if(confirm('¿Eliminar permanentemente?')) { storageService.savePilots(pilots.filter(x => x.id !== p.id)); refreshData(); } }} className="p-3 bg-red-600/5 rounded-xl text-red-600/50 border border-red-600/10 hover:bg-red-600 hover:text-white transition-all"><Trash2 size={14}/></button>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                  </table>
               </div>
            </div>
          )}

          {/* TAB: EVENTOS */}
          {activeTab === 'eventos' && (
            <div className="space-y-10 animate-in fade-in">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-4 glass-panel p-8 rounded-[2.5rem] flex flex-col gap-3">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Campeonato Activo</label>
                    <select value={selectedChampionshipId} onChange={e => setSelectedChampionshipId(e.target.value)} className="bg-transparent border-none text-white font-black oswald text-2xl uppercase outline-none cursor-pointer">
                      {championships.map(c => <option key={c.id} value={c.id} className="bg-zinc-900">{c.name}</option>)}
                    </select>
                  </div>
                  <div className="lg:col-span-4 glass-panel p-8 rounded-[2.5rem] flex flex-col gap-3">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Gran Premio Seleccionado</label>
                    <select value={selectedEventId} onChange={e => setSelectedEventId(e.target.value)} className="bg-transparent border-none text-white font-black oswald text-2xl uppercase outline-none cursor-pointer">
                      <option value="" className="bg-zinc-900 text-zinc-600 italic">-- Seleccionar GP --</option>
                      {currentChampionship?.events?.map(e => <option key={e.id} value={e.id} className="bg-zinc-900">ROUND {e.round}: {e.name}</option>)}
                    </select>
                  </div>
                  <div className="lg:col-span-4 flex gap-4">
                    <button onClick={() => openEventModal()} className="flex-grow bg-blue-600 text-white rounded-[2.5rem] font-black uppercase text-[10px] flex items-center justify-center gap-3 shadow-2xl hover:bg-white hover:text-blue-600 transition-all">
                      Programar Fecha <Calendar size={18} />
                    </button>
                  </div>
               </div>

               <div className="glass-panel rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
                  <table className="w-full text-left">
                    <thead className="bg-black/40 text-[9px] font-black uppercase text-zinc-700 border-b border-white/5">
                       <tr><th className="px-10 py-6">Rnd</th><th className="px-10 py-6">GP / Evento</th><th className="px-10 py-6">Circuito</th><th className="px-10 py-6">Estado</th><th className="px-10 py-6 text-right pr-10">Acciones</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                       {currentChampionship?.events?.map(e => (
                         <tr key={e.id} className={`hover:bg-white/[0.02] ${selectedEventId === e.id ? 'bg-blue-600/5' : ''}`}>
                           <td className="px-10 py-6 font-black oswald text-xl text-blue-500">#{e.round}</td>
                           <td className="px-10 py-6 font-bold text-white uppercase text-xs">{e.name}</td>
                           <td className="px-10 py-6 text-[10px] font-black uppercase text-zinc-500">{e.track || 'TBD'}</td>
                           <td className="px-10 py-6"><span className="px-3 py-1 bg-zinc-900 border border-white/5 rounded text-[8px] font-black uppercase text-zinc-400">{e.status}</span></td>
                           <td className="px-10 py-6 text-right pr-10">
                             <div className="flex justify-end gap-2">
                                <button onClick={() => openEventModal(e)} className="p-3 bg-zinc-950 rounded-xl text-zinc-600 hover:text-yellow-500"><Edit3 size={14}/></button>
                                <button onClick={() => deleteEvent(e.id)} className="p-3 bg-zinc-950 rounded-xl text-zinc-600 hover:text-red-500"><Trash2 size={14}/></button>
                             </div>
                           </td>
                         </tr>
                       ))}
                       {(!currentChampionship?.events || currentChampionship.events.length === 0) && (
                         <tr><td colSpan={5} className="py-20 text-center text-zinc-700 uppercase font-black text-[10px]">No hay fechas programadas para este campeonato</td></tr>
                       )}
                    </tbody>
                  </table>
               </div>
            </div>
          )}

          {/* TAB: RESULTADOS */}
          {activeTab === 'resultados' && (
            <div className="space-y-8 animate-in fade-in">
               <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="glass-panel p-6 rounded-[2rem] flex flex-col gap-2">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Flag size={10} /> Fecha</label>
                    <select value={selectedEventId} onChange={e => setSelectedEventId(e.target.value)} className="bg-transparent border-none text-white font-black oswald text-lg uppercase outline-none cursor-pointer">
                      {currentChampionship?.events?.map(e => <option key={e.id} value={e.id} className="bg-zinc-900">{e.name}</option>)}
                    </select>
                  </div>
                  <div className="glass-panel p-6 rounded-[2rem] flex flex-col gap-2">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Activity size={10} /> Sesión</label>
                    <select value={selectedSession} onChange={e => setSelectedSession(e.target.value)} className="bg-transparent border-none text-white font-black oswald text-lg uppercase outline-none cursor-pointer">
                      {SESSIONS.map(s => <option key={s} value={s} className="bg-zinc-900">{s}</option>)}
                    </select>
                  </div>
                  <div className="glass-panel p-6 rounded-[2rem] flex flex-col gap-2">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2"><ListChecks size={10} /> Categoría</label>
                    <select value={resCatFilter} onChange={e => setResCatFilter(e.target.value)} className="bg-transparent border-none text-white font-black oswald text-lg uppercase outline-none cursor-pointer">
                      {officialCats.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <button onClick={() => generateOfficialResultsPDF(resCatFilter, detailedResults, selectedSession, currentEvent?.name)} className="bg-blue-600 text-white rounded-[2rem] font-black uppercase text-[10px] flex items-center justify-center gap-3 shadow-xl hover:bg-white hover:text-blue-600 transition-all">
                    Exportar PDF <FileDown size={18} />
                  </button>
               </div>

               <div className="flex gap-4 bg-black/40 p-6 rounded-[2rem] border border-white/5">
                  <button onClick={() => setResultViewMode('racefull')} className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${resultViewMode === 'racefull' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-500'}`}>Race Summary</button>
                  <button onClick={() => setResultViewMode('laps')} className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${resultViewMode === 'laps' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-500'}`}>Análisis de Vueltas</button>
               </div>

               <div className="glass-panel rounded-[2.5rem] overflow-hidden border border-white/5 shadow-3xl">
                  {detailedResults.length > 0 ? (
                    resultViewMode === 'racefull' ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-zinc-950/80 text-[8px] font-black uppercase text-zinc-600 border-b border-white/5">
                            <tr><th className="px-8 py-6 text-center">POS</th><th className="px-6 py-6 text-center">KART</th><th className="px-8 py-6">PILOTO</th><th className="px-6 py-6 text-center">VTAS</th><th className="px-8 py-6 text-right">MEJOR VTA</th></tr>
                          </thead>
                          <tbody className="divide-y divide-white/[0.03] font-mono text-xs">
                            {detailedResults.map(res => (
                              <tr key={res.no} className="hover:bg-blue-600/[0.02] transition-colors">
                                <td className="px-8 py-5 text-center font-black oswald italic text-2xl text-zinc-700">{res.pos}</td>
                                <td className="px-6 py-5 text-center"><span className="bg-zinc-900 text-white font-black oswald px-3 py-1 rounded-lg">#{res.no}</span></td>
                                <td className="px-8 py-5 font-sans font-black text-white uppercase text-xs">{res.pilotName}</td>
                                <td className="px-6 py-5 text-center font-bold text-zinc-500">{res.laps}</td>
                                <td className="px-8 py-5 text-right"><span className="text-purple-400 font-black">{res.bestLap}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-8 space-y-4">
                        {detailedResults.map(res => (
                          <div key={res.no} className="bg-black/40 border border-white/5 rounded-3xl overflow-hidden">
                            <button onClick={() => setExpandedPilotId(expandedPilotId === res.no ? null : res.no)} className="w-full px-8 py-6 flex items-center justify-between hover:bg-white/[0.02]">
                              <div className="flex items-center gap-6">
                                <div className="bg-zinc-900 text-white font-black oswald px-4 py-2 rounded-xl border border-white/5">#{res.no}</div>
                                <div className="text-left"><p className="text-sm font-black text-white uppercase tracking-tight">{res.pilotName}</p></div>
                              </div>
                              <div className="flex items-center gap-4 text-[10px] font-black text-purple-500 uppercase tracking-widest">{res.laps} VTAS • {expandedPilotId === res.no ? <ChevronUp /> : <ChevronDown />}</div>
                            </button>
                            {expandedPilotId === res.no && (
                              <div className="px-8 pb-8 pt-4 animate-in slide-in-from-top-4">
                                <table className="w-full text-left">
                                  <thead className="bg-black text-[9px] font-black uppercase text-zinc-700 border-b border-white/5">
                                    <tr><th className="px-6 py-3">VUELTA</th><th className="px-6 py-3">TIEMPO</th><th className="px-6 py-3 text-right">STATUS</th></tr>
                                  </thead>
                                  <tbody className="divide-y divide-white/[0.03] font-mono text-xs">
                                    {res.lapTimes.map(l => (
                                      <tr key={l.lap} className={`hover:bg-white/[0.02] ${l.isBest ? 'bg-purple-600/5' : ''}`}>
                                        <td className="px-6 py-3 text-zinc-500">{l.lap}</td>
                                        <td className={`px-6 py-3 font-black ${l.isBest ? 'text-purple-400' : 'text-zinc-300'}`}>{l.time}</td>
                                        <td className="px-6 py-3 text-right">{l.isBest && <span className="text-[9px] font-black bg-purple-500 text-white px-2 py-0.5 rounded uppercase">Record</span>}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="py-20 text-center text-zinc-700 uppercase font-black text-[10px]">No hay resultados cargados para esta categoría</div>
                  )}
               </div>
            </div>
          )}

          {/* TAB: CAMPEONATOS */}
          {activeTab === 'campeonatos' && (
            <div className="space-y-10 animate-in fade-in">
               <div className="flex justify-between items-end border-b border-white/5 pb-10">
                  <div>
                    <h3 className="text-4xl font-black oswald uppercase text-white">Temporadas <span className="text-blue-500">KDO</span></h3>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-2">Archivo histórico y gestión de torneos actuales</p>
                  </div>
                  <button onClick={() => { setChampForm({ name: '', year: 2026, status: 'Programado' }); setShowChampModal(true); }} className="bg-blue-600 text-white px-10 py-5 rounded-[2.5rem] font-black uppercase text-[10px] flex items-center gap-3 shadow-2xl hover:bg-white hover:text-blue-600 transition-all">
                    Nuevo Campeonato <Trophy size={20} />
                  </button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {championships.map(ch => (
                    <div key={ch.id} className="bg-zinc-900 border border-white/5 p-8 rounded-[3.5rem] group hover:border-blue-600 transition-all shadow-xl flex flex-col h-full">
                       <div className="flex justify-between items-center mb-6">
                          <span className="text-3xl font-black text-blue-500 oswald italic">{ch.year}</span>
                          <div className="flex gap-2">
                             <button onClick={() => { setChampForm(ch); setShowChampModal(true); }} className="p-3 bg-zinc-950 rounded-xl text-zinc-600 hover:text-yellow-500 transition-all"><Edit3 size={14}/></button>
                             <button onClick={() => deleteChampionship(ch.id)} className="p-3 bg-zinc-950 rounded-xl text-zinc-600 hover:text-red-500 transition-all"><Trash2 size={14}/></button>
                          </div>
                       </div>
                       <h4 className="text-xl font-black text-white oswald uppercase italic mb-4 leading-tight flex-grow">{ch.name}</h4>
                       <div className="space-y-2 border-t border-white/5 pt-4">
                          <div className="flex justify-between text-[10px] font-black uppercase"><span className="text-zinc-600">Estado:</span> <span className="text-blue-500">{ch.status}</span></div>
                          <div className="flex justify-between text-[10px] font-black uppercase"><span className="text-zinc-600">Eventos:</span> <span className="text-white">{ch.events?.length || 0}</span></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* TAB: NORMATIVAS */}
          {activeTab === 'normativas' && (
            <div className="space-y-10 animate-in fade-in">
               <div className="flex justify-between items-end border-b border-white/5 pb-10">
                  <div>
                    <h3 className="text-4xl font-black oswald uppercase text-white">Repositorio <span className="text-blue-500">PDF</span></h3>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-2">Publicación de reglamentos y circulares técnicas</p>
                  </div>
                  <button onClick={() => { setEditingReg({ title: '', category: 'Técnico', version: '1.0' }); setShowRegModal(true); }} className="bg-blue-600 text-white px-10 py-5 rounded-[2.5rem] font-black uppercase text-[10px] flex items-center gap-3">
                    Subir PDF <Upload size={20} />
                  </button>
               </div>
               <div className="glass-panel rounded-[2rem] overflow-hidden border border-white/5">
                  <table className="w-full text-left">
                     <thead className="bg-black/40 text-[8px] font-black uppercase text-zinc-700 border-b border-white/5">
                        <tr><th className="px-10 py-5">Título del Documento</th><th className="px-10 py-5">Categoría</th><th className="px-10 py-5">Versión</th><th className="px-10 py-5 text-right pr-10">Acciones</th></tr>
                     </thead>
                     <tbody className="divide-y divide-white/[0.03]">
                        {regulations.map(reg => (
                          <tr key={reg.id} className="hover:bg-white/[0.02]">
                             <td className="px-10 py-6"><span className="text-white font-black text-xs uppercase">{reg.title}</span></td>
                             <td className="px-10 py-6"><span className="text-[9px] font-black text-zinc-500 uppercase">{reg.category}</span></td>
                             <td className="px-10 py-6 font-mono text-[10px]">v{reg.version}</td>
                             <td className="px-10 py-6 text-right pr-10">
                                <div className="flex justify-end gap-3">
                                   <button onClick={() => { setEditingReg(reg); setShowRegModal(true); }} className="p-3 bg-zinc-950 rounded-xl text-zinc-600 hover:text-yellow-500 transition-all"><Edit3 size={14}/></button>
                                   <button onClick={() => deleteReg(reg.id)} className="p-3 bg-zinc-950 rounded-xl text-zinc-600 hover:text-red-500 transition-all"><Trash2 size={14}/></button>
                                </div>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {/* TAB: NOTICIAS */}
          {activeTab === 'noticias' && (
            <div className="space-y-10 animate-in fade-in">
               <div className="flex justify-between items-end border-b border-white/5 pb-10">
                  <div>
                    <h3 className="text-4xl font-black oswald uppercase text-white">Prensa <span className="text-blue-500">KDO</span></h3>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-2">Comunicación oficial y noticias de paddock</p>
                  </div>
                  <button onClick={() => { setNewsForm({ title: '', content: '', category: 'Oficial' }); setShowNewsModal(true); }} className="bg-blue-600 text-white px-10 py-5 rounded-[2.5rem] font-black uppercase text-[10px] flex items-center gap-3">
                    Publicar Nota <Plus size={20} />
                  </button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {news.map(item => (
                    <div key={item.id} className="bg-zinc-900 border border-white/5 p-8 rounded-[3rem] flex flex-col relative group">
                       <div className="absolute top-6 right-6 flex gap-2">
                          <button onClick={() => { setNewsForm(item); setShowNewsModal(true); }} className="p-3 bg-zinc-950 rounded-xl text-zinc-600 hover:text-yellow-500 transition-all"><Edit3 size={14}/></button>
                          <button onClick={() => deleteNews(item.id)} className="p-3 bg-zinc-950 rounded-xl text-zinc-600 hover:text-red-500 transition-all"><Trash2 size={14}/></button>
                       </div>
                       <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-4">{item.category} • {item.date}</span>
                       <h4 className="text-xl font-black text-white oswald uppercase italic leading-tight mb-4 pr-12">{item.title}</h4>
                       <p className="text-zinc-500 text-xs line-clamp-3 mb-6 flex-grow">{item.content}</p>
                       <div className="flex items-center gap-2 text-[9px] font-black text-zinc-700 uppercase">
                          <User size={10} /> Autor: {item.author}
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* TAB: STAFF */}
          {activeTab === 'staff' && (
            <div className="space-y-10 animate-in fade-in">
               <div className="flex justify-between items-end border-b border-white/5 pb-10">
                  <div>
                    <h3 className="text-4xl font-black oswald uppercase text-white">Oficiales <span className="text-blue-500">Staff</span></h3>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-2">Gestión de accesos y credenciales administrativas</p>
                  </div>
                  <button onClick={() => { setStaffForm({ username: '', name: '', role: 'Comisario Deportivo', password: '' }); setShowStaffModal(true); }} className="bg-blue-600 text-white px-10 py-5 rounded-[2.5rem] font-black uppercase text-[10px] flex items-center gap-3">
                    Autorizar Oficial <UserPlus size={20} />
                  </button>
               </div>
               <div className="glass-panel rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
                  <table className="w-full text-left">
                     <thead className="bg-black/40 text-[8px] font-black uppercase text-zinc-700 border-b border-white/5">
                        <tr><th className="px-10 py-5">Nombre / Oficial</th><th className="px-10 py-5">Identidad</th><th className="px-10 py-5">Rango</th><th className="px-10 py-5 text-right pr-10">Acciones</th></tr>
                     </thead>
                     <tbody className="divide-y divide-white/[0.03]">
                        {adminUsers.map(u => (
                          <tr key={u.id} className="hover:bg-blue-600/[0.02] group">
                             <td className="px-10 py-6 flex items-center gap-6"><div className="w-12 h-12 bg-zinc-950 border border-white/5 rounded-2xl flex items-center justify-center text-blue-500 shadow-xl"><User size={20} /></div><span className="text-white font-black text-xs uppercase">{u.name}</span></td>
                             <td className="px-10 py-6 font-mono text-[10px] text-zinc-600">@{u.username}</td>
                             <td className="px-10 py-6"><span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg border ${u.role === 'SuperAdmin' ? 'bg-red-600/10 text-red-500 border-red-600/20' : 'bg-blue-600/10 text-blue-500 border-blue-600/20'}`}>{u.role}</span></td>
                             <td className="px-10 py-6 text-right pr-10"><div className="flex justify-end gap-3"><button onClick={() => { setStaffForm(u); setShowStaffModal(true); }} className="p-3 bg-zinc-950 rounded-xl text-zinc-600 hover:text-yellow-500 transition-all"><Edit3 size={14}/></button><button onClick={() => deleteStaff(u.id)} className="p-3 bg-zinc-950 rounded-xl text-zinc-600 hover:text-red-500 transition-all"><Trash2 size={14}/></button></div></td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {/* TAB: AUDITORÍA */}
          {activeTab === 'auditoría' && (
            <div className="space-y-8 animate-in fade-in">
               <div className="glass-panel p-8 rounded-[3rem] border border-white/5">
                  <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-10">
                     <div>
                        <h3 className="text-4xl font-black oswald uppercase text-white">Terminal de <span className="text-blue-500">Control</span></h3>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">Bitácora de integridad del sistema KDO</p>
                     </div>
                     <button onClick={async () => { setIsAnalyzing(true); setAuditAnalysis(await aiService.analyzeAuditLogs(logs)); setIsAnalyzing(false); }} disabled={isAnalyzing} className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-[10px] flex items-center gap-4 shadow-2xl">
                        {isAnalyzing ? <Loader2 className="animate-spin" /> : <Sparkles />} Análisis IA
                     </button>
                  </div>
                  {auditAnalysis && (
                    <div className="bg-blue-500/10 border border-blue-500/20 p-8 rounded-[2rem] mb-10 animate-in slide-in-from-top-4">
                       <p className="text-zinc-200 text-sm italic leading-relaxed">"{auditAnalysis}"</p>
                    </div>
                  )}
                  <div className="bg-black/60 border border-white/5 rounded-[2rem] overflow-hidden">
                    <table className="w-full text-left">
                       <thead className="bg-zinc-950/80 text-[10px] font-black uppercase text-zinc-700 border-b border-white/5">
                          <tr><th className="px-10 py-6">Timestamp</th><th className="px-10 py-6">Oficial</th><th className="px-10 py-6">Acción</th><th className="px-10 py-6 text-right pr-10">ID</th></tr>
                       </thead>
                       <tbody className="divide-y divide-white/[0.03]">
                          {logs.map(log => (
                            <tr key={log.id} className="hover:bg-white/[0.02]">
                               <td className="px-10 py-7 text-[11px] font-bold text-zinc-500">{new Date(log.timestamp).toLocaleString('es-AR')}</td>
                               <td className="px-10 py-7 font-black uppercase text-white">@{log.admin}</td>
                               <td className="px-10 py-7 text-zinc-300 font-bold uppercase text-[10px]">{log.action}: {log.details}</td>
                               <td className="px-10 py-7 text-right pr-10 font-mono text-[9px] text-zinc-700">{log.id}</td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
               </div>
            </div>
          )}

          {/* TAB: AJUSTES */}
          {activeTab === 'ajustes' && (
            <div className="space-y-8 animate-in fade-in">
               <div className="glass-panel p-10 rounded-[3rem] border border-white/5 max-w-4xl mx-auto">
                  <h3 className="text-2xl font-black oswald uppercase text-white mb-10 italic">Configuración <span className="text-blue-500">Global</span></h3>
                  <div className="space-y-8">
                     <div>
                        <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-3 ml-1">Mensaje Ticker Paddock (Marquee)</label>
                        <input type="text" value={settings.paddockTicker} onChange={e => setSettings({...settings, paddockTicker: e.target.value})} className="w-full bg-black border border-white/5 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:border-blue-600" />
                     </div>
                     <div className="grid grid-cols-2 gap-8">
                        <div className="p-8 bg-black/40 rounded-3xl border border-white/5">
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Inscripciones Abiertas</span>
                              <button onClick={() => setSettings({...settings, registrationsOpen: !settings.registrationsOpen})} className={`w-14 h-8 rounded-full transition-all relative ${settings.registrationsOpen ? 'bg-blue-600' : 'bg-zinc-800'}`}>
                                 <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.registrationsOpen ? 'right-1' : 'left-1'}`}></div>
                              </button>
                           </div>
                        </div>
                        <div className="p-8 bg-black/40 rounded-3xl border border-white/5">
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Modo Mantenimiento</span>
                              <button onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})} className={`w-14 h-8 rounded-full transition-all relative ${settings.maintenanceMode ? 'bg-red-600' : 'bg-zinc-800'}`}>
                                 <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'right-1' : 'left-1'}`}></div>
                              </button>
                           </div>
                        </div>
                     </div>
                     <div>
                        <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-3 ml-1">URL Live Timing Externo</label>
                        <input type="text" value={settings.liveTimingUrl} onChange={e => setSettings({...settings, liveTimingUrl: e.target.value})} placeholder="https://..." className="w-full bg-black border border-white/5 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:border-blue-600" />
                     </div>
                     <button onClick={saveSystemSettings} className="w-full bg-blue-600 hover:bg-white text-white hover:text-black font-black uppercase py-6 rounded-3xl shadow-2xl transition-all oswald italic text-xl">Sincronizar Sistemas</button>
                  </div>
               </div>
            </div>
          )}

        </div>
      </main>

      {/* MODAL CAMPEONATOS */}
      {showChampModal && (
        <div className="fixed inset-0 z-[400] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6">
           <div className="bg-zinc-900 border border-white/10 w-full max-w-2xl p-14 rounded-[4rem] shadow-2xl relative animate-in zoom-in-95">
              <button onClick={() => setShowChampModal(false)} className="absolute top-10 right-10 text-zinc-500 hover:text-white bg-zinc-950 p-2 rounded-full transition-all"><XCircle size={32} /></button>
              <div className="flex items-center gap-5 mb-10">
                 <div className="bg-blue-600 p-4 rounded-3xl"><Trophy size={28} className="text-white" /></div>
                 <h2 className="text-4xl font-black oswald uppercase text-white italic tracking-tighter">Gestionar <span className="text-blue-500">Temporada</span></h2>
              </div>
              <div className="space-y-6">
                 <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3">
                       <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-2 mb-2 block">Nombre del Campeonato</label>
                       <input type="text" value={champForm.name} onChange={e => setChampForm({...champForm, name: e.target.value})} className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-6 text-white font-black uppercase outline-none focus:border-blue-600" />
                    </div>
                    <div>
                       <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-2 mb-2 block">Año</label>
                       <input type="number" value={champForm.year} onChange={e => setChampForm({...champForm, year: Number(e.target.value)})} className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-6 text-white font-black outline-none focus:border-blue-600" />
                    </div>
                 </div>
                 <button onClick={saveChampionship} className="w-full bg-blue-600 hover:bg-white text-white hover:text-black font-black uppercase py-6 rounded-3xl shadow-2xl transition-all oswald italic text-lg tracking-widest">Sincronizar Campeonato</button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL EVENTOS */}
      {showEventModal && (
        <div className="fixed inset-0 z-[400] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6">
           <div className="bg-zinc-900 border border-white/10 w-full max-w-xl p-14 rounded-[4rem] shadow-2xl relative animate-in zoom-in-95">
              <button onClick={() => setShowEventModal(false)} className="absolute top-10 right-10 text-zinc-500 hover:text-white bg-zinc-950 p-2 rounded-full transition-all"><XCircle size={32} /></button>
              <div className="flex items-center gap-5 mb-10">
                 <div className="bg-blue-600 p-4 rounded-3xl"><Calendar size={28} className="text-white" /></div>
                 <h2 className="text-4xl font-black oswald uppercase text-white italic tracking-tighter">{eventForm.id ? 'Editar' : 'Programar'} <span className="text-blue-500">Fecha</span></h2>
              </div>
              <div className="space-y-6">
                 {eventErrors.map((err, i) => <p key={i} className="text-red-500 text-[10px] font-black uppercase flex items-center gap-2"><AlertCircle size={14}/> {err}</p>)}
                 <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3">
                       <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2 block">Gran Premio</label>
                       <input type="text" value={eventForm.name} onChange={e => setEventForm({...eventForm, name: e.target.value})} className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-6 text-white font-black uppercase outline-none focus:border-blue-600" placeholder="GP Coronación" />
                    </div>
                    <div>
                       <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2 block">Round</label>
                       <input type="number" value={eventForm.round} onChange={e => setEventForm({...eventForm, round: Number(e.target.value)})} className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-6 text-white font-black outline-none focus:border-blue-600" />
                    </div>
                 </div>
                 <button onClick={saveEvent} className="w-full bg-blue-600 hover:bg-white text-white hover:text-black font-black uppercase py-6 rounded-3xl shadow-2xl transition-all oswald italic text-lg tracking-widest">Confirmar Calendario</button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL STAFF */}
      {showStaffModal && (
        <div className="fixed inset-0 z-[400] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6">
           <div className="bg-zinc-900 border border-white/10 w-full max-w-lg p-14 rounded-[4rem] shadow-2xl relative animate-in zoom-in-95">
              <button onClick={() => setShowStaffModal(false)} className="absolute top-10 right-10 text-zinc-500 hover:text-white bg-zinc-950 p-2 rounded-full transition-all"><XCircle size={32} /></button>
              <div className="flex items-center gap-5 mb-10">
                 <div className="bg-blue-600 p-4 rounded-3xl"><UserCog size={28} className="text-white" /></div>
                 <h2 className="text-4xl font-black oswald uppercase text-white italic tracking-tighter">Oficial <span className="text-blue-500">Staff</span></h2>
              </div>
              <div className="space-y-6">
                 <input type="text" value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} placeholder="NOMBRE COMPLETO" className="w-full bg-black border border-white/5 rounded-2xl py-4 px-6 text-white font-black uppercase outline-none focus:border-blue-600" />
                 <div className="grid grid-cols-2 gap-4">
                    <input type="text" value={staffForm.username} onChange={e => setStaffForm({...staffForm, username: e.target.value})} placeholder="USUARIO" className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-6 text-white font-black uppercase outline-none" />
                    <input type="password" value={staffForm.password} onChange={e => setStaffForm({...staffForm, password: e.target.value})} placeholder="PASSWORD" className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-6 text-white font-black outline-none" />
                 </div>
                 <select value={staffForm.role} onChange={e => setStaffForm({...staffForm, role: e.target.value as UserRole})} className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-6 text-white font-black outline-none">
                    <option value="SuperAdmin">SuperAdmin</option>
                    <option value="Comisario Deportivo">Comisario Deportivo</option>
                    <option value="Escrutador Técnico">Escrutador Técnico</option>
                    <option value="Secretario">Secretario</option>
                 </select>
                 <button onClick={saveStaff} className="w-full bg-blue-600 hover:bg-white text-white hover:text-black font-black uppercase py-6 rounded-3xl shadow-2xl transition-all oswald italic text-lg">Autorizar Oficial</button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL NOTICIAS */}
      {showNewsModal && (
        <div className="fixed inset-0 z-[400] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6">
           <div className="bg-zinc-900 border border-white/10 w-full max-w-2xl p-14 rounded-[4rem] shadow-2xl relative animate-in zoom-in-95">
              <button onClick={() => setShowNewsModal(false)} className="absolute top-10 right-10 text-zinc-500 hover:text-white bg-zinc-950 p-2 rounded-full transition-all"><XCircle size={32} /></button>
              <div className="flex items-center gap-5 mb-10">
                 <div className="bg-blue-600 p-4 rounded-3xl"><Newspaper size={28} className="text-white" /></div>
                 <h2 className="text-4xl font-black oswald uppercase text-white italic tracking-tighter">Prensa <span className="text-blue-500">KDO</span></h2>
              </div>
              <div className="space-y-6">
                 <input type="text" value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})} placeholder="TITULAR DEL COMUNICADO" className="w-full bg-black border border-white/5 rounded-2xl py-4 px-6 text-white font-black uppercase outline-none focus:border-blue-600" />
                 <textarea value={newsForm.content} onChange={e => setNewsForm({...newsForm, content: e.target.value})} placeholder="CONTENIDO OFICIAL..." className="w-full h-40 bg-black border border-white/5 rounded-2xl py-4 px-6 text-white font-medium outline-none focus:border-blue-600 resize-none" />
                 <select value={newsForm.category} onChange={e => setNewsForm({...newsForm, category: e.target.value as any})} className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-6 text-white font-black uppercase outline-none">
                    <option value="Oficial">Oficial</option>
                    <option value="Prensa">Prensa</option>
                    <option value="Urgente">Urgente</option>
                 </select>
                 <button onClick={saveNews} className="w-full bg-blue-600 hover:bg-white text-white hover:text-black font-black uppercase py-6 rounded-3xl shadow-2xl transition-all oswald italic text-lg">Publicar Comunicado</button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL REGLAMENTOS */}
      {showRegModal && (
        <div className="fixed inset-0 z-[400] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6">
           <div className="bg-zinc-900 border border-white/10 w-full max-w-xl p-14 rounded-[4rem] shadow-2xl relative animate-in zoom-in-95">
              <button onClick={() => setShowRegModal(false)} className="absolute top-10 right-10 text-zinc-500 hover:text-white bg-zinc-950 p-2 rounded-full transition-all"><XCircle size={32} /></button>
              <div className="flex items-center gap-5 mb-10">
                 <div className="bg-blue-600 p-4 rounded-3xl"><FileDown size={28} className="text-white" /></div>
                 <h2 className="text-4xl font-black oswald uppercase text-white italic tracking-tighter">Repositorio <span className="text-blue-500">PDF</span></h2>
              </div>
              <div className="space-y-6">
                 <input type="text" value={editingReg.title} onChange={e => setEditingReg({...editingReg, title: e.target.value})} placeholder="TÍTULO DEL DOCUMENTO" className="w-full bg-black border border-white/5 rounded-2xl py-4 px-6 text-white font-black uppercase outline-none focus:border-blue-600" />
                 <div className="grid grid-cols-2 gap-4">
                    <select value={editingReg.category} onChange={e => setEditingReg({...editingReg, category: e.target.value as any})} className="bg-black/60 border border-white/5 rounded-2xl py-4 px-6 text-white font-black uppercase outline-none">
                       <option value="Técnico">Técnico</option>
                       <option value="Deportivo">Deportivo</option>
                       <option value="Calendario">Calendario</option>
                    </select>
                    <input type="text" value={editingReg.version} onChange={e => setEditingReg({...editingReg, version: e.target.value})} placeholder="VERSIÓN" className="bg-black/60 border border-white/5 rounded-2xl py-4 px-6 text-white font-black outline-none" />
                 </div>
                 <div className="p-8 border-2 border-dashed border-white/5 rounded-[2rem] text-center group hover:border-blue-500 transition-all cursor-pointer relative">
                    <input type="file" onChange={handleFileUpload} accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
                    <Upload className="mx-auto mb-4 text-zinc-700 group-hover:text-blue-500" />
                    <p className="text-[10px] font-black uppercase text-zinc-600">{regFile ? "Archivo cargado OK" : "Subir archivo PDF"}</p>
                 </div>
                 <button onClick={saveReg} className="w-full bg-blue-600 hover:bg-white text-white hover:text-black font-black uppercase py-6 rounded-3xl shadow-2xl transition-all oswald italic text-lg">Publicar Documento</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
