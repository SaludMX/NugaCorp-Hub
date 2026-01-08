
import React, { useState } from 'react';
import { Wifi, Lock, Mail, ArrowRight, ShieldCheck, Loader2, Sparkles } from 'lucide-react';
import { UserRole } from '../types';

export const WelcomeView: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white overflow-hidden">
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -mr-40 -mt-40"></div>
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -ml-40 -mb-40"></div>
    
    <div className="max-w-xl w-full text-center relative z-10 space-y-12">
      <div className="space-y-6">
        <div className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-indigo-600/40 animate-bounce">
          <Wifi size={48} className="text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
            NugaCorp <br/> Wireless
          </h1>
          <p className="text-indigo-400 font-black uppercase text-[10px] tracking-[0.4em]">Next-Gen WISP Management</p>
        </div>
      </div>

      <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md mx-auto">
        Infraestructura MikroTik, facturación CFDI 4.0 y atención al cliente impulsada por IA.
      </p>

      <button 
        onClick={onNext}
        className="group relative px-12 py-6 bg-white text-slate-950 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-2xl overflow-hidden"
      >
        <span className="relative z-10 flex items-center gap-4">
          Comenzar Despliegue <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
        </span>
        <div className="absolute inset-0 bg-indigo-100 translate-y-full group-hover:translate-y-0 transition-transform"></div>
      </button>
      
      <div className="flex justify-center gap-8 pt-8 opacity-30">
        <img src="https://mikrotik.com/img/logo.png" alt="MikroTik" className="h-4 grayscale invert" />
        <img src="https://ui.com/static/images/ubiquiti-logo.png" alt="Ubiquiti" className="h-4 grayscale invert" />
      </div>
    </div>
  </div>
);

export const LoginView: React.FC<{ onLogin: (email: string, password: string) => Promise<{ error: any }> }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { error: signInError } = await onLogin(email, pass);
      
      if (signInError) {
        // Handle specific Supabase error messages
        if (signInError.message?.includes('Invalid login credentials')) {
          setError('Email o contraseña incorrectos');
        } else if (signInError.message?.includes('Email not confirmed')) {
          setError('Por favor confirma tu email antes de iniciar sesión');
        } else {
          setError(signInError.message || 'Error al iniciar sesión');
        }
      }
      // Success handled by auth context
    } catch (err: any) {
      setError('Error de conexión. Verifica tu internet.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-inter">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-200 p-10 lg:p-14">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <ShieldCheck size={32} className="text-indigo-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Bienvenido</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-3">Introduce tus credenciales NugaCorp</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  placeholder="ej: admin@nugacorp.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                /> || !email || !pass}
              className="w-full py-5 bg-slate-950 hover:bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-slate-950/10 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              {isLoading ? 'Verificando...' : 'Entrar al Hub'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
               Usa las credenciales proporcionadas por tu WISP<br/>
               <span className="text-indigo-500">¿Problemas? Contacta soporte@nugacorp.com
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
               Pistas para pruebas:<br/>
               <span className="text-indigo-500">admin@... soporte@... tecnico@... marketing@... juan@...</span>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
