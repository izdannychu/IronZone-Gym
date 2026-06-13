import {
  BarChart3,
  Bell,
  Dumbbell,
  Home,
  LogOut,
  Menu,
  Package,
  Percent,
  ReceiptText,
  Search,
  Settings,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const items = [
  ['', BarChart3, 'Tổng quan'],
  ['plans', Package, 'Gói tập'],
  ['members', Users, 'Hội viên'],
  ['trainers', Dumbbell, 'HLV'],
  ['equipment', Settings, 'Thiết bị'],
  ['maintenance', Wrench, 'Bảo trì'],
  ['promotions', Percent, 'Khuyến mãi'],
  ['orders', ReceiptText, 'Đơn hàng'],
];

const Sidebar = ({ onNavigate }) => (
  <div className="flex h-full flex-col">
    <Link to="/admin" onClick={onNavigate} className="block border-b border-white/10 px-6 py-6">
      <img src="/assets/ironzone-logo.png" alt="IronZone Admin" className="h-8 w-auto" />
      <span className="mt-2 block text-[10px] font-black uppercase tracking-[0.24em] text-zinc-500">Management console</span>
    </Link>

    <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
      {items.map(([to, Icon, label]) => (
        <NavLink
          end={to === ''}
          key={label}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) => `group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold transition ${
            isActive
              ? 'bg-primary text-black'
              : 'text-zinc-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Icon size={18} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>

    <div className="border-t border-white/10 p-4">
      <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold text-zinc-400 hover:bg-white/5 hover:text-white">
        <Home size={18} />
        Về trang chủ
      </Link>
    </div>
  </div>
);

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const today = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date());
  const username = user?.username || 'Admin';

  return (
    <main className="dark min-h-screen bg-zinc-950 text-zinc-100 lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="hidden h-screen border-r border-white/10 bg-black lg:sticky lg:top-0 lg:block">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              aria-label="Đóng menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-white/10 bg-black lg:hidden"
            >
              <button onClick={() => setMobileOpen(false)} className="absolute right-4 top-5 rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white">
                <X size={20} />
              </button>
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <section className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/90 backdrop-blur-xl">
          <div className="flex min-h-20 items-center gap-4 px-4 sm:px-6 lg:px-8">
            <button onClick={() => setMobileOpen(true)} className="rounded-lg border border-white/10 p-2.5 text-zinc-300 lg:hidden">
              <Menu size={20} />
            </button>

            <label className="relative hidden max-w-sm flex-1 sm:block">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input className="h-11 w-full rounded-lg border border-white/10 bg-black/40 pl-11 pr-4 text-sm outline-none placeholder:text-zinc-600 focus:border-primary" placeholder="Tìm kiếm trong hệ thống..." />
            </label>

            <p className="hidden text-sm font-semibold capitalize text-zinc-500 xl:block">{today}</p>

            <div className="ml-auto flex items-center gap-2">
              <button title="Thông báo" className="relative grid h-11 w-11 place-items-center rounded-lg border border-white/10 bg-black/40 text-zinc-300 hover:border-primary hover:text-primary">
                <Bell size={18} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                title="Đăng xuất"
                className="grid h-11 w-11 place-items-center rounded-lg border border-white/10 bg-black/40 text-zinc-300 hover:border-red-500 hover:text-red-400"
              >
                <LogOut size={18} />
              </button>
              <div className="ml-1 flex items-center gap-3 border-l border-white/10 pl-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-primary font-black text-black">
                  {username.slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-black">{username}</p>
                  <p className="text-xs text-zinc-500">{user?.role || 'Administrator'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </section>
    </main>
  );
}
