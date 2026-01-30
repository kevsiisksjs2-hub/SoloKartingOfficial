
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { Lock, User as UserIcon, ShieldCheck } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validUsers = [
      { user: 'pknadmin', pass: 'pkn2026', role: 'admin' }
    ];

    const match = validUsers.find(u => u.user === username && u.pass === password);

    if (match) {
      storageService.setAuth({ 
        id: Math.random().toString(36).substr(2, 9), 
        username: match.user, 
        role: 'admin' 
      });
      navigate('/AdminKDO/dashboard');
    } else {
      setError('Credenciales incorrectas. Verifique acceso PKN.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="bg-blue-600 inline-block px-4 py-2 rounded-xl italic font-black text-white text-3xl oswald tracking-tighter mb-4 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
            ADMIN <span className="text-black bg-white px-1.5 rounded-sm">PKN</span>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight oswald leading-none">Pilotos Karting del Norte</h2>
          <p className="text-zinc-600 mt-3 text-[9px] font-black uppercase tracking-[0.4em] italic">Sistema de Gestión Centralizado</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>
          
          <form onSubmit={handleLogin} className="space-y-8">
            <div>
              <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-3 ml-1">Identificador de Usuario</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white font-bold focus:outline-none focus:border-blue-600 transition-all uppercase placeholder:text-zinc-800 text-sm"
                  placeholder="USUARIO PKN"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-3 ml-1">Clave PKN System</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-600 transition-all placeholder:text-zinc-800 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-600/10 border border-red-600/20 p-4 rounded-xl flex items-center gap-3 animate-pulse">
                <ShieldCheck className="text-red-500 shrink-0" size={18} />
                <p className="text-red-500 text-[10px] font-black uppercase leading-tight">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase py-6 rounded-2xl transition-all transform active:scale-95 shadow-xl shadow-blue-600/20 oswald tracking-wider text-xl italic"
            >
              Iniciar Gestión PKN
            </button>
          </form>
        </div>
        
        <p className="text-center text-zinc-800 text-[8px] font-black uppercase tracking-[0.5em] mt-8">
          PILOTOS KARTING DEL NORTE • ACCESO ADMINISTRATIVO
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
