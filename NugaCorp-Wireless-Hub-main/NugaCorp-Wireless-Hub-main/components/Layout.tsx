
import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, CreditCard, 
  Settings, LogOut, Menu, X, Bell,
  Shield, Globe, Network, Navigation, 
  Share2, Package, Wifi, Activity, Layers, AppWindow, HardDrive
} from 'lucide-react';
import { UserRole } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  userName: string;
}

const Layout: React.FC<LayoutProps> = ({ children, role, userName }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getMenuItems = () => {
    // Menú SUPER ADMIN (NugaCorp)
    if (role === UserRole.SUPER_ADMIN) {
      return [
        {
          label: 'Hub Core',
          id: 'core',
          items: [
            { icon: <LayoutDashboard size={20} />, label: 'Control Global', path: '/super' },
            { icon: <Layers size={20} />, label: 'WISPs / Tenants', path: '/tenants' },
            { icon: <Shield size={20} />, label: 'Infraestructura', path: '/super' },
          ]
        },
        {
          label: 'Ecosistema',
          id: 'eco',
          items: [
            { icon: <AppWindow size={20} />, label: 'Marketplace', path: '/super' },
            { icon: <HardDrive size={20} />, label: 'Servidores', path: '/super' },
          ]
        }
      ];
    }

    if (role === UserRole.CLIENT) {
      return [
        {
          label: 'Usuario',
          id: 'client',
          items: [
            { icon: <LayoutDashboard size={20} />, label: 'Inicio', path: '/portal' },
            { icon: <CreditCard size={20} />, label: 'Mis Pagos', path: '/portal' },
            { icon: <Activity size={20} />, label: 'Soporte', path: '/portal' },
          ]
        }
      ];
    }

    // Menú WISP STAFF
    return [
      {
        label: 'Empresa',
        id: 'wisp',
        items: [
          { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
          { icon: < Globe size={20} />, label: 'Configuración WISP', path: '/wisp-config' },
        ]
      },
      {
        label: 'Operaciones',
        id: 'ops',
        items: [
          { icon: <Users size={20} />, label: 'Clientes', path: '/clients' },
          { icon: <Network size={20} />, label: 'Red Core', path: '/routers' },
          { icon: <Wifi size={20} />, label: 'Sectoriales', path: '/sectorials' },
        ]
      },
      {
        label: 'Administración',
        id: 'admin',
        items: [
          { icon: <CreditCard size={20} />, label: 'Billing', path: '/billing' },
          { icon: <Navigation size={20} />, label: 'Campo', path: '/field' },
          { icon: <Package size={20} />, label: 'Almacén', path: '/stock' },
        ]
      }
    ];
  };

  const menuSections = getMenuItems();

  return (
    <div className="flex h-[100dvh] w-full bg-slate-50 overflow-hidden fixed inset-0 font-inter">
      <div className={`fixed inset-0 bg-slate-950/60 backdrop-blur-md z-40 lg:hidden transition-all duration-500 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`fixed inset-y-0 left-0 bg-slate-950 text-white transition-all duration-500 flex flex-col z-50 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full lg:translate-x-0 lg:w-24'}`}>
        <div className="h-24 flex items-center px-8 shrink-0 border-b border-white/5 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-11 h-11 bg-indigo-600 rounded-[1rem] flex items-center justify-center font-black text-white shrink-0 shadow-2xl">N</div>
          <span className={`ml-4 font-black text-lg tracking-tighter transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>Hub Control</span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-8 overflow-y-auto no-scrollbar">
          {menuSections.map((section: any) => (
            <div key={section.id} className="space-y-4">
              <p className={`text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] px-5 ${sidebarOpen ? 'block' : 'hidden lg:hidden'}`}>{section.label}</p>
              <div className="space-y-1">
                {section.items.map((item: any) => (
                  <button 
                    key={item.path} 
                    onClick={() => { navigate(item.path); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-5 px-5 py-4 rounded-2xl transition-all group ${location.pathname === item.path ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                  >
                    <div className="shrink-0 transition-transform group-hover:scale-110">{item.icon}</div>
                    <span className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
           <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:flex items-center justify-center w-full py-4 text-slate-500 hover:text-white transition-all bg-white/5 rounded-2xl">
             {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
           </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-24 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-3 bg-slate-100 rounded-xl text-slate-500"><Menu size={24} /></button>
            <div className="hidden md:flex items-center gap-4">
               <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${role === UserRole.SUPER_ADMIN ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white'}`}>
                 {role === UserRole.SUPER_ADMIN ? 'CENTRAL HUB' : 'WISP NODE'}
               </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="flex items-center gap-4 p-1.5 pr-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer" onClick={() => navigate('/profile')}>
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black">{userName.charAt(0)}</div>
                <div className="hidden sm:block">
                   <p className="text-xs font-black text-slate-900">{userName}</p>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Sesión de Hub</p>
                </div>
             </div>
             <button onClick={() => window.location.reload()} className="p-2.5 text-slate-400 hover:text-red-500 transition-colors"><LogOut size={22} /></button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-12 no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
