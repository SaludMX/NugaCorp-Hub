
import React from 'react';
import { 
  Globe, Users, Server, DollarSign, Activity, ChevronRight, 
  Plus, AlertCircle, ShieldCheck, Zap, Layers, BarChart3, TrendingUp
} from 'lucide-react';
import { GLOBAL_STATS, MOCK_WISPS } from '../constants';
import { useNavigate } from 'react-router-dom';

const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Global Hub Control</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-4 flex items-center gap-3">
             <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
             NugaCorp Management Layer • Central Node Active
          </p>
        </div>
        <button className="bg-indigo-600 text-white px-10 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-indigo-600/30 active:scale-95 transition-all flex items-center gap-4">
           <Plus size={20} /> Onboard New WISP
        </button>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'WISPs Activos', val: GLOBAL_STATS.totalWisps, icon: <Layers />, color: 'indigo' },
           { label: 'Abonados Globales', val: GLOBAL_STATS.totalClients.toLocaleString(), icon: <Users />, color: 'emerald' },
           { label: 'Nodos MikroTik', val: GLOBAL_STATS.totalMikrotiks, icon: <Server />, color: 'blue' },
           { label: 'System Uptime', val: GLOBAL_STATS.systemUptime, icon: <Activity />, color: 'orange' },
         ].map((kpi, i) => (
           <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between h-44 group hover:border-indigo-400 transition-all cursor-pointer relative overflow-hidden">
              <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${kpi.color}-50/50 rounded-full blur-3xl group-hover:scale-150 transition-transform`}></div>
              <div className="flex justify-between items-start relative z-10">
                 <div className={`p-4 bg-${kpi.color}-50 text-${kpi.color}-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm`}>
                    {kpi.icon}
                 </div>
                 <TrendingUp size={16} className="text-emerald-500" />
              </div>
              <div className="relative z-10">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                 <p className="text-3xl font-black text-slate-900 tracking-tighter mt-1">{kpi.val}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Tenant List */}
         <div className="lg:col-span-2 bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Socio-Tenants (WISPs)</h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Ecosistema de Redes Federadas</p>
               </div>
               <div className="flex gap-2">
                  <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">v4.2-STABLE</div>
               </div>
            </div>
            
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-slate-50/50">
                        <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Empresa / Dominio</th>
                        <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Plan Hub</th>
                        <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Quota Abonados</th>
                        <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Revenue (30d)</th>
                        <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Salud API</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {MOCK_WISPS.map(w => (
                        <tr key={w.id} className="hover:bg-slate-50 transition-all group cursor-pointer">
                           <td className="px-10 py-8">
                              <div className="flex items-center gap-5">
                                 <div className="w-12 h-12 rounded-[1.2rem] flex items-center justify-center text-white font-black shadow-xl group-hover:scale-110 transition-transform" style={{ backgroundColor: w.primaryColor }}>
                                    {w.name.charAt(0)}
                                 </div>
                                 <div>
                                    <p className="font-black text-slate-900 text-sm">{w.name}</p>
                                    <p className="text-[10px] text-indigo-500 font-mono font-bold">{w.subdomain}.nugacorp.hub</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-10 py-8 text-center">
                              <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black border ${
                                 w.plan === 'ENTERPRISE' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                              }`}>{w.plan}</span>
                           </td>
                           <td className="px-10 py-8 text-center">
                              <div className="space-y-2">
                                 <p className="text-xs font-black text-slate-700">{w.currentClients} / {w.maxClients}</p>
                                 <div className="w-24 mx-auto h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(w.currentClients/w.maxClients)*100}%` }}></div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-10 py-8 text-right">
                              <p className="text-sm font-black text-slate-900">${w.revenue.toLocaleString()}</p>
                              <p className="text-[9px] font-bold text-emerald-500 uppercase mt-1">+12% Profit</p>
                           </td>
                           <td className="px-10 py-8 text-right">
                              <div className="flex justify-end gap-1">
                                 {[1,2,3,4,5].map(i => (
                                    <div key={i} className={`w-1.5 h-4 rounded-full ${i <= 4 ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                                 ))}
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Infrastructure Monitoring */}
         <div className="space-y-8">
            <div className="bg-slate-950 rounded-[3.5rem] p-10 text-white relative overflow-hidden shadow-2xl border border-white/5 h-full">
               <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
               <div className="relative z-10 space-y-12">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-indigo-600/30">
                        <BarChart3 size={32} />
                     </div>
                     <div>
                        <h3 className="text-2xl font-black tracking-tight leading-none uppercase">Central Nodes</h3>
                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-2">Resource Utilization</p>
                     </div>
                  </div>
                  
                  <div className="space-y-8">
                     {[
                        { label: 'CPU Cluster', val: '24%', color: 'indigo' },
                        { label: 'RAM Pool', val: '62%', color: 'emerald' },
                        { label: 'API Gateway Sockets', val: '1,245', color: 'orange' },
                     ].map((item, i) => (
                        <div key={i} className="space-y-3">
                           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                              <span className="text-slate-400">{item.label}</span>
                              <span className={`text-${item.color}-400`}>{item.val}</span>
                           </div>
                           <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                              <div className={`h-full bg-${item.color}-500 rounded-full`} style={{ width: item.val.includes('%') ? item.val : '70%' }}></div>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center gap-5">
                     <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                        <ShieldCheck className="text-emerald-400" size={24} />
                     </div>
                     <div>
                        <p className="text-xs font-black uppercase">Core v2 Firewall</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Filtering 2.4k req/sec</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
