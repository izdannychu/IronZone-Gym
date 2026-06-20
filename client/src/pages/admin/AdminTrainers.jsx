import { adminTrainers, createAdminTrainer, deleteAdminTrainer, updateAdminTrainer } from '../../api/admin';
import { AdminResource } from '../../components/admin/AdminResource';
import { formatMoney } from '../../components/PlanCard';
import { Badge } from '../../components/ui/Badge';

const fields = [
  { name: 'full_name', label: 'Họ và tên', required: true },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Phone' },
  { name: 'specialty', label: 'Chuyên môn', required: true },
  { name: 'certifications', label: 'Chứng chỉ' },
  { name: 'hourly_rate', label: 'Giá theo giờ', type: 'number', required: true, min: 0, step: 1000 },
  { name: 'avatar_url', label: 'Avatar URL' },
  { name: 'bio', label: 'Bio', type: 'textarea' },
  { name: 'status', label: 'Trạng thái', type: 'select', defaultValue: 'active', required: true, options: [{ value: 'active', label: 'Đang hoạt động' }, { value: 'inactive', label: 'Tạm ngưng' }] }
];

export default function AdminTrainers() {
  return (
    <AdminResource
      title="Quản lý HLV"
      load={adminTrainers}
      createItem={createAdminTrainer}
      updateItem={updateAdminTrainer}
      deleteItem={deleteAdminTrainer}
      fields={fields}
      getRowLabel={(row) => row.full_name}
      deleteConfig={{
        title: 'Ẩn huấn luyện viên',
        actionLabel: 'Ẩn',
        confirmLabel: 'Ẩn huấn luyện viên',
        destructive: false,
        description: (row) => `Ẩn hồ sơ của “${row.full_name}”? Dữ liệu đánh giá và lịch sử đặt huấn luyện viên vẫn được giữ lại.`
      }}
      canDelete={(row) => row.status === 'active'}
      columns={[
        { key: 'full_name', label: 'Tên', render: (row) => <strong>{row.full_name}</strong> },
        { key: 'specialty', label: 'Chuyên môn' },
        { key: 'phone', label: 'Phone' },
        { key: 'hourly_rate', label: 'Giá', render: (row) => formatMoney(row.hourly_rate) },
        { key: 'status', label: 'Trạng thái', render: (row) => <Badge tone={row.status}>{row.status}</Badge> }
      ]}
    />
  );
}
