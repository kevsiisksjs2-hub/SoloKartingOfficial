
import React, { useEffect, useState, useRef } from 'react';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { Category, Status, Pilot } from '../types';
import { 
  FileCheck, UserPlus, X, CheckCircle2, Search, Zap, ChevronRight, 
  ShieldCheck, AlertCircle, Camera, Loader2, Sparkles, UserSearch
} from 'lucide-react';

const Inscripciones: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [foundInRanking, setFoundInRanking] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    number: '',
    ranking: '99',
    medicalLicense: '',
    sportsLicense: ''
  });

  useEffect(() => {
    setCategories(storageService.getCategories());
  }, []);

  const handleNumberLookup = (number: string) => {
    setFormData(prev => ({ ...prev, number }));
    if (!number || !selectedCategory) return;

    const rankingPilots = storageService.getPilots();
    const match = rankingPilots.find(p => p.number === number && p.category === selectedCategory);

    if (match) {
      setFormData(prev => ({
        ...prev,
        name: match.name,
        ranking: (match.ranking || 99).toString(),
        medicalLicense: '',
        sportsLicense: ''
      }));
      setFoundInRanking(true);
    } else {
      setFoundInRanking(false);
    }
  };

  const startCamera = async () => {
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("No se pudo acceder a la cámara.");
      setIsScanning(false);
    }
  };

  const captureAndScan = async () => {
    if (!canvasRef.current || !videoRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    
    const base64 = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
    setIsAnalyzing(true);
    
    try {
      const data = await aiService.extractLicenseData(base64, 'image/jpeg');
      if (data) {
        setFormData(prev => ({
          ...prev,
          name: data.name || prev.name,
          medicalLicense: data.medicalLicense || prev.medicalLicense,
          sportsLicense: data.sportsLicense || prev.sportsLicense,
          number: data.number || prev.number
        }));
      }
      stopCamera();
    } catch (error) {
      alert("Error analizando la imagen. Intente de nuevo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(t => t.stop());
    }
    setIsScanning(false);
  };

  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPilots = storageService.getPilots();
    const existingIdx = currentPilots.findIndex(p => p.number === formData.number && p.category === selectedCategory);
    
    if (existingIdx !== -1) {
      const updated = [...currentPilots];
      updated[existingIdx] = {
        ...updated[existingIdx],
        status: Status.PENDIENTE,
        medicalLicense: formData.medicalLicense || updated[existingIdx].medicalLicense || 'PENDIENTE',
        sportsLicense: formData.sportsLicense || updated[existingIdx].sportsLicense || 'PENDIENTE',
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      storageService.savePilots(updated);
    } else {
      const newPilot: Pilot = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name.toUpperCase().trim(),
        number: formData.number.trim(),
        category: selectedCategory,
        status: Status.PENDIENTE,
        ranking: parseInt(formData.ranking) || 99,
        medicalLicense: formData.medicalLicense || 'PENDIENTE',
        sportsLicense: formData.sportsLicense || 'PENDIENTE',
        transponderId: `TX-${formData.number}`,
        lastUpdated: new Date().toISOString().split('T')[0],
        createdAt: Date.now(),
        conductPoints: 10,
        stats: { wins: 0, podiums: 0, poles: 0 }
      };
      storageService.savePilots([...currentPilots, newPilot]);
    }

    setSubmitted(true);
    setTimeout(() => { setShowForm(false); setSubmitted(false); setStep(1); setFoundInRanking(false); }, 2500);
  };

  return (
    <div className="bg-black py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-blue-600 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
          <FileCheck size={40} className="text-white" />
        </div>
        <h1 className="text-6xl font-black oswald uppercase text-white mb-6">Inscripciones <span className="text-blue-500">Smart</span></h1>
        <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-0.5em mb-12">Portal Automatizado para Pilotos Rankeados y Nuevos</p>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black uppercase text-xs shadow-2xl hover:scale-105 transition-all">Abrir Portal de Registro</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl overflow-y-auto">
          <div className="bg-zinc-900 w-full max-w-lg rounded-[3rem] border border-zinc-800 p-10 relative">
            <button onClick={() => { stopCamera(); setShowForm(false); }} className="absolute top-10 right-10 text-zinc-500 hover:text-white transition-colors"><X size={28} /></button>
            
            {!submitted ? (
              <>
                <h2 className="text-3xl font-black oswald uppercase text-white mb-8">{step === 1 ? 'Seleccione Categoría' : 'Datos de Inscripción'}</h2>
                {step === 1 ? (
                   <div className="space-y-3">
                      {categories.map(c => (
                        <button key={c} onClick={() => { setSelectedCategory(c); setStep(2); }} className="w-full bg-black border border-zinc-800 hover:border-blue-600 text-white font-bold py-5 px-6 rounded-2xl flex justify-between items-center group transition-all">
                          <span className="group-hover:text-blue-500 transition-colors">{c}</span> <ChevronRight size={18} />
                        </button>
                      ))}
                   </div>
                ) : (
                   <form onSubmit={handleDirectSubmit} className="space-y-6">
                      <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5 mb-6">
                        <div className="flex items-center gap-3">
                           <Zap size={16} className="text-blue-500" />
                           <span className="text-white text-[10px] font-black uppercase tracking-widest">{selectedCategory}</span>
                        </div>
                        <button type="button" onClick={() => setStep(1)} className="text-[8px] font-black text-zinc-500 hover:text-white uppercase">Cambiar</button>
                      </div>

                      <div className="space-y-5">
                        <div className="relative">
                          <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2 block ml-2">Número de Karting (Dorsal)</label>
                          <input 
                            required 
                            type="text"
                            value={formData.number} 
                            onChange={e => handleNumberLookup(e.target.value.replace(/\D/g, ''))} 
                            className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-5 text-white font-black oswald text-3xl focus:border-blue-600 outline-none transition-all" 
                            placeholder="00" 
                          />
                        </div>

                        <div>
                          <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2 block ml-2">Piloto (Nombre y Apellido)</label>
                          <input 
                            required 
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})} 
                            className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-white font-bold uppercase focus:border-blue-600 outline-none transition-all" 
                            placeholder="Ingrese su nombre" 
                            readOnly={foundInRanking}
                          />
                        </div>
                      </div>

                      <button type="submit" className="w-full bg-blue-600 hover:bg-white text-white hover:text-black py-6 rounded-[2rem] font-black uppercase shadow-2xl mt-4 transition-all transform active:scale-95 oswald italic text-xl">
                        {foundInRanking ? 'Confirmar Inscripción' : 'Registrar Nuevo Piloto'}
                      </button>
                   </form>
                )}
              </>
            ) : (
              <div className="py-20 text-center animate-in zoom-in-95 duration-500">
                <div className="bg-emerald-500/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/30">
                  <CheckCircle2 size={48} className="text-emerald-500" />
                </div>
                <h2 className="text-4xl font-black oswald text-white mb-4 uppercase italic">¡Inscripción Exitosa!</h2>
                <p className="text-zinc-500 text-xs font-black uppercase tracking-widest max-w-xs mx-auto leading-relaxed">Sus datos han sido procesados. El comisariado verificará su estado en boxes.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Inscripciones;
