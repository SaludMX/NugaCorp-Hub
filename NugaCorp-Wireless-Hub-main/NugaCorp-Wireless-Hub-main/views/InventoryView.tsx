
import React, { useState, useRef } from 'react';
import { 
  HardDrive, Search, Filter, Box, Plus, Settings2, MapPin, 
  User, TowerControl as Tower, Download, Camera, X, Scan, 
  Loader2, Sparkles, CheckCircle2, Cpu, BarChart, Activity
} from 'lucide-react';
import { MOCK_EQUIPMENT, MOCK_ZONES, MOCK_CLIENTS } from '../constants';
import { extractClientDataFromID } from '../services/geminiService';

const InventoryView: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'STOCK' | 'INSTALLED'>('ALL');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newDevice, setNewDevice] = useState({
    model: '',
    mac: '',
    serial: '',
    type: 'CPE' as any
  });

  const getUbicacion = (eq: any) => {
    if (eq.clientId) {
      const client = MOCK_CLIENTS.find(c => c.id === eq.clientId);
      return { name: client?.name || 'Cliente Desconocido', type: 'CLIENT', icon: <User size={12} /> };
    }
    if (eq.zoneId) {
      const zone = MOCK_ZONES.find(z => z.id === eq.zoneId);
      return { name: zone?.name || 'Zona Desconocida', type: 'ZONE', icon: <Tower size={12} /> };
    }
    return { name: 'Almacén Central', type: 'STOCK', icon: <Box size={12} /> };
  };

  const handleScanCPE = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      // Reutilizamos la lógica de extracción para hardware
      const data = await extractClientDataFromID(base64, file.type); 
      if (data) {
        setNewDevice(prev => ({
          ...prev,
          mac: data.id_number || 'AC:22:BB...', // Simulado: En producción mapeamos a campos de hardware
          model: data.name || 'Ubiquiti LiteBeam 5AC'
        }));
      }
      setIsScanning(false);
    };
    reader.readAsDataURL(file);
  };

  const filteredEquipment = MOCK_EQUIPMENT.filter(eq => {
    if (activeFilter === 'STOCK') return eq.status === 'STOCK';
    if (activeFilter === 'INSTALLED') return eq.status === 'INSTALLED';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Almacén & Stock</h1>
          <p className="text-slate-500 mt-3 uppercase text-[10px] font-black tracking-[0.3em]">Trazabilidad de Activos NugaCorp NOC</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto bg-slate-950 text-white px-10 py-5 rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4"
        >
          <Plus size={20} /> Registrar Equipo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Total Activos', val: MOCK_EQUIPMENT.length, icon: <HardDrive />, color: 'indigo' },
           { label: 'En Almacén', val: MOCK_EQUIPMENT.filter(e => e.status === 'STOCK').length, icon: <Box />, color: 'emerald' },
           { label: 'Instalados', val: MOCK_EQUIPMENT.filter(e => e.status === 'INSTALLED').length, icon: <Tower />, color: 'blue' },
           // Added Activity icon from missing imports
           { label: 'Averías', val: 0, icon: <Activity />, color: 'red' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6">
              <div className={`w-14 h-14 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center shadow-sm`}>
                {stat.icon}
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                 <p className="text-2xl font-black text-slate-900">{stat.val}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col lg:flex-row gap-6 items-center justify-between bg-slate-50/20">
           <div className="flex gap-1 bg-slate-200/50 p-1.5 rounded-2xl w-full lg:w-auto">
              {['ALL', 'STOCK', 'INSTALLED'].map(f => (
                <button 
                  key={f}
                  onClick={() => setActiveFilter(f as any)}
                  className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeFilter === f ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500'
                  }`}
                >
                  {f === 'ALL' ? 'Todos' : f === 'STOCK' ? 'Almacén' : 'En Clientes'}
                </button>
              ))}
           </div>
           <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="MAC, Serie o Modelo..." className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase outline-none focus:ring-4 focus:ring-indigo-500/5" />
           </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Hardware / Modelo</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">MAC Address</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Ubicación</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Estado Técnico</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEquipment.map(eq => {
                const ubi = getUbicacion(eq);
                return (
                  <tr key={eq.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <Cpu size={24} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm">{eq.model}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">ID: {eq.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="font-mono text-xs text-slate-600 font-black">{eq.mac}</span>
                    </td>
                    <td className="px-10 py-8">
                      <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border w-fit ${
                        ubi.type === 'ZONE' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' :
                        ubi.type === 'CLIENT' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                        'bg-slate-50 border-slate-100 text-slate-500'
                      }`}>
                        {ubi.icon}
                        <span className="text-[9px] font-black uppercase tracking-widest">{ubi.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-xl border ${
                        eq.status === 'INSTALLED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {eq.status === 'INSTALLED' ? 'En Servicio' : 'Disponible'}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex justify-end gap-2">
                         <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm active:scale-90">
                           <BarChart size={18} />
                         </button>
                         <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm active:scale-90">
                           <Settings2 size={18} />
                         </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Alta Equipo con OCR */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl sm:rounded-[3rem] shadow-2xl p-10 lg:p-14 relative animate-in slide-in-from-bottom duration-300">
            <button onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900"><X size={28} /></button>
            <div className="mb-12 flex items-center gap-6">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl"><HardDrive size={32} /></div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 leading-none">Registro de Hardware</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-3">Sincronización IA de Activos NugaCorp</p>
              </div>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`mb-10 border-4 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center transition-all cursor-pointer group ${
                isScanning ? 'border-indigo-400 bg-indigo-50' : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
              }`}
            >
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleScanCPE} />
              {isScanning ? (
                <div className="flex flex-col items-center gap-5">
                  <Loader2 size={40} className="text-indigo-600 animate-spin" />
                  <p className="text-[11px] font-black uppercase text-indigo-600 tracking-widest animate-pulse">IA Escaneando Etiqueta del Equipo...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-5 text-center">
                  <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-[2rem] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Scan size={40} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Escanear Label (MAC/SN)</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Ubiquiti • MikroTik • Cambium</p>
                  </div>
                </div>
              )}
            </div>

            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setShowAddModal(false); alert('Equipo registrado correctamente en almacén central.'); }}>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">MAC Address</label>
                   <div className="relative">
                      <input 
                        type="text" 
                        value={newDevice.mac}
                        onChange={(e) => setNewDevice({...newDevice, mac: e.target.value})}
                        className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono font-bold outline-none" 
                        placeholder="00:00:00:00:00:00" 
                      />
                      {newDevice.mac && <Sparkles size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-indigo-500" />}
                   </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Modelo de Equipo</label>
                   <input 
                    type="text" 
                    value={newDevice.model}
                    onChange={(e) => setNewDevice({...newDevice, model: e.target.value})}
                    className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" 
                    placeholder="Ej: PowerBeam M5" 
                   />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Almacén Destino</label>
                 <select className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase outline-none appearance-none">
                    <option>ALMACÉN CENTRAL (CDMX)</option>
                    <option>STOCK TÉCNICO - CARLOS RUIZ</option>
                    <option>NODO CERRO GRANDE (REPUESTOS)</option>
                 </select>
               </div>
               <button type="submit" className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-indigo-600/40 active:scale-95 transition-all flex items-center justify-center gap-4">
                 <CheckCircle2 size={20} /> Guardar en Inventario
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryView;
