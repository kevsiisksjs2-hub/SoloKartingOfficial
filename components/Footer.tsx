
import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-zinc-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
             <div className="bg-blue-600 px-3 py-1.5 rounded italic font-black text-white text-lg oswald tracking-tighter w-fit mb-6">
                PKN <span className="text-black bg-white px-1.5 rounded-sm text-[8px] ml-1">PILOTOS KARTING DEL NORTE</span>
              </div>
            <p className="text-zinc-500 leading-relaxed text-sm font-medium">
              El punto de encuentro para todos los pilotos del norte. Gestión profesional de carreras en tierra bajo normativa federada oficial.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-black uppercase text-[10px] tracking-widest mb-6">Institucional</h4>
            <ul className="space-y-4 text-zinc-500 text-xs font-bold uppercase tracking-tight">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Historia PKN</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Contacto Oficial</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Prensa y Medios</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase text-[10px] tracking-widest mb-6">Accesos</h4>
            <ul className="space-y-4 text-zinc-500 text-xs font-bold uppercase tracking-tight">
              <li><a href="#/circuitos" className="hover:text-blue-500 transition-colors">Circuitos</a></li>
              <li><a href="#/campeonatos" className="hover:text-blue-500 transition-colors">Torneos</a></li>
              <li><a href="#/inscripciones" className="hover:text-blue-500 transition-colors">Inscribirse</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase text-[10px] tracking-widest mb-6">Comunidad</h4>
            <div className="flex gap-4">
              <a href="#" className="bg-zinc-900 p-3 rounded-full text-zinc-400 hover:text-white hover:bg-blue-600 transition-all shadow-lg"><Facebook size={18} /></a>
              <a href="#" className="bg-zinc-900 p-3 rounded-full text-zinc-400 hover:text-white hover:bg-sky-500 transition-all shadow-lg"><Twitter size={18} /></a>
              <a href="#" className="bg-zinc-900 p-3 rounded-full text-zinc-400 hover:text-white hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-red-500 hover:to-purple-600 transition-all shadow-lg"><Instagram size={18} /></a>
              <a href="#" className="bg-zinc-900 p-3 rounded-full text-zinc-400 hover:text-white hover:bg-blue-700 transition-all shadow-lg"><Youtube size={18} /></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-800 text-[10px] font-black uppercase tracking-widest">© 2024 PKN - PILOTOS KARTING DEL NORTE. TODOS LOS DERECHOS RESERVADOS.</p>
          <div className="flex gap-6 text-zinc-800 text-[10px] font-black uppercase tracking-widest">
            <a href="#" className="hover:text-zinc-400 transition-colors">Términos</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
