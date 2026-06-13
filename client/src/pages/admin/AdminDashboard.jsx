import {
  ArrowDownRight,
  ArrowUpRight,
  CircleDollarSign,
  Dumbbell,
  PackageCheck,
  Settings,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { adminStats } from '../../api/admin';
import { formatMoney } from '../../components/PlanCard';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { useAuth } from '../../hooks/useAuth';

const CHART_COLORS = ['#F59E0B', '#FCD34D', '#D97706', '#FFFFFF', '#71717A'];

const formatCompactMoney = (value) => new Intl.NumberFormat('vi-VN', {
  notation: 'compact',
  maximumFractionDigits: 1,
}).format(value || 0);

const KpiCard = ({ icon: Icon, label, value, detail, featured = false, growth }) => {
  const positive = Number(growth) >= 0;

  return (
    <article className={`relative min-h-44 overflow-hidden rounded-lg border p-5 ${
      featured
        ? 'border-primary bg-primary text-black'
        : 'border-white/10 bg-zinc-900 text-white'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <p className={`text-sm font-bold ${featured ? 'text-black/60' : 'text-zinc-500'}`}>{label}</p>
        <span className={`grid h-10 w-10 place-items-center rounded-full ${
          featured ? 'bg-black text-primary' : 'bg-white/5 text-primary'
        }`}>
          <Icon size={19} />
        </span>
      </div>
      <p className="mt-7 text-3xl font-black tracking-tight">{value}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className={`text-xs ${featured ? 'text-black/60' : 'text-zinc-500'}`}>{detail}</p>
        {growth !== undefined && (
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-black ${
            positive
              ? featured ? 'bg-black text-primary' : 'bg-emerald-500/15 text-emerald-400'
              : 'bg-red-500/15 text-red-400'
          }`}>
            {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(Number(growth)).toFixed(1)}%
          </span>
        )}
      </div>
    </article>
  );
};

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-black px-3 py-2 shadow-xl">
      <p className="text-xs font-bold text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-black text-primary">{formatMoney(payload[0].value)}</p>
    </div>
  );
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    adminStats().then((res) => setData(res.data.data));
  }, []);

  const revenueSeries = useMemo(() => (data?.revenue_series || []).map((item) => ({
    ...item,
    label: new Intl.DateTimeFormat('vi-VN', { month: 'short' }).format(new Date(`${item.month}-01T00:00:00`)),
  })), [data]);

  const revenueByPlan = data?.revenue_by_plan || [];
  const totalPlanRevenue = revenueByPlan.reduce((sum, item) => sum + Number(item.revenue), 0);

  if (!data) return <Spinner />;

  return (
    <section className="mx-auto max-w-[1600px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">IronZone operations</p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">
            Xin chào, {user?.username || 'Admin'}.
          </h1>
          <p className="mt-2 text-sm text-zinc-500">Đây là tình hình hoạt động mới nhất của phòng tập.</p>
        </div>
        <div className="w-fit rounded-lg border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm font-bold text-zinc-300">
          Tháng này
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          featured
          icon={CircleDollarSign}
          label="Doanh thu tháng"
          value={formatMoney(data.revenue_month)}
          detail="So với tháng trước"
          growth={data.revenue_growth}
        />
        <KpiCard
          icon={PackageCheck}
          label="Tổng đơn hàng"
          value={data.total_orders}
          detail={`${data.pending_orders} đơn đang chờ xử lý`}
        />
        <KpiCard
          icon={Users}
          label="Tổng hội viên"
          value={data.total_members}
          detail={`${data.new_members_month} hội viên mới tháng này`}
        />
        <KpiCard
          icon={Dumbbell}
          label="Membership đang hoạt động"
          value={data.active_memberships}
          detail={`${data.equipment_attention} thiết bị cần chú ý`}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.45fr_0.75fr]">
        <article className="rounded-lg border border-white/10 bg-zinc-900 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Financial overview</p>
              <h2 className="mt-2 text-xl font-black">Doanh thu 6 tháng</h2>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-black">
              <ArrowUpRight size={18} />
            </span>
          </div>

          <div className="mt-8 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueSeries} margin={{ top: 10, right: 0, left: -15, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#27272A" strokeDasharray="4 4" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 12 }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71717A', fontSize: 12 }}
                  tickFormatter={formatCompactMoney}
                />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} content={<ChartTooltip />} />
                <Bar dataKey="revenue" fill="#F59E0B" radius={[6, 6, 0, 0]} maxBarSize={56} animationDuration={900} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-lg border border-white/10 bg-zinc-900 p-5 sm:p-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Revenue mix</p>
          <h2 className="mt-2 text-xl font-black">Doanh thu theo gói</h2>
          <div className="mt-4 h-[210px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueByPlan}
                  dataKey="revenue"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={86}
                  paddingAngle={3}
                  stroke="none"
                  animationDuration={900}
                >
                  {revenueByPlan.map((item, index) => (
                    <Cell key={item.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {revenueByPlan.map((item, index) => (
              <div key={item.name} className="flex items-center gap-3 text-sm">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                <span className="min-w-0 flex-1 truncate text-zinc-400">{item.name}</span>
                <strong>{totalPlanRevenue ? Math.round((item.revenue / totalPlanRevenue) * 100) : 0}%</strong>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <article className="rounded-lg border border-white/10 bg-zinc-900 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Top performance</p>
              <h2 className="mt-2 text-xl font-black">Gói bán chạy</h2>
            </div>
            <Settings size={19} className="text-zinc-600" />
          </div>
          <div className="mt-6 space-y-5">
            {data.top_plans.map((plan, index) => {
              const maxSold = Math.max(...data.top_plans.map((item) => Number(item.sold)), 1);
              const width = (Number(plan.sold) / maxSold) * 100;
              return (
                <div key={plan.name}>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="font-bold">{plan.name}</span>
                    <span className="text-zinc-500">{plan.sold} lượt</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Recent activity</p>
              <h2 className="mt-2 text-xl font-black">Đơn hàng mới nhất</h2>
            </div>
            <span className="text-sm font-bold text-zinc-500">{data.latest_orders.length} đơn</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm">
              <thead className="text-left text-xs uppercase tracking-[0.12em] text-zinc-600">
                <tr>
                  <th className="px-5 py-3 sm:px-6">Mã</th>
                  <th className="px-5 py-3">Hội viên</th>
                  <th className="px-5 py-3">Giá trị</th>
                  <th className="px-5 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {data.latest_orders.map((order) => (
                  <tr key={order.id} className="border-t border-white/5 transition hover:bg-white/[0.03]">
                    <td className="px-5 py-4 font-black text-primary sm:px-6">#{order.id}</td>
                    <td className="px-5 py-4 font-bold">{order.full_name}</td>
                    <td className="px-5 py-4 text-zinc-400">{formatMoney(order.total_amount)}</td>
                    <td className="px-5 py-4"><Badge tone={order.status}>{order.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
}
