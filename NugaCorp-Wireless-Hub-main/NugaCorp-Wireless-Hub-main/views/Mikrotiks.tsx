import React, { useState } from 'react';
import { useMikrotiks } from '../hooks/data';
import { Plus, RefreshCw, Loader2, AlertCircle, Edit2, Trash2, Server } from 'lucide-react';
import type { MikrotikInsert, MikrotikUpdate } from '../hooks/data';

const Mikrotiks: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ONLINE' | 'WARNING' | 'OFFLINE'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<MikrotikInsert>>({
    name: '',
    host: '',
    port: 8728,
    username: '',
    password_encrypted: '',
    model: '',
    routeros_version: '',
    status: 'OFFLINE',
  });

  const { data: mikrotiks, loading, error, refetch, createMikrotik, updateMikrotik, deleteMikrotik } = useMikrotiks();

  const filteredMikrotiks = mikrotiks?.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.host.includes(search) ||
      m.model?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || m.status === filterStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      host: '',
      port: 8728,
      username: '',
      password_encrypted: '',
      model: '',
      routeros_version: '',
      status: 'OFFLINE',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMikrotik(editingId, formData as MikrotikUpdate);
        alert('MikroTik actualizado');
      } else {
        await createMikrotik(formData as MikrotikInsert);
        alert('MikroTik registrado');
      }
      await refetch();
      resetForm();
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleEdit = (m: typeof mikrotiks[0]) => {
    setEditingId(m.id);
    setFormData(m);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este MikroTik?')) return;
    try {
      await deleteMikrotik(id);
      await refetch();
      alert('MikroTik eliminado');
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

  const statusCount = (status: string) => mikrotiks?.filter(m => m.status === status).length || 0;

  return (
    <div className="w-full space-y-6 lg:space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 leading-none">Administración MikroTik</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
            {loading ? 'Cargando...' : `${filteredMikrotiks.length} dispositivos registrados`}
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
            Registrar MikroTik
          </button>
        </div>
      </div>

      {/* Cards de Estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center shadow-sm">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Total</p>
          <p className="text-3xl font-black text-slate-900">{mikrotiks?.length || 0}</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-center shadow-sm">
          <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-2">En Línea</p>
          <p className="text-3xl font-black text-emerald-900">{statusCount('ONLINE')}</p>
        </div>
        <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200 text-center shadow-sm">
          <p className="text-[8px] font-black text-yellow-600 uppercase tracking-widest mb-2">Advertencia</p>
          <p className="text-3xl font-black text-yellow-900">{statusCount('WARNING')}</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-4 border border-red-200 text-center shadow-sm">
          <p className="text-[8px] font-black text-red-600 uppercase tracking-widest mb-2">Offline</p>
          <p className="text-3xl font-black text-red-900">{statusCount('OFFLINE')}</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-black text-amber-900">Vista Administrativa</p>
          <p className="text-[10px] text-amber-700 mt-1">
            Esta vista es para registro y monitoreo únicamente. Las credenciales se almacenan encriptadas. 
            No hay conexión SSH ni control remoto desde aquí.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-4">
          <AlertCircle size={24} className="text-red-600" />
          <div>
            <p className="font-black text-red-900 text-sm">Error al cargar MikroTiks</p>
            <p className="text-xs text-red-600 mt-1">{error.message}</p>
            <button onClick={handleRefresh} className="mt-2 text-xs font-bold text-red-600 underline">Reintentar</button>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre, IP o modelo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase"
        >
          <option value="ALL">Todos los Estados</option>
          <option value="ONLINE">ONLINE ({statusCount('ONLINE')})</option>
          <option value="WARNING">WARNING ({statusCount('WARNING')})</option>
          <option value="OFFLINE">OFFLINE ({statusCount('OFFLINE')})</option>
        </select>
      </div>

      {loading ? (
        <div className="p-20 flex flex-col items-center justify-center gap-4">
          <Loader2 size={32} className="text-indigo-600 animate-spin" />
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Cargando MikroTiks...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMikrotiks.map(m => (
            <div key={m.id} className="bg-white rounded-[2rem] border border-slate-200 p-6 hover:shadow-xl transition-all shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${
                    m.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-600' :
                    m.status === 'WARNING' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    <Server size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-black text-slate-900">{m.name}</h3>
                      <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-lg ${getStatusColor(m.status)}`}>
                        {m.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-[9px] font-mono text-slate-600 mt-3">
                      <div>
                        <p className="font-black text-slate-400 uppercase text-[8px]">IP</p>
                        <p>{m.host}:{m.port}</p>
                      </div>
                      {m.model && (
                        <div>
                          <p className="font-black text-slate-400 uppercase text-[8px]">Modelo</p>
                          <p>{m.model}</p>
                        </div>
                      )}
                      {m.routeros_version && (
                        <div>
                          <p className="font-black text-slate-400 uppercase text-[8px]">RouterOS</p>
                          <p>{m.routeros_version}</p>
                        </div>
                      )}
                      {m.last_seen && (
                        <div>
                          <p className="font-black text-slate-400 uppercase text-[8px]">Último Sync</p>
                          <p>{new Date(m.last_seen).toLocaleTimeString('es-MX')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(m)}
                    className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-all active:scale-90"
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-red-600 transition-all active:scale-90"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredMikrotiks.length === 0 && !loading && (
            <div className="p-20 text-center">
              <p className="text-slate-400 font-black text-sm">No hay MikroTiks registrados</p>
              <p className="text-[10px] text-slate-300 mt-2">Registra uno nuevo para comenzar</p>
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
                <h2 className="text-3xl font-black text-slate-900 leading-none">{editingId ? 'Editar MikroTik' : 'Registrar MikroTik'}</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Datos de conectividad</p>
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
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">Nombre</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="Ej: MikroTik Cerro Grande"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">Dirección IP / Host</label>
                  <input
                    type="text"
                    value={formData.host || ''}
                    onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono outline-none focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="192.168.1.1"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">Puerto</label>
                  <input
                    type="number"
                    value={formData.port || 8728}
                    onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">Usuario</label>
                  <input
                    type="text"
                    value={formData.username || ''}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="admin"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">Contraseña (encriptada)</label>
                  <input
                    type="password"
                    value={formData.password_encrypted || ''}
                    onChange={(e) => setFormData({ ...formData, password_encrypted: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="Contraseña"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">Modelo</label>
                  <input
                    type="text"
                    value={formData.model || ''}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="Ej: MikroTik hEX S"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">RouterOS Version</label>
                  <input
                    type="text"
                    value={formData.routeros_version || ''}
                    onChange={(e) => setFormData({ ...formData, routeros_version: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="7.10.1"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 block mb-2">Estado</label>
                  <select
                    value={formData.status || 'OFFLINE'}
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
                  {editingId ? 'Actualizar' : 'Registrar'} MikroTik
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

export default Mikrotiks;
