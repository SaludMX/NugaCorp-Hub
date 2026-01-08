
import React, { useState } from 'react';
import { MOCK_INVOICES, ADMIN_STATS, MOCK_CLIENTS } from '../constants';
import { 
  Plus, Search, FileText, Receipt, TrendingUp, X, Clock, RefreshCw, 
  ShieldCheck, Download, FileCode, CheckCircle2, Loader2, AlertTriangle,
  ExternalLink, FileStack
} from 'lucide-react';

const BillingView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'OVERDUE'>('ALL');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [stampingId, setStampingId] = useState<string | null>(null);

  // Generador de UUID simulado para el timbrado
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16).toUpperCase();
    });
  };

  const handleGrantPromise = (id: string) => {
    setProcessingId(id);
    setTimeout(() => {
      alert("Promesa de Pago otorgada. El servicio se ha reactivado automáticamente por 48 horas en el MikroTik.");
      setProcessingId(null);
    }, 1500);
  };

  const handleStamp = (id: string) => {
    setStampingId(id);
    setTimeout(() => {
      const uuid = generateUUID();
      // En una app real, aquí actualizaríamos el estado global o la DB
      alert(`¡Timbrado Exitoso!\nFolio Fiscal: ${uuid}\nEl CFDI ha sido enviado al SAT y al cliente.`);
      setStampingId(null);
    }, 2500);
  };

  const invoices = activeTab === 'ALL' ? MOCK_INVOICES : MOCK_INVOICES.filter(i => i.status === 'OVERDUE');

  return (
    <div className="w-full space-y-6 lg:space-y-10 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 leading-none tracking-tight">Finanzas & Fiscal</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
            <ShieldCheck size={12} className="text-indigo-600" />
            NugaCorp Billing Core • CFDI 4.0 Active
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={() => setShowInvoiceModal(true)} className="flex-1 sm:flex-none bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">
            <Plus size={16} /> Crear Factura
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Recaudado Mes', val: `$${ADMIN_STATS.totalRevenue.toLocaleString()}`, trend: '+4.2%', icon: <TrendingUp size={14}/>, color: 'emerald' },
          { label: 'Cuentas en Mora', val: '12', trend: 'CRITICAL', icon: <AlertTriangle size={14}/>, color: 'red' },
          { label: 'Timbrados OK', val: '284', trend: 'PAC-V2', icon: <ShieldCheck size={14}/>, color: 'indigo' },
          { label: 'IVA a Pagar', val: `$${(ADMIN_STATS.totalRevenue * 0.16).toLocaleString()}`, trend: 'PROY', icon: <FileStack size={14}/>, color: 'slate' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between h-36 group hover:border-indigo-200 transition-all">
            <div className="flex justify-between items-start">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              <div className={`p-2 bg-${kpi.color}-50 text-${kpi.color}-600 rounded-lg group-hover:scale-110 transition-transform`}>{kpi.icon}</div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{kpi.val}</p>
            <div className={`text-${kpi.color}-500 text-[9px] font-black uppercase flex items-center gap-2`}>
              {kpi.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
           <div className="flex gap-1 bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto overflow-x-auto no-scrollbar">
              <button onClick={() => setActiveTab('ALL')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ALL' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>Emisión General</button>
              <button onClick={() => setActiveTab('OVERDUE')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'OVERDUE' ? 'bg-white text-red-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>Suspensiones / Corte</button>
           </div>
           <div className="relative w-full sm:w-72">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="ID, RFC o Cliente..." className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase outline-none focus:ring-4 focus:ring-indigo-500/5 shadow-sm" />
           </div>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
           <table className="w-full text-left min-w-[900px]">
             <thead className="bg-slate-50/50">
               <tr>
                 <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Receptor / Factura</th>
                 <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Concepto & Monto</th>
                 <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Estatus Fiscal</th>
                 <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Vencimiento</th>
                 <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Mantenimiento</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {invoices.map(inv => {
                 const client = MOCK_CLIENTS.find(c => c.id === inv.clientId);
                 const isStamping = stampingId === inv.id;
                 const isProcessing = processingId === inv.id;

                 return (
                   <tr key={inv.id} className="hover:bg-slate-50/80 transition-all group">
                     <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-indigo-100">
                              <FileText size={18} />
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-900 leading-none">{client?.name}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1.5">FOLIO: {inv.id.toUpperCase()}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <p className="text-sm font-black text-slate-900">${inv.amount.toLocaleString()}.00</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{inv.items[0].description}</p>
                     </td>
                     <td className="px-8 py-6">
                        {inv.isStamped ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 w-fit">
                              <CheckCircle2 size={12} />
                              <span className="text-[9px] font-black uppercase tracking-tighter">TIMBRADO OK</span>
                            </div>
                            <p className="text-[8px] font-mono text-slate-400 truncate w-32 bg-slate-50 p-1 rounded border border-slate-100">{inv.uuid}</p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-1 rounded-lg border border-orange-100 w-fit">
                            <Clock size={12} />
                            <span className="text-[9px] font-black uppercase tracking-tighter">CFDI PENDIENTE</span>
                          </div>
                        )}
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <p className={`text-[10px] font-black uppercase ${inv.status === 'OVERDUE' ? 'text-red-500' : 'text-slate-500'}`}>
                             {inv.dueDate}
                          </p>
                          <p className="text-[8px] font-bold text-slate-300 uppercase mt-0.5">{inv.status}</p>
                        </div>
                     </td>
                     <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                           {!inv.isStamped ? (
                             <button 
                               onClick={() => handleStamp(inv.id)}
                               disabled={isStamping}
                               className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10"
                             >
                               {isStamping ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={12} />}
                               TIMBRAR CFDI
                             </button>
                           ) : (
                             <>
                               <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200" title="Ver XML"><FileCode size={18}/></button>
                               <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200" title="Descargar PDF"><Download size={18}/></button>
                             </>
                           )}
                           {inv.status !== 'PAID' && (
                              <button 
                                onClick={() => handleGrantPromise(inv.id)}
                                disabled={isProcessing}
                                className="p-2.5 bg-orange-50 text-orange-400 hover:text-white hover:bg-orange-500 rounded-xl transition-all border border-orange-100"
                                title="Promesa de Pago (Auto-reconexión)"
                              >
                                 {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Clock size={18} />}
                              </button>
                           )}
                        </div>
                     </td>
                   </tr>
                 );
               })}
             </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default BillingView;
