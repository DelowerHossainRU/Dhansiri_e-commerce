import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingCart, Boxes, Users, Briefcase, 
  FileText, Tag, Settings, ScrollText, ArrowLeft, LogOut, ShieldAlert,
  Menu, X, Microscope, FileSpreadsheet, Sprout
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Toaster } from 'sonner';

export const AdminLayout = () => {
  const { user, logout, isAdmin, isStaff } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  if (!user || (!isAdmin && !isStaff)) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto mb-4" />
        <h2 className="font-serif-display text-2xl font-bold text-[#1E2420] mb-2">Access Denied</h2>
        <p className="text-xs text-[#71717A] mb-6">You must be logged in as an administrator or operations staff to view this console.</p>
        <Link to="/login" className="px-4 py-2 text-white text-xs font-semibold rounded-xs shadow-xs" style={{ backgroundColor: 'var(--brand-primary)' }}>
          Sign In as Admin
        </Link>
      </div>
    );
  }

  const menuItems = [
    { label: 'Executive Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Products & Varieties', path: '/admin/products', icon: Package },
    { label: 'Orders & Shipments', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Silo & Warehouse Stock', path: '/admin/inventory', icon: Boxes },
    { label: 'Purchases & POs', path: '/admin/purchases', icon: FileText },
    { label: 'Partner Farmers', path: '/admin/farmers', icon: Sprout },
    { label: 'Quality Control & Lab', path: '/admin/quality', icon: Microscope },
    { label: 'B2B & Wholesale Quotes', path: '/admin/wholesale', icon: Briefcase },
    { label: 'Business Reports & CSV', path: '/admin/reports', icon: FileSpreadsheet },
    { label: 'Farmer Suppliers', path: '/admin/suppliers', icon: Users },
    { label: 'Promo Coupons', path: '/admin/coupons', icon: Tag },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
    { label: 'Audit Trail Logs', path: '/admin/audit-logs', icon: ScrollText }
  ];

  return (
    <div
      className="h-screen w-full max-w-full flex flex-col md:flex-row overflow-hidden bg-slate-50"
      style={{ color: 'var(--brand-text)' }}
    >
      <Toaster position="bottom-right" richColors />

      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-xs text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-serif-display font-bold text-base text-slate-900 tracking-tight">
            DHANSIRI AGRO
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[10px] uppercase font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
            Admin
          </span>
          <Link
            to="/"
            className="text-slate-500 hover:text-slate-900 p-1"
            title="Return to Public Store"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-40 transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar - Permanently fixed on desktop, never scrolls with page */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 md:z-20 w-64 bg-white text-slate-800 shrink-0 flex flex-col justify-between p-4 border-r border-slate-200 shadow-xl md:shadow-xs transition-transform duration-200 ease-in-out h-full overflow-y-auto ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Logo in Admin */}
          <div className="pb-4 mb-4 border-b border-slate-200 flex items-center justify-between">
            <Link to="/admin" className="block group">
              <span className="font-serif-display text-lg font-bold text-slate-900 block group-hover:text-emerald-800 transition-colors">
                DHANSIRI AGRO
              </span>
              <span
                className="text-[10px] uppercase tracking-widest font-semibold block"
                style={{ color: 'var(--brand-primary)' }}
              >
                Operations Console
              </span>
            </Link>
            <div className="flex items-center gap-1">
              <Link
                to="/"
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-xs transition-colors"
                title="Return to Public Store"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="md:hidden text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xs text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-900 font-semibold border-l-2 border-[#166534] shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-emerald-800' : 'text-slate-400'
                        }`}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Badge & Logout */}
        <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
              {user.name?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-slate-900 block truncate max-w-[120px]">{user.name}</span>
              <span className="text-[10px] text-slate-500 capitalize">{user.role}</span>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xs transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body - Right side has independent scroll and sticky header */}
      <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden bg-slate-50">
        <header
          className="sticky top-0 z-10 border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between bg-white shadow-2xs shrink-0"
        >
          <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
            <span className="font-semibold text-slate-900 hidden sm:inline">Dhansiri Enterprise Core</span>
            <span className="hidden sm:inline">/</span>
            <span className="capitalize">{window.location.pathname.replace('/admin', '').replace('/', '') || 'Overview'}</span>
          </div>
          <div className="flex items-center gap-4 text-xs shrink-0">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xs border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              Silo Sync Online
            </span>
            <Link
              to="/"
              target="_blank"
              className="font-semibold hover:underline flex items-center gap-1 text-slate-700 hover:text-emerald-800"
            >
              Live Store ↗
            </Link>
          </div>
        </header>

        <main ref={mainRef} className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
