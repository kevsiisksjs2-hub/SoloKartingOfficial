
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService, ExtendedSystemSettings } from '../services/storageService';
import { 
  Pilot, AuditLog, TrackFlag, Status, AdminUser
} from '../types';
import { 
  Users, Wrench, Settings, History, LogOut, Trash2, 
  Search, Plus, Flag, XCircle, ShieldCheck, 
  Gavel, UserCheck, IdCard, FileCheck, Calendar, BookOpen, UserCog, ChevronRight, Zap, UserPlus, Activity
} from 'lucide-react';
import { generatePilotCredential } from '../utils/pdfGenerator';

type AdminTab = 'pilotos' | 'tecnica' | 'disciplina' | 'reglamentos' | 'resultados' | 'calendario' | 'pista' | 'usuarios' | 'ajustes' | 'logs';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('pilotos');
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [settings, setSettings] = useState<ExtendedSystemSettings>(storageService.getSettings());
  const [trackFlag, setTrackFlag] = useState<TrackFlag>(storageService.getTrackStatus());
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);

  const LOGO_URL = "https://api.mundopiloto.com.ar/archivos/2/IMAGENES/ASOCIACIONES/logo_asociacion_2025-06-11T201534737Z.jpg";

  useEffect(() => {
    const auth = storageService.getAuth();
    if (!auth) { 
      navigate('/AdminKDO');
      return; 
    }
    setCurrentUser(auth);
    refreshData();
  }, [navigate]);

  const refreshData = () => {
    setPilots(storageService.getPilots());
    setLogs(storageService.getAuditLogs());
    setAdminUsers(storageService.getAdminUsers());
    setSettings(storageService.getSettings());
    setTrackFlag(storageService.getTrackStatus());
  };

  const handleFlagChange = (f: TrackFlag) => {
    storageService.saveTrackStatus(f);
    storageService.addLog('RACE_CONTROL', `Cambio de bandera: ${f}`);
    setTrackFlag(f);
  };

  const handleDeleteUser = (id: string) => {
    if (currentUser?.id === id) return alert("No puedes eliminar tu propio usuario.");
    if (!confirm("¿Eliminar este miembro del staff?")) return;
    const updated = adminUsers.filter(u => u.id !== id);
    storageService.saveAdminUsers(updated);
    storageService.addLog('USERS', `Usuario eliminado ID: ${id}`);
    setAdminUsers(updated);
  };

  const handleLogout = () => {
    storageService.setAuth(null);
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-400 font-sans overflow-hidden">
      {/* SIDEBAR ADMINISTRATIVO REFINADO */}
      <aside className="w-72 bg-black border-r border-white/5 flex flex-col shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-yellow-400/[0.01] pointer-events-none"></div>
        <div className="p-8 border-b border-white/5 flex flex-col items-center relative">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-yellow-400/20 blur-2xl rounded-full scale-110"></div>
            <img src={LOGO_URL} alt="KDO" className="w-16 h-16 rounded-full border-2 border-yellow-400 relative z-10 bg-white object-contain p-1.5" />
          </div>
          <div className="bg-yellow-400 px-4 py-2 rounded-xl italic font-black text-black text-xl oswald w-full text-center shadow-lg transform -skew-x-2">
            ADMIN <span className="text-white bg-black px-1.5 rounded-sm">KDO</span>
          </div>
          {currentUser && (
            <div className="mt-4 flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.2em]">{currentUser.name}</span>
            </div>
          )}
        </div>

        <nav className="flex-grow p-5 space-y-1 overflow-y-auto custom-scrollbar relative">
          {[
            { id: 'pilotos', icon: Users, label: 'Padrón Oficial' },
            { id: 'tecnica', icon: Wrench, label: 'Escrutinio Técnico' },
            { id: 'disciplina', icon: Gavel, label: 'Comisariato' },
            { id: 'reglamentos', icon: BookOpen, label: 'Normativa' },
            { id: 'resultados', icon: FileCheck, label: 'Resultados' },
            { id: 'calendario', icon: Calendar, label: 'Calendario' },
            { id: 'pista', icon: Flag, label: 'Control Pista' },
            { id: 'usuarios', icon: UserCog, label: 'Staff / Usuarios' },
            { id: 'ajustes', icon: Settings, label: 'Configuración' },
            { id: 'logs', icon: History, label: 'Auditoría' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as AdminTab)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all group ${activeTab === tab.id ? 'bg-yellow-400 text-black shadow-xl shadow-yellow-400/20 translate-x-1' : 'hover:bg-white/5 text-zinc-600 hover:text-zinc-200'}`}>
              <tab.icon size={18} className={activeTab === tab.id ? 'text-black' : 'group-hover:text-yellow-400 transition-colors'} /> 
              {tab.label}
              {activeTab === tab.id && <ChevronRight size={14} className="ml-auto opacity-40 animate-in fade-in slide-in-from-left-2" />}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-black/50">
           <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-zinc-900/50 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-lg border border-red-900/10">
             <LogOut size={16} /> Finalizar Sesión
           </button>
        </div>
      </aside>

      <main className="flex-grow flex flex-col overflow-hidden relative">
        {/* SCANLINE EFFECT */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
        
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-black/40 backdrop-blur-3xl shrink-0">
           <div className="flex items-center gap-6">
              <div className="h-10 w-1.5 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.5)]"></div>
              <h2 className="text-3xl font-black oswald uppercase text-white italic tracking-tighter">{activeTab.toUpperCase()}</h2>
           </div>
           
           <div className="flex items-center gap-3 bg-black/60 p-2.5 rounded-2xl border border-white/5 shadow-2xl">
             {[TrackFlag.VERDE, TrackFlag.AMARILLA, TrackFlag.ROJA].map(f => (
               <button 
                 key={f} 
                 onClick={() => handleFlagChange(f)} 
                 className={`w-11 h-11 rounded-xl transition-all flex items-center justify-center shadow-lg ${trackFlag === f ? 'scale-110' : 'opacity-20 grayscale hover:opacity-100 hover:grayscale-0'} ${f === TrackFlag.VERDE ? 'bg-emerald-500' : f === TrackFlag.AMARILLA ? 'bg-yellow-400 text-black' : 'bg-red-600'}`}
                 title={f}
               >
                 <Flag size={20} />
               </button>
             ))}
           </div>
        </header>

        <div className="flex-grow overflow-auto p-10 custom-scrollbar bg-black/20">
          {activeTab === 'pilotos' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
               <div className="flex justify-between items-center gap-6 glass-panel p-6 rounded-[2.5rem]">
                  <div className="relative flex-grow max-w-xl">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    <input 
                      type="text" 
                      placeholder="FILTRAR REGISTRO..." 
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-4.5 pl-14 pr-6 text-white font-bold text-xs outline-none focus:border-yellow-400 uppercase tracking-[0.2em] transition-all" 
                      value={searchTerm} 
                      onChange={e => setSearchTerm(e.target.value)} 
                    />
                  </div>
                  <button onClick={() => navigate('/AdminKDO/nuevo-piloto')} className="bg-yellow-400 text-black px-10 py-4.5 rounded-xl font-black uppercase text-[10px] flex items-center gap-3 hover:bg-white transition-all shadow-xl shadow-yellow-400/10 active:scale-95">
                    <Plus size={18} /> Alta de Piloto
                  </button>
               </div>

               <div className="glass-panel rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
                  <table className="w-full text-left">
                    <thead className="bg-black/80 text-[10px] font-black uppercase text-zinc-600 border-b border-white/5 tracking-[0.3em]">
                       <tr><th className="px-10 py-6">Dorsal</th><th className="px-10 py-6">Piloto</th><th className="px-10 py-6">Categoría</th><th className="px-10 py-6">Status</th><th className="px-10 py-6 text-right">Acción</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                       {pilots.filter(p => p.name.toUpperCase().includes(searchTerm.toUpperCase()) || p.number.includes(searchTerm)).map(p => (
                         <tr key={p.id} className="hover:bg-white/[0.02] group transition-all">
                            <td className="px-10 py-7 font-black oswald text-3xl italic text-yellow-400 tracking-tighter">#{p.number}</td>
                            <td className="px-10 py-7">
                               <p className="text-white font-black text-sm uppercase tracking-tight">{p.name}</p>
                               <p className="text-[9px] text-zinc-700 font-bold uppercase mt-1">Lic: {p.sportsLicense}</p>
                            </td>
                            <td className="px-10 py-7 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{p.category}</td>
                            <td className="px-10 py-7"><span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border tracking-widest ${p.status === Status.CONFIRMADO ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'}`}>{p.status}</span></td>
                            <td className="px-10 py-7 text-right">
                               <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                  <button onClick={() => generatePilotCredential(p)} className="p-3 bg-black/80 border border-white/5 rounded-xl text-zinc-500 hover:text-yellow-400 transition-all hover:scale-110"><IdCard size={18}/></button>
                                  <button className="p-3 bg-black/80 border border-white/5 rounded-xl text-zinc-500 hover:text-red-500 transition-all hover:scale-110"><Trash2 size={18}/></button>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === 'usuarios' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="flex justify-between items-end mb-8">
                  <div>
                    <h3 className="text-3xl font-black oswald uppercase text-white italic tracking-tighter">Equipo de <span className="text-yellow-400">Staff Administrativo</span></h3>
                    <p className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.4em] mt-2">Control de privilegios y accesos de seguridad</p>
                  </div>
                  <button onClick={() => setShowUserModal(true)} className="bg-yellow-400 text-black px-10 py-4.5 rounded-xl font-black uppercase text-[10px] flex items-center gap-3 shadow-xl shadow-yellow-400/10 active:scale-95 transition-all">
                    <UserPlus size={18} /> Nuevo Acceso
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {adminUsers.map(user => (
                    <div key={user.id} className="glass-panel p-10 rounded-[3.5rem] relative group hover:border-yellow-400/50 transition-all shadow-2xl overflow-hidden border border-white/5">
                       <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12 group-hover:opacity-[0.08] transition-all translate-x-4 -translate-y-4"><Zap size={140} /></div>
                       <div className="flex items-center gap-6 mb-10">
                          <div className="bg-black p-5 rounded-[1.5rem] border border-white/10 text-yellow-400 shadow-xl group-hover:scale-110 transition-transform">
                             <UserCheck size={32} />
                          </div>
                          <div>
                             <h4 className="text-white font-black oswald uppercase text-2xl italic tracking-tighter">{user.name}</h4>
                             <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] mt-1">ID: {user.username}</p>
                          </div>
                       </div>
                       <div className="flex items-center justify-between pt-8 border-t border-white/5">
                          <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border ${user.role === 'SuperAdmin' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                             {user.role}
                          </span>
                          <button onClick={() => handleDeleteUser(user.id)} className="p-3 bg-black/50 border border-white/5 rounded-xl text-zinc-700 hover:text-red-500 transition-all hover:bg-red-600/10">
                             <Trash2 size={18} />
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'logs' && (
             <div className="space-y-8 animate-in fade-in duration-500">
                <div className="glass-panel rounded-[3.5rem] overflow-hidden shadow-2xl border border-white/5">
                   <div className="p-10 border-b border-white/5 flex items-center gap-5 bg-black/40">
                      <div className="bg-yellow-400 p-2.5 rounded-xl text-black shadow-lg"><History size={20} /></div>
                      <div>
                        <h3 className="text-xl font-black oswald uppercase text-white italic tracking-widest">Auditoría del Sistema</h3>
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] mt-1">Registro cronológico de operaciones administrativas</p>
                      </div>
                   </div>
                   <div className="divide-y divide-white/[0.03] max-h-[650px] overflow-y-auto custom-scrollbar">
                     {logs.map(log => (
                       <div key={log.id} className="p-8 flex items-center justify-between hover:bg-white/[0.01] transition-colors group">
                          <div className="flex items-center gap-10">
                             <div className="flex flex-col items-center">
                                <span className="text-[11px] font-black text-zinc-400 tabular-nums oswald uppercase">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                <span className="text-[8px] font-mono text-zinc-700 mt-1">{new Date(log.timestamp).toLocaleDateString()}</span>
                             </div>
                             <div className="bg-black/60 px-4 py-2 rounded-xl border border-white/5 group-hover:border-yellow-400/30 transition-colors">
                                <span className="text-[9px] font-black text-yellow-400 uppercase tracking-[0.2em]">{log.admin}</span>
                             </div>
                             <div>
                                <p className="text-white font-black uppercase text-[10px] tracking-tight group-hover:text-yellow-400 transition-colors">{log.action}</p>
                                <p className="text-[9px] text-zinc-600 mt-1.5 uppercase font-medium max-w-lg leading-relaxed">{log.details}</p>
                             </div>
                          </div>
                          <Activity className="text-zinc-800 opacity-20 group-hover:opacity-100 group-hover:text-emerald-500 transition-all" size={20} />
                       </div>
                     ))}
                   </div>
                </div>
             </div>
          )}
        </div>
      </main>

      {/* MODAL STAFF KDO */}
      {showUserModal && (
        <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-300">
           <form onSubmit={(e) => { e.preventDefault(); setShowUserModal(false); }} className="glass-panel w-full max-w-md rounded-[3.5rem] p-12 shadow-[0_0_120px_rgba(250,204,21,0.1)] relative border border-white/10">
              <button type="button" onClick={() => setShowUserModal(false)} className="absolute top-10 right-10 text-zinc-700 hover:text-white transition-all transform hover:rotate-90 duration-300"><XCircle size={36}/></button>
              <h3 className="text-3xl font-black oswald uppercase text-white italic mb-10 tracking-tighter">Habilitar <span className="text-yellow-400">Operador KDO</span></h3>
              <div className="space-y-7">
                 <div className="space-y-2.5">
                    <label className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.3em] ml-2">Nombre Completo</label>
                    <input name="name" required placeholder="NOMBRE Y CARGO" className="w-full bg-black/60 border border-zinc-800 rounded-2xl p-5 text-white font-bold uppercase text-xs focus:border-yellow-400 outline-none transition-all shadow-inner" />
                 </div>
                 <div className="space-y-2.5">
                    <label className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.3em] ml-2">Identificador (ID)</label>
                    <input name="username" required placeholder="ID DE ACCESO ÚNICO" className="w-full bg-black/60 border border-zinc-800 rounded-2xl p-5 text-white font-bold uppercase text-xs focus:border-yellow-400 outline-none transition-all shadow-inner" />
                 </div>
                 <div className="space-y-2.5">
                    <label className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.3em] ml-2">Clave Maestra</label>
                    <input name="password" required type="password" placeholder="••••••••" className="w-full bg-black/60 border border-zinc-800 rounded-2xl p-5 text-white font-bold text-xs focus:border-yellow-400 outline-none transition-all shadow-inner" />
                 </div>
                 <button type="submit" className="w-full bg-yellow-400 text-black py-6 rounded-2xl font-black uppercase text-xs shadow-2xl shadow-yellow-400/25 transform hover:scale-[1.02] active:scale-95 transition-all oswald italic tracking-widest text-lg">Habilitar Staff</button>
              </div>
           </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
