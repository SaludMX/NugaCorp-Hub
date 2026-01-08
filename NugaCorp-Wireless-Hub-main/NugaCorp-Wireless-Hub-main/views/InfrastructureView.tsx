
import React, { useState } from 'react';
import { MOCK_ZONES } from '../constants';
import { Signal, MapPin, Plus, LayoutGrid, Server, Wifi, X, Radar, Compass } from 'lucide-react';

const InfrastructureView: React.FC = () => {
  const [showZoneModal, setShowZoneModal] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none">Zonas & Torres</h1>
          <p className="text-slate-500 mt-2 uppercase text-[10px] font-black tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Distribución Regional NugaCorp
          </p>
        </div>
        <button 
          onClick={() => setShowZoneModal(true)}
          className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20"
        >
          <Plus size={18} /> Nueva Zona / Torre
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:gap-10">
        {MOCK_ZONES.map(zone => (
          <div key={zone.id} className="bg-white rounded-[2rem] lg:rounded-[3.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            <div className="p-6 lg:p-12 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
              
              <div className="w-full lg:w-auto flex flex-row lg:flex-col items-center justify-between lg:justify-start gap-6 shrink-0 lg:border-r border-slate-100 lg:pr-12">
                 <div className={`w-20 h-20 lg:w-28 lg:h-28 rounded-[2rem] lg:rounded-[2.5rem] flex items-center justify-center transition-all ${
                   zone.status === 'ONLINE' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' : 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white'
                 }`}>
                   <Signal size={40} className="lg:hidden" />
                   <Signal size={56} className="hidden lg:block" />
                 </div>
                 <div className="text-right lg:text-center space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado Zona</p>
                    <p className={`font-black uppercase text-xs lg:text-sm ${zone.status === 'ONLINE' ? 'text-emerald-500' : 'text-orange-500'}`}>
                      {zone.status}
                    </p>
                 </div>
              </div>
              
              <div className="flex-1 space-y-8 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
                  <div>
                    <h3 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight">{zone.name}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-slate-400 mt-2">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-indigo-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{zone.location.lat}, {zone.location.lng}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <LayoutGrid size={14} className="text-indigo-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest font-mono">{zone.ipRange}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className="text-center px-6 py-4 bg-slate-50 rounded-3xl border border-slate-100 min-w-[120px]">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Clientes</p>
                      <p className="text-xl font-black text-slate-900 leading-none">{zone.clientsCount}</p>
                    </div>
                    <div className="text-center px-6 py-4 bg-slate-50 rounded-3xl border border-slate-100 min-w-[120px]">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Equipos</p>
                      <p className="text-xl font-black text-slate-900 leading-none">{zone.devices.length}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
                  {zone.devices.map(dev => (
                    <div key={dev.id} className="p-5 bg-white rounded-3xl border border-slate-100 flex items-center gap-4 hover:border-indigo-200 transition-all shadow-sm">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-all shrink-0">
                        {dev.type === 'ROUTER' ? <Server size={24} /> : <Wifi size={24} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-900 truncate">{dev.model}</p>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{dev.type} • {dev.ip}</p>
                      </div>
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nueva Zona */}
      {showZoneModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
          <div className="bg-white w-full max-w-2xl sm:rounded-[3rem] shadow-2xl p-8 sm:p-12 relative h-[85vh] sm:h-auto animate-in zoom-in duration-300">
            <button onClick={() => setShowZoneModal(false)} className="absolute top-8 right-8 text-slate-400"><X size={28} /></button>
            <div className="mb-10 flex items-center gap-5">
              <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Radar size={28} /></div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 leading-none">Nueva Zona / Torre</h2>
                <p className="text-slate-500 text-sm mt-1 uppercase font-black text-[10px] tracking-widest">Registro de Punto de Presencia (PoP)</p>
              </div>
            </div>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setShowZoneModal(false); }}>
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nombre de la Zona o Nodo</label>
                 <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" placeholder="Ej: Torre Poniente San Luis" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Latitud</label>
                   <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono font-bold" placeholder="19.4321" />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Longitud</label>
                   <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono font-bold" placeholder="-99.1234" />
                 </div>
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">MikroTik Gestión (IP)</label>
                 <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono font-bold" placeholder="10.x.x.x" />
               </div>
               <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-950/20 active:scale-95 transition-all">Registrar Nodo en Red</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfrastructureView;
