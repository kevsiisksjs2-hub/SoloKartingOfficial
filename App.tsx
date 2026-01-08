
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Circuitos from './pages/Circuitos';
import Campeonatos from './pages/Campeonatos';
import Pilotos from './pages/Pilotos';
import Inscripciones from './pages/Inscripciones';
import Noticias from './pages/Noticias';
import Resultados from './pages/Resultados';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AIChatBot from './components/AIChatBot';

const AppContent: React.FC = () => {
  const location = useLocation();
  const hideChromeRoutes = [
    '/Administracion19216811/dashboard'
  ];
  
  const isChromeHidden = hideChromeRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      {!isChromeHidden && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/circuitos" element={<Circuitos />} />
          <Route path="/campeonatos" element={<Campeonatos />} />
          <Route path="/pilotos" element={<Pilotos />} />
          <Route path="/inscripciones" element={<Inscripciones />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/resultados" element={<Resultados />} />
          
          <Route path="/Administracion19216811" element={<AdminLogin />} />
          <Route path="/Administracion19216811/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isChromeHidden && (
        <>
          <Footer />
          <AIChatBot />
        </>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
