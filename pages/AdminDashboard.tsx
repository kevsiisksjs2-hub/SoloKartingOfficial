
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { Pilot, Category, Regulation, Status, RegulationCategory, Championship, Circuit } from '../types';
import { 
  Users, LogOut, Trash2, X,
  Search, Settings, FileText, 
  Plus, Upload, FilePlus, HardDrive,
  Download, Trophy, FileDown, Filter,
  Radio, Activity, AlertTriangle, Save,
  Calendar, MapPin, Image as ImageIcon,
  ShieldAlert, LayoutGrid, Ruler, Edit2
} from 'lucide-react';
import { generatePilotsPDF, generateChampionshipPDF } from '../utils/pdfGenerator';

type Tab = 'inscriptos' | 'reglamentos' | 'campeonatos' | 'circuitos' | 'ajustes';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('inscriptos');
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  // Estados para ajustes del sistema
  const [streamingUrl, setStreamingUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  // Modales
  const [showRegModal, setShowRegModal] = useState(false);
  const [newReg, setNewReg] = useState({ 
    title: '', 
    description: '', 
    category: 'Técnico' as RegulationCategory, 
    fileData: '', 
    fileName: '' 
  });
  
  const [showChampModal, setShowChampModal] = useState(false);
  const [newChamp, setNewChamp] = useState({ 
    name: '', 
    status: 'En curso', 
    dates: '', 
    tracks: '', 
    image: '' 
  });

  const [showCircuitModal, setShowCircuitModal] = useState(false);
  const [editingCircuitId, setEditingCircuitId] = useState<string | null>(null);
  const [newCircuit, setNewCircuit] = useState({
    name: '',
    location: '',
    length: '',
    description: '',
    image: '',
    features: '' // string separado por comas para facilitar input
  });

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean, 
    type: 'pilot' | 'champ' | 'reg' | 'cat' | 'circuit', 
    data: any
  }>({ show: false, type: 'pilot', data: null });

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
    setChampionships(storageService.getChampionships());
    setCircuits(storageService.getCircuits());
    setStreamingUrl(storageService.getStreamingUrl());
    setLiveUrl(storageService.getLiveUrl());
  };

  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusChange = (id: string, newStatus: Status) => {
    const updated = pilots.map(p => p.id === id ? { ...p, status: newStatus } : p);
    storageService.savePilots(updated);
    setPilots(updated);
    notify(`Estado actualizado a: ${newStatus}`);
  };

  const openDeleteConfirmation = (type: 'pilot' | 'champ' | 'reg' | 'cat' | 'circuit', data: any) => {
    setDeleteConfirmation({ show: true, type, data });
  };

  const confirmDeletion = () => {
    if (!deleteConfirmation.data) return;

    if (deleteConfirmation.type === 'pilot') {
      const upd = pilots.filter(x => x.id !== deleteConfirmation.data.id);
      storageService.savePilots(upd);
      setPilots(upd);
      notify("PILOTO ELIMINADO", "error");
    } else if (deleteConfirmation.type === 'champ') {
      const upd = championships.filter(x => x.id !== deleteConfirmation.data.id);
      storageService.saveChampionships(upd);
      setChampionships(upd);
      notify("CAMPEONATO ELIMINADO", "error");
    } else if (deleteConfirmation.type === 'reg') {
      const upd = regulations.filter(x => x.id !== deleteConfirmation.data.id);
      storageService.saveRegulations(upd);
      setRegulations(upd);
      notify("REGLAMENTO ELIMINADO", "error");
    } else if (deleteConfirmation.type === 'cat') {
      const upd = categories.filter(c => c !== deleteConfirmation.data);
      storageService.saveCategories(upd);
      setCategories(upd);
      notify("CATEGORÍA ELIMINADA", "error");
    } else if (deleteConfirmation.type === 'circuit') {
      const upd = circuits.filter(x => x.id !== deleteConfirmation.data.id);
      storageService.saveCircuits(upd);
      setCircuits(upd);
      notify("CIRCUITO ELIMINADO", "error");
    }
    
    setDeleteConfirmation({ show: false, type: 'pilot', data: null });
  };

  const handleExportInscriptos = () => {
    const toExport = pilots.filter(p => categoryFilter === 'Todas' || p.category === categoryFilter);
    if (toExport.length === 0) return notify("No hay pilotos registrados", "error");
    generatePilotsPDF(toExport, categoryFilter === 'Todas' ? 'LISTADO GENERAL' : `INSCRIPTOS - ${categoryFilter}`, categoryFilter === 'Todas' ? undefined : categoryFilter);
    notify("Planilla PDF Generada");
  };

  const handleSaveSystemSettings = () => {
    storageService.saveStreamingUrl(streamingUrl);
    storageService.saveLiveUrl(liveUrl);
    notify("Ajustes de sistema actualizados");
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    if (categories.includes(newCategoryName.trim())) {
      notify("La categoría ya existe", "error");
      return;
    }
    const updated = [...categories, newCategoryName.trim()];
    storageService.saveCategories(updated);
    setCategories(updated);
    setNewCategoryName('');
    notify("Categoría añadida con éxito");
  };

  const handleSaveChamp = () => {
    if (!newChamp.name || !newChamp.dates || !newChamp.tracks) {
      notify("Complete los campos requeridos", "error");
      return;
    }
    const champ: Championship = {
      id: Math.random().toString(36).substr(2, 9),
      ...newChamp,
      image: newChamp.image || 'https://images.unsplash.com/photo-1547631618-f29792042761?w=800'
    };
    const updated = [...championships, champ];
    storageService.saveChampionships(updated);
    setChampionships(updated);
    setShowChampModal(false);
    setNewChamp({ name: '', status: 'En curso', dates: '', tracks: '', image: '' });
    notify("Campeonato registrado");
  };

  const handleSaveCircuit = () => {
    if (!newCircuit.name || !newCircuit.location || !newCircuit.length) {
      notify("Complete los campos requeridos", "error");
      return;
    }
    
    const circuitData: Circuit = {
      id: editingCircuitId || Math.random().toString(36).substr(2, 9),
      name: newCircuit.name,
      location: newCircuit.location,
      length: newCircuit.length,
      description: newCircuit.description,
      image: newCircuit.image || 'https://images.unsplash.com/photo-1547631618-f29792042761?w=800',
      features: newCircuit.features.split(',').map(f => f.trim()).filter(f => f !== '')
    };

    let updated: Circuit[];
    if (editingCircuitId) {
      updated = circuits.map(c => c.id === editingCircuitId ? circuitData : c);
    } else {
      updated = [...circuits, circuitData];
    }

    storageService.saveCircuits(updated);
    setCircuits(updated);
    setShowCircuitModal(false);
    setEditingCircuitId(null);
    setNewCircuit({ name: '', location: '', length: '', description: '', image: '', features: '' });
    notify(editingCircuitId ? "Circuito actualizado" : "Circuito registrado");
  };

  const openEditCircuit = (c: Circuit) => {
    setEditingCircuitId(c.id);
    setNewCircuit({
      name: c.name,
      location: c.location,
      length: c.length,
      description: c.description,
      image: c.image,
      features: c.features.join(', ')
    });
    setShowCircuitModal(true);
  };

  const handleSaveRegulation = () => {
    if (!newReg.title || !newReg.fileData) {
      notify("Título y archivo PDF son obligatorios", "error");
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
    notify("Normativa publicada");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNewReg({ ...newReg, fileData: reader.result as string, fileName: file.name });
    };
    reader.readAsDataURL(file);
  };

  const filteredPilots = pilots.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.number.includes(searchTerm);
    const matchesCategory = categoryFilter === 'Todas' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-400 font-sans overflow-hidden">
      {/* Sistema de Notificaciones */}
      {toast && (
        <div className={`fixed top-8 right-8 px-8 py-4 rounded-2xl z-[500] font-black oswald flex items-center gap-3 shadow-2xl animate-in slide-in-from-right-8 duration-300 ${toast.type === 'success' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.msg.toUpperCase()}
        </div>
      )}
      
      {/* Sidebar de Navegación */}
      <aside className="w-80 bg-[#0a0a0a] border-r border-zinc-900 flex flex-col shrink-0">
        <div className="p-8 border-b border-zinc-900">
          <div className="bg-blue-600 px-4 py-3 rounded-xl italic font-black text-white text-2xl oswald mb-2 text-center shadow-xl shadow-blue-600/10">
            ADMIN <span className="text-black bg-white px-2 rounded-sm text-sm ml-1">PKN</span>
          </div>
          <p className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.3em] text-center mt-3">Sistema de Gestión Oficial</p>
        </div>

        <nav className="flex-grow p-6 space-y-3">
          {[
            { id: 'inscriptos', icon: Users, label: 'Inscriptos' },
            { id: 'reglamentos', icon: FileText, label: 'Reglamentos' },
            { id: 'campeonatos', icon: Trophy, label: 'Campeonatos' },
            { id: 'circuitos', icon: MapPin, label: 'Circuitos' },
            { id: 'ajustes', icon: Settings, label: 'Sistema' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)} 
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/20' : 'hover:bg-zinc-900 text-zinc-500 hover:text-white'}`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-zinc-900">
          <button 
            onClick={() => { storageService.setAuth(null); navigate('/AdminKDO'); }} 
            className="w-full flex items-center justify-center gap-3 bg-zinc-900 text-zinc-500 hover:text-white px-4 py-4 rounded-xl text-[10px] font-black uppercase transition-all"
          >
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="flex-grow flex flex-col bg-black overflow-hidden relative">
        <header className="h-28 border-b border-zinc-900 flex items-center justify-between px-12 bg-zinc-950/50 backdrop-blur-2xl shrink-0">
          <div className="flex items-center gap-4">
             <div className="h-12 w-1.5 bg-blue-600 rounded-full"></div>
             <h2 className="text-4xl font-black oswald uppercase text-white italic tracking-tighter">
                {activeTab === 'inscriptos' ? 'Control de Pilotos' : 
                 activeTab === 'reglamentos' ? 'Normativas y Leyes' : 
                 activeTab === 'campeonatos' ? 'Gestión de Temporadas' : 
                 activeTab === 'circuitos' ? 'Trazados de Pista' :
                 'Ajustes del Sistema'}
             </h2>
          </div>
        </header>

        <div className="flex-grow overflow-auto p-12 custom-scrollbar">
          
          {/* SECCIÓN PILOTOS */}
          {activeTab === 'inscriptos' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col xl:flex-row gap-6 justify-between items-center">
                 <div className="flex gap-4 w-full xl:w-auto">
                    <div className="relative flex-grow xl:w-80">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                       <input 
                         type="text" 
                         placeholder="BUSCAR POR NOMBRE O #..." 
                         value={searchTerm} 
                         onChange={e => setSearchTerm(e.target.value)} 
                         className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white text-xs font-bold outline-none focus:border-blue-600 transition-all uppercase" 
                       />
                    </div>
                    <div className="relative w-full xl:w-64">
                       <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                       <select 
                         value={categoryFilter} 
                         onChange={(e) => setCategoryFilter(e.target.value)} 
                         className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-white text-xs font-black outline-none transition-all uppercase appearance-none cursor-pointer"
                       >
                          <option value="Todas">Todas las Categorías</option>
                          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                       </select>
                    </div>
                 </div>
                 
                 <div className="flex gap-4 w-full xl:w-auto">
                    <button 
                      onClick={handleExportInscriptos} 
                      className="flex-grow bg-zinc-900 text-white border border-zinc-800 px-8 py-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-xl"
                    >
                       <FileDown size={18} /> Exportar Planilla
                    </button>
                    <button 
                      onClick={() => navigate('/AdminKDO/nuevo-piloto')} 
                      className="flex-grow bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/20 hover:bg-blue-700 transition-all"
                    >
                       <Plus size={18} /> Nuevo Piloto
                    </button>
                 </div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                  <thead className="bg-zinc-950 text-[10px] font-black uppercase text-zinc-500 border-b border-zinc-800 tracking-[0.2em]">
                    <tr>
                      <th className="px-10 py-6">Dorsal</th>
                      <th className="px-10 py-6">Piloto</th>
                      <th className="px-10 py-6">Categoría</th>
                      <th className="px-10 py-6">Estado</th>
                      <th className="px-10 py-6 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {filteredPilots.map(p => (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-all group">
                        <td className="px-10 py-6 font-black text-blue-600 oswald italic text-3xl">#{p.number}</td>
                        <td className="px-10 py-6">
                           <p className="font-black text-white uppercase text-sm tracking-tight">{p.name}</p>
                           <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{p.association || 'PILOTO FEDERADO'}</p>
                        </td>
                        <td className="px-10 py-6">
                           <span className="text-[10px] text-zinc-400 font-black uppercase border border-zinc-800 px-3 py-1.5 rounded-xl">{p.category}</span>
                        </td>
                        <td className="px-10 py-6">
                           <select 
                             value={p.status} 
                             onChange={(e) => handleStatusChange(p.id, e.target.value as Status)} 
                             className={`text-[9px] font-black uppercase px-4 py-2 rounded-xl border outline-none cursor-pointer transition-all ${p.status === Status.CONFIRMADO ? 'bg-emerald-600/10 text-emerald-500 border-emerald-500/20' : 'bg-yellow-600/10 text-yellow-500 border-yellow-500/20'}`}
                           >
                              <option value={Status.CONFIRMADO}>Confirmado</option>
                              <option value={Status.PENDIENTE}>Pendiente</option>
                              <option value={Status.BAJA}>De Baja</option>
                           </select>
                        </td>
                        <td className="px-10 py-6 text-right">
                           <button 
                             onClick={() => openDeleteConfirmation('pilot', p)} 
                             className="p-4 text-zinc-800 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                             title="Eliminar permanentemente"
                           >
                             <Trash2 size={18} />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECCIÓN REGLAMENTOS */}
          {activeTab === 'reglamentos' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <h3 className="text-xl font-black oswald uppercase text-white tracking-widest">Base Normativa</h3>
                    <p className="text-[10px] font-black uppercase text-zinc-600 mt-1 tracking-widest">{regulations.length} Documentos en línea</p>
                  </div>
                  <button onClick={() => setShowRegModal(true)} className="w-full md:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-[11px] flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/20">
                     <FilePlus size={20} /> Publicar Nueva Ley
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {regulations.map(reg => (
                    <div key={reg.id} className="bg-zinc-900 border border-zinc-800 p-10 rounded-[3rem] flex flex-col h-full hover:border-blue-600 transition-all relative group shadow-2xl">
                       <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                          <FileText size={100} />
                       </div>
                       <div className="flex justify-between items-start mb-8">
                          <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${reg.category === 'Técnico' ? 'bg-red-600/10 text-red-500 border-red-500/20' : 'bg-blue-600/10 text-blue-500 border-blue-500/20'}`}>
                             {reg.category}
                          </span>
                          <button onClick={() => openDeleteConfirmation('reg', reg)} className="text-zinc-800 hover:text-red-500 transition-colors">
                             <Trash2 size={20} />
                          </button>
                       </div>
                       <h4 className="text-2xl font-black text-white uppercase oswald italic mb-6 leading-tight flex-grow tracking-tighter">
                          {reg.title}
                       </h4>
                       <div className="pt-8 border-t border-zinc-800 flex justify-between items-center">
                          <div className="flex flex-col gap-1">
                             <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{reg.date}</span>
                             <span className="text-[8px] font-bold text-zinc-700 uppercase">{reg.fileSize}</span>
                          </div>
                          <a href={reg.fileData} download={reg.fileName} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-blue-500 hover:bg-blue-600 hover:text-white transition-all shadow-lg">
                             <Download size={20} />
                          </a>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* SECCIÓN CAMPEONATOS */}
          {activeTab === 'campeonatos' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <h3 className="text-xl font-black oswald uppercase text-white tracking-widest">Torneos y Temporadas</h3>
                    <p className="text-[10px] font-black uppercase text-zinc-600 mt-1 tracking-widest">Gestión de eventos oficiales PKN</p>
                  </div>
                  <button onClick={() => setShowChampModal(true)} className="w-full md:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-[11px] flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/20">
                     <Plus size={20} /> Crear Campeonato
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {championships.map(ch => (
                    <div key={ch.id} className="bg-zinc-900 border border-zinc-800 rounded-[3rem] overflow-hidden flex flex-col hover:border-blue-600 transition-all group shadow-2xl relative">
                       <div className="h-56 relative overflow-hidden">
                          <img src={ch.image} alt={ch.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100 grayscale-[50%] group-hover:grayscale-0" />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                          <div className="absolute top-6 right-6 flex gap-2">
                             <button onClick={() => openDeleteConfirmation('champ', ch)} className="p-3 bg-black/80 backdrop-blur-xl hover:bg-red-600 text-white rounded-2xl transition-all shadow-2xl border border-white/5"><Trash2 size={18}/></button>
                          </div>
                          <div className="absolute bottom-6 left-8"><span className={`text-[8px] font-black uppercase px-3 py-1 rounded-lg border backdrop-blur-md ${ch.status === 'En curso' ? 'bg-emerald-600/20 text-emerald-400 border-emerald-400/30' : 'bg-blue-600/20 text-blue-400 border-blue-400/30'}`}>{ch.status}</span></div>
                       </div>
                       <div className="p-10 flex-grow flex flex-col">
                          <h4 className="text-2xl font-black oswald uppercase text-white italic tracking-tighter mb-6 group-hover:text-blue-500 transition-colors">{ch.name}</h4>
                          <div className="mt-auto space-y-3">
                             <div className="flex items-center gap-3 text-zinc-500 text-[10px] font-black uppercase tracking-widest"><Calendar size={16} className="text-blue-600" /> {ch.dates}</div>
                             <div className="flex items-center gap-3 text-zinc-500 text-[10px] font-black uppercase tracking-widest"><MapPin size={16} className="text-blue-600" /> {ch.tracks}</div>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* SECCIÓN CIRCUITOS */}
          {activeTab === 'circuitos' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <h3 className="text-xl font-black oswald uppercase text-white tracking-widest">Gestión de Circuitos</h3>
                    <p className="text-[10px] font-black uppercase text-zinc-600 mt-1 tracking-widest">{circuits.length} Trazados habilitados</p>
                  </div>
                  <button onClick={() => { setEditingCircuitId(null); setNewCircuit({name:'', location:'', length:'', description:'', image:'', features:''}); setShowCircuitModal(true); }} className="w-full md:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-[11px] flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/20">
                     <Plus size={20} /> Añadir Circuito
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {circuits.map(c => (
                    <div key={c.id} className="bg-zinc-900 border border-zinc-800 rounded-[3rem] overflow-hidden flex flex-col hover:border-blue-600 transition-all group shadow-2xl relative">
                       <div className="h-56 relative overflow-hidden">
                          <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100 grayscale-[50%] group-hover:grayscale-0" />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                          <div className="absolute top-6 right-6 flex gap-2">
                             <button onClick={() => openEditCircuit(c)} className="p-3 bg-black/80 backdrop-blur-xl hover:bg-blue-600 text-white rounded-2xl transition-all shadow-2xl border border-white/5"><Edit2 size={18}/></button>
                             <button onClick={() => openDeleteConfirmation('circuit', c)} className="p-3 bg-black/80 backdrop-blur-xl hover:bg-red-600 text-white rounded-2xl transition-all shadow-2xl border border-white/5"><Trash2 size={18}/></button>
                          </div>
                          <div className="absolute bottom-6 left-8"><span className="text-[8px] font-black uppercase px-3 py-1 rounded-lg border backdrop-blur-md bg-blue-600/20 text-blue-400 border-blue-400/30">{c.length}</span></div>
                       </div>
                       <div className="p-10 flex-grow flex flex-col">
                          <h4 className="text-2xl font-black oswald uppercase text-white italic tracking-tighter mb-4 group-hover:text-blue-500 transition-colors">{c.name}</h4>
                          <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">
                             <MapPin size={14} className="text-blue-600" /> {c.location}
                          </div>
                          <p className="text-[10px] text-zinc-600 font-bold uppercase line-clamp-2">{c.description}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* SECCIÓN AJUSTES */}
          {activeTab === 'ajustes' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-zinc-900 border border-zinc-800 p-12 rounded-[3.5rem] shadow-2xl space-y-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><LayoutGrid size={150} /></div>
                  <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
                     <Radio className="text-blue-600" size={28} />
                     <h3 className="text-2xl font-black oswald uppercase text-white italic tracking-tighter">Enlaces Multimedia</h3>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Streaming Oficial</label>
                        <div className="relative group"><ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" size={20} /><input type="text" value={streamingUrl} onChange={e => setStreamingUrl(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-5 pl-14 pr-6 text-white text-xs font-bold outline-none focus:border-blue-600 transition-all shadow-inner" /></div>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Live Timing</label>
                        <div className="relative group"><Activity className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" size={20} /><input type="text" value={liveUrl} onChange={e => setLiveUrl(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-5 pl-14 pr-6 text-white text-xs font-bold outline-none focus:border-blue-600 transition-all shadow-inner" /></div>
                     </div>
                  </div>
                  <button onClick={handleSaveSystemSettings} className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-[11px] flex items-center gap-3 shadow-2xl shadow-blue-600/20 hover:bg-blue-700 transition-all transform active:scale-95"><Save size={20} /> Guardar Configuración</button>
               </div>

               <div className="bg-zinc-900 border border-zinc-800 p-12 rounded-[3.5rem] shadow-2xl space-y-10">
                  <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
                     <Users className="text-blue-600" size={28} />
                     <h3 className="text-2xl font-black oswald uppercase text-white italic tracking-tighter">Categorías Registradas</h3>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-6 mb-10">
                     <div className="flex-grow"><input type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-5 px-8 text-white text-sm font-bold outline-none focus:border-blue-600 transition-all shadow-inner uppercase" placeholder="NOMBRE DE LA NUEVA CATEGORÍA" /></div>
                     <button onClick={handleAddCategory} className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-[11px] flex items-center justify-center gap-3 hover:bg-blue-600 hover:text-white transition-all shadow-2xl"><Plus size={20} /> Añadir Categoría</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                     {categories.map(cat => (
                       <div key={cat} className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl text-[11px] font-black text-white uppercase flex justify-between items-center group hover:border-blue-600 transition-all shadow-lg">{cat}<button onClick={() => openDeleteConfirmation('cat', cat)} className="text-zinc-800 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"><Trash2 size={16} /></button></div>
                     ))}
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* --- MODALES --- */}

      {/* MODAL CIRCUITO */}
      {showCircuitModal && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[600] flex items-center justify-center p-6">
           <div className="bg-zinc-900 w-full max-w-2xl rounded-[4rem] border border-zinc-800 p-12 relative shadow-[0_0_120px_rgba(37,99,235,0.15)] animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <button onClick={() => setShowCircuitModal(false)} className="absolute top-10 right-10 text-zinc-500 hover:text-white bg-zinc-950 p-2 rounded-full transition-all"><X size={24}/></button>
              <div className="flex items-center gap-4 mb-10">
                 <div className="bg-blue-600 p-4 rounded-3xl shadow-2xl"><MapPin className="text-white" size={32} /></div>
                 <h3 className="text-4xl font-black oswald text-white uppercase italic tracking-tighter">{editingCircuitId ? 'Editar Circuito' : 'Nuevo Circuito'}</h3>
              </div>
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 block ml-2">Nombre del Circuito</label>
                    <input type="text" value={newCircuit.name} onChange={e => setNewCircuit({...newCircuit, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-3xl py-5 px-8 text-white text-sm font-bold uppercase outline-none focus:border-blue-600" placeholder="EJ: KARTÓDROMO PKN CHIVILCOY" />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 block ml-2">Ubicación</label>
                       <input type="text" value={newCircuit.location} onChange={e => setNewCircuit({...newCircuit, location: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-3xl py-5 px-8 text-white text-sm font-bold outline-none focus:border-blue-600" placeholder="EJ: CHIVILCOY, BUENOS AIRES" />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 block ml-2">Extensión (metros)</label>
                       <div className="relative"><Ruler className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700" size={18}/><input type="text" value={newCircuit.length} onChange={e => setNewCircuit({...newCircuit, length: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-3xl py-5 pl-16 pr-8 text-white text-sm font-bold outline-none focus:border-blue-600" placeholder="EJ: 1.100 MTS" /></div>
                    </div>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 block ml-2">Descripción</label>
                    <textarea value={newCircuit.description} onChange={e => setNewCircuit({...newCircuit, description: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-3xl py-5 px-8 text-white text-sm font-bold outline-none focus:border-blue-600 h-32 resize-none" placeholder="RESEÑA DEL CIRCUITO..." />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 block ml-2">Características (Separadas por coma)</label>
                    <input type="text" value={newCircuit.features} onChange={e => setNewCircuit({...newCircuit, features: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-3xl py-5 px-8 text-white text-sm font-bold outline-none focus:border-blue-600" placeholder="EJ: TIERRA COMPACTADA, TRAZADO TÉCNICO, BOXES PKN" />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 block ml-2">URL Imagen</label>
                    <div className="relative"><ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700" size={20}/><input type="text" value={newCircuit.image} onChange={e => setNewCircuit({...newCircuit, image: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-3xl py-5 pl-16 pr-8 text-white text-sm font-bold outline-none focus:border-blue-600" placeholder="https://..." /></div>
                 </div>
                 <button onClick={handleSaveCircuit} className="w-full bg-blue-600 text-white py-7 rounded-[2rem] font-black uppercase oswald tracking-[0.2em] shadow-2xl shadow-blue-600/30 transform active:scale-95 transition-all text-2xl italic mt-6">{editingCircuitId ? 'Actualizar Trazado' : 'Publicar Nuevo Circuito'}</button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL CONFIRMACIÓN ELIMINACIÓN */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[1000] flex items-center justify-center p-6">
           <div className="bg-zinc-900 w-full max-w-md rounded-[3.5rem] border border-red-600/30 p-12 text-center shadow-[0_0_150px_rgba(220,38,38,0.15)] animate-in zoom-in-95 duration-200">
              <div className="bg-red-600/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-600/20 shadow-2xl"><AlertTriangle className="text-red-600" size={56} /></div>
              <h3 className="text-3xl font-black oswald uppercase text-white mb-3 italic tracking-tighter">¿CONFIRMAR ACCIÓN?</h3>
              <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-[0.2em] mb-10 leading-relaxed">ESTÁS A PUNTO DE ELIMINAR "{deleteConfirmation.data?.name || deleteConfirmation.data?.title || deleteConfirmation.data}" DE FORMA <span className="text-red-600 font-black">IRREVERSIBLE</span>.</p>
              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => setDeleteConfirmation({ show: false, type: 'pilot', data: null })} className="bg-zinc-800 text-zinc-400 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:text-white transition-all">Cancelar</button>
                 <button onClick={confirmDeletion} className="bg-red-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-red-600/20 hover:bg-red-700 transition-all transform active:scale-95">Eliminar Ahora</button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL NUEVO REGLAMENTO */}
      {showRegModal && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[600] flex items-center justify-center p-6">
          <div className="bg-zinc-900 w-full max-w-xl rounded-[4rem] border border-zinc-800 p-12 relative shadow-[0_0_120px_rgba(37,99,235,0.15)] animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowRegModal(false)} className="absolute top-10 right-10 text-zinc-500 hover:text-white bg-zinc-950 p-2 rounded-full transition-all"><X size={24}/></button>
            <div className="flex items-center gap-4 mb-10"><div className="bg-blue-600 p-4 rounded-3xl shadow-2xl"><FilePlus className="text-white" size={32} /></div><h3 className="text-4xl font-black oswald text-white uppercase italic tracking-tighter leading-none">Nueva Norma PKN</h3></div>
            <div className="space-y-6">
               <div><label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 block ml-2">Título Oficial</label><input type="text" placeholder="EJ: REGLAMENTO TÉCNICO" value={newReg.title} onChange={e => setNewReg({...newReg, title: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-3xl py-5 px-8 text-white text-sm font-bold uppercase outline-none focus:border-blue-600 transition-all" /></div>
               <div><label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 block ml-2">Categoría</label><select value={newReg.category} onChange={e => setNewReg({...newReg, category: e.target.value as RegulationCategory})} className="w-full bg-zinc-950 border border-zinc-800 rounded-3xl py-5 px-8 text-white text-sm font-bold uppercase outline-none focus:border-blue-600 transition-all cursor-pointer"><option value="Técnico">Técnico</option><option value="Deportivo">Deportivo</option><option value="Anexo">Anexo</option><option value="Calendario">Calendario</option><option value="Institucional">Institucional</option></select></div>
               <label className="block border-4 border-dashed border-zinc-800 rounded-[2.5rem] p-12 text-center cursor-pointer hover:border-blue-600 hover:bg-blue-600/5 transition-all group mt-6"><Upload size={48} className="mx-auto mb-6 text-zinc-800 group-hover:text-blue-600 transition-colors" /><p className="text-[11px] font-black uppercase text-zinc-500 mb-2 group-hover:text-white transition-colors">{newReg.fileName || 'CARGAR ARCHIVO PDF OFICIAL'}</p><input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf" /></label>
               <button onClick={handleSaveRegulation} className="w-full bg-blue-600 text-white py-7 rounded-[2rem] font-black uppercase oswald tracking-[0.2em] shadow-2xl shadow-blue-600/30 transform active:scale-95 transition-all text-2xl italic mt-6">Publicar Normativa</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NUEVO CAMPEONATO */}
      {showChampModal && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[600] flex items-center justify-center p-6">
           <div className="bg-zinc-900 w-full max-w-xl rounded-[4rem] border border-zinc-800 p-12 relative shadow-[0_0_120px_rgba(37,99,235,0.15)] animate-in zoom-in-95 duration-300">
              <button onClick={() => setShowChampModal(false)} className="absolute top-10 right-10 text-zinc-500 hover:text-white bg-zinc-950 p-2 rounded-full transition-all"><X size={24}/></button>
              <div className="flex items-center gap-4 mb-10"><div className="bg-blue-600 p-4 rounded-3xl shadow-2xl"><Trophy className="text-white" size={32} /></div><h3 className="text-4xl font-black oswald text-white uppercase italic tracking-tighter">Nuevo Campeonato</h3></div>
              <div className="space-y-6">
                 <div><label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 block ml-2">Nombre del Torneo</label><input type="text" value={newChamp.name} onChange={e => setNewChamp({...newChamp, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-3xl py-5 px-8 text-white text-sm font-bold uppercase outline-none focus:border-blue-600" /></div>
                 <div className="grid grid-cols-2 gap-6">
                    <div><label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 block ml-2">Fechas</label><input type="text" value={newChamp.dates} onChange={e => setNewChamp({...newChamp, dates: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-3xl py-5 px-8 text-white text-sm font-bold outline-none" /></div>
                    <div><label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 block ml-2">Estado</label><select value={newChamp.status} onChange={e => setNewChamp({...newChamp, status: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-3xl py-5 px-8 text-white text-sm font-bold uppercase"><option value="En curso">En curso</option><option value="Finalizado">Finalizado</option><option value="Próximamente">Próximamente</option></select></div>
                 </div>
                 <div><label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 block ml-2">Circuitos</label><input type="text" value={newChamp.tracks} onChange={e => setNewChamp({...newChamp, tracks: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-3xl py-5 px-8 text-white text-sm font-bold outline-none" /></div>
                 <button onClick={handleSaveChamp} className="w-full bg-blue-600 text-white py-7 rounded-[2rem] font-black uppercase oswald tracking-[0.2em] shadow-2xl shadow-blue-600/30 text-2xl italic mt-6">Publicar Campeonato</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
