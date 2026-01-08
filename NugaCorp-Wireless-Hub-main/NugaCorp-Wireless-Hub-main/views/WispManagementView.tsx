
import React, { useState } from 'react';
import { 
  Palette, Smartphone, Layout, Globe, Key, Wifi, 
  Terminal, ShieldCheck, Copy, Check, Save, Upload,
  Layers, AppWindow, Bot
} from 'lucide-react';
import { MOCK_WISPS } from '../constants';

const WispManagementView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const wisp = MOCK_WISPS[0]; // Usuario logueado como WISP_OWNER

  const mikrotikScript = `/interface sstp-client
add connect-to=hub.nugacorp.com disabled=no name=nuga-hub user=wisp_${wisp.id} password=secret
/ip service set api-ssl certificate=none port=8729 disabled=no
/user add name=nuga_ops group=full password=auth_token_821`;

  const copyScript = () => {
    navigator.clipboard.writeText(mikrotikScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">WISP Configuration</h1>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-4 flex items-center gap-3">
           Tenant Identity • White Label Orchestrator
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Identity & Branding */}
         <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm">
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-10 flex items-center gap-3">
                  <Palette size={16} /> Identidad Visual
               </h3>
               
               <div className="space-y-10">
                  <div className="flex flex-col items-center gap-6">
                     <div className="w-32 h-32 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2.5rem] flex items-center justify-center group cursor-pointer hover:border-indigo-400 transition-all">
                        <Upload className="text-slate-300 group-hover:text-indigo-400 transition-colors" size={32} />
                     </div>
                     <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Logo del WISP (SVG/PNG)</p>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Color Primario</label>
                     <div className="flex gap-4">
                        <input type="color" defaultValue={wisp.primaryColor} className="w-16 h-16 rounded-2xl overflow-hidden cursor-pointer" />
                        <div className="flex-1 px-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center font-mono text-sm font-black text-slate-700">
                           {wisp.primaryColor.toUpperCase()}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Nombre Comercial</label>
                     <input type="text" defaultValue={wisp.name} className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" />
                  </div>

                  <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                     <Save size={18} /> Actualizar Marca
                  </button>
               </div>
            </div>
         </div>

         {/* Integration & MikroTik Onboarding */}
         <div className="lg:col-span-2 space-y-10">
            <div className="bg-slate-900 rounded-[4rem] p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] -mr-24 -mt-24"></div>
               <div className="relative z-10 space-y-10">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl">
                           <Terminal size={32} />
                        </div>
                        <div>
                           <h3 className="text-2xl font-black tracking-tight leading-none uppercase">MikroTik Connector</h3>
                           <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-2">Zero-Touch Automation Script</p>
                        </div>
                     </div>
                     <button onClick={copyScript} className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all active:scale-90">
                        {copied ? <Check className="text-emerald-400" size={24} /> : <Copy size={24} />}
                     </button>
                  </div>

                  <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-xl">
                     Pega este script en el terminal de tu MikroTik (Core Router) para establecer una conexión segura de Capa 2 hacia NugaCorp Hub. Esto activará la telemetría y el control de Queues en tiempo real.
                  </p>

                  <div className="bg-black/60 rounded-[2rem] p-8 border border-white/10 font-mono text-xs leading-relaxed text-indigo-300 overflow-x-auto whitespace-pre">
                     {mikrotikScript}
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4">
                     <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-xl">
                        <Key size={14} className="text-indigo-400" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">API Port: 8729 (SSL)</span>
                     </div>
                     <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-xl">
                        <Wifi size={14} className="text-indigo-400" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Tunnel Type: SSTP</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm flex flex-col justify-between group cursor-pointer hover:border-indigo-400 transition-all">
                  <div className="space-y-6">
                     <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <AppWindow size={28} />
                     </div>
                     <h4 className="text-xl font-black text-slate-900 leading-none">Portal de Cliente</h4>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Configurar accesos y ránkings</p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                     <span className="text-[9px] font-black uppercase text-indigo-600 tracking-widest">Personalizar Portal</span>
                     <Check className="text-emerald-500" size={16} />
                  </div>
               </div>

               <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm flex flex-col justify-between group cursor-pointer hover:border-emerald-400 transition-all">
                  <div className="space-y-6">
                     <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <Bot size={28} />
                     </div>
                     <h4 className="text-xl font-black text-slate-900 leading-none">IA NugaBot Config</h4>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Nivel de autonomía de soporte</p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                     <span className="text-[9px] font-black uppercase text-emerald-600 tracking-widest">Gestión de IA</span>
                     <Check className="text-emerald-500" size={16} />
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default WispManagementView;
