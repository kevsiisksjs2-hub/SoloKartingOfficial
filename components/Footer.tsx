
import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
             <div className="bg-red-600 p-1.5 rounded italic font-black text-white text-xl oswald tracking-tighter w-fit mb-6">
                SOLO <span className="text-black bg-white px-1 rounded-sm">KARTING</span>
              </div>
            <p className="text-zinc-500 leading-relaxed">
              La plataforma líder para los amantes del karting. Sigue los resultados en tiempo real y gestiona tus inscripciones de forma sencilla.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold uppercase mb-6">Información</h4>
            <ul className="space-y-4 text-zinc-400">
              <li><a href="#" className="hover:text-red-500 transition-colors">Sobre Nosotros</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Publicidad</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase mb-6">Enlaces Rápidos</h4>
            <ul className="space-y-4 text-zinc-400">
              <li><a href="#/circuitos" className="hover:text-red-500 transition-colors">Circuitos</a></li>
              <li><a href="#/campeonatos" className="hover:text-red-500 transition-colors">Campeonatos</a></li>
              <li><a href="#/inscripciones" className="hover:text-red-500 transition-colors">Inscripciones</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase mb-6">Síguenos</h4>
            <div className="flex gap-4">
              <a 
                href="https://facebook.com/solokarting" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-zinc-900 p-3 rounded-full text-zinc-400 hover:text-white hover:bg-blue-600 transition-all shadow-lg"
                title="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://twitter.com/solokarting" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-zinc-900 p-3 rounded-full text-zinc-400 hover:text-white hover:bg-sky-500 transition-all shadow-lg"
                title="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://instagram.com/solokarting_oficial" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-zinc-900 p-3 rounded-full text-zinc-400 hover:text-white hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-red-500 hover:to-purple-600 transition-all shadow-lg"
                title="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://youtube.com/solokarting" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-zinc-900 p-3 rounded-full text-zinc-400 hover:text-white hover:bg-red-700 transition-all shadow-lg"
                title="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-sm">© 2024 Solo Karting. Todos los derechos reservados.</p>
          <div className="flex gap-6 text-zinc-600 text-sm">
            <a href="#" className="hover:text-zinc-400">Términos y Condiciones</a>
            <a href="#" className="hover:text-zinc-400">Política de Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
