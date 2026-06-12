import { BarChart3, Dumbbell, Home, LogOut, Package, Percent, ReceiptText, Settings, Users, Wrench } from 'lucide-react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

const items = [
  ['', BarChart3, 'Tổng quan'],
  ['plans', Package, 'Gói tập'],
  ['members', Users, 'Hội viên'],
  ['trainers', Dumbbell, 'HLV'],
  ['equipment', Settings, 'Thiết bị'],
  ['maintenance', Wrench, 'Bảo trì'],
  ['promotions', Percent, 'Khuyến mãi'],
  ['orders', ReceiptText, 'Đơn hàng']
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="grid min-h-screen bg-zinc-100 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100 lg:grid-cols-[260px_1fr]">
      <aside className="border-r border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <Link to="/admin" className="mb-8 block px-2">
          <img src="/assets/ironzone-logo-light.png" alt="IronZone Admin" className="h-8 w-auto dark:hidden" />
          <img src="/assets/ironzone-logo.png" alt="IronZone Admin" className="hidden h-8 w-auto dark:block" />
          <span className="mt-2 block text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Admin Console</span>
        </Link>
        <nav>
          {items.map(([to, Icon, label]) => <NavLink end={to === ''} key={label} to={to} className={({ isActive }) => `mb-1 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold ${isActive ? 'bg-primary text-black' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}><Icon size={18} />{label}</NavLink>)}
        </nav>
      </aside>
      <section className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
          <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Management Console</p>
              <h1 className="text-xl font-black">{user?.username || 'Admin'}</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button as={Link} to="/" variant="outline"><Home size={17} />Về trang chủ</Button>
              <Button variant="dark" onClick={() => { logout(); navigate('/login'); }}><LogOut size={17} />Đăng xuất</Button>
            </div>
          </div>
        </header>
        <div className="p-5 lg:p-8">
          <Outlet />
        </div>
      </section>
    </main>
  );
}
