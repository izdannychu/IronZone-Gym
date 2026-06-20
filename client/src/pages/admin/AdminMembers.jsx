import { useEffect, useState } from 'react';
import { adminMembers, createAdminMember, deleteAdminMember, updateAdminMember } from '../../api/admin';
import { AdminResource } from '../../components/admin/AdminResource';
import { Badge } from '../../components/ui/Badge';

const fields = [
  { name: 'full_name', label: 'Họ và tên', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'password', label: 'Mật khẩu', type: 'password', createOnly: true, required: true, minLength: 6 },
  { name: 'phone', label: 'Số điện thoại' },
  { name: 'dob', label: 'Ngày sinh', type: 'date' },
  {
    name: 'gender',
    label: 'Giới tính',
    type: 'select',
    placeholder: 'Chưa cập nhật',
    options: [
      { value: 'male', label: 'Nam' },
      { value: 'female', label: 'Nữ' },
      { value: 'other', label: 'Khác' }
    ]
  },
  { name: 'avatar_url', label: 'Ảnh đại diện (URL)' },
  {
    name: 'status',
    label: 'Trạng thái',
    type: 'select',
    defaultValue: 'active',
    required: true,
    options: [
      { value: 'active', label: 'Đang hoạt động' },
      { value: 'inactive', label: 'Tạm ngưng' },
      { value: 'banned', label: 'Đã khóa' }
    ]
  }
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
      <input className="input mb-5 max-w-sm" placeholder="Tìm tên, email hoặc số điện thoại" value={search} onChange={(e) => setSearch(e.target.value)} />
      <AdminResource
        key={reloadKey}
        title="Quản lý hội viên"
        load={() => adminMembers({ search, limit: 100 })}
        createItem={createAdminMember}
        updateItem={updateAdminMember}
        deleteItem={deleteAdminMember}
        fields={fields}
        normalize={(row) => ({ ...row, dob: row.dob || '', gender: row.gender || '', avatar_url: row.avatar_url || '' })}
        getRowLabel={(row) => row.full_name}
        deleteConfig={{
          title: 'Khóa tài khoản hội viên',
          actionLabel: 'Khóa',
          confirmLabel: 'Khóa tài khoản',
          description: (row) => `Khóa tài khoản “${row.full_name}”? Hội viên sẽ không thể đăng nhập, nhưng đơn hàng và lịch sử liên quan vẫn được giữ lại.`
        }}
        canDelete={(row) => row.status !== 'banned'}
        columns={[
          { key: 'full_name', label: 'Tên', render: (row) => <strong>{row.full_name}</strong> },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Số điện thoại' },
          { key: 'status', label: 'Trạng thái', render: (row) => <Badge tone={row.status}>{row.status}</Badge> },
          { key: 'created_at', label: 'Ngày tạo', render: (row) => new Date(row.created_at).toLocaleDateString('vi-VN') }
        ]}
      />
    </div>
  );
}
