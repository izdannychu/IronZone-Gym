import { useEffect, useState } from 'react';
import { adminEquipment } from '../../api/admin';
import { formatMoney } from '../../components/PlanCard';
import { Badge } from '../../components/ui/Badge';

export default function AdminEquipment() {
  const [rows, setRows] = useState([]);
  useEffect(() => { adminEquipment().then((res) => setRows(res.data.data)); }, []);
  return (
    <section>
      <h1 className="text-3xl font-black">Thiet bi</h1>
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="bg-zinc-100 dark:bg-zinc-800"><tr><th className="p-4 text-left">Ten</th><th className="p-4 text-left">Loai</th><th className="p-4 text-left">Hang</th><th className="p-4 text-left">Tinh trang</th><th className="p-4 text-left">Vi tri</th><th className="p-4 text-left">Gia mua</th></tr></thead>
          <tbody>{rows.map((e) => <tr key={e.id} className="border-t border-zinc-200 dark:border-zinc-800"><td className="p-4 font-bold">{e.name}</td><td className="p-4">{e.category}</td><td className="p-4">{e.brand}</td><td className="p-4"><Badge tone={e.condition === 'good' || e.condition === 'new' ? 'active' : 'pending'}>{e.condition}</Badge></td><td className="p-4">{e.location}</td><td className="p-4">{formatMoney(e.purchase_price)}</td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
