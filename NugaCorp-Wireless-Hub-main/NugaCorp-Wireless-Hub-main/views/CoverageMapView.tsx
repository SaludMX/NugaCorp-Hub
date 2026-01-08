
import React, { useEffect, useState, useRef } from 'react';
import { 
  TowerControl as Tower, Users, Signal, Map as MapIcon, 
  Layers, Crosshair, Zap, Activity, Shield, 
  ChevronRight, Maximize2, Filter, Loader2, Globe
} from 'lucide-react';
import { MOCK_ZONES, MOCK_CLIENTS } from '../constants';

// Coordenadas base (CDMX Centro por defecto para el mock)
const CENTER = [19.4326, -99.1332];

const CoverageMapView: React.FC = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(MOCK_ZONES[0]);
  const [showClients, setShowClients] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Carga dinámica de Leaflet desde ESM
    const loadMap = async () => {
      if (typeof window === 'undefined') return;
      
      const L = await import('https://esm.sh/leaflet@1.9.4');
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://esm.sh/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(cssLink);

      if (!mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView(CENTER, 13);

      // Capa de mapa oscura (CartoDB Dark Matter)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(map);

      // Iconos personalizados
      const towerIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="w-10 h-10 bg-indigo-600 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2.5 3-2.5 5"/><path d="m15 7 5 5"/><path d="m7 15 5 5"/><path d="M22 2.25c-2.5 0-4.83 1-6.5 2.75"/><path d="M17.5 7c-1.26 1.5-3 2.5-5 2.5"/><path d="m2 22 5-5"/><path d="m15 7 2.5-2.5"/><path d="m9.5 12.5 2.5-2.5"/><path d="m5 17 2.5-2.5"/><path d="m14 10 2.5-2.5"/></svg></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const clientIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-lg shadow-emerald-500/50"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });

      // Agregar Nodos (Torres)
      MOCK_ZONES.forEach(zone => {
        const marker = L.marker([zone.location.lat, zone.location.lng], { icon: towerIcon }).addTo(map);
        
        // Simulación de Heatmap de Cobertura (Círculo de RF)
        if (showHeatmap) {
          L.circle([zone.location.lat, zone.location.lng], {
            color: '#6366f1',
            fillColor: '#6366f1',
            fillOpacity: 0.15,
            radius: 2500, // 2.5km de cobertura estimada
            weight: 1
          }).addTo(map);

          // Círculo central (Señal Fuerte)
          L.circle([zone.location.lat, zone.location.lng], {
            color: '#6366f1',
            fillColor: '#6366f1',
            fillOpacity: 0.3,
            radius: 800,
            weight: 0
          }).addTo(map);
        }

        marker.on('click', () => {
          setSelectedNode(zone);
          map.flyTo([zone.location.lat, zone.location.lng], 14);
        });
      });

      // Agregar Clientes (Mock geolocalizado cerca de las torres)
      if (showClients) {
        MOCK_CLIENTS.forEach((client, i) => {
          const lat = CENTER[0] + (Math.random() - 0.5) * 0.04;
          const lng = CENTER[1] + (Math.random() - 0.5) * 0.04;
          L.marker([lat, lng], { icon: clientIcon }).addTo(map)
            .bindPopup(`<div class="p-2 font-black text-xs uppercase">${client.name}<br/><span class="text-indigo-500">${client.mikrotikIp}</span></div>`);
        });
      }

      setMapLoaded(true);
    };

    loadMap();
  }, [showClients, showHeatmap]);

  return (
    <div className="h-[calc(100vh-140px)] relative rounded-[3rem] overflow-hidden border border-slate-200 shadow-2xl bg-slate-900">
      
      {/* Container del Mapa */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0" />

      {/* Overlay de Carga */}
      {!mapLoaded && (
        <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center text-white">
          <Loader2 size={48} className="text-indigo-500 animate-spin mb-6" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Sincronizando Capas Geoespaciales...</p>
        </div>
      )}

      {/* Panel Superior: Controles */}
      <div className="absolute top-8 left-8 z-10 flex flex-col gap-4">
        <div className="bg-white/90 backdrop-blur-xl p-2 rounded-[2rem] border border-white shadow-2xl flex items-center gap-1">
           <button 
             onClick={() => setShowClients(!showClients)}
             className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${showClients ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
           >
             <Users size={16} /> Clientes
           </button>
           <button 
             onClick={() => setShowHeatmap(!showHeatmap)}
             className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${showHeatmap ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
           >
             <Signal size={16} /> Heatmap RF
           </button>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 text-white w-72 shadow-2xl">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4">Leyenda de Señal</h3>
           <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                   <span className="text-[9px] font-bold uppercase">Excelencia (-50 dBm)</span>
                </div>
                <span className="text-[9px] font-black opacity-40">L7</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 bg-indigo-500/30 rounded-full border border-indigo-500/50"></div>
                   <span className="text-[9px] font-bold uppercase">Borde (-75 dBm)</span>
                </div>
                <span className="text-[9px] font-black opacity-40">L2</span>
              </div>
           </div>
        </div>
      </div>

      {/* Panel Lateral Derecho: Telemetría de Nodo */}
      <div className="absolute top-8 right-8 z-10 w-96 flex flex-col gap-6">
         <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-right duration-500">
            <div className="p-8 bg-slate-950 text-white flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/20">
                    <Tower size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black tracking-tight leading-none">{selectedNode.name}</h4>
                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-2">Core Router OS Active</p>
                  </div>
               </div>
               <button className="p-3 hover:bg-white/10 rounded-xl transition-colors"><Maximize2 size={18} /></button>
            </div>
            
            <div className="p-8 space-y-8">
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Carga CPU</p>
                     <p className="text-xl font-black text-slate-900">14%</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">SNR Promedio</p>
                     <p className="text-xl font-black text-emerald-600">32 dB</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Salud del Espectro (5GHz)</h5>
                  <div className="flex items-end gap-1.5 h-16">
                     {[40, 65, 30, 85, 45, 20, 90, 55, 35, 75].map((h, i) => (
                       <div key={i} className="flex-1 bg-slate-100 rounded-full relative group">
                          <div 
                            className={`absolute bottom-0 left-0 right-0 rounded-full transition-all duration-1000 ${h > 70 ? 'bg-red-500' : 'bg-indigo-500'}`} 
                            style={{ height: `${h}%` }}
                          />
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {h}%
                          </div>
                       </div>
                     ))}
                  </div>
                  <div className="flex justify-between text-[8px] font-black text-slate-300 uppercase tracking-widest">
                    <span>5745 MHz</span>
                    <span>5825 MHz</span>
                  </div>
               </div>

               <button 
                onClick={() => alert('Iniciando auditoría de ruido espectral...')}
                className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-3 active:scale-95 transition-all"
               >
                 <Zap size={16} /> Optimizar Frecuencia IA
               </button>
            </div>
         </div>

         {/* Alerta de Inteligencia Flotante */}
         <div className="bg-indigo-600 text-white p-6 rounded-[2.5rem] shadow-2xl flex items-center gap-5 relative overflow-hidden group hover:bg-indigo-500 transition-all cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
               <Shield size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Insight Preventivo</p>
               <p className="text-xs font-bold leading-relaxed mt-1">Se detecta interferencia L2 en la zona Noroeste. Sugerencia: Cambio a Canal 140.</p>
            </div>
            <ChevronRight size={20} className="ml-auto opacity-40 group-hover:translate-x-1 transition-transform" />
         </div>
      </div>

      {/* Control de Zoom Inferior */}
      <div className="absolute bottom-8 left-8 z-10 flex items-center gap-3">
         <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xl flex items-center gap-4 px-6">
            <Globe size={18} className="text-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Map Server: cartodb-dark-l7</span>
         </div>
      </div>
    </div>
  );
};

export default CoverageMapView;
