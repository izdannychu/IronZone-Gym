import { adminPlans, createAdminPlan, deleteAdminPlan, updateAdminPlan } from '../../api/admin';
import { AdminResource } from '../../components/admin/AdminResource';
import { formatMoney } from '../../components/PlanCard';
import { Badge } from '../../components/ui/Badge';

const fields = [
  { name: 'name', label: 'Tên gói', required: true },
  { name: 'duration_days', label: 'Thời hạn (ngày)', type: 'number', required: true, min: 1, step: 1 },
  { name: 'price', label: 'Giá', type: 'number', required: true, min: 0, step: 1000 },
  { name: 'description', label: 'Mô tả', type: 'textarea' },
  { name: 'features', label: 'Quyền lợi, mỗi dòng một mục', type: 'textarea' },
  { name: 'is_active', label: 'Trạng thái', type: 'select', defaultValue: 1, required: true, options: [{ value: 1, label: 'Đang hiển thị' }, { value: 0, label: 'Đang ẩn' }] },
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
      getRowLabel={(row) => row.name}
      deleteConfig={{
        title: 'Ẩn gói tập',
        actionLabel: 'Ẩn',
        confirmLabel: 'Ẩn gói tập',
        destructive: false,
        description: (row) => `Ẩn gói “${row.name}” khỏi trang bán hàng? Các đơn hàng và hội viên đã mua gói này không bị ảnh hưởng.`
      }}
      canDelete={(row) => Boolean(row.is_active)}
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
