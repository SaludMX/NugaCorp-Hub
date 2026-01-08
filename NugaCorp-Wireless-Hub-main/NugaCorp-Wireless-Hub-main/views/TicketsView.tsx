
import React, { useState } from 'react';
import { useTickets } from '../hooks/data';
import { 
  MessageCircle, Search, Filter, Plus, Clock, User, AlertCircle, ChevronRight, 
  MoreVertical, CheckCircle2, X, Send, Loader2, Briefcase, Trash2, CheckSquare, RefreshCw
} from 'lucide-react';

const TicketsView: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Hook de datos reales
  const { data: tickets, loading, error, refetch, updateTicket, deleteTicket } = useTickets();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-blue-500';
      default: return 'bg-slate-400';
    }
  };

  const filteredTickets = filter === 'ALL' 
    ? tickets || []
    : tickets?.filter(t => t.status === filter) || [];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleUpdateStatus = async (id: string, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED') => {
    try {
      await updateTicket(id, { status });
      await refetch();
      alert('Ticket actualizado');
    } catch (err) {
      alert('Error al actualizar ticket');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este ticket?')) return;
    try {
      await deleteTicket(id);
      await refetch();
      alert('Ticket eliminado');
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none">Help Desk</h1>
          <p className="text-slate-500 mt-2 uppercase text-[10px] font-black tracking-widest">
            {loading ? 'Cargando...' : `${filteredTickets.length} Tickets`}
          </p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
        >
          {isRefreshing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
          ACTUALIZAR
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">⚠️</div>
          <div>
            <p className="font-black text-red-900 text-sm">Error al cargar tickets</p>
            <p className="text-xs text-red-600 mt-1">{error.message}</p>
            <button onClick={handleRefresh} className="mt-2 text-xs font-bold text-red-600 underline">Reintentar</button>
          </div>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
        {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all border ${
              filter === f 
              ? 'bg-slate-950 text-white border-slate-950 shadow-lg shadow-slate-950/20' 
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f === 'ALL' ? 'Todos' : f === 'OPEN' ? 'Pendientes' : f === 'IN_PROGRESS' ? 'En Curso' : 'Resueltos'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-20 flex flex-col items-center justify-center gap-4">
          <Loader2 size={32} className="text-indigo-600 animate-spin" />
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Cargando tickets...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {filteredTickets.map(ticket => {
            return (
              <div key={ticket.id} className="bg-white rounded-[2rem] border border-slate-200 p-8 hover:shadow-xl transition-all group shadow-sm flex flex-col gap-6 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1.5 h-full ${getPriorityColor(ticket.priority)}`}></div>
                
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">#{ticket.id.slice(0,8)}</span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-lg border ${
                          ticket.status === 'OPEN' ? 'bg-red-50 text-red-600 border-red-100' : 
                          ticket.status === 'IN_PROGRESS' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {ticket.status === 'OPEN' ? 'Pendiente' : ticket.status === 'IN_PROGRESS' ? 'En Curso' : 'Resuelto'}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{ticket.title}</h3>
                   </div>
                   <button 
                    onClick={() => handleDelete(ticket.id)}
                    className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-red-500 transition-all active:scale-90"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100/50">
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Descripción</p>
                   <p className="text-xs text-slate-700 line-clamp-2">{ticket.description || 'Sin descripción'}</p>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleUpdateStatus(ticket.id, 'IN_PROGRESS')}
                    disabled={ticket.status === 'IN_PROGRESS'}
                    className="flex-1 py-2 px-4 bg-orange-50 text-orange-600 rounded-xl text-[9px] font-black uppercase hover:bg-orange-100 transition-all disabled:opacity-50"
                  >
                    En Curso
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(ticket.id, 'RESOLVED')}
                    disabled={ticket.status === 'RESOLVED'}
                    className="flex-1 py-2 px-4 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase hover:bg-emerald-100 transition-all disabled:opacity-50"
                  >
                    Resolver
                  </button>
                </div>

                <div className="flex items-center gap-2 text-slate-400 pt-2 border-t border-slate-100">
                  <Clock size={12} />
                  <span className="text-[9px] font-medium">{new Date(ticket.created_at).toLocaleDateString('es-MX')}</span>
                </div>
              </div>
            );
          })}
          {filteredTickets.length === 0 && !loading && (
            <div className="col-span-2 p-20 text-center">
              <p className="text-slate-400 font-black text-sm">No hay tickets en esta categoría</p>
              <p className="text-[10px] text-slate-300 mt-2">Cambia el filtro para ver más</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
                    <Clock size={12} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{ticket.createdAt}</span>
                 </div>
                 <button 
                  onClick={() => setSelectedTicket(ticket)}
                  className="py-3 px-8 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-950/10"
                 >
                    GESTIONAR
                 </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nueva Incidencia */}
      {showNewTicket && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl sm:rounded-[3rem] shadow-2xl p-8 sm:p-12 relative h-[85vh] sm:h-auto animate-in zoom-in duration-300">
            <button onClick={() => setShowNewTicket(false)} className="absolute top-8 right-8 text-slate-400"><X size={28} /></button>
            <div className="mb-10 flex items-center gap-5">
              <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><MessageCircle size={28} /></div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 leading-none">Nueva Incidencia</h2>
                <p className="text-slate-500 text-sm mt-1 uppercase font-black text-[10px] tracking-widest">Reporte de Falla o Solicitud de Cliente</p>
              </div>
            </div>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setShowNewTicket(false); alert('Incidencia creada con éxito'); }}>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Seleccionar Cliente</label>
                   <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none appearance-none">
                      {MOCK_CLIENTS.map(c => <option key={c.id}>{c.name}</option>)}
                   </select>
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Prioridad</label>
                   <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none appearance-none">
                      <option>BAJA</option>
                      <option>MEDIA</option>
                      <option>ALTA</option>
                      <option>CRÍTICA</option>
                   </select>
                 </div>
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Asunto</label>
                 <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" placeholder="Resumen corto de la falla" />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Descripción Detallada</label>
                 <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none resize-none h-32" placeholder="Explica el problema..."></textarea>
               </div>
               <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">ABRIR TICKET Y ASIGNAR</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Gestión de Ticket Seleccionado */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl sm:rounded-[3rem] shadow-2xl p-8 sm:p-12 relative h-[85vh] sm:h-auto animate-in slide-in-from-bottom duration-300 border-t-8 border-indigo-600">
            <button onClick={() => setSelectedTicket(null)} className="absolute top-8 right-8 text-slate-400"><X size={28} /></button>
            <div className="mb-10">
               <div className="flex items-center gap-3 mb-2">
                 <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg border ${getPriorityColor(selectedTicket.priority)} text-white`}>{selectedTicket.priority}</span>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ID: {selectedTicket.id}</span>
               </div>
               <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{selectedTicket.subject}</h2>
            </div>
            
            <div className="space-y-8">
               <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Relato del Cliente</p>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed italic">"{selectedTicket.description || 'Sin descripción detallada.'}"</p>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Re-Asignar Staff</label>
                   <select className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm font-black outline-none appearance-none">
                      {MOCK_STAFF.map(s => <option key={s.id}>{s.name} ({s.role})</option>)}
                   </select>
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Estado de Resolución</label>
                   <select className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm font-black outline-none appearance-none">
                      <option>PENDIENTE</option>
                      <option>EN TRÁMITE</option>
                      <option>RESUELTO</option>
                   </select>
                 </div>
               </div>

               <div className="flex gap-3 pt-6">
                  <button onClick={() => setSelectedTicket(null)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">CANCELAR</button>
                  <button onClick={() => { setSelectedTicket(null); alert('Incidencia resuelta. MikroTik actualizado.'); }} className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <CheckSquare size={16} /> RESOLVER COMPLETAMENTE
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsView;
