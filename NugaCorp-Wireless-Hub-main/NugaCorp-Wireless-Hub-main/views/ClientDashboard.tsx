
import React, { useState } from 'react';
import { 
  Activity, CreditCard, Package, HelpCircle, ArrowUpRight, CheckCircle2, 
  AlertTriangle, ShieldCheck, Loader2, Edit3, Settings, Trophy, Star, 
  Zap, Gift, ChevronRight, TrendingUp, Sparkles, Target,
  Globe, Receipt, Users, Award, Rocket, Download, FileCode
} from 'lucide-react';
import { MOCK_CLIENT, MOCK_INVOICES, MOCK_PLANS } from '../constants';
import NetworkChart from '../components/NetworkChart';

const ClientDashboard: React.FC = () => {
  const [isReporting, setIsReporting] = useState(false);
  const [isBoosting, setIsBoosting] = useState(false);
  const currentPlan = MOCK_PLANS.find(p => p.id === MOCK_CLIENT.planId);
  const usagePercentage = (MOCK_CLIENT.currentUsage / MOCK_CLIENT.limitUsage) * 100;

  const handleBoost = () => {
    if (MOCK_CLIENT.points < 500) {
      alert("No tienes suficientes puntos para un Boost de velocidad.");
      return;
    }
    setIsBoosting(true);
    setTimeout(() => {
      setIsBoosting(false);
      alert("¡BOOST ACTIVADO! MikroTik ha reconfigurado tu Simple Queue. Disfruta de +50Mbps por las próximas 24 horas.");
    }, 2500);
  };

  const getRankColor = (rank: string) => {
    switch(rank) {
      case 'PLATINUM': return 'from-slate-300 via-slate-100 to-slate-400 text-slate-600';
      case 'GOLD': return 'from-amber-400 via-yellow-200 to-amber-600 text-amber-800';
      case 'SILVER': return 'from-slate-400 via-slate-200 to-slate-500 text-slate-600';
      default: return 'from-orange-500 via-orange-300 to-orange-700 text-orange-900';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-10 pb-20 px-1 sm:px-0 animate-in fade-in duration-700">
      
      {/* Nuga Rewards Hero - Gamification Central */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative rounded-[2rem] lg:rounded-[3.5rem] overflow-hidden bg-slate-900 p-8 sm:p-12 shadow-2xl border border-white/5 group">
           <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 group-hover:scale-110 transition-transform">
                       <Trophy size={28} />
                    </div>
                    <div>
                       <h2 className="text-xl font-black text-white uppercase tracking-widest">Nuga Rewards</h2>
                       <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] mt-1">Socio de Red Nivel Avanzado</p>
                    </div>
                 </div>
                 <div className={`px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest bg-gradient-to-br shadow-xl ${getRankColor(MOCK_CLIENT.rank)}`}>
                    Rango {MOCK_CLIENT.rank}
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-end gap-8">
                 <div className="space-y-2">
                    <p className="text-5xl sm:text-7xl font-black text-white tracking-tighter flex items-baseline gap-4">
                       {MOCK_CLIENT.points.toLocaleString()} 
                       <span className="text-lg font-black text-indigo-400 uppercase tracking-[0.2em]">PTS</span>
                    </p>
                    <div className="pt-4 space-y-3">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 tracking-widest">
                          <span>Progreso a PLATINUM</span>
                          <span className="text-indigo-400">{MOCK_CLIENT.nextRankProgress}%</span>
                       </div>
                       <div className="w-64 sm:w-80 h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-1000" style={{ width: `${MOCK_CLIENT.nextRankProgress}%` }}></div>
                       </div>
                    </div>
                 </div>
                 <div className="flex gap-4 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none py-5 px-10 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-600/30">
                       <Gift size={18} /> Canjear Puntos
                    </button>
                    <button className="flex-1 sm:flex-none py-5 px-8 bg-white/5 text-white border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">
                       Ranking Local
                    </button>
                 </div>
              </div>
           </div>
           
           {/* Decoración de fondo */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -mr-40 -mt-40 group-hover:bg-indigo-600/20 transition-colors duration-700"></div>
           <Award className="absolute bottom-12 right-12 text-white/5 group-hover:scale-125 transition-transform duration-1000" size={180} />
        </div>

        <div className="bg-indigo-600 rounded-[2rem] lg:rounded-[3.5rem] p-8 sm:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-md">
                    <Target size={24} />
                 </div>
                 <h3 className="text-white font-black uppercase text-[10px] tracking-widest">Reto de Pago</h3>
              </div>
              <p className="text-3xl font-black text-white leading-tight">"Pago Rayo" ⚡️</p>
              <p className="text-indigo-100 text-xs font-medium mt-4 leading-relaxed opacity-90">
                Paga tu factura antes del día 05 y recibe <span className="font-black text-white underline decoration-white/30">+500 PTS</span> y un <span className="font-black text-white">Speed Boost gratis</span>.
              </p>
           </div>
           
           <div className="mt-8 pt-6 border-t border-white/20 relative z-10">
              <div className="flex justify-between items-center text-white mb-3">
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Tu Progreso</span>
                 <span className="text-xs font-black">75%</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                 <div className="h-full bg-white rounded-full shadow-[0_0_10px_white] transition-all duration-1000 w-3/4"></div>
              </div>
           </div>
           <Sparkles className="absolute top-8 right-8 text-white/10 group-hover:rotate-12 transition-transform duration-700" size={100} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 mt-10">
        {/* Connection Status Card */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] lg:rounded-[3.5rem] p-6 sm:p-10 border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <div>
              <h3 className="font-black text-[11px] uppercase tracking-[0.25em] text-slate-400 flex items-center gap-3">
                <Activity className="text-indigo-600" size={18} /> Telemetría de tu Enlace
              </h3>
            </div>
            <div className="flex gap-2">
               <span className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black border border-emerald-100 tracking-widest">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                  GIGAFIBRA ACTIVE
               </span>
            </div>
          </div>
          
          <div className="flex-1 min-h-[250px] sm:min-h-[350px]">
            <NetworkChart />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[
              { label: 'Latencia (Ping)', value: '12 ms', sub: 'Latencia Gaming OK', icon: <Activity size={14} className="text-indigo-500"/> },
              { label: 'Salud de Enlace', value: '100%', sub: 'Cero Packet Loss', icon: <ShieldCheck size={14} className="text-emerald-500"/> },
              { label: 'Gateway NOC', value: '187.12.34.120', sub: 'MikroTik Core S1', icon: <Globe size={14} className="text-indigo-500"/> },
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col justify-center text-left hover:bg-white hover:border-indigo-100 transition-all shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  {stat.icon}
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                </div>
                <p className="text-xl sm:text-2xl font-black text-slate-900 truncate">{stat.value}</p>
                <p className="text-[9px] font-bold text-slate-400 mt-1.5 uppercase tracking-tighter">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Plan & Speed Boost Interaction */}
        <div className="bg-white rounded-[2rem] lg:rounded-[3.5rem] p-8 sm:p-10 border border-slate-200 shadow-sm flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <Package className="text-indigo-600" size={24} />
                  <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Plan de Servicio</h3>
               </div>
               <button 
                onClick={handleBoost}
                disabled={isBoosting}
                className={`p-4 rounded-2xl transition-all shadow-xl active:scale-90 ${isBoosting ? 'bg-indigo-100 text-indigo-400' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/20'}`}
               >
                  {isBoosting ? <Loader2 size={24} className="animate-spin" /> : <Rocket size={24} />}
               </button>
            </div>
            
            <div className="space-y-10">
              <div>
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">{currentPlan?.name}</h2>
                <div className="flex items-baseline gap-3 mt-3">
                  <span className="text-5xl font-black text-indigo-600 tracking-tight">{currentPlan?.download}</span>
                  <span className="text-slate-500 font-black uppercase text-[11px] tracking-widest">Mbps Simétricos</span>
                </div>
              </div>

              <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-8 relative overflow-hidden group/cons">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 rounded-full blur-xl -mr-12 -mt-12"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-end mb-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Datos Consumidos (Mes)</span>
                      <span className="text-sm font-black text-slate-900">{MOCK_CLIENT.currentUsage} <span className="text-slate-400">/ {MOCK_CLIENT.limitUsage} GB</span></span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden border border-white">
                      <div 
                        className="h-full bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.3)] transition-all duration-1000"
                        style={{ width: `${usagePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 pt-2 border-t border-slate-200/50">
                     <div className="flex items-center gap-2">
                        <Star size={16} className="text-amber-400 fill-amber-400 animate-pulse" /> Multiplicador x1.5 {MOCK_CLIENT.rank}
                     </div>
                     <div className="text-emerald-600 font-black">Bonus Active</div>
                  </div>
              </div>
            </div>
          </div>

          <div className="mt-12 relative z-10">
            <button className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] hover:bg-slate-900 transition-all shadow-2xl flex items-center justify-center gap-4 group/btn overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
               <TrendingUp size={20} className="group-hover/btn:scale-110 transition-transform" /> Mejorar mi Plan
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mt-10">
        {/* Invoices List - Fiscal UX */}
        <div className="bg-white rounded-[2rem] lg:rounded-[3.5rem] p-8 sm:p-12 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="font-black text-slate-900 uppercase text-sm tracking-[0.2em]">Facturación CFDI 4.0</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase mt-2">Documentos Fiscales Validados</p>
            </div>
            {/* Fix: Added missing Download icon to lucide-react imports */}
            <button className="text-indigo-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all">
              <Download size={16} /> Descargar Historial
            </button>
          </div>
          <div className="space-y-5">
            {MOCK_INVOICES.map(inv => (
              <div key={inv.id} className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between group hover:bg-white hover:border-indigo-200 transition-all shadow-sm">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${
                    inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    <Receipt size={24} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-base">Factura {inv.id.split('_')[1].toUpperCase()}</p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase mt-1 tracking-tight">{inv.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-10">
                   <div className="hidden sm:block text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Estatus SAT</p>
                      <span className={`text-[9px] font-black px-3 py-1 rounded-xl border flex items-center gap-2 ${inv.isStamped ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                         {inv.isStamped && <CheckCircle2 size={10} />}
                         {inv.isStamped ? 'TIMBRADA' : 'EMISIÓN PENDIENTE'}
                      </span>
                   </div>
                   <div className="text-right">
                      <p className="font-black text-slate-900 text-xl tracking-tight">${inv.amount.toLocaleString()}.00</p>
                      <div className="flex gap-4 mt-2 justify-end">
                         {/* Fix: Added missing FileCode icon to lucide-react imports */}
                         <button className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1"><FileCode size={12}/> XML</button>
                         {/* Fix: Added missing Download icon to lucide-react imports */}
                         <button className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1"><Download size={12}/> PDF</button>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nuga Ecosystem & Rewards Canje */}
        <div className="bg-white rounded-[2rem] lg:rounded-[3.5rem] p-8 sm:p-12 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>
          <h3 className="font-black text-slate-900 uppercase text-sm tracking-[0.2em] mb-10">Ecosistema Nuga Rewards</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <button className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100 text-left hover:border-indigo-300 transition-all group/card shadow-sm relative overflow-hidden">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm mb-6 group-hover/card:scale-110 transition-transform border border-slate-100">
                   <Users size={28} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Referidos</p>
                <p className="text-lg font-black text-slate-900 leading-tight">Gana 1,500 Puntos</p>
                <p className="text-[10px] font-medium text-slate-500 mt-3 leading-relaxed">Por cada vecino que contrate fibra con tu código: <span className="font-black text-indigo-600">NUGA-REF-42</span></p>
             </button>

             <button 
              onClick={handleBoost}
              className="p-8 bg-indigo-950 text-white rounded-[3rem] border border-indigo-800 text-left hover:bg-slate-900 transition-all group/card shadow-2xl relative overflow-hidden"
             >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400 shadow-sm mb-6 group-hover/card:scale-110 transition-transform border border-white/5">
                     <Rocket size={28} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-50">Canje Exprés</p>
                  <p className="text-lg font-black text-white leading-tight">Speed Boost 24h</p>
                  <p className="text-[10px] font-medium opacity-70 mt-3">Coste: <span className="text-indigo-400 font-black">500 PTS</span>. Se aplica inmediatamente a tu cuenta.</p>
                </div>
             </button>
          </div>
          
          <div className="mt-10 p-8 bg-indigo-50 rounded-[3rem] flex items-center justify-between border border-indigo-100 group/help cursor-pointer hover:bg-indigo-100 transition-all">
             <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0 border border-indigo-50 group-hover/help:rotate-12 transition-transform">
                   <HelpCircle size={28} />
                </div>
                <div>
                   <p className="text-base font-black text-indigo-900 leading-none">¿Dudas con tus puntos?</p>
                   <p className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.2em] mt-2">Chat con NugaBot Soporte IA</p>
                </div>
             </div>
             <ChevronRight size={24} className="text-indigo-300 group-hover/help:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
