
import React from 'react';
import { MOCK_INVOICES, MOCK_STAFF, ADMIN_STATS } from '../constants';
import { DollarSign, UserCheck, TrendingUp, Download, PieChart, Briefcase } from 'lucide-react';

const CRMView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900">CRM & Finanzas</h1>
          <p className="text-slate-500">Control de cobros, rendimiento de staff y proyecciones.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2 text-sm">
            <Download size={18} />
            Exportar Reporte
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI: Recaudación Mes */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm border-l-4 border-l-indigo-600">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cobranza del Mes</p>
              <p className="text-2xl font-black text-slate-900">${ADMIN_STATS.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold">
            <TrendingUp size={14} />
            <span>+18% vs mes anterior</span>
          </div>
        </div>

        {/* KPI: Staff Performance */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <UserCheck size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Staff Operativo</p>
              <p className="text-2xl font-black text-slate-900">{MOCK_STAFF.filter(s => s.status !== 'OFFLINE').length} / {MOCK_STAFF.length}</p>
            </div>
          </div>
          <p className="text-slate-500 text-xs">Todos los técnicos cuentan con EPP.</p>
        </div>

        {/* KPI: Morosidad */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm border-l-4 border-l-red-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
              <PieChart size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cartera Vencida</p>
              <p className="text-2xl font-black text-slate-900">$4,250.00</p>
            </div>
          </div>
          <p className="text-red-500 text-xs font-bold">12 clientes por suspender.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Facturas Recientes */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Facturación Reciente</h3>
            <button className="text-indigo-600 text-xs font-bold hover:underline">Gestionar Todo</button>
          </div>
          <div className="divide-y divide-slate-100">
            {MOCK_INVOICES.map(inv => (
              <div key={inv.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                  }`}>
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">#{inv.id}</p>
                    <p className="text-[10px] text-slate-400">{inv.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">${inv.amount}</p>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>{inv.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gestión de Staff */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Rendimiento de Staff</h3>
            <button className="text-indigo-600 text-xs font-bold hover:underline">Ver Horarios</button>
          </div>
          <div className="divide-y divide-slate-100">
            {MOCK_STAFF.map(staff => (
              <div key={staff.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{staff.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Briefcase size={10} className="text-slate-400" />
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{staff.role}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${staff.status === 'ON_FIELD' ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                    <p className="text-[10px] font-black uppercase text-slate-600">{staff.status}</p>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">{staff.tasksCompleted} tareas este mes</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMView;
