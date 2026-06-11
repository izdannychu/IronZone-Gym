import { useEffect, useState } from 'react';
import { adminPromotions } from '../../api/admin';
import { Badge } from '../../components/ui/Badge';

export default function AdminPromotions() {
  const [rows, setRows] = useState([]);
  useEffect(() => { adminPromotions().then((res) => setRows(res.data.data)); }, []);
  return (
    <section>
      <h1 className="text-3xl font-black">Ma khuyen mai</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">{rows.map((p) => <article key={p.id} className="card p-5"><div className="flex justify-between gap-4"><h3 className="text-xl font-black text-primary">{p.code}</h3><Badge tone={p.is_active ? 'active' : 'cancelled'}>{p.is_active ? 'active' : 'off'}</Badge></div><p className="mt-2 text-sm text-zinc-500">{p.description}</p><p className="mt-4 font-bold">{p.discount_type === 'percent' ? `${p.discount_value}%` : `${Number(p.discount_value).toLocaleString('vi-VN')}d`} · used {p.used_count}/{p.usage_limit}</p><p className="mt-1 text-xs text-zinc-500">{p.start_date} - {p.end_date}</p></article>)}</div>
    </section>
  );
}
