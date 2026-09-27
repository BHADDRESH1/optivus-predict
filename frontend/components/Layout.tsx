import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';
import { Bell, LogOut, Menu, X, Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { normalizeRole, getRoleInfo } from '../permissions';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, switchRole } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const currentRole = normalizeRole(user?.role);
  const roleInfo = getRoleInfo(currentRole);

  // Determine current page title from the full list (for header display)
  const activeItem = NAV_ITEMS.find(item => item.path === location.pathname);
  const currentPageTitle = activeItem?.label || 'Dashboard';
  
  // Filter navigation items based on user role using useMemo for efficiency
  // Only modules permitted for the logged-in role appear in the sidebar
  const filteredNavItems = useMemo(() => {
    if (!user) return [];
    const normalized = normalizeRole(user.role);
    
    return NAV_ITEMS.filter(item => {
      if (!item.roles || item.roles.length === 0) return true;
      return item.roles.includes(normalized);
    });
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-2xl lg:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <div 
              className="flex items-center gap-2 font-bold text-2xl text-blue-600 tracking-tight cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <span className="bg-blue-600 text-white rounded-lg p-1.5 shadow-md text-base leading-none">OP</span>
              <span className="text-slate-800">TIVUS</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold tracking-normal uppercase">Predict</span>
            </div>
            <button 
              className="ml-auto lg:hidden text-slate-500 hover:text-slate-700 transition-colors p-1 rounded-md hover:bg-slate-100"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          {/* User Profile Summary (Sidebar Top) */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/70">
             <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-base shadow-xs border ${roleInfo.badgeColor}`}>
                  {user?.name.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Authorized User'}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Shield size={12} className={currentRole === Role.ADMIN ? 'text-purple-600' : 'text-blue-600'} />
                    <span className="text-[11px] font-bold text-slate-600 truncate uppercase tracking-wider">
                      {roleInfo.badge}
                    </span>
                  </div>
                </div>
             </div>
             
             {/* Role & Scope Tag */}
             <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
               <span className="text-slate-400 font-semibold uppercase tracking-wider">Scope:</span>
               <span className="text-slate-600 font-medium truncate max-w-[170px]" title={roleInfo.scope}>
                 {roleInfo.scope}
               </span>
             </div>
          </div>

          {/* Navigation Items (Dynamically filtered by active role) */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Navigation ({filteredNavItems.length} modules)
            </div>
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 shadow-xs border border-blue-100 font-bold' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  <Icon size={18} className={`transition-colors shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span className="truncate text-left">{item.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></div>}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-100">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 rounded-lg transition-all shadow-xs group"
            >
              <LogOut size={16} className="group-hover:stroke-red-600" />
              Sign Out
            </button>
            <p className="mt-2.5 text-center text-[10px] text-slate-400 font-medium tracking-wide">
              OPTIVUS Predict • RBAC Enabled
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shadow-xs z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-slate-500 hover:text-slate-700 p-2 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">{currentPageTitle}</h1>
              <span className="text-[10px] text-blue-600 font-semibold mt-1 hidden md:block tracking-wider uppercase">
                AI Medicine Stockout Prediction & Redistribution
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-5">
             {/* Role Switcher for Judge / Demo Interactive Testing */}
             <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase hidden sm:inline">Role:</span>
                <select
                  value={currentRole}
                  onChange={(e) => switchRole && switchRole(e.target.value as Role)}
                  aria-label="Switch Role"
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg border shadow-xs cursor-pointer outline-none transition-all ${roleInfo.badgeColor}`}
                >
                  <option value={Role.ADMIN}>System Admin (Full Access)</option>
                  <option value={Role.HOSPITAL_HEAD}>Hospital Head (Executive View)</option>
                  <option value={Role.SUPERVISOR}>Pharmacy Supervisor</option>
                  <option value={Role.PHARMACIST}>Dispensary Pharmacist</option>
                </select>
             </div>

             {/* Regional Hub Info */}
             <div className="hidden lg:block text-right">
                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Active Scope</p>
                <p className="text-xs font-semibold text-slate-700 truncate max-w-[180px]">{roleInfo.scope}</p>
             </div>
             
             <div className="h-6 w-px bg-slate-200 hidden lg:block"></div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate('/admin/alerts')}
                title="View Medicine Alerts"
                className="relative p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white ring-1 ring-white"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content Render */}
        <main className="flex-1 overflow-auto bg-slate-50/50 p-4 lg:p-6 xl:p-8">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};