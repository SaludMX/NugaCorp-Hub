
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Server, Settings2, Shield, Zap, RefreshCw, Database,
  HardDrive, Bot, X, Radio, Network, UserCheck, BarChart3, Globe, Cpu as CpuIcon,
  Activity, Terminal
} from 'lucide-react';

const MOCK_ROUTERS = [
  { id: 'rb-1', name: 'Nuga-Core-CCR', ip: '187.162.3.1', user: 'admin', api: '8728', cpu: '12%', ram: '2.4GB', status: 'ONLINE', zone: 'CDMX-Central' },
  { id: 'rb-2', name: 'RB5009-Puebla', ip: '187.162.3.12', user: 'admin', api: '8728', cpu: '45%', ram: '1GB', status: 'ONLINE', zone: 'Puebla-PoP' },
];

const RouterListView: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState<any>(null);
  const [showToolsModal, setShowToolsModal] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  const handleAddRouter = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Sincronizando con MikroTik RouterOS... Validando API Socket... Router vinculado correctamente.');
    setShowAddModal(false);
  };

  const runTool = (name: string) => {
    setIsScanning(true);
    setConsoleLogs([`Initializing ${name} on socket 8728...`, `Connection established.`, `Querying RouterOS API tables...`]);
    setTimeout(() => {
      setConsoleLogs(prev => [...prev, `Found 42 active interfaces.`, `Status: OK.`]);
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-10">
        <div className="flex items-center gap-6">
           <div className="w-20 h-20 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl transition-transform hover:scale-105">
              <Network size={40} />
           </div>
           <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Nodos & Gateways</h1>
              <p className="text-slate-500 mt-3 uppercase text-[10px] font-black tracking-[0.3em] flex items-center gap-3">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                 API MikroTik v7.x Active
              </p>
           </div>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-5 rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-4 active:scale-95 transition-all"
        >
          <Plus size={20} /> Vincular Core
        </button>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-6 items-center bg-slate-50/20">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" placeholder="IP, Nombre o Zona de Red..." className="w-full pl-16 pr-8 py-5 bg-white border border-slate-200 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none" />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <button onClick={() => alert('Refrescando estado de los sockets MikroTik...')} className="p-5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm active:scale-90">
               <RefreshCw size={24} />
             </button>
             <button className="flex-1 md:flex-none px-10 py-5 bg-slate-950 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-4 shadow-2xl active:scale-95 transition-all">
               <Bot size={18} /> Auditoría IA
             </button>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-12 py-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Router / Nodo</th>
                <th className="px-12 py-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Host / API</th>
                <th className="px-12 py-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Performance</th>
                <th className="px-12 py-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Estado Core</th>
                <th className="px-12 py-8 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Mantenimiento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_ROUTERS.map(router => (
                <tr key={router.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-12 py-10">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center font-bold shadow-xl group-hover:scale-110 transition-transform">
                        <HardDrive size={30} />
                      </div>
                      <div>
                        <p className="text-lg font-black text-slate-900">{router.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                           <Globe size={12} /> {router.zone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-12 py-10">
                    <div className="flex items-center gap-4">
                       <Globe size={18} className="text-indigo-500" />
                       <p className="text-sm font-mono font-black text-slate-700">{router.ip}</p>
                    </div>
                    <p className="text-[9px] font-black text-indigo-500 uppercase mt-2 tracking-widest">Socket: {router.api}/TLS</p>
                  </td>
                  <td className="px-12 py-10">
                    <div className="flex gap-4">
                       <div className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-4">
                         <CpuIcon size={18} className="text-slate-400" />
                         <span className="text-xs font-black text-slate-900">{router.cpu}</span>
                       </div>
                       <div className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-4">
                         <Database size={18} className="text-slate-400" />
                         <span className="text-xs font-black text-slate-900">{router.ram}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-12 py-10">
                    <div className="flex items-center gap-4 px-5 py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-[1.5rem] w-fit">
                       <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                       <span className="text-[10px] font-black uppercase tracking-[0.2em]">Connected</span>
                    </div>
                  </td>
                  <td className="px-12 py-10 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => { setShowToolsModal(router); setConsoleLogs(['Waiting for commands...']); }} 
                        className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm active:scale-90"
                        title="Tools"
                      >
                        <Zap size={22} />
                      </button>
                      <button 
                        onClick={() => setShowConfigModal(router)}
                        className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-950 hover:border-slate-300 transition-all shadow-sm active:scale-90"
                        title="Config"
                      >
                        <Settings2 size={22} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Agregar Router */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl sm:rounded-[3rem] shadow-2xl p-10 lg:p-14 relative animate-in slide-in-from-bottom duration-300">
            <button onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-950 transition-colors"><X size={32} /></button>
            <div className="mb-12 flex items-center gap-6">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl"><Plus size={32} /></div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 leading-none">Vincular Core Router</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Sincronización API MikroTik RouterOS</p>
              </div>
            </div>
            <form className="space-y-8" onSubmit={handleAddRouter}>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Identificador Interno</label>
                   <input type="text" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" placeholder="Ej: MikroTik-NOC-01" required />
                 </div>
                 <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">IP Pública / DDNS</label>
                   <input type="text" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono font-bold" placeholder="187.x.x.x" required />
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">User API</label>
                   <input type="text" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold" defaultValue="admin" required />
                 </div>
                 <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Password</label>
                   <input type="password" placeholder="••••••••" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold" required />
                 </div>
               </div>
               <div className="p-8 bg-indigo-50/50 rounded-[2rem] border border-indigo-100 flex items-start gap-6">
                  <Shield size={28} className="text-indigo-600 shrink-0" />
                  <p className="text-xs font-bold text-indigo-900/60 leading-relaxed">
                    NugaCorp recomienda usar el puerto <b>8729 (SSL)</b> para comunicaciones seguras entre el hub y los nodos remotos.
                  </p>
               </div>
               <button type="submit" className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-[12px] tracking-[0.2em] shadow-2xl shadow-indigo-600/30 active:scale-95 transition-all">Sincronizar Gateway en Red</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Herramientas (Interactiva) */}
      {showToolsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl sm:rounded-[3rem] shadow-2xl p-12 lg:p-14 relative animate-in zoom-in duration-300">
            <button onClick={() => setShowToolsModal(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-950"><X size={32} /></button>
            <div className="mb-12">
               <h2 className="text-3xl font-black text-slate-900 leading-none">Terminal de Diagnóstico</h2>
               <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-4 flex items-center gap-3">
                 <Terminal size={14} className="text-indigo-600" /> NOC: {showToolsModal.name} • {showToolsModal.ip}
               </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
               {[
                  { name: 'Torch', icon: <Radio size={22} /> },
                  { name: 'ARP Scan', icon: <Network size={22} /> },
                  { name: 'Traffic', icon: <BarChart3 size={22} /> },
                  { name: 'Ping 8.8.8.8', icon: <Activity size={22} /> },
               ].map((tool, idx) => (
                 <button 
                  key={idx} 
                  onClick={() => runTool(tool.name)}
                  className="flex flex-col items-center gap-4 p-8 bg-slate-50 hover:bg-white border border-slate-100 hover:border-indigo-200 rounded-[2.5rem] transition-all group active:scale-95 shadow-sm"
                 >
                   <div className="text-indigo-600 transition-transform group-hover:scale-125">{tool.icon}</div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{tool.name}</span>
                 </button>
               ))}
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-8 min-h-[250px] relative overflow-hidden">
               <div className="absolute top-4 right-6 flex gap-2">
                 <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                 <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                 <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
               </div>
               <div className="font-mono text-[11px] space-y-2 text-indigo-300">
                  {consoleLogs.map((log, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="opacity-30">[{new Date().toLocaleTimeString()}]</span>
                      <span className="text-emerald-400">$</span>
                      <span className="text-slate-100">{log}</span>
                    </div>
                  ))}
                  {isScanning && <div className="animate-pulse text-indigo-400">Requesting data from RouterOS API core...</div>}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouterListView;
