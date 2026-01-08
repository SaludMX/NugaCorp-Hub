
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Views - Auth
import { WelcomeView, LoginView } from './views/AuthViews';

// Views - Dashboards
import ClientDashboard from './views/ClientDashboard';
import AdminDashboard from './views/AdminDashboard';
import SuperAdminDashboard from './views/SuperAdminDashboard';

// Views - FASE 3 (New)
import WispManagement from './views/WispManagement';
import NetworkPlans from './views/NetworkPlans';
import Zones from './views/Zones';
import Equipment from './views/Equipment';
import Mikrotiks from './views/Mikrotiks';

// Views - FASE 2C (Existing)
import ClientList from './views/ClientList';
import TicketsView from './views/TicketsView';

// Views - Other
import ProfileView from './views/ProfileView';
import SettingsView from './views/SettingsView';
import BillingView from './views/BillingView';
import StaffView from './views/StaffView';
import InfrastructureView from './views/InfrastructureView';
import InventoryView from './views/InventoryView';
import MikrotikConfigView from './views/MikrotikConfigView';
import HotspotView from './views/HotspotView';
import RouterListView from './views/RouterListView';
import SectorialView from './views/SectorialView';
import CoverageMapView from './views/CoverageMapView';
import OSPFView from './views/OSPFView';
import FieldOpsView from './views/FieldOpsView';
import WispManagementView from './views/WispManagementView';

// Components
import AIChatWidget from './components/AIChatWidget';
import { UserRole } from './types';

const App: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const { user, loading, signIn } = useAuth();

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (hasSeenWelcome) {
      setShowWelcome(false);
    }
  }, []);

  const handleWelcomeNext = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcome(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium">Cargando NugaCorp Hub...</p>
        </div>
      </div>
    );
  }

  if (showWelcome && !user) {
    return <WelcomeView onNext={handleWelcomeNext} />;
  }

  if (!user) {
    return <LoginView onLogin={signIn} />;
  }

  const userName = user.user_metadata?.name || user.email || 'Usuario';

  return (
    <Router>
      <div className="antialiased min-h-screen">
        <ProtectedRoute>
          <Layout role={UserRole.CLIENT} userName={userName}>
            <Routes>
              {/* Home */}
              <Route
                path="/"
                element={
                  <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-6">
                    <div className="max-w-2xl text-center space-y-8">
                      <div className="space-y-4">
                        <h1 className="text-4xl lg:text-5xl font-bold text-slate-900">
                          ✅ NugaCorp Wireless Hub
                        </h1>
                        <p className="text-xl text-slate-600">
                          Sesión de {user.email} verificada correctamente
                        </p>
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-8 space-y-4">
                        <h2 className="text-2xl font-semibold text-slate-900">Estado: FASE 3 Completa</h2>
                        <p className="text-slate-600">
                          ✓ AuthContext configurado<br />
                          ✓ Hooks de datos tipados<br />
                          ✓ Vistas operativas conectadas<br />
                          ✓ FASE 3: WispManagement, NetworkPlans, Zones, Equipment, Mikrotiks<br />
                        </p>
                      </div>

                      <nav className="grid grid-cols-2 gap-4 text-left">
                        <a href="/#/admin" className="bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 transition">Admin Dashboard</a>
                        <a href="/#/clients" className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition">Clientes</a>
                        <a href="/#/tickets" className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 transition">Tickets</a>
                        <a href="/#/settings" className="bg-slate-600 text-white p-4 rounded-lg hover:bg-slate-700 transition">Configuración</a>
                      </nav>
                    </div>
                  </div>
                }
              />

              {/* FASE 2C - Existing */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/clients" element={<ClientList />} />
              <Route path="/tickets" element={<TicketsView />} />

              {/* FASE 3 - New */}
              <Route path="/wisps" element={<WispManagement />} />
              <Route path="/network-plans" element={<NetworkPlans />} />
              <Route path="/zones" element={<Zones />} />
              <Route path="/equipment" element={<Equipment />} />
              <Route path="/mikrotiks" element={<Mikrotiks />} />

              {/* Account & Settings */}
              <Route path="/profile" element={<ProfileView user={user} />} />
              <Route path="/settings" element={<SettingsView />} />

              {/* Legacy views (keep for compatibility) */}
              <Route path="/super-admin" element={<SuperAdminDashboard />} />
              <Route path="/billing" element={<BillingView />} />
              <Route path="/staff" element={<StaffView />} />
              <Route path="/infra" element={<InfrastructureView />} />
              <Route path="/stock" element={<InventoryView />} />
              <Route path="/admin/mikrotik" element={<MikrotikConfigView />} />
              <Route path="/hotspot" element={<HotspotView />} />
              <Route path="/routers" element={<RouterListView />} />
              <Route path="/sectorials" element={<SectorialView />} />
              <Route path="/coverage" element={<CoverageMapView />} />
              <Route path="/ospf" element={<OSPFView />} />
              <Route path="/field" element={<FieldOpsView />} />
              <Route path="/wisp-management" element={<WispManagementView />} />
              <Route path="/portal" element={<ClientDashboard />} />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
          <AIChatWidget />
        </ProtectedRoute>
      </div>
    </Router>
  );
};

export default App;

