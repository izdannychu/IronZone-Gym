import { Bell, CreditCard, Dumbbell, PackageCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { getMyOrders } from '../api/orders';
import { MembershipCard } from '../components/MembershipCard';
import { formatMoney } from '../components/PlanCard';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';

export default function Dashboard() {
  const [memberships, setMemberships] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    Promise.all([api.get('/memberships/my'), getMyOrders(), api.get('/notifications/my')]).then(([m, o, n]) => {
      setMemberships(m.data.data);
      setOrders(o.data.data);
      setNotifications(n.data.data);
    });
  }, []);
  const active = memberships.filter((m) => m.status === 'active');
  const unread = notifications.filter((n) => !n.is_read).length;
  return (
    <main className="container-page py-10">
      <h1 className="text-4xl font-black">Dashboard hoi vien</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <StatCard icon={Dumbbell} label="Membership active" value={active.length} />
        <StatCard icon={CreditCard} label="Don hang" value={orders.length} />
        <StatCard icon={Bell} label="Thong bao moi" value={unread} />
      </div>
      <section className="mt-10">
        <h2 className="text-2xl font-black">Membership</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">{memberships.length ? memberships.map((m) => <MembershipCard key={m.id} membership={m} />) : <EmptyState title="Chua co membership" subtitle="Hay mua mot goi tap de kich hoat." />}</div>
      </section>
      <section className="mt-10">
        <h2 className="text-2xl font-black">Don hang</h2>
        <div className="mt-5 overflow-x-auto card">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-zinc-100 dark:bg-zinc-800"><tr><th className="p-4 text-left">Ma</th><th className="p-4 text-left">Ngay</th><th className="p-4 text-left">Tong</th><th className="p-4 text-left">Trang thai</th></tr></thead>
            <tbody>{orders.map((o) => <tr key={o.id} className="border-t border-zinc-200 dark:border-zinc-800"><td className="p-4 font-bold">#{o.id}</td><td className="p-4">{new Date(o.ordered_at).toLocaleDateString('vi-VN')}</td><td className="p-4">{formatMoney(o.total_amount)}</td><td className="p-4"><Badge tone={o.status}>{o.status}</Badge></td></tr>)}</tbody>
          </table>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="text-2xl font-black">Thong bao</h2>
        <div className="mt-5 grid gap-3">{notifications.map((n) => <div key={n.id} className="card flex items-start gap-3 p-4"><PackageCheck className="text-primary" /><div><h3 className="font-bold">{n.title}</h3><p className="text-sm text-zinc-500">{n.message}</p></div></div>)}</div>
      </section>
    </main>
  );
}
