import { useEffect, useState } from 'react';
import { adminTrainers } from '../../api/admin';
import { formatMoney } from '../../components/PlanCard';
import { Badge } from '../../components/ui/Badge';

export default function AdminTrainers() {
  const [rows, setRows] = useState([]);
  useEffect(() => { adminTrainers().then((res) => setRows(res.data.data)); }, []);
  return (
    <section>
      <h1 className="text-3xl font-black">Quan ly HLV</h1>
      <div className="mt-6 grid gap-4 xl:grid-cols-2">{rows.map((t) => <article key={t.id} className="card flex gap-4 p-4"><img src={t.avatar_url} className="h-20 w-20 rounded-lg object-cover" /><div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><h3 className="font-black">{t.full_name}</h3><Badge tone={t.status}>{t.status}</Badge></div><p className="text-sm text-primary">{t.specialty}</p><p className="mt-1 text-sm text-zinc-500">{formatMoney(t.hourly_rate)}/h · {t.phone}</p></div></article>)}</div>
    </section>
  );
}
