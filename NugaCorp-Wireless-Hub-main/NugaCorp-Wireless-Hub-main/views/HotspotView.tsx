
import React, { useState } from 'react';
import { Zap, Plus, Search, Timer, Wifi, CreditCard, Download, Trash2, X, RefreshCw, Smartphone } from 'lucide-react';

const MOCK_VOUCHERS = [
  { id: 'NK-821A', plan: '1 HORA', code: '821A-3921', status: 'ACTIVE', used: '24m', limit: '1h' },
  { id: 'NK-932B', plan: '1 DÍA', code: '932B-8812', status: 'USED', used: '24h', limit: '24h' },
  { id: 'NK-103C', plan: '1 SEMANA', code: '103C-1102', status: 'PENDING', used: '0m', limit: '168h' },
];

const HotspotView: React.FC = () => {
  const [showGenModal, setShowGenModal] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none">Fichas HotSpot</h1>
          <p className="text-slate-500 mt-2 uppercase text-[10px] font-black tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Venta Prepago MikroTik User Manager
          </p>
        </div>
        <button 
          onClick={() => setShowGenModal(true)}
          className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3"
        >
          <Plus size={18} /> Generar Lote
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ventas Hoy</p>
           <p className="text-2xl font-black text-slate-900">$840.00</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fichas Activas</p>
           <p className="text-2xl font-black text-emerald-600">142</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock Disponible</p>
           <p className="text-2xl font-black text-indigo-600">850</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center bg-slate-50/30">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Buscar por código..." className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none" />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600"><RefreshCw size={20} /></button>
          <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Download size={16} /> PDF Lote</button>
        </div>

        <div className="divide-y divide-slate-100">
          {MOCK_VOUCHERS.map(v => (
            <div key={v.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-slate-50 transition-all">
               <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${v.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Wifi size={24} />
                 </div>
                 <div>
                   <p className="text-sm font-black text-slate-900">{v.plan}</p>
                   <p className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest mt-1">CÓDIGO: {v.code}</p>
                 </div>
               </div>
               
               <div className="flex items-center justify-between sm:justify-end gap-10 w-full sm:w-auto border-t sm:border-0 pt-4 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">Consumo</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                       <Timer size={14} className="text-slate-400" /> {v.used} / {v.limit}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-xl transition-all"><Trash2 size={18} /></button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Generar Fichas */}
      {showGenModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
          <div className="bg-white w-full max-w-xl sm:rounded-[3rem] shadow-2xl p-8 sm:p-12 relative animate-in zoom-in duration-300">
            <button onClick={() => setShowGenModal(false)} className="absolute top-8 right-8 text-slate-400"><X size={28} /></button>
            <div className="mb-8 flex items-center gap-4">
               <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Zap size={28} /></div>
               <h2 className="text-3xl font-black text-slate-900">Generar Fichas</h2>
            </div>
            <form className="space-y-6" onSubmit={e => { e.preventDefault(); setShowGenModal(false); }}>
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Plan de Tiempo</label>
                 <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none appearance-none">
                    <option>1 HORA - $10.00</option>
                    <option>2 HORAS - $15.00</option>
                    <option>1 DÍA - $35.00</option>
                    <option>1 SEMANA - $150.00</option>
                 </select>
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Cantidad de Fichas</label>
                 <input type="number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" placeholder="100" />
               </div>
               <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center gap-3">
                  <Smartphone size={20} className="text-indigo-600" />
                  <p className="text-[10px] font-bold text-indigo-700 leading-tight">Las fichas se sincronizarán automáticamente con el MikroTik asignado a la zona.</p>
               </div>
               <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">Crear e Imprimir Lote</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotspotView;
