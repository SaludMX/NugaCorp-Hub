
import React, { useState } from 'react';
import { MOCK_STAFF } from '../constants';
import { Users2, Briefcase, MapPin, CheckCircle, Plus, X, UserPlus, ShieldCheck, Mail, Smartphone } from 'lucide-react';

const StaffView: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none">Equipo Operativo</h1>
          <p className="text-slate-500 mt-2 uppercase text-[10px] font-black tracking-widest">Recursos Humanos & Desempeño</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto bg-slate-950 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-950/10"
        >
          <UserPlus size={18} /> Registrar Personal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_STAFF.map(staff => (
          <div key={staff.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white font-black text-xl group-hover:scale-110 transition-transform">
                {staff.name.charAt(0)}
              </div>
              <span className={`text-[10px] font-black px-3 py-1 rounded-xl uppercase border ${
                staff.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                staff.status === 'ON_FIELD' ? 'bg-orange-50 text-orange-700 border-orange-100 animate-pulse' : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}>
                {staff.status === 'ON_FIELD' ? 'En Campo' : 'Disponible'}
              </span>
            </div>
            
            <h3 className="text-xl font-black text-slate-900">{staff.name}</h3>
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-1 mb-6">{staff.role}</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-400">
                  <CheckCircle size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Tareas Mes</span>
                </div>
                <span className="font-black text-slate-900">{staff.tasksCompleted}</span>
              </div>
              
              {staff.lastLocation && (
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Ubicación</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-900 truncate ml-2 uppercase tracking-tight">{staff.lastLocation}</span>
                </div>
              )}
            </div>

            <button className="w-full mt-8 py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 hover:text-white transition-all active:scale-95">
              Asignar Incidencia
            </button>
          </div>
        ))}
      </div>

      {/* Modal Registro Staff */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
          <div className="bg-white w-full max-w-2xl sm:rounded-[3rem] shadow-2xl p-8 sm:p-12 relative h-[85vh] sm:h-auto animate-in slide-in-from-bottom duration-300">
            <button onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 text-slate-400"><X size={28} /></button>
            <div className="mb-10 flex items-center gap-5">
              <div className="w-14 h-14 bg-slate-950 text-white rounded-2xl flex items-center justify-center shadow-lg"><Briefcase size={28} /></div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 leading-none">Alta de Personal</h2>
                <p className="text-slate-500 text-sm mt-1 uppercase font-black text-[10px] tracking-widest">Técnicos de Campo & Soporte</p>
              </div>
            </div>
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); setShowAddModal(false); }}>
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nombre Completo</label>
                 <div className="relative">
                   <Users2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                   <input type="text" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" placeholder="Nombre" />
                 </div>
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Rol Operativo</label>
                 <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none appearance-none">
                    <option>TÉCNICO INSTALADOR</option>
                    <option>SOPORTE NIVEL 1</option>
                    <option>ADMINISTRATIVO</option>
                    <option>INGENIERO DE RED</option>
                 </select>
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email</label>
                 <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                   <input type="email" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" placeholder="user@nugacorp.com" />
                 </div>
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Teléfono</label>
                 <div className="relative">
                   <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                   <input type="text" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" placeholder="+52..." />
                 </div>
               </div>
               <div className="sm:col-span-2 pt-6">
                 <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">Activar Credenciales</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffView;
