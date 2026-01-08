
import React, { useState } from 'react';
import { Wifi, Layers, Box, SignalHigh, SignalLow, SignalMedium, Plus, Search, MapPin, RefreshCw, X } from 'lucide-react';

const MOCK_SECTORIALS = [
  { id: 'sec-1', name: 'AP-Nuga-Norte-01', frequency: '5820 MHz', ssid: 'NugaCorp_Ventas_1', clients: 42, signal: 'Stable' },
  { id: 'sec-2', name: 'AP-Nuga-Sur-Omni', frequency: '2412 MHz', ssid: 'NugaCorp_Ventas_2', clients: 15, signal: 'Intermittent' },
];

const SectorialView: React.FC = () => {
  const [scanningId, setScanningId] = useState<string | null>(null);

  const handleScan = (id: string) => {
    setScanningId(id);
    setTimeout(() => {
      setScanningId(null);
      alert("Escaneo de espectro completado. Frecuencia recomendada: 5845 MHz.");
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 leading-none">Sectoriales & NAP</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Gestión de Acceso Inalámbrico y Distribución</p>
        </div>
        <button className="w-full sm:w-auto bg-slate-950 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all">
          <Plus size={18} /> Nueva Sectorial
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {MOCK_SECTORIALS.map(sec => (
          <div key={sec.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            {scanningId === sec.id && (
              <div className="absolute inset-0 bg-indigo-600/90 backdrop-blur-md z-10 flex flex-col items-center justify-center text-white p-8 text-center animate-in fade-in duration-300">
                <RefreshCw size={48} className="animate-spin mb-4" />
                <h4 className="text-lg font-black uppercase tracking-widest">Sincronizando Espectro</h4>
                <p className="text-xs font-medium opacity-80 mt-2">Analizando interferencias en {sec.frequency}...</p>
              </div>
            )}
            
            <div className="flex justify-between items-start mb-8">
               <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Wifi size={28} />
                 </div>
                 <div>
                   <h3 className="text-xl font-black text-slate-900">{sec.name}</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{sec.ssid}</p>
                 </div>
               </div>
               <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border ${
                 sec.signal === 'Stable' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
               }`}>{sec.signal}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                 <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Frecuencia</p>
                 <p className="text-xs font-black text-slate-700">{sec.frequency}</p>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                 <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Clientes</p>
                 <p className="text-xs font-black text-slate-700">{sec.clients} / 60</p>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                 <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Ruido</p>
                 <p className="text-xs font-black text-emerald-600">-102 dBm</p>
               </div>
            </div>

            <div className="flex gap-2">
               <button onClick={() => handleScan(sec.id)} className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">Escanear Espectro</button>
               <button className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Clientes Conectados</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 sm:p-12 shadow-sm">
         <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <Box size={24} className="text-indigo-600" />
              <h3 className="text-xl font-black text-slate-900 uppercase text-xs tracking-[0.2em]">Cajas NAP de Distribución</h3>
            </div>
            <button className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all border border-slate-100"><Plus size={20} /></button>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { name: 'NAP-S01-CENTRO', capacity: '12/16', status: 'ACTIVE' },
              { name: 'NAP-S02-SUR', capacity: '16/16', status: 'FULL' },
              { name: 'NAP-S03-OESTE', capacity: '2/8', status: 'ACTIVE' },
            ].map((nap, i) => (
              <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between hover:border-indigo-100 transition-all cursor-pointer">
                <div>
                   <p className="text-sm font-black text-slate-900">{nap.name}</p>
                   <p className="text-[10px] font-black text-slate-400 uppercase mt-1">Puertos: {nap.capacity}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${nap.status === 'FULL' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`}></div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default SectorialView;
