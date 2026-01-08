
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
    
    // Usuarios oficiales solicitados
    const validUsers = [
      { user: 'kdoadmin', pass: 'kdo2026', role: 'admin' },
      { user: 'FRAD 3', pass: 'Frad3.2026', role: 'admin' }
    ];

    const match = validUsers.find(u => u.user === username && u.pass === password);

    if (match) {
      storageService.setAuth({ 
        id: Math.random().toString(36).substr(2, 9), 
        username: match.user, 
        role: 'admin' 
      });
      navigate('/Administracion19216811/dashboard');
    } else {
      setError('Credenciales incorrectas. Verifique usuario y contraseña.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="bg-red-600 inline-block p-2 rounded-lg italic font-black text-white text-3xl oswald tracking-tighter mb-4 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
            SOLO <span className="text-black bg-white px-1 rounded-sm">KARTING</span>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight oswald">Acceso Restringido</h2>
          <p className="text-zinc-500 mt-2 text-xs font-black uppercase tracking-widest">Federación Regional de Automovilismo Deportivo</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Identificador de Usuario</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-4 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white font-bold focus:outline-none focus:border-red-600 transition-all uppercase placeholder:text-zinc-800"
                  placeholder="NOMBRE APELLIDO"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Clave de Seguridad</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-4 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-800"
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
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase py-5 rounded-xl transition-all transform hover:scale-[1.02] shadow-xl shadow-red-600/20 oswald tracking-wider"
            >
              Autenticar Personal
            </button>
          </form>
        </div>
        
        <p className="text-center text-zinc-700 text-[8px] font-black uppercase tracking-[0.4em] mt-8">
          Solo Karting Management System • Cronomax System Compatible
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
