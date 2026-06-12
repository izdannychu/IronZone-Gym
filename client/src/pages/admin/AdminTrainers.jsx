import { adminTrainers, createAdminTrainer, deleteAdminTrainer, updateAdminTrainer } from '../../api/admin';
import { AdminResource } from '../../components/admin/AdminResource';
import { formatMoney } from '../../components/PlanCard';
import { Badge } from '../../components/ui/Badge';

const fields = [
  { name: 'full_name', label: 'Họ tên' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Phone' },
  { name: 'specialty', label: 'Chuyên môn' },
  { name: 'certifications', label: 'Chứng chỉ' },
  { name: 'hourly_rate', label: 'Giá theo giờ', type: 'number' },
  { name: 'avatar_url', label: 'Avatar URL' },
  { name: 'bio', label: 'Bio', type: 'textarea' },
  { name: 'status', label: 'Trạng thái', type: 'select', defaultValue: 'active', options: [{ value: 'active', label: 'active' }, { value: 'inactive', label: 'inactive' }] }
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
