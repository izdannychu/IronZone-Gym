import { SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getPlans } from '../api/plans';
import { PlanCard } from '../components/PlanCard';
import { Spinner } from '../components/ui/Spinner';

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [duration, setDuration] = useState('all');
  const [sort, setSort] = useState('asc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlans().then((res) => setPlans(res.data.data)).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => plans.filter((p) => {
    if (duration === '30') return p.duration_days <= 30;
    if (duration === '90') return p.duration_days === 90;
    if (duration === '180') return p.duration_days >= 180;
    return true;
  }).sort((a, b) => sort === 'asc' ? a.price - b.price : b.price - a.price), [plans, duration, sort]);

  return (
    <main className="container-page py-10">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div><h1 className="text-4xl font-black">Goi tap</h1><p className="mt-2 text-zinc-500">Chon goi phu hop muc tieu va lich tap cua ban.</p></div>
        <div className="flex flex-wrap gap-2">
          {['all', '30', '90', '180'].map((v) => <button key={v} onClick={() => setDuration(v)} className={`rounded-lg px-3 py-2 text-sm font-bold ${duration === v ? 'bg-primary text-black' : 'bg-white dark:bg-zinc-900'}`}>{v === 'all' ? 'Tat ca' : v === '30' ? '1 thang' : v === '90' ? '3 thang' : '6+ thang'}</button>)}
          <label className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm dark:bg-zinc-900"><SlidersHorizontal size={16} /><select className="bg-transparent outline-none" value={sort} onChange={(e) => setSort(e.target.value)}><option value="asc">Gia tang dan</option><option value="desc">Gia giam dan</option></select></label>
        </div>
      </div>
      {loading ? <Spinner /> : <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filtered.map((plan) => <PlanCard key={plan.id} plan={plan} />)}</div>}
      <section className="mt-12 overflow-x-auto">
        <table className="w-full min-w-[720px] overflow-hidden rounded-xl border border-zinc-200 text-sm dark:border-zinc-800">
          <thead className="bg-zinc-100 dark:bg-zinc-900"><tr>{['Goi', 'Thoi han', 'Gia', 'PT mien phi', 'Xong hoi'].map((h) => <th key={h} className="p-4 text-left">{h}</th>)}</tr></thead>
          <tbody>{plans.map((p) => <tr key={p.id} className="border-t border-zinc-200 dark:border-zinc-800"><td className="p-4 font-bold">{p.name}</td><td className="p-4">{p.duration_days} ngay</td><td className="p-4">{p.price.toLocaleString('vi-VN')}d</td><td className="p-4">{p.features.join(' ').includes('PT') ? 'Co' : 'Khong'}</td><td className="p-4">{p.features.join(' ').includes('xong') ? 'Co' : 'Khong'}</td></tr>)}</tbody>
        </table>
      </section>
    </main>
  );
}
