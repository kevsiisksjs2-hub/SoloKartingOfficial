
import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';
import { Category, Status, Pilot, Association } from '../types';
import { 
  FileCheck, 
  UserPlus, 
  X, 
  CheckCircle2, 
  Search,
  Zap,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const Inscripciones: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    number: '',
    ranking: '',
    medicalLicense: '',
    sportsLicense: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAutoValidated, setIsAutoValidated] = useState(false);

  useEffect(() => {
    setCategories(storageService.getCategories());
  }, []);

  useEffect(() => {
    if (step === 2 && formData.name.length > 4) {
      const categoryRankings = storageService.getCategoryRankings(selectedCategory);
      const search = formData.name.toLowerCase().trim();
      
      const match = categoryRankings.find(p => p.name.toLowerCase().includes(search));
      
      if (match) {
        setFormData(prev => ({ 
          ...prev, 
          ranking: match.ranking.toString(),
          number: match.number 
        }));
        setIsAutoValidated(true);
        setErrors(prev => ({ ...prev, name: '', number: '', ranking: '' }));
      } else {
        setIsAutoValidated(false);
      }
    }
  }, [formData.name, selectedCategory, step]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.name.trim().length < 5) {
      newErrors.name = "Ingrese nombre y apellido completo (mínimo 5 carac.).";
    }
    
    if (!formData.number || isNaN(Number(formData.number)) || Number(formData.number) <= 0) {
      newErrors.number = "N° inválido.";
    }

    if (!formData.ranking || isNaN(Number(formData.ranking)) || Number(formData.ranking) <= 0) {
      newErrors.ranking = "Ranking inválido.";
    }

    if (formData.medicalLicense.length < 4) {
      newErrors.medicalLicense = "Lic. Médica incompleta.";
    }

    if (formData.sportsLicense.length < 4) {
      newErrors.sportsLicense = "Lic. Deportiva incompleta.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const currentPilots = storageService.getPilots();
    const newPilot: Pilot = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name.toUpperCase().trim(),
      number: formData.number.trim(),
      category: selectedCategory,
      status: Status.PENDIENTE,
      ranking: parseInt(formData.ranking) || 99,
      medicalLicense: formData.medicalLicense,
      sportsLicense: formData.sportsLicense,
      transponderId: `TX-${formData.number}`,
      lastUpdated: new Date().toISOString().split('T')[0],
      conductPoints: 10,
      stats: { wins: 0, podiums: 0, poles: 0 }
    };

    storageService.savePilots([...currentPilots, newPilot]);
    setSubmitted(true);
    
    setTimeout(() => { 
      setShowForm(false); 
      setSubmitted(false); 
      setStep(1); 
      setFormData({name: '', number: '', ranking: '', medicalLicense: '', sportsLicense: ''}); 
      setErrors({});
    }, 2500);
  };

  const handleOnlyNumbers = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
      e.preventDefault();
    }
  };

  return (
    <div className="bg-zinc-950 py-12 min-h-screen relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 text-center">
          <div className="bg-red-600 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-600/20">
            <FileCheck size={40} className="text-white" />
          </div>
          <h1 className="text-6xl font-black italic oswald uppercase text-white mb-6 tracking-tighter">Portal de <span className="text-red-600">Inscripciones</span></h1>
          <p className="text-zinc-500 max-w-2xl mx-auto font-bold uppercase text-[10px] tracking-widest leading-relaxed">Registro inteligente para pilotos federados. Los datos de ranking y numeración se validarán automáticamente.</p>
        </div>

        <div className="max-w-xl mx-auto bg-zinc-900 border border-zinc-800 p-10 rounded-[3rem] shadow-2xl text-center">
           <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 mb-6 text-red-600 inline-block"><UserPlus size={48} /></div>
           <h3 className="text-2xl font-black oswald uppercase text-white mb-4">Inscripción Directa</h3>
           <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-10">Inicia tu registro seleccionando la categoría de competencia.</p>
           <button 
             onClick={() => setShowForm(true)}
             className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3"
           >
             Abrir Formulario Oficial
           </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/98 backdrop-blur-xl">
          <div className="bg-zinc-900 w-full max-w-lg rounded-[3rem] border border-zinc-800 p-10 shadow-2xl relative animate-in slide-in-from-bottom-4 duration-300 max-h-[95vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setShowForm(false)} className="absolute top-10 right-10 text-zinc-500 hover:text-white"><X size={28} /></button>
            
            {!submitted ? (
              <>
                <div className="flex items-center gap-4 mb-8">
                   <div className="bg-red-600 p-3 rounded-2xl shadow-lg"><Zap className="text-white" size={24} /></div>
                   <h2 className="text-3xl font-black oswald uppercase text-white">{step === 1 ? 'Paso 1: Categoría' : 'Paso 2: Datos'}</h2>
                </div>
                
                {step === 1 ? (
                   <div className="space-y-3 animate-in fade-in duration-300">
                      {categories.map(c => (
                        <button 
                          key={c} 
                          onClick={() => { setSelectedCategory(c); setStep(2); }}
                          className="w-full bg-zinc-950 border border-zinc-800 hover:border-red-600 text-white font-bold uppercase text-xs py-5 px-6 rounded-2xl flex justify-between items-center group transition-all"
                        >
                          {c}
                          <ChevronRight size={18} className="text-zinc-700 group-hover:text-red-600" />
                        </button>
                      ))}
                   </div>
                ) : (
                   <form onSubmit={handleDirectSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                      <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl flex justify-between items-center mb-6">
                         <span className="text-[10px] font-black uppercase text-red-500 tracking-widest">{selectedCategory}</span>
                         <button type="button" onClick={() => setStep(1)} className="text-[8px] font-black uppercase text-zinc-600 hover:text-white underline">Cambiar Categoría</button>
                      </div>

                      <div className="space-y-2">
                        <label className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em] ml-2">Piloto (Nombre y Apellido)</label>
                        <div className="relative">
                          <Search className="absolute left-5 top-5 text-zinc-600" size={18} />
                          <input 
                            required
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className={`w-full bg-zinc-950 border rounded-3xl pl-14 pr-6 py-5 text-white outline-none font-bold uppercase text-sm transition-all ${errors.name ? 'border-red-600' : 'border-zinc-800 focus:border-red-600'}`}
                            placeholder="Buscar en el ranking..."
                          />
                          {isAutoValidated && (
                            <div className="absolute right-5 top-5 text-emerald-500 flex items-center gap-2">
                               <ShieldCheck size={18} />
                               <span className="text-[8px] font-black uppercase">Validado</span>
                            </div>
                          )}
                        </div>
                        {errors.name && <p className="text-[9px] text-red-600 font-black uppercase flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.name}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em] ml-2">Kart #</label>
                          <input 
                            required 
                            type="text" 
                            onKeyDown={handleOnlyNumbers}
                            value={formData.number} 
                            onChange={(e) => setFormData({...formData, number: e.target.value})} 
                            className={`w-full bg-zinc-950 border rounded-3xl px-6 py-5 text-center font-black text-3xl oswald transition-all ${errors.number ? 'border-red-600' : isAutoValidated ? 'border-emerald-500/50 text-emerald-500' : 'border-zinc-800 text-white'}`} 
                            placeholder="00" 
                          />
                          {errors.number && <p className="text-[9px] text-red-600 font-black uppercase text-center mt-1">{errors.number}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em] ml-2">Ranking</label>
                          <input 
                            required 
                            type="text" 
                            onKeyDown={handleOnlyNumbers}
                            value={formData.ranking} 
                            onChange={(e) => setFormData({...formData, ranking: e.target.value})} 
                            className={`w-full bg-zinc-950 border rounded-3xl px-6 py-5 text-center font-black text-2xl transition-all ${errors.ranking ? 'border-red-600' : isAutoValidated ? 'border-emerald-500/50 text-emerald-500' : 'border-zinc-800 text-white'}`} 
                            placeholder="99" 
                          />
                          {errors.ranking && <p className="text-[9px] text-red-600 font-black uppercase text-center mt-1">{errors.ranking}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em] ml-2">Lic. Médica</label>
                          <input 
                            required 
                            type="text" 
                            onKeyDown={handleOnlyNumbers}
                            value={formData.medicalLicense} 
                            onChange={(e) => setFormData({...formData, medicalLicense: e.target.value})} 
                            className={`w-full bg-zinc-950 border rounded-3xl px-6 py-5 text-white outline-none font-bold text-sm text-center transition-all ${errors.medicalLicense ? 'border-red-600' : 'border-zinc-800 focus:border-red-600'}`} 
                            placeholder="0000" 
                          />
                          {errors.medicalLicense && <p className="text-[9px] text-red-600 font-black uppercase text-center mt-1">{errors.medicalLicense}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em] ml-2">Lic. Deportiva</label>
                          <input 
                            required 
                            type="text" 
                            onKeyDown={handleOnlyNumbers}
                            value={formData.sportsLicense} 
                            onChange={(e) => setFormData({...formData, sportsLicense: e.target.value})} 
                            className={`w-full bg-zinc-950 border rounded-3xl px-6 py-5 text-white outline-none font-bold text-sm text-center transition-all ${errors.sportsLicense ? 'border-red-600' : 'border-zinc-800 focus:border-red-600'}`} 
                            placeholder="0000" 
                          />
                          {errors.sportsLicense && <p className="text-[9px] text-red-600 font-black uppercase text-center mt-1">{errors.sportsLicense}</p>}
                        </div>
                      </div>

                      <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase py-6 rounded-3xl shadow-2xl shadow-red-600/30 transition-all flex items-center justify-center gap-3 mt-6">
                        Confirmar Inscripción
                      </button>
                   </form>
                )}
              </>
            ) : (
              <div className="py-24 text-center animate-in zoom-in duration-300">
                <CheckCircle2 size={80} className="text-emerald-500 mx-auto mb-8 animate-bounce" />
                <h2 className="text-4xl font-black oswald uppercase text-white mb-2">¡Completado!</h2>
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Inscripción procesada para {selectedCategory}.</p>
                <p className="text-zinc-700 text-[8px] font-black uppercase tracking-widest mt-4">Redirigiendo al portal...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Inscripciones;
