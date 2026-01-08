
import React, { useState } from 'react';
import { 
  Network, Share2, Activity, Globe, Shield, RefreshCw, Plus, 
  Settings2, ArrowRightLeft, ListTree, Database, Cpu, Loader2, Sparkles, AlertTriangle,
  // Added missing CheckCircle2 icon
  CheckCircle2
} from 'lucide-react';
import { MOCK_ZONES } from '../constants';

const MOCK_NEIGHBORS = [
  { id: 'n1', routerId: '10.255.255.1', address: '172.16.0.1', state: 'FULL', priority: 1, cost: 10, uptime: '14d 05h' },
  { id: 'n2', routerId: '10.255.255.2', address: '172.16.0.5', state: 'FULL', priority: 1, cost: 50, uptime: '02h 12m' },
  { id: 'n3', routerId: '10.255.255.3', address: '172.16.1.2', state: 'INIT', priority: 0, cost: 100, uptime: '00m 05s' },
];

const OSPFView: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const handleAIAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      alert("NugaBot AI: Se detecta flapping en el vecino 10.255.255.3. Sugerencia: Revisa la alineación del radioenlace en la Zona Torre Centro.");
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none">OSPF Dynamic Routing</h1>
          <p className="text-slate-500 mt-2 uppercase text-[10px] font-black tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            Área Backbone 0.0.0.0 • MikroTik RouterOS
          </p>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <button 
            onClick={handleAIAnalysis}
            disabled={isAnalyzing}
            className="flex-1 lg:flex-none bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} className="text-indigo-400" />}
            Análisis de Convergencia
          </button>
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="flex-1 lg:flex-none bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            {isSyncing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            Sincronizar LSA
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {[
           { label: 'Vecinos Activos', val: '12', icon: <Share2 size={18}/>, color: 'indigo' },
           { label: 'Áreas OSPF', val: '3', icon: <Globe size={18}/>, color: 'emerald' },
           { label: 'Rutas Dinámicas', val: '248', icon: <Database size={18}/>, color: 'blue' },
           { label: 'Router ID', val: '10.255.255.254', icon: <Shield size={18}/>, color: 'slate' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between h-36">
              <div className="flex justify-between items-start">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                 <div className={`p-2 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl`}>{stat.icon}</div>
              </div>
              <p className="text-xl font-black text-slate-900 tracking-tight">{stat.val}</p>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <ListTree size={24} />
              </div>
              <div>
                 <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Tabla de Vecinos OSPF</h3>
                 <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Monitoreo de Adyacencias en Tiempo Real</p>
              </div>
           </div>
           <div className="flex gap-2">
              <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                <Plus size={14} /> Agregar Interface
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-slate-50/50">
                    <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Router ID / Peer</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Estado Adyacencia</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Costo / Métrica</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Uptime</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Acciones</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {MOCK_NEIGHBORS.map(neighbor => (
                   <tr key={neighbor.id} className="hover:bg-slate-50/80 transition-all group">
                      <td className="px-10 py-8">
                         <div className="flex items-center gap-5">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                               <ArrowRightLeft size={18} />
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-900">{neighbor.routerId}</p>
                               <p className="text-[9px] font-mono text-slate-400 mt-1">ADDR: {neighbor.address}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-10 py-8">
                         <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border w-fit ${
                           neighbor.state === 'FULL' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                           neighbor.state === 'INIT' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-red-50 text-red-700 border-red-100'
                         }`}>
                            {neighbor.state === 'FULL' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                            <span className="text-[10px] font-black uppercase tracking-widest">{neighbor.state}</span>
                         </div>
                      </td>
                      <td className="px-10 py-8 text-center">
                         <p className="text-sm font-black text-slate-900">{neighbor.cost}</p>
                         <p className="text-[9px] font-bold text-slate-300 uppercase mt-0.5">METRIC</p>
                      </td>
                      <td className="px-10 py-8">
                         <p className="text-[10px] font-black uppercase text-slate-500">{neighbor.uptime}</p>
                      </td>
                      <td className="px-10 py-8 text-right">
                         <div className="flex justify-end gap-2">
                            <button className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200 shadow-sm"><Settings2 size={18} /></button>
                         </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default OSPFView;
