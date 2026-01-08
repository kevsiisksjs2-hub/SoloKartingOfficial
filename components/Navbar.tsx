
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShieldAlert } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Resultados', path: '/resultados' },
    { name: 'Circuitos', path: '/circuitos' },
    { name: 'Campeonatos', path: '/campeonatos' },
    { name: 'Pilotos', path: '/pilotos' },
    { name: 'Inscripciones', path: '/inscripciones' },
  ];

  return (
    <nav className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-red-600 p-1.5 rounded italic font-black text-white text-xl oswald tracking-tighter transition-transform group-hover:scale-105">
                SOLO <span className="text-black bg-white px-1 rounded-sm">KARTING</span>
              </div>
            </Link>
          </div>

          <div className="hidden lg:flex items-center">
            <div className="ml-10 flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    location.pathname === link.path 
                      ? 'text-red-500 bg-red-600/5' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="ml-6 pl-6 border-l border-zinc-800 flex items-center gap-3">
              <Link
                to="/Administracion19216811"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-white hover:text-black transition-all shadow-xl"
              >
                <ShieldAlert size={14} className="text-red-600" />
                Acceso Personal
              </Link>
            </div>
          </div>

          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-900 transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-zinc-950 border-t border-zinc-900 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-4 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest ${
                  location.pathname === link.path 
                    ? 'text-red-500 bg-red-600/10' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/Administracion19216811"
              className="block px-4 py-4 mt-2 bg-red-600 text-white rounded-xl text-sm font-black uppercase tracking-widest text-center"
              onClick={() => setIsOpen(false)}
            >
              Acceso Personal
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
