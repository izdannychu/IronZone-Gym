import { useEffect, useState } from 'react';
import { adminMembers } from '../../api/admin';
import { Badge } from '../../components/ui/Badge';

export default function AdminMembers() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  useEffect(() => { adminMembers({ search }).then((res) => setRows(res.data.data.rows)); }, [search]);
  return (
    <section>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><h1 className="text-3xl font-black">Hoi vien</h1><input className="input max-w-sm" placeholder="Tim ten, email, phone" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-zinc-100 dark:bg-zinc-800"><tr><th className="p-4 text-left">Ten</th><th className="p-4 text-left">Email</th><th className="p-4 text-left">Phone</th><th className="p-4 text-left">Trang thai</th><th className="p-4 text-left">Ngay tao</th></tr></thead>
          <tbody>{rows.map((u) => <tr key={u.id} className="border-t border-zinc-200 dark:border-zinc-800"><td className="p-4 font-bold">{u.full_name}</td><td className="p-4">{u.email}</td><td className="p-4">{u.phone}</td><td className="p-4"><Badge tone={u.status}>{u.status}</Badge></td><td className="p-4">{new Date(u.created_at).toLocaleDateString('vi-VN')}</td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
