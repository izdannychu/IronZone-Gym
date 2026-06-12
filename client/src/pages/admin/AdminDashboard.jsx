import { DollarSign, Dumbbell, Settings, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { adminStats } from '../../api/admin';
import { formatMoney } from '../../components/PlanCard';
import { StatCard } from '../../components/StatCard';
import { Badge } from '../../components/ui/Badge';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  useEffect(() => { adminStats().then((res) => setData(res.data.data)); }, []);
  if (!data) return null;
  return (
    <section>
      <h1 className="text-3xl font-black">Admin Dashboard</h1>
      <div className="mt-6 grid gap-5 md:grid-cols-4">
        <StatCard icon={Users} label="Tổng hội viên" value={data.total_members} />
        <StatCard icon={DollarSign} label="Doanh thu tháng" value={formatMoney(data.revenue_month)} />
        <StatCard icon={Dumbbell} label="Membership active" value={data.active_memberships} />
        <StatCard icon={Settings} label="Thiết bị cần chú ý" value={data.equipment_attention} />
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-black">Gói bán chạy</h2>
          <div className="mt-5 space-y-3">{data.top_plans.map((p) => <div key={p.name} className="flex items-center justify-between"><span>{p.name}</span><strong>{p.sold}</strong></div>)}</div>
        </div>
        <div className="card p-5">
          <h2 className="font-black">Đơn hàng mới</h2>
          <div className="mt-5 space-y-3">{data.latest_orders.map((o) => <div key={o.id} className="flex items-center justify-between gap-4"><span className="truncate">#{o.id} {o.full_name}</span><Badge tone={o.status}>{o.status}</Badge></div>)}</div>
        </div>
      </div>
    </section>
  );
}
