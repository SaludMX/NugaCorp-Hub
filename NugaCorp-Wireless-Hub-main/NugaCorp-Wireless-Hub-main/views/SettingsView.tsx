
import React, { useState } from 'react';
import { 
  User, Shield, Palette, Save, Bell, Smartphone, 
  Lock, Laptop, LogOut, CheckCircle2, Moon, Sun, 
  Monitor, Upload, MessageSquare, Bot, Key, History, Layout, Scale, Loader2, KeyRound
} from 'lucide-react';

const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'SECURITY' | 'INTERFACE' | 'NOTIFICATIONS' | 'IA'>('PROFILE');
  const [isSaving, setIsSaving] = useState(false);
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    whatsapp: true,
    sms: false,
    ia_diagnostico: true,
    ia_qos: false,
    ia_ocr: true,
    darkMode: false,
    compactMode: false,
    mfa: true
  });

  const handleToggle = (key: string) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Configuración sincronizada con el servidor NugaCorp.');
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Ajustes</h1>
        <p className="text-slate-500 mt-3 uppercase text-[10px] font-black tracking-[0.3em]">NugaCorp Workspace Management • v3.5.0</p>
      </div>

      <div className="flex gap-2 bg-slate-200/50 p-2 rounded-[2rem] w-full overflow-x-auto no-scrollbar border border-slate-200">
        {[
          { id: 'PROFILE', label: 'Mi Perfil', icon: <User size={18} /> },
          { id: 'SECURITY', label: 'Seguridad', icon: <Shield size={18} /> },
          { id: 'INTERFACE', label: 'Interfaz / UI', icon: <Palette size={18} /> },
          { id: 'NOTIFICATIONS', label: 'Comunicaciones', icon: <MessageSquare size={18} /> },
          { id: 'IA', label: 'Inteligencia IA', icon: <Bot size={18} /> },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'bg-white text-indigo-600 shadow-xl border border-slate-200' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden p-10 lg:p-14 min-h-[550px] relative">
        
        {activeTab === 'PROFILE' && (
          <div className="space-y-12 animate-in fade-in duration-300">
             <div className="flex flex-col sm:flex-row gap-12 items-center border-b border-slate-100 pb-12">
                <div className="relative group">
                  <div className="w-36 h-36 bg-slate-900 rounded-[3rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl transition-transform group-hover:scale-105">I</div>
                  <button className="absolute -bottom-2 -right-2 p-4 bg-indigo-600 text-white rounded-2xl shadow-2xl border-4 border-white hover:bg-indigo-500 transition-all active:scale-90">
                    <Upload size={20} />
                  </button>
                </div>
                <div className="text-center sm:text-left">
                   <h3 className="text-4xl font-black text-slate-900">Ingeniero Nuga</h3>
                   <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Director Técnico de Red</p>
                   <div className="flex gap-3 mt-6 justify-center sm:justify-start">
                     <span className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest">En Línea</span>
                     <span className="px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl text-[10px] font-black uppercase tracking-widest">ID: #0001</span>
                   </div>
                </div>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Email Corporativo</label>
                  <input type="email" defaultValue="admin@nugacorp.com" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">WhatsApp de Gestión</label>
                  <input type="text" defaultValue="+52 55 1234 5678" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10" />
                </div>
             </div>
          </div>
        )}

        {activeTab === 'SECURITY' && (
          <div className="space-y-10 animate-in fade-in duration-300">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 space-y-8">
                   <div className="flex items-center gap-5 text-slate-900">
                      <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-600/20"><KeyRound size={24} /></div>
                      <h4 className="font-black text-sm uppercase tracking-widest leading-none">Clave de Acceso</h4>
                   </div>
                   <input type="password" placeholder="Contraseña Actual" className="w-full p-5 bg-white border border-slate-200 rounded-2xl text-xs font-bold shadow-sm" />
                   <input type="password" placeholder="Nueva Contraseña" className="w-full p-5 bg-white border border-slate-200 rounded-2xl text-xs font-bold shadow-sm" />
                   <button className="w-full py-5 bg-slate-950 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl">Actualizar Credenciales</button>
                </div>
                
                <div className="space-y-6">
                   <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-5">
                         <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl"><Shield size={24} /></div>
                         <div>
                            <p className="text-sm font-black text-slate-900">MFA / 2FA</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Doble factor activo</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => handleToggle('mfa')}
                        className={`w-16 h-8 rounded-full relative transition-colors ${toggles.mfa ? 'bg-emerald-500' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-xl ${toggles.mfa ? 'right-1' : 'left-1'}`}></div>
                      </button>
                   </div>
                   
                   <div className="p-8 bg-slate-950 rounded-[2.5rem] text-white">
                      <div className="flex items-center gap-4 mb-6">
                        <History size={20} className="text-indigo-400" />
                        <h4 className="text-[11px] font-black uppercase tracking-widest">Log de Sesiones</h4>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="opacity-50">Chrome en Windows 11</span>
                          <span className="font-black text-emerald-400">ACTUAL</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="opacity-50">Nuga App en iPhone 15</span>
                          <span className="opacity-30">HACE 2H</span>
                        </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'INTERFACE' && (
          <div className="space-y-10 animate-in fade-in duration-300">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="p-10 border border-slate-100 rounded-[3rem] flex items-center justify-between hover:bg-slate-50 transition-all group">
                   <div className="flex items-center gap-6">
                      <div className="p-5 bg-slate-950 text-white rounded-2xl shadow-2xl transition-transform group-hover:rotate-12"><Moon size={28} /></div>
                      <div>
                         <p className="text-lg font-black text-slate-900">Modo Oscuro</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Dark Experience UI</p>
                      </div>
                   </div>
                   <button onClick={() => handleToggle('darkMode')} className={`w-16 h-8 rounded-full relative transition-colors ${toggles.darkMode ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                     <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-xl ${toggles.darkMode ? 'right-1' : 'left-1'}`}></div>
                   </button>
                </div>
                
                <div className="p-10 border border-slate-100 rounded-[3rem] flex items-center justify-between hover:bg-slate-50 transition-all group">
                   <div className="flex items-center gap-6">
                      <div className="p-5 bg-indigo-50 text-indigo-600 rounded-2xl transition-transform group-hover:-rotate-12"><Scale size={28} /></div>
                      <div>
                         <p className="text-lg font-black text-slate-900">Modo Compacto</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Optimizar Densidad de Info</p>
                      </div>
                   </div>
                   <button onClick={() => handleToggle('compactMode')} className={`w-16 h-8 rounded-full relative transition-colors ${toggles.compactMode ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                     <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-xl ${toggles.compactMode ? 'right-1' : 'left-1'}`}></div>
                   </button>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'NOTIFICATIONS' && (
          <div className="space-y-10 animate-in fade-in duration-300">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                {[
                  { id: 'whatsapp', label: 'WhatsApp API', icon: <MessageSquare size={24} />, color: 'text-emerald-500', desc: 'Envío de recibos MikroTik' },
                  { id: 'sms', label: 'Gateway SMS', icon: <Smartphone size={24} />, color: 'text-indigo-500', desc: 'Avisos de mantenimiento PoP' },
                ].map(item => (
                  <div key={item.id} className="p-10 border border-slate-100 rounded-[3rem] flex items-center justify-between hover:bg-slate-50 transition-all group">
                     <div className="flex items-center gap-6">
                        <div className={`p-5 bg-slate-50 ${item.color} rounded-2xl transition-transform group-hover:scale-110 shadow-sm`}>{item.icon}</div>
                        <div>
                           <p className="text-lg font-black text-slate-900">{item.label}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{item.desc}</p>
                        </div>
                     </div>
                     <button onClick={() => handleToggle(item.id)} className={`w-16 h-8 rounded-full relative transition-colors ${toggles[item.id] ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                       <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-xl ${toggles[item.id] ? 'right-1' : 'left-1'}`}></div>
                     </button>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'IA' && (
          <div className="space-y-12 animate-in fade-in duration-300">
             <div className="bg-slate-950 rounded-[3.5rem] p-12 text-white flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] -mr-40 -mt-40 animate-pulse"></div>
                <div className="w-28 h-28 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shrink-0 shadow-2xl shadow-indigo-600/40 relative z-10">
                   <Bot size={56} />
                </div>
                <div className="relative z-10 text-center md:text-left">
                   <h3 className="text-4xl font-black tracking-tight leading-none">AI NugaCore</h3>
                   <p className="text-slate-400 text-lg mt-3 font-medium italic leading-relaxed">Optimizando latencia y ráfagas de red en tiempo real con Gemini Pro.</p>
                </div>
             </div>
             <div className="space-y-6">
                {[
                  { id: 'ia_diagnostico', label: 'IA Auto-Diagnóstico MikroTik', desc: 'Previene bucles L2 y saturación de CPU de forma predictiva.' },
                  { id: 'ia_qos', label: 'Dynamic Traffic Shaping', desc: 'Reajusta las Simple Queues basado en la prioridad del tráfico.' },
                  { id: 'ia_ocr', label: 'Sincronización OCR', desc: 'Altas de clientes express mediante escaneo de identificación.' },
                ].map(feat => (
                  <div key={feat.id} className="p-8 border border-slate-100 rounded-[2.5rem] flex items-center justify-between hover:bg-slate-50 transition-all group">
                     <div>
                        <p className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{feat.label}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{feat.desc}</p>
                     </div>
                     <button onClick={() => handleToggle(feat.id)} className={`w-16 h-8 rounded-full relative transition-colors ${toggles[feat.id] ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                       <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-xl ${toggles[feat.id] ? 'right-1' : 'left-1'}`}></div>
                     </button>
                  </div>
                ))}
             </div>
          </div>
        )}

        <div className="mt-14 pt-10 border-t border-slate-100 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-20 py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-[12px] tracking-[0.2em] shadow-2xl shadow-indigo-600/40 active:scale-95 transition-all flex items-center gap-5"
          >
            {isSaving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />} 
            Sincronizar Ajustes Globales
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
