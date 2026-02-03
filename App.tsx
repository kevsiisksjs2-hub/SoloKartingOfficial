
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Circuitos from './pages/Circuitos';
import Campeonatos from './pages/Campeonatos';
import Pilotos from './pages/Pilotos';
import Inscripciones from './pages/Inscripciones';
import Resultados from './pages/Resultados';
import Reglamentos from './pages/Reglamentos';
import HallOfFame from './pages/HallOfFame';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminNewPilot from './pages/AdminNewPilot';
import LiveCenter from './pages/LiveCenter';
import AIChatBot from './components/AIChatBot';

const AppContent: React.FC = () => {
  const location = useLocation();
  const path = location.pathname.toLowerCase();
  
  const isAdminRoute = path.includes('/adminkdo');
  const isLiveRoute = path.includes('/live');

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      {(!isAdminRoute && !isLiveRoute) && <Navbar />}
      
      <main className="flex-grow">
        <Routes>
          {/* PORTAL PÚBLICO */}
          <Route path="/" element={<Home />} />
          <Route path="/circuitos" element={<Circuitos />} />
          <Route path="/campeonatos" element={<Campeonatos />} />
          <Route path="/pilotos" element={<Pilotos />} />
          <Route path="/inscripciones" element={<Inscripciones />} />
          <Route path="/resultados" element={<Resultados />} />
          <Route path="/reglamentos" element={<Reglamentos />} />
          <Route path="/historia" element={<HallOfFame />} />
          <Route path="/live" element={<LiveCenter />} />
          
          {/* PORTAL ADMINISTRATIVO */}
          <Route path="/AdminKDO" element={<AdminLogin />} />
          <Route path="/AdminKDO/dashboard" element={<AdminDashboard />} />
          <Route path="/AdminKDO/nuevo-piloto" element={<AdminNewPilot />} />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {(!isAdminRoute && !isLiveRoute) && (
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
