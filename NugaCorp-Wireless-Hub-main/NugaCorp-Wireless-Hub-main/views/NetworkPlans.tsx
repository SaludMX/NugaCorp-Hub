import React, { useState } from 'react';
import { useNetworkPlans } from '../hooks/data';
import { Plus, RefreshCw, Loader2, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import type { NetworkPlanInsert, NetworkPlanUpdate } from '../hooks/data';

const NetworkPlans: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<NetworkPlanInsert>>({
    name: '',
    download: 10,
    upload: 5,
    price: 299,
  });

  const { data: plans, loading, error, refetch, createPlan, updatePlan, deletePlan } = useNetworkPlans();

  const filteredPlans = plans?.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      download: 10,
      upload: 5,
      price: 299,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updatePlan(editingId, formData as NetworkPlanUpdate);
        alert('Plan actualizado');
      } else {
        await createPlan(formData as NetworkPlanInsert);
        alert('Plan creado');
      }
      await refetch();
      resetForm();
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleEdit = (plan: typeof plans[0]) => {
    setEditingId(plan.id);
    setFormData(plan);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este plan?')) return;
    try {
      await deletePlan(id);
      await refetch();
      alert('Plan eliminado');
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="w-full space-y-6 lg:space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 leading-none">Planes de Internet</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
            {loading ? 'Cargando...' : `${filteredPlans.length} planes disponibles`}
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
            Nuevo Plan
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-4">
          <AlertCircle size={24} className="text-red-600" />
          <div>
            <p className="font-black text-red-900 text-sm">Error al cargar planes</p>
            <p className="text-xs text-red-600 mt-1">{error.message}</p>
            <button onClick={handleRefresh} className="mt-2 text-xs font-bold text-red-600 underline">Reintentar</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="p-20 flex flex-col items-center justify-center gap-4">
          <Loader2 size={32} className="text-indigo-600 animate-spin" />
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Cargando planes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map(plan => (
            <div key={plan.id} className="bg-white rounded-[2rem] border border-slate-200 p-8 hover:shadow-xl transition-all group shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{plan.name}</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Plan de Banda Ancha</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-all active:scale-90"
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-red-600 transition-all active:scale-90"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl border border-indigo-200">
                  <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest mb-2">Descarga</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-indigo-900">{plan.download}</span>
                    <span className="text-sm font-bold text-indigo-600">Mbps</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                  <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-2">Carga</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-blue-900">{plan.upload}</span>
                    <span className="text-sm font-bold text-blue-600">Mbps</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200">
                  <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-2">Precio Mensual</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-emerald-600">$</span>
                    <span className="text-4xl font-black text-emerald-900">{plan.price}</span>
                    <span className="text-sm font-bold text-emerald-600">MXN</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Ratio de Velocidad</p>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full"
                    style={{ width: `${Math.min((plan.download / 100) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
          {filteredPlans.length === 0 && !loading && (
            <div className="col-span-full p-20 text-center">
              <p className="text-slate-400 font-black text-sm">No hay planes registrados</p>
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
                <h2 className="text-3xl font-black text-slate-900 leading-none">{editingId ? 'Editar Plan' : 'Nuevo Plan'}</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Configure los parámetros</p>
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
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">Nombre del Plan</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="Ej: Plan Profesional 20Mbps"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">Descarga (Mbps)</label>
                  <input
                    type="number"
                    value={formData.download || 10}
                    onChange={(e) => setFormData({ ...formData, download: parseInt(e.target.value) })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">Carga (Mbps)</label>
                  <input
                    type="number"
                    value={formData.upload || 5}
                    onChange={(e) => setFormData({ ...formData, upload: parseInt(e.target.value) })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">Precio Mensual (MXN)</label>
                  <input
                    type="number"
                    value={formData.price || 299}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
                >
                  {editingId ? 'Actualizar' : 'Crear'} Plan
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

export default NetworkPlans;
