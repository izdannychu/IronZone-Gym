import { useEffect, useState } from 'react';
import { adminMembers, deleteAdminMember, updateAdminMember } from '../../api/admin';
import { AdminResource } from '../../components/admin/AdminResource';
import { Badge } from '../../components/ui/Badge';

const fields = [
  { name: 'full_name', label: 'Họ tên' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Phone' },
  { name: 'dob', label: 'Ngày sinh', type: 'date' },
  { name: 'gender', label: 'Giới tính', type: 'select', defaultValue: 'other', options: ['male', 'female', 'other'].map((value) => ({ value, label: value })) },
  { name: 'status', label: 'Trạng thái', type: 'select', defaultValue: 'active', options: ['active', 'inactive', 'banned'].map((value) => ({ value, label: value })) }
];

export default function AdminMembers() {
  const [search, setSearch] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setReloadKey((v) => v + 1), 250);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div>
      <input className="input mb-5 max-w-sm" placeholder="Tìm tên, email, phone" value={search} onChange={(e) => setSearch(e.target.value)} />
      <AdminResource
        key={reloadKey}
        title="Quản lý hội viên"
        load={() => adminMembers({ search })}
        updateItem={updateAdminMember}
        deleteItem={deleteAdminMember}
        fields={fields}
        columns={[
          { key: 'full_name', label: 'Tên', render: (row) => <strong>{row.full_name}</strong> },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'status', label: 'Trạng thái', render: (row) => <Badge tone={row.status}>{row.status}</Badge> },
          { key: 'created_at', label: 'Ngày tạo', render: (row) => new Date(row.created_at).toLocaleDateString('vi-VN') }
        ]}
      />
    </div>
  );
}
