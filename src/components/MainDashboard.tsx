import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Wrench,
  Home,
  BarChart3,
  Users,
  FileText,
  Calendar,
  Building2
} from 'lucide-react';
import MachineryModule from './MachineryModule';
import WarehouseModule from './WarehouseModule';

const MainDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModule, setActiveModule] = useState('home');

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { id: 'home', name: 'Inicio', icon: Home },
    { id: 'machinery', name: 'Maquinarias', icon: Wrench },
    { id: 'warehouses', name: 'Almacenes', icon: Building2 },
    { id: 'reports', name: 'Reportes', icon: BarChart3 },
    { id: 'clients', name: 'Clientes', icon: Users },
    { id: 'contracts', name: 'Contratos', icon: FileText },
    { id: 'calendar', name: 'Calendario', icon: Calendar },
  ];

  const renderContent = () => {
    switch (activeModule) {
      case 'machinery':
        return <MachineryModule />;
      case 'warehouses':
        return <WarehouseModule />;
      case 'home':
      default:
        return (
          <div className="p-8">
            <div className="text-center">
              <div className="mb-8">
                <div className="mx-auto h-32 w-32 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-6">
                  <Wrench className="h-16 w-16 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">MaquiRent Pro</h1>
                <p className="text-xl text-gray-600">Sistema de Gestión de Maquinarias y Almacenes</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {menuItems.slice(1).map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveModule(item.id)}
                      className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 hover:border-blue-300 group"
                    >
                      <Icon className="h-12 w-12 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 mt-2">
                        {item.id === 'machinery' && 'Gestiona tu flota de maquinarias'}
                        {item.id === 'warehouses' && 'Administra tus almacenes'}
                        {item.id === 'reports' && 'Reportes y estadísticas'}
                        {item.id === 'clients' && 'Administra tus clientes'}
                        {item.id === 'contracts' && 'Contratos de alquiler'}
                        {item.id === 'calendar' && 'Programación y eventos'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">MaquiRent</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveModule(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors mb-1 ${
                  activeModule === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-8 w-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              <Settings className="h-4 w-4 mr-2" />
              Config
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {menuItems.find(item => item.id === activeModule)?.name || 'Dashboard'}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Bienvenido, {user?.name}
              </span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainDashboard;