import { useEffect, useState } from 'react';
import { adminMaintenance } from '../../api/admin';
import { formatMoney } from '../../components/PlanCard';
import { Badge } from '../../components/ui/Badge';

export default function AdminMaintenance() {
  const [rows, setRows] = useState([]);
  useEffect(() => { adminMaintenance().then((res) => setRows(res.data.data)); }, []);
  return (
    <section>
      <h1 className="text-3xl font-black">Bao tri</h1>
      <div className="mt-6 grid gap-4">{rows.map((m) => <article key={m.id} className="card p-4"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-black">{m.equipment_name}</h3><Badge tone={m.status === 'completed' ? 'active' : 'pending'}>{m.status}</Badge></div><p className="mt-2 text-sm text-zinc-500">{m.maintenance_date} · {m.type} · {formatMoney(m.cost)}</p><p className="mt-2 text-sm">{m.description}</p></article>)}</div>
    </section>
  );
}
