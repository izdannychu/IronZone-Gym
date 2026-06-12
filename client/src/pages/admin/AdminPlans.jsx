import { adminPlans, createAdminPlan, deleteAdminPlan, updateAdminPlan } from '../../api/admin';
import { AdminResource } from '../../components/admin/AdminResource';
import { formatMoney } from '../../components/PlanCard';
import { Badge } from '../../components/ui/Badge';

const fields = [
  { name: 'name', label: 'Tên gói' },
  { name: 'duration_days', label: 'Thời hạn ngày', type: 'number' },
  { name: 'price', label: 'Giá', type: 'number' },
  { name: 'description', label: 'Mô tả', type: 'textarea' },
  { name: 'features', label: 'Quyền lợi, mỗi dòng một mục', type: 'textarea' },
  { name: 'is_active', label: 'Trạng thái', type: 'select', defaultValue: 1, options: [{ value: 1, label: 'active' }, { value: 0, label: 'inactive' }] },
  { name: 'is_featured', label: 'Nổi bật', type: 'select', defaultValue: 0, options: [{ value: 0, label: 'Không' }, { value: 1, label: 'Có' }] }
];

export default function AdminPlans() {
  return (
    <AdminResource
      title="Quản lý gói tập"
      load={adminPlans}
      createItem={createAdminPlan}
      updateItem={updateAdminPlan}
      deleteItem={deleteAdminPlan}
      fields={fields}
      normalize={(row) => ({ ...row, features: row.features?.join('\n') || '' })}
      columns={[
        { key: 'name', label: 'Tên', render: (row) => <strong>{row.name}</strong> },
        { key: 'duration_days', label: 'Ngày' },
        { key: 'price', label: 'Giá', render: (row) => formatMoney(row.price) },
        { key: 'is_active', label: 'Trạng thái', render: (row) => <Badge tone={row.is_active ? 'active' : 'cancelled'}>{row.is_active ? 'active' : 'inactive'}</Badge> },
        { key: 'is_featured', label: 'Nổi bật', render: (row) => row.is_featured ? 'Có' : 'Không' }
      ]}
    />
  );
}
