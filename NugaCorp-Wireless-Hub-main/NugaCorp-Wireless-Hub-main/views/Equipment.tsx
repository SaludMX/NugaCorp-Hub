import React, { useState } from 'react';
import { useEquipment } from '../hooks/data';
import { Plus, RefreshCw, Loader2, AlertCircle, Edit2, Trash2, Wifi } from 'lucide-react';
import type { EquipmentInsert, EquipmentUpdate } from '../hooks/data';

const Equipment: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'ROUTER' | 'SWITCH' | 'SECTORIAL' | 'PTP' | 'CPE'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'INSTALLED' | 'STOCK' | 'FAULTY'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<EquipmentInsert>>({
    model: '',
    type: 'CPE',
    mac_address: '',
    ip_address: '',
    status: 'STOCK',
  });

  const { data: equipment, loading, error, refetch, createEquipment, updateEquipment, deleteEquipment } = useEquipment();

  const filteredEquipment = equipment?.filter(e => {
    const matchesSearch = e.model.toLowerCase().includes(search.toLowerCase()) ||
      e.mac_address.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'ALL' || e.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || e.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  }) || [];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const resetForm = () => {
    setFormData({
      model: '',
      type: 'CPE',
      mac_address: '',
      ip_address: '',
      status: 'STOCK',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateEquipment(editingId, formData as EquipmentUpdate);
        alert('Equipo actualizado');
      } else {
        await createEquipment(formData as EquipmentInsert);
        alert('Equipo creado');
      }
      await refetch();
      resetForm();
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleEdit = (eq: typeof equipment[0]) => {
    setEditingId(eq.id);
    setFormData(eq);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este equipo?')) return;
    try {
      await deleteEquipment(id);
      await refetch();
      alert('Equipo eliminado');
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ROUTER': return 'bg-indigo-100 text-indigo-600';
      case 'SWITCH': return 'bg-blue-100 text-blue-600';
      case 'SECTORIAL': return 'bg-purple-100 text-purple-600';
      case 'PTP': return 'bg-cyan-100 text-cyan-600';
      case 'CPE': return 'bg-emerald-100 text-emerald-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'INSTALLED': return 'bg-emerald-100 text-emerald-600';
      case 'STOCK': return 'bg-blue-100 text-blue-600';
      case 'FAULTY': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const typeCount = (type: string) => equipment?.filter(e => e.type === type).length || 0;
  const statusCount = (status: string) => equipment?.filter(e => e.status === status).length || 0;

  return (
    <div className="w-full space-y-6 lg:space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 leading-none">Inventario de Equipos</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
            {loading ? 'Cargando...' : `${filteredEquipment.length} equipos disponibles`}
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
            Agregar Equipo
          </button>
        </div>
      </div>

      {/* Cards de Estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center shadow-sm">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Total</p>
          <p className="text-3xl font-black text-slate-900">{equipment?.length || 0}</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-center shadow-sm">
          <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-2">Instalados</p>
          <p className="text-3xl font-black text-emerald-900">{statusCount('INSTALLED')}</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 text-center shadow-sm">
          <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-2">Stock</p>
          <p className="text-3xl font-black text-blue-900">{statusCount('STOCK')}</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-4 border border-red-200 text-center shadow-sm">
          <p className="text-[8px] font-black text-red-600 uppercase tracking-widest mb-2">Dañados</p>
          <p className="text-3xl font-black text-red-900">{statusCount('FAULTY')}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-4">
          <AlertCircle size={24} className="text-red-600" />
          <div>
            <p className="font-black text-red-900 text-sm">Error al cargar equipos</p>
            <p className="text-xs text-red-600 mt-1">{error.message}</p>
            <button onClick={handleRefresh} className="mt-2 text-xs font-bold text-red-600 underline">Reintentar</button>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por modelo o MAC..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase"
          >
            <option value="ALL">Todos los Tipos</option>
            <option value="ROUTER">ROUTER ({typeCount('ROUTER')})</option>
            <option value="SWITCH">SWITCH ({typeCount('SWITCH')})</option>
            <option value="SECTORIAL">SECTORIAL ({typeCount('SECTORIAL')})</option>
            <option value="PTP">PTP ({typeCount('PTP')})</option>
            <option value="CPE">CPE ({typeCount('CPE')})</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="INSTALLED">Instalados</option>
            <option value="STOCK">Stock</option>
            <option value="FAULTY">Dañados</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-20 flex flex-col items-center justify-center gap-4">
          <Loader2 size={32} className="text-indigo-600 animate-spin" />
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Cargando equipos...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEquipment.map(eq => (
            <div key={eq.id} className="bg-white rounded-[2rem] border border-slate-200 p-6 hover:shadow-xl transition-all shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${getTypeColor(eq.type)}`}>
                    <Wifi size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-black text-slate-900">{eq.model}</h3>
                      <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-lg ${getTypeColor(eq.type)}`}>
                        {eq.type}
                      </span>
                      <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-lg ${getStatusColor(eq.status)}`}>
                        {eq.status}
                      </span>
                    </div>
                    <p className="text-[9px] font-mono text-slate-500">{eq.mac_address}</p>
                    {eq.ip_address && <p className="text-[9px] font-mono text-slate-500">{eq.ip_address}</p>}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(eq)}
                    className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-all active:scale-90"
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(eq.id)}
                    className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-red-600 transition-all active:scale-90"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredEquipment.length === 0 && !loading && (
            <div className="p-20 text-center">
              <p className="text-slate-400 font-black text-sm">No hay equipos para mostrar</p>
              <p className="text-[10px] text-slate-300 mt-2">Ajusta los filtros o crea un nuevo equipo</p>
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
                <h2 className="text-3xl font-black text-slate-900 leading-none">{editingId ? 'Editar Equipo' : 'Nuevo Equipo'}</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Inventario de hardware</p>
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
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">Modelo</label>
                  <input
                    type="text"
                    value={formData.model || ''}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="MikroTik hAP ac3"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">Tipo</label>
                  <select
                    value={formData.type || 'CPE'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none"
                  >
                    <option value="ROUTER">ROUTER</option>
                    <option value="SWITCH">SWITCH</option>
                    <option value="SECTORIAL">SECTORIAL</option>
                    <option value="PTP">PTP</option>
                    <option value="CPE">CPE</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">MAC Address</label>
                  <input
                    type="text"
                    value={formData.mac_address || ''}
                    onChange={(e) => setFormData({ ...formData, mac_address: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono outline-none focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="00:00:00:00:00:00"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">IP Address</label>
                  <input
                    type="text"
                    value={formData.ip_address || ''}
                    onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono outline-none focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="10.0.0.1"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">Estado</label>
                  <select
                    value={formData.status || 'STOCK'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none"
                  >
                    <option value="STOCK">STOCK</option>
                    <option value="INSTALLED">INSTALLED</option>
                    <option value="FAULTY">FAULTY</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
                >
                  {editingId ? 'Actualizar' : 'Crear'} Equipo
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

export default Equipment;
