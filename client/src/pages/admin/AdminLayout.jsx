import { BarChart3, Dumbbell, Percent, Settings, Users, Wrench } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

const items = [
  ['', BarChart3, 'Tong quan'],
  ['members', Users, 'Hoi vien'],
  ['trainers', Dumbbell, 'HLV'],
  ['equipment', Settings, 'Thiet bi'],
  ['maintenance', Wrench, 'Bao tri'],
  ['promotions', Percent, 'Khuyen mai']
];

export default function AdminLayout() {
  return (
    <main className="container-page grid gap-6 py-10 lg:grid-cols-[240px_1fr]">
      <aside className="card h-fit p-3">
        {items.map(([to, Icon, label]) => <NavLink end={to === ''} key={label} to={to} className={({ isActive }) => `mb-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold ${isActive ? 'bg-primary text-black' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}><Icon size={18} />{label}</NavLink>)}
      </aside>
      <Outlet />
    </main>
  );
}
