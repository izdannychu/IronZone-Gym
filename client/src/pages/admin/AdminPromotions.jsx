import { adminPromotions, createAdminPromotion, deleteAdminPromotion, updateAdminPromotion } from '../../api/admin';
import { AdminResource } from '../../components/admin/AdminResource';
import { Badge } from '../../components/ui/Badge';

const fields = [
  { name: 'code', label: 'Mã' },
  { name: 'description', label: 'Mô tả', type: 'textarea' },
  { name: 'discount_type', label: 'Loại giảm', type: 'select', defaultValue: 'percent', options: [{ value: 'percent', label: 'percent' }, { value: 'fixed', label: 'fixed' }] },
  { name: 'discount_value', label: 'Giá trị', type: 'number' },
  { name: 'min_order_amount', label: 'Đơn tối thiểu', type: 'number' },
  { name: 'start_date', label: 'Ngày bắt đầu', type: 'date' },
  { name: 'end_date', label: 'Ngày kết thúc', type: 'date' },
  { name: 'usage_limit', label: 'Giới hạn', type: 'number' },
  { name: 'is_active', label: 'Trạng thái', type: 'select', defaultValue: 1, options: [{ value: 1, label: 'active' }, { value: 0, label: 'inactive' }] }
];

export default function AdminPromotions() {
  return (
    <AdminResource
      title="Quản lý mã khuyến mãi"
      load={adminPromotions}
      createItem={createAdminPromotion}
      updateItem={updateAdminPromotion}
      deleteItem={deleteAdminPromotion}
      fields={fields}
      columns={[
        { key: 'code', label: 'Mã', render: (row) => <strong className="text-primary">{row.code}</strong> },
        { key: 'discount_value', label: 'Giảm', render: (row) => row.discount_type === 'percent' ? `${row.discount_value}%` : `${Number(row.discount_value).toLocaleString('vi-VN')}đ` },
        { key: 'used_count', label: 'Đã dùng', render: (row) => `${row.used_count}/${row.usage_limit}` },
        { key: 'end_date', label: 'Hết hạn' },
        { key: 'is_active', label: 'Trạng thái', render: (row) => <Badge tone={row.is_active ? 'active' : 'cancelled'}>{row.is_active ? 'active' : 'off'}</Badge> }
      ]}
    />
  );
}
