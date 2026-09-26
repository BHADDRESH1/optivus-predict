import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';
import { Bell, LogOut, Menu, X, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Determine current page title from the full list (for header display)
  const activeItem = NAV_ITEMS.find(item => item.path === location.pathname);
  const currentPageTitle = activeItem?.label || 'Dashboard';
  
  // Filter navigation items based on user role using useMemo for efficiency
  // This ensures pages are cleanly visible based on role
  const filteredNavItems = useMemo(() => {
    if (!user) return [];
    
    return NAV_ITEMS.filter(item => {
      if (!item.roles || item.roles.length === 0) return true;
      const userRole = (user.role as string)?.toLowerCase();
      return item.roles.some(r => (r as string)?.toLowerCase() === userRole);
    });
  }, [user]);

  // Defense in depth: Check if current path is allowed for the user
  useEffect(() => {
    if (user && activeItem && activeItem.roles) {
      const userRole = (user.role as string)?.toLowerCase();
      const isAllowed = activeItem.roles.some(r => (r as string)?.toLowerCase() === userRole);
      if (!isAllowed) {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, activeItem, navigate]);

  // Helper for role-based styling in the sidebar profile section
  const getRoleBadgeStyle = (role?: Role) => {
    switch (role) {
      case Role.ADMIN: return 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-100';
      case Role.HOSPITAL_HEAD: return 'bg-teal-50 text-teal-700 border-teal-200 ring-teal-100';
      case Role.SUPERVISOR: return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-100';
      case Role.TECHNICIAN: return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-100';
    }
  };

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
          <div className="p-5 border-b border-slate-50 bg-slate-50/50">
             <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm border ${getRoleBadgeStyle(user?.role)}`}>
                  {user?.name.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Admin User'}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Shield size={12} className={user?.role === Role.ADMIN || user?.role === Role.HOSPITAL_HEAD ? 'text-purple-600' : 'text-slate-400'} />
                    <span className="text-xs font-semibold text-slate-500 truncate uppercase tracking-wider">{user?.role || 'Administrator'}</span>
                  </div>
                </div>
             </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
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
                      ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100 font-semibold' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  <Icon size={19} className={`transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span className="truncate">{item.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600"></div>}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-100">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 rounded-lg transition-all shadow-sm group"
            >
              <LogOut size={18} className="group-hover:stroke-red-600" />
              Sign Out
            </button>
            <p className="mt-3 text-center text-[11px] text-slate-400 font-medium tracking-wide">
              OPTIVUS Predict • Sustain-a-thon 2026
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shadow-sm z-10 sticky top-0">
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
          
          <div className="flex items-center gap-3 md:gap-6">
             {/* Regional Hub Info */}
             <div className="hidden md:block text-right">
                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Active Facility</p>
                <p className="text-sm font-semibold text-slate-700">Hospital A (Chennai Hub)</p>
             </div>
             
             <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/admin/alerts')}
                title="View Medicine Alerts"
                className="relative p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white ring-1 ring-white"></span>
              </button>
              
              {/* Mobile Role Badge */}
              <div className={`md:hidden w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${getRoleBadgeStyle(user?.role)}`}>
                  {user?.name.charAt(0) || 'U'}
              </div>
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