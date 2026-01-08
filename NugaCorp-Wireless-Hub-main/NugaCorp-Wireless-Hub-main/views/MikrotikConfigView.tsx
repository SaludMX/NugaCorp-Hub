
import React, { useState } from 'react';
import { 
  Zap, Activity, Cpu, ArrowDownCircle, ArrowUpCircle,
  Plus, Play, Sparkles, Loader2, List, TowerControl as Tower,
  Search, Globe, Database, Network, Key, WifiOff, RefreshCw, X, Edit3, Trash2, Shield,
  // Fix: Added Package to imports
  Package
} from 'lucide-react';
import { MOCK_ZONES, MOCK_PLANS } from '../constants';

const MikrotikConfigView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SIMPLE_QUEUES' | 'PPPOE' | 'PCQ' | 'DHCP_MORA' | 'PLANES'>('SIMPLE_QUEUES');
  const [selectedTower, setSelectedTower] = useState(MOCK_ZONES[0]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState<any>(null);

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      alert("IA MikroTik: Algoritmos de PCQ ajustados según demanda actual de tráfico.");
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 px-4 sm:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl transition-transform hover:scale-105">
             <Network size={40} />
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none">Control de Red</h1>
            <p className="text-slate-500 mt-2 uppercase text-[10px] font-black tracking-[0.2em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              MikroTik RouterOS Core Management
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Tower className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              className="pl-12 pr-10 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase appearance-none outline-none focus:ring-4 focus:ring-indigo-500/10 min-w-[260px] shadow-sm"
              value={selectedTower.id}
              onChange={(e) => setSelectedTower(MOCK_ZONES.find(z => z.id === e.target.value) || MOCK_ZONES[0])}
            >
              {MOCK_ZONES.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
            </select>
          </div>
          <button 
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            {isOptimizing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} 
            Optimizar QoS IA
          </button>
        </div>
      </div>

      <div className="flex gap-2 bg-slate-200/50 p-1.5 rounded-[2rem] w-full overflow-x-auto no-scrollbar border border-slate-200">
        {[
          { id: 'SIMPLE_QUEUES', label: 'Simple Queues', icon: <List size={16} /> },
          { id: 'PPPOE', label: 'PPPoE Secrets', icon: <Key size={16} /> },
          { id: 'PCQ', label: 'PCQ / Queues', icon: <Activity size={16} /> },
          { id: 'DHCP_MORA', label: 'DHCP Control', icon: <WifiOff size={16} /> },
          { id: 'PLANES', label: 'Planes de Red', icon: <Package size={16} /> },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden min-h-[550px]">
        {activeTab === 'PLANES' ? (
          <div className="p-10 lg:p-14 animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-12">
               <div>
                 <h3 className="text-3xl font-black text-slate-900 leading-none">Gestión de Perfiles</h3>
                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2">Definición de QoS para inyección en MikroTik</p>
               </div>
               <button 
                onClick={() => setShowPlanModal({ name: '', download: 0, upload: 0, price: 0 })}
                className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl active:scale-90 transition-all"
               >
                 <Plus size={24} />
               </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {MOCK_PLANS.map(plan => (
                <div key={plan.id} className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 group hover:border-indigo-200 transition-all">
                  <div className="flex justify-between items-start mb-10">
                    <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Zap size={32} />
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => setShowPlanModal(plan)} className="p-3 bg-white text-slate-400 hover:text-indigo-600 rounded-xl shadow-sm border border-slate-200"><Edit3 size={18}/></button>
                       <button className="p-3 bg-white text-slate-400 hover:text-red-500 rounded-xl shadow-sm border border-slate-200"><Trash2 size={18}/></button>
                    </div>
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-4">{plan.name}</h4>
                  <div className="flex items-center gap-8 pt-6 border-t border-slate-200">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">Down (Max)</p>
                      <p className="text-2xl font-black text-emerald-600 tracking-tight">{plan.download}M</p>
                    </div>
                    <div className="w-px h-10 bg-slate-200"></div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">Up (Max)</p>
                      <p className="text-2xl font-black text-indigo-600 tracking-tight">{plan.upload}M</p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Precio Sugerido</p>
                    <p className="text-xl font-black text-slate-900 mt-1">${plan.price}.00 <span className="text-[10px] text-slate-400 font-bold">/ MES</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-10 lg:p-14 animate-in fade-in duration-300">
             <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-5">
                   <div className="p-5 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm"><Activity size={28} /></div>
                   <div>
                     <h3 className="text-2xl font-black text-slate-900 leading-none">Gestión: {activeTab.replace('_', ' ')}</h3>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                        <Globe size={12} /> Nodo: {selectedTower.name} • {selectedTower.ipRange}
                     </p>
                   </div>
                </div>
                <button className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                   <RefreshCw size={14} /> Refrescar MikroTik API
                </button>
             </div>
             
             {/* Contenido Dinámico según Método */}
             <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-12 text-center space-y-6">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-slate-300">
                   <Search size={48} />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900">Sincronizando Registros...</h4>
                  <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed mt-2 font-medium">
                    Consultando tabla de <b>{activeTab}</b> en el nodo seleccionado. NugaCorp está recuperando los límites de velocidad y estados actuales de conexión.
                  </p>
                </div>
                <div className="pt-8">
                   <div className="flex justify-center gap-3">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                   </div>
                </div>
             </div>
             
             <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 flex items-start gap-5">
                  <Shield size={28} className="text-indigo-600 shrink-0" />
                  <div>
                    <h5 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">Nota Técnica de Lead</h5>
                    <p className="text-xs text-indigo-900/70 mt-2 font-medium leading-relaxed">
                      El método <b>{activeTab}</b> es el más eficiente para esta zona. NugaCorp inyectará scripts automáticos para gestionar ráfagas (burst) cada 15 minutos.
                    </p>
                  </div>
                </div>
                <div className="p-8 bg-slate-950 rounded-[2.5rem] text-white flex items-center justify-between">
                   <div>
                     <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Estado API Socket</p>
                     <p className="text-lg font-black mt-1">Conectado (8728/SSL)</p>
                   </div>
                   <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Ver Logs</button>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Modal Planes */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-xl sm:rounded-[3rem] shadow-2xl p-10 sm:p-14 relative animate-in slide-in-from-bottom duration-300">
            <button onClick={() => setShowPlanModal(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-950 transition-colors"><X size={28} /></button>
            <div className="mb-12 flex items-center gap-6">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/30"><Zap size={32} /></div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 leading-none">Perfil MikroTik</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Injection Policy: Queue / Profile</p>
              </div>
            </div>
            <form className="space-y-8" onSubmit={e => { e.preventDefault(); setShowPlanModal(null); alert('Actualizando MikroTik RouterOS... Plan inyectado correctamente.'); }}>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Nombre del Plan (SSID/PPP Name)</label>
                 <input type="text" defaultValue={showPlanModal.name} className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10" placeholder="Ej: Nuga Fibra 100M" />
               </div>
               <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Download Limit (M)</label>
                   <input type="number" defaultValue={showPlanModal.download} className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Upload Limit (M)</label>
                   <input type="number" defaultValue={showPlanModal.upload} className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold" />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Precio Mensual ($)</label>
                 <input type="number" defaultValue={showPlanModal.price} className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-black text-slate-900" />
               </div>
               <button type="submit" className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-indigo-600/30 active:scale-95 transition-all">Sincronizar en Toda la Red</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MikrotikConfigView;
