import React, { useState } from 'react';
import { useWisps } from '../hooks/data';
import { Plus, RefreshCw, Loader2, AlertCircle, Edit2, Trash2, MoreVertical } from 'lucide-react';
import type { WispInsert, WispUpdate } from '../hooks/data';

const WispManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<WispInsert>>({
    name: '',
    subdomain: '',
    primary_color: '#4f46e5',
    status: 'TRIAL',
    plan: 'BASIC',
    max_clients: 10,
  });

  const { data: wisps, loading, error, refetch, createWisp, updateWisp, deleteWisp } = useWisps();

  const filteredWisps = wisps?.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.subdomain.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      subdomain: '',
      primary_color: '#4f46e5',
      status: 'TRIAL',
      plan: 'BASIC',
      max_clients: 10,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateWisp(editingId, formData as WispUpdate);
        alert('WISP actualizado');
      } else {
        await createWisp(formData as WispInsert);
        alert('WISP creado');
      }
      await refetch();
      resetForm();
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleEdit = (wisp: typeof wisps[0]) => {
    setEditingId(wisp.id);
    setFormData(wisp);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este WISP?')) return;
    try {
      await deleteWisp(id);
      await refetch();
      alert('WISP eliminado');
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="w-full space-y-6 lg:space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 leading-none">Administración de WISPs</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
            {loading ? 'Cargando...' : `${filteredWisps.length} WISPs registrados`}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex-1 sm:flex-none bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isRefreshing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
            Actualizar
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex-1 sm:flex-none bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Nuevo WISP
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-4">
          <AlertCircle size={24} className="text-red-600" />
          <div>
            <p className="font-black text-red-900 text-sm">Error al cargar WISPs</p>
            <p className="text-xs text-red-600 mt-1">{error.message}</p>
            <button onClick={handleRefresh} className="mt-2 text-xs font-bold text-red-600 underline">Reintentar</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="p-20 flex flex-col items-center justify-center gap-4">
          <Loader2 size={32} className="text-indigo-600 animate-spin" />
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Cargando WISPs...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredWisps.map(wisp => (
            <div key={wisp.id} className="bg-white rounded-[2rem] border border-slate-200 p-8 hover:shadow-xl transition-all group shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl shadow-lg"
                      style={{ backgroundColor: wisp.primary_color }}
                    />
                    <div>
                      <h3 className="text-lg font-black text-slate-900">{wisp.name}</h3>
                      <p className="text-[9px] font-bold text-slate-400">{wisp.subdomain}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(wisp)}
                    className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-all active:scale-90"
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(wisp.id)}
                    className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-red-600 transition-all active:scale-90"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Estado</p>
                  <span className={`text-xs font-black uppercase px-2 py-1 rounded-lg inline-block ${
                    wisp.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-600' :
                    wisp.status === 'SUSPENDED' ? 'bg-red-100 text-red-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {wisp.status}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Plan</p>
                  <p className="text-xs font-black text-slate-700">{wisp.plan}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                  <p className="text-[8px] font-black text-indigo-600 uppercase">Clientes</p>
                  <p className="text-lg font-black text-indigo-900">{wisp.current_clients}/{wisp.max_clients}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                  <p className="text-[8px] font-black text-orange-600 uppercase">MikroTiks</p>
                  <p className="text-lg font-black text-orange-900">{wisp.mikrotiks_count}</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  <p className="text-[8px] font-black text-emerald-600 uppercase">Ingresos</p>
                  <p className="text-lg font-black text-emerald-900">${wisp.revenue}</p>
                </div>
              </div>
            </div>
          ))}
          {filteredWisps.length === 0 && !loading && (
            <div className="col-span-2 p-20 text-center">
              <p className="text-slate-400 font-black text-sm">No hay WISPs registrados</p>
              <p className="text-[10px] text-slate-300 mt-2">Crea uno nuevo para comenzar</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-2xl w-full rounded-[3rem] shadow-2xl p-8 sm:p-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 leading-none">{editingId ? 'Editar WISP' : 'Nuevo WISP'}</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Complete los datos</p>
              </div>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">Nombre</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="Nombre del WISP"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">Subdominio</label>
                  <input
                    type="text"
                    value={formData.subdomain || ''}
                    onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="subdominio.wisphub.io"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">Color Primario</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.primary_color || '#4f46e5'}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer h-14"
                    />
                    <div
                      className="w-14 h-14 rounded-2xl shadow-lg border-2 border-slate-200"
                      style={{ backgroundColor: formData.primary_color || '#4f46e5' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">Estado</label>
                  <select
                    value={formData.status || 'TRIAL'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="TRIAL">TRIAL</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">Plan</label>
                  <select
                    value={formData.plan || 'BASIC'}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value as any })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none"
                  >
                    <option value="BASIC">BASIC</option>
                    <option value="PRO">PRO</option>
                    <option value="ENTERPRISE">ENTERPRISE</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">Max Clientes</label>
                  <input
                    type="number"
                    value={formData.max_clients || 10}
                    onChange={(e) => setFormData({ ...formData, max_clients: parseInt(e.target.value) })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
                >
                  {editingId ? 'Actualizar' : 'Crear'} WISP
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WispManagement;
