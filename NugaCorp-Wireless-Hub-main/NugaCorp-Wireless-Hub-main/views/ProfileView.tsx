
import React from 'react';
import { User, Mail, Shield, Phone, MapPin, Camera, LogOut, Clock, CheckCircle, Activity } from 'lucide-react';

const ProfileView: React.FC<{ user: any }> = ({ user }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          <div className="absolute bottom-0 right-0 p-10">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-widest">
              Sesión iniciada: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
        <div className="px-10 pb-12">
          <div className="relative -mt-24 mb-8 flex flex-col sm:flex-row items-end gap-6">
            <div className="relative">
              <div className="w-40 h-40 bg-slate-950 border-[8px] border-white rounded-[3rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl overflow-hidden">
                {user?.name?.charAt(0)}
              </div>
              <button className="absolute bottom-2 right-2 p-3 bg-indigo-600 text-white rounded-2xl border-4 border-white shadow-xl hover:scale-110 transition-transform">
                <Camera size={20} />
              </button>
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">{user?.name}</h1>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase border border-indigo-100">Staff</span>
              </div>
              <p className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.3em] mt-2 ml-1">Super Administrador de Sistemas</p>
            </div>
            <button 
              onClick={() => window.location.reload()} // Simulación de logout
              className="px-8 py-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center gap-3 mb-2 shadow-sm"
            >
              <LogOut size={18} /> Cerrar Sesión
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm mb-4">
                <Activity size={24} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Actividad</p>
              <p className="text-xl font-black text-slate-900">42 Tareas</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm mb-4">
                <CheckCircle size={24} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronización</p>
              <p className="text-xl font-black text-slate-900">100% OK</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm mb-4">
                <Clock size={24} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Antigüedad</p>
              <p className="text-xl font-black text-slate-900">2 Años</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center gap-3">
            <Shield className="text-indigo-600" size={20} />
            <h3 className="font-black text-slate-900 uppercase text-xs tracking-[0.2em]">Privacidad & Datos</h3>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Corporativo</p>
                <p className="text-sm font-bold text-slate-900">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp Enlace</p>
                <p className="text-sm font-bold text-slate-900">+52 55 9876 5432</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base de Operaciones</p>
                <p className="text-sm font-bold text-slate-900">NOC Central - Ciudad de México</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl"></div>
           <h3 className="font-black text-[10px] uppercase tracking-[0.3em] mb-8 text-indigo-400">Log de Seguridad</h3>
           <div className="space-y-6">
              {[
                { event: 'Acceso desde API MikroTik', time: '10:15 AM', status: 'SUCCESS' },
                { event: 'Modificación de QoS Global', time: 'Ayer, 06:45 PM', status: 'SUCCESS' },
                { event: 'Intento de Acceso Fallido', time: 'Lun, 02:10 AM', status: 'WARN' },
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                   <div className={`w-2 h-2 rounded-full mt-1.5 ${log.status === 'SUCCESS' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                   <div>
                     <p className="text-xs font-bold">{log.event}</p>
                     <p className="text-[9px] text-slate-500 mt-1 uppercase font-black">{log.time}</p>
                   </div>
                </div>
              ))}
           </div>
           <button className="w-full mt-10 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Ver Historial Completo</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
