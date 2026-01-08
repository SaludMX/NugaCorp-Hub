import React, { useState } from 'react';
import { useZones } from '../hooks/data';
import { Plus, RefreshCw, Loader2, AlertCircle, Edit2, Trash2, MapPin } from 'lucide-react';
import type { ZoneInsert, ZoneUpdate } from '../hooks/data';

const Zones: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ZoneInsert>>({
    name: '',
    ip_range: '10.0.0.0/24',
    latitude: 0,
    longitude: 0,
    status: 'ONLINE',
  });

  const { data: zones, loading, error, refetch, createZone, updateZone, deleteZone } = useZones();

  const filteredZones = zones?.filter(z =>
    z.name.toLowerCase().includes(search.toLowerCase()) ||
    z.ip_range.includes(search)
  ) || [];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      ip_range: '10.0.0.0/24',
      latitude: 0,
      longitude: 0,
      status: 'ONLINE',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateZone(editingId, formData as ZoneUpdate);
        alert('Zona actualizada');
      } else {
        await createZone(formData as ZoneInsert);
        alert('Zona creada');
      }
      await refetch();
      resetForm();
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleEdit = (zone: typeof zones[0]) => {
    setEditingId(zone.id);
    setFormData(zone);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta zona?')) return;
    try {
      await deleteZone(id);
      await refetch();
      alert('Zona eliminada');
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'bg-emerald-100 text-emerald-600';
      case 'WARNING': return 'bg-yellow-100 text-yellow-600';
      case 'OFFLINE': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="w-full space-y-6 lg:space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 leading-none">Zonas y Torres</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
            {loading ? 'Cargando...' : `${filteredZones.length} zonas configuradas`}
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
            Nueva Zona
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-4">
          <AlertCircle size={24} className="text-red-600" />
          <div>
            <p className="font-black text-red-900 text-sm">Error al cargar zonas</p>
            <p className="text-xs text-red-600 mt-1">{error.message}</p>
            <button onClick={handleRefresh} className="mt-2 text-xs font-bold text-red-600 underline">Reintentar</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="p-20 flex flex-col items-center justify-center gap-4">
          <Loader2 size={32} className="text-indigo-600 animate-spin" />
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Cargando zonas...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredZones.map(zone => (
            <div key={zone.id} className="bg-white rounded-[2rem] border border-slate-200 p-6 hover:shadow-xl transition-all group shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black">
                    <MapPin size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-black text-slate-900">{zone.name}</h3>
                      <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-lg ${getStatusColor(zone.status)}`}>
                        {zone.status}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 font-mono">{zone.ip_range}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-[8px] font-black text-slate-400 uppercase">Clientes</p>
                    <p className="text-xl font-black text-indigo-600">{zone.clients_count}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(zone)}
                      className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-all active:scale-90"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(zone.id)}
                      className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-red-600 transition-all active:scale-90"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-[8px] font-black text-slate-400 uppercase">Latitud</p>
                  <p className="text-sm font-mono font-bold text-slate-700 mt-1">{zone.latitude.toFixed(4)}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-[8px] font-black text-slate-400 uppercase">Longitud</p>
                  <p className="text-sm font-mono font-bold text-slate-700 mt-1">{zone.longitude.toFixed(4)}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-[8px] font-black text-slate-400 uppercase">Creada</p>
                  <p className="text-sm font-bold text-slate-700 mt-1">{new Date(zone.created_at).toLocaleDateString('es-MX')}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-[8px] font-black text-slate-400 uppercase">Actualizada</p>
                  <p className="text-sm font-bold text-slate-700 mt-1">{new Date(zone.updated_at).toLocaleDateString('es-MX')}</p>
                </div>
              </div>
            </div>
          ))}
          {filteredZones.length === 0 && !loading && (
            <div className="p-20 text-center">
              <p className="text-slate-400 font-black text-sm">No hay zonas registradas</p>
              <p className="text-[10px] text-slate-300 mt-2">Crea una nueva zona para comenzar</p>
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
                <h2 className="text-3xl font-black text-slate-900 leading-none">{editingId ? 'Editar Zona' : 'Nueva Zona'}</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Configurar nodo/torre</p>
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
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">Nombre de la Zona</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="Ej: Cerro Grande, Torre Centro"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">Rango CIDR</label>
                  <input
                    type="text"
                    value={formData.ip_range || ''}
                    onChange={(e) => setFormData({ ...formData, ip_range: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono outline-none focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="10.0.0.0/24"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">Latitud</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.latitude || 0}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="0.0000"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">Longitud</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.longitude || 0}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="0.0000"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">Estado</label>
                  <select
                    value={formData.status || 'ONLINE'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none"
                  >
                    <option value="ONLINE">ONLINE</option>
                    <option value="WARNING">WARNING</option>
                    <option value="OFFLINE">OFFLINE</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
                >
                  {editingId ? 'Actualizar' : 'Crear'} Zona
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

export default Zones;
