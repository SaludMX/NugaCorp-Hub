
import React, { useState } from 'react';
import { Search, Filter, MoreVertical, WifiOff, UserPlus, Phone, MapPin, Wifi, RefreshCw, Loader2 } from 'lucide-react';
import { useClients } from '../hooks/data';

const ClientList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Hook de datos reales
  const { data: clients, loading, error, refetch, updateClient } = useClients();

  // Filtrar clientes por búsqueda
  const filteredClients = clients?.filter(client => 
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.email?.toLowerCase().includes(search.toLowerCase()) ||
    client.phone_number?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleAction = async (id: string, actionName: string, newStatus?: string) => {
    setProcessingId(id);
    try {
      if (newStatus) {
        await updateClient(id, { status: newStatus as any });
        await refetch();
        alert(`${actionName} completado con éxito`);
      } else {
        // Simulación de ping/sincronización
        setTimeout(() => {
          setProcessingId(null);
          alert(`${actionName} completado`);
        }, 1000);
      }
    } catch (err) {
      alert(`Error en ${actionName}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  return (
    <div className="w-full space-y-6 lg:space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 leading-none">Clientes</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
            {loading ? 'Cargando...' : `${filteredClients.length} Clientes Registrados`}
          </p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isRefreshing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
          Actualizar
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">⚠️</div>
          <div>
            <p className="font-black text-red-900 text-sm">Error al cargar clientes</p>
            <p className="text-xs text-red-600 mt-1">{error.message}</p>
            <button onClick={handleRefresh} className="mt-2 text-xs font-bold text-red-600 underline">Reintentar</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center bg-slate-50/20">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar cliente por nombre, email o teléfono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 size={32} className="text-indigo-600 animate-spin" />
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Cargando clientes...</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredClients.map(client => {
              const isProcessing = processingId === client.id;
              return (
                <div key={client.id} className="p-4 sm:p-6 hover:bg-slate-50/50 transition-all group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                        {client.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-slate-900 text-sm truncate">{client.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`w-2 h-2 rounded-full ${client.status === 'ACTIVE' ? 'bg-emerald-500' : client.status === 'SUSPENDED' ? 'bg-red-500' : 'bg-yellow-500'} shadow-sm`} />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{client.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-6 text-slate-500">
                      {client.email && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold truncate max-w-[150px]">{client.email}</span>
                        </div>
                      )}
                      {client.phone_number && (
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-slate-400" />
                          <span className="text-[10px] font-bold">{client.phone_number}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                      <button 
                        onClick={() => handleRefresh()}
                        disabled={isProcessing}
                        className="flex-1 sm:flex-none p-3 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-200 rounded-xl transition-all active:scale-90"
                        title="Sincronizar"
                      >
                        {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                      </button>
                      <button 
                        onClick={() => handleAction(client.id, 'Suspender servicio', 'SUSPENDED')}
                        disabled={client.status === 'SUSPENDED'}
                        className="flex-1 sm:flex-none p-3 text-slate-400 hover:bg-red-50 hover:text-red-600 border border-slate-200 rounded-xl transition-all active:scale-90 disabled:opacity-50"
                        title="Suspender"
                      >
                        <WifiOff size={18} />
                      </button>
                      <button 
                        onClick={() => alert(`Ver perfil: ${client.name}`)}
                        className="flex-1 sm:flex-none p-3 text-slate-400 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 rounded-xl transition-all active:scale-90"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>
                  {client.address && (
                    <div className="mt-3 flex items-center gap-2 text-slate-400 px-2">
                      <MapPin size={12} className="text-indigo-400" />
                      <p className="text-[10px] font-medium truncate uppercase tracking-tight">{client.address}</p>
                    </div>
                  )}
                </div>
              );
            })}
            {filteredClients.length === 0 && !loading && (
              <div className="p-20 text-center">
                <p className="text-slate-400 font-black text-sm">No se encontraron clientes</p>
                <p className="text-[10px] text-slate-300 mt-2">Intenta con otros términos de búsqueda</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>

export default ClientList;
