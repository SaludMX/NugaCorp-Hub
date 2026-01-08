
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, AlertCircle, MessageSquare, Map, RefreshCw, Loader2 } from 'lucide-react';
import { useClients, useTickets } from '../hooks/data';
import NetworkChart from '../components/NetworkChart';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Hooks de datos reales
  const { data: clients, loading: loadingClients, error: errorClients, refetch: refetchClients } = useClients();
  const { data: tickets, loading: loadingTickets, error: errorTickets, refetch: refetchTickets } = useTickets();

  const activeClients = clients?.filter(c => c.status === 'ACTIVE').length || 0;
  const suspendedClients = clients?.filter(c => c.status === 'SUSPENDED').length || 0;
  const openTicketsCount = tickets?.filter(t => t.status === 'OPEN').length || 0;

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchClients(), refetchTickets()]);
    setIsRefreshing(false);
  };

  const kpis = [
    { label: 'Clientes', val: activeClients, icon: <Users size={18}/>, color: 'emerald', path: '/clients' },
    { label: 'Incidencias', val: openTicketsCount, icon: <MessageSquare size={18}/>, color: 'orange', path: '/tickets' },
    { label: 'Suspendidos', val: suspendedClients, icon: <AlertCircle size={18}/>, color: 'red', path: '/clients' },
    { label: 'Total Clientes', val: clients?.length || 0, icon: <Users size={18}/>, color: 'indigo', path: '/clients' },
    { label: 'Total Tickets', val: tickets?.length || 0, icon: <MessageSquare size={18}/>, color: 'blue', path: '/tickets' },
  ];

  return (
    <div className="w-full space-y-6 lg:space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 leading-none tracking-tight">Panel Administrativo</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">NugaCorp Wireless • Gestión Descentralizada</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ name: '', address: '', ip: '', plan: MOCK_PLANS[0].name, zoneId: MOCK_ZONES[0].id });
            setShowAddModal(true);
          }} 
          className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
        >
          <UserPlus size={18} /> Alta Cliente
        </button>
      </div>

  // Manejo de estados de carga y error
  if (loadingClients || loadingTickets) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
          <p className="text-slate-600 font-medium">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (errorClients || errorTickets) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">Error al cargar datos</h3>
          <p className="text-slate-600">{errorClients?.message || errorTickets?.message}</p>
          <button
            onClick={handleRefreshAll}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 lg:space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 leading-none tracking-tight">Panel Administrativo</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">NugaCorp Wireless • Datos en Tiempo Real</p>
        </div>
        <button 
          onClick={handleRefreshAll}
          disabled={isRefreshing}
          className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRefreshing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
          {isRefreshing ? 'Actualizando...' : 'Refrescar Datos'}
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-6 sm:p-10 border border-slate-200 shadow-sm">
           <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-lg font-black text-slate-900">Resumen de Clientes</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Datos en Tiempo Real</p>
              </div>
           </div>
           <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <p className="text-xs font-black text-emerald-600 uppercase mb-2">Clientes Activos</p>
                  <p className="text-3xl font-black text-emerald-900">{activeClients}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-2xl border border-red-200">
                  <p className="text-xs font-black text-red-600 uppercase mb-2">Suspendidos</p>
                  <p className="text-3xl font-black text-red-900">{suspendedClients}</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-xs font-black text-slate-600 uppercase mb-2">Total de Clientes</p>
                <p className="text-3xl font-black text-slate-900">{clients?.length || 0}</p>
              </div>
              <button
                onClick={() => navigate('/clients')}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition"
              >
                Ver Todos los Clientes
              </button>
           </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-slate-200 shadow-sm">
           <div className="mb-6">
              <h3 className="text-lg font-black text-slate-900">Tickets de Soporte</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estados Actuales</p>
           </div>
           <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200">
                <p className="text-xs font-black text-orange-600 uppercase mb-2">Tickets Abiertos</p>
                <p className="text-3xl font-black text-orange-900">{openTicketsCount}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-xs font-black text-slate-600 uppercase mb-2">Total de Tickets</p>
                <p className="text-3xl font-black text-slate-900">{tickets?.length || 0}</p>
              </div>
              <button
                onClick={() => navigate('/tickets')}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition"
              >
                Ver Todos los Tickets
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
