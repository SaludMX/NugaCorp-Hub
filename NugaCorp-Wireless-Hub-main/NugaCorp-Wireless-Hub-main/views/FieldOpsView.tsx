
import React, { useState, useEffect } from 'react';
import { 
  MapPin, Navigation, Smartphone, CheckSquare, Clock, 
  ChevronRight, Users, Compass, AlertCircle, Loader2, Sparkles, UserCheck, Search, Filter
} from 'lucide-react';
import { MOCK_STAFF, MOCK_TICKETS } from '../constants';

const FieldOpsView: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState<'MAP' | 'TASKS'>('MAP');

  useEffect(() => {
    if (trackingEnabled) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [trackingEnabled]);

  const techsInField = MOCK_STAFF.filter(s => s.status === 'ON_FIELD');
  const openTasks = MOCK_TICKETS.filter(t => t.status === 'OPEN');

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-10 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 leading-none">Despacho & Campo</h1>
          <p className="text-slate-500 mt-2 uppercase text-[10px] font-black tracking-widest flex items-center gap-2">
            <Smartphone size={14} className="text-indigo-600" />
            Field Ops Intelligence Gateway
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setTrackingEnabled(!trackingEnabled)}
            className={`flex-1 sm:flex-none px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl ${
              trackingEnabled ? 'bg-indigo-600 text-white shadow-indigo-600/20' : 'bg-white text-slate-500 border border-slate-200'
            }`}
          >
            {trackingEnabled ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
            {trackingEnabled ? 'Tracking Activo' : 'Activar GPS'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {/* Vista de Mapa Simplificada (Dashboard Admin de Campo) */}
           <div className="bg-slate-900 rounded-[3rem] h-[500px] relative overflow-hidden border border-slate-800 shadow-2xl group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              
              {/* Representación Visual de Técnicos y Tareas */}
              <div className="absolute inset-0 flex items-center justify-center">
                 {!trackingEnabled ? (
                   <div className="text-center space-y-4">
                      <Compass size={64} className="text-white/10 mx-auto animate-spin-slow" />
                      <p className="text-white/30 font-black uppercase text-[10px] tracking-widest">Esperando Telemetría de GPS...</p>
                   </div>
                 ) : (
                   <div className="relative w-full h-full">
                      {/* Marcador Técnico (Simulado en el centro) */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                         <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-20"></div>
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl border-4 border-white shadow-2xl flex items-center justify-center text-white relative z-10">
                               <Navigation size={24} className="rotate-45" />
                            </div>
                         </div>
                      </div>

                      {/* Marcadores de Tareas Cercanas (Simulados) */}
                      {openTasks.map((t, idx) => (
                        <div 
                          key={t.id} 
                          className="absolute bg-white p-3 rounded-2xl border border-slate-200 shadow-xl flex items-center gap-3 animate-bounce"
                          style={{ top: `${20 + idx * 30}%`, left: `${30 + idx * 40}%` }}
                        >
                           <div className="w-8 h-8 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                              <AlertCircle size={16} />
                           </div>
                           <div className="pr-2">
                              <p className="text-[9px] font-black text-slate-900 uppercase truncate w-24">{t.subject}</p>
                              <p className="text-[8px] font-bold text-slate-400">Dist: 2.4km</p>
                           </div>
                        </div>
                      ))}
                   </div>
                 )}
              </div>

              {/* Controles de Mapa */}
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center pointer-events-none">
                 <div className="pointer-events-auto bg-slate-950/80 backdrop-blur-md px-6 py-4 rounded-[1.5rem] border border-white/10 text-white flex items-center gap-6 shadow-2xl">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                       <span className="text-[10px] font-black uppercase tracking-widest">NOC-SAT-Link: OK</span>
                    </div>
                    <div className="w-px h-6 bg-white/10"></div>
                    <div className="flex items-center gap-3">
                       <Users size={16} className="text-indigo-400" />
                       <span className="text-[10px] font-black uppercase tracking-widest">{techsInField.length} Técnicos</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Lista de Técnicos Activos */}
           <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-2">
                   <UserCheck size={18} className="text-indigo-600" /> Disponibilidad de Equipo
                 </h3>
                 <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-indigo-600"><Search size={18} /></button>
                    <button className="p-2 text-slate-400 hover:text-indigo-600"><Filter size={18} /></button>
                 </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {MOCK_STAFF.map(staff => (
                   <div key={staff.id} className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between group hover:bg-white hover:border-indigo-200 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black">
                            {staff.name.charAt(0)}
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-900">{staff.name}</p>
                            <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${staff.status === 'ON_FIELD' ? 'text-indigo-600' : 'text-slate-400'}`}>
                              {staff.status === 'ON_FIELD' ? 'En Operación' : 'Disponible'}
                            </p>
                         </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Panel de Tareas Pendientes y Despacho */}
        <div className="space-y-6">
           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
              <h3 className="font-black text-slate-900 uppercase text-xs tracking-[0.2em] mb-8">Cola de Despacho</h3>
              <div className="space-y-4">
                 {openTasks.map(task => (
                   <div key={task.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4 hover:bg-white hover:border-indigo-100 transition-all group">
                      <div className="flex justify-between items-start">
                         <div className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-[8px] font-black uppercase tracking-widest">
                            ALTA PRIORIDAD
                         </div>
                         <span className="text-[10px] font-black text-slate-300">#{task.id}</span>
                      </div>
                      <div>
                         <h4 className="font-black text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{task.subject}</h4>
                         <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tight italic">"{task.description.substring(0, 40)}..."</p>
                      </div>
                      <div className="pt-4 border-t border-slate-200/50 flex items-center justify-between">
                         <div className="flex items-center gap-2 text-slate-400">
                            <Clock size={12} />
                            <span className="text-[9px] font-black uppercase">{task.createdAt}</span>
                         </div>
                         <button className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
                            <Navigation size={14} />
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-8 py-5 bg-slate-950 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-slate-950/10">
                 Asignación Automática IA
              </button>
           </div>

           {/* Stats de Productividad */}
           <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                       <CheckSquare size={24} />
                    </div>
                    <h3 className="text-xl font-black tracking-tight leading-none uppercase text-xs tracking-widest opacity-80">Cumplimiento</h3>
                 </div>
                 <div>
                    <p className="text-4xl font-black tracking-tighter">94% <span className="text-sm font-medium opacity-50 uppercase tracking-widest">SLA OK</span></p>
                    <div className="w-full h-2 bg-white/20 rounded-full mt-4 overflow-hidden">
                       <div className="h-full bg-white rounded-full w-[94%] shadow-[0_0_10px_white]"></div>
                    </div>
                 </div>
                 <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest leading-relaxed">
                   Tiempo promedio de resolución: <span className="text-white font-black underline">1.4 Horas</span>.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FieldOpsView;
