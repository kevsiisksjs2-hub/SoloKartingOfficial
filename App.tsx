
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
import Reglamentos from './pages/Reglamentos';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AIChatBot from './components/AIChatBot';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/AdminKDO');

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/circuitos" element={<Circuitos />} />
          <Route path="/campeonatos" element={<Campeonatos />} />
          <Route path="/pilotos" element={<Pilotos />} />
          <Route path="/inscripciones" element={<Inscripciones />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/resultados" element={<Resultados />} />
          <Route path="/reglamentos" element={<Reglamentos />} />
          
          <Route path="/AdminKDO" element={<AdminLogin />} />
          <Route path="/AdminKDO/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isAdminRoute && (
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
