import { adminPromotions, createAdminPromotion, deleteAdminPromotion, updateAdminPromotion } from '../../api/admin';
import { AdminResource } from '../../components/admin/AdminResource';
import { Badge } from '../../components/ui/Badge';

const fields = [
  { name: 'code', label: 'Mã', required: true },
  { name: 'description', label: 'Mô tả', type: 'textarea' },
  { name: 'discount_type', label: 'Loại giảm', type: 'select', defaultValue: 'percent', required: true, options: [{ value: 'percent', label: 'Phần trăm' }, { value: 'fixed', label: 'Số tiền cố định' }] },
  { name: 'discount_value', label: 'Giá trị giảm', type: 'number', required: true, min: 0.01 },
  { name: 'min_order_amount', label: 'Giá trị đơn tối thiểu', type: 'number', defaultValue: 0, min: 0, step: 1000 },
  { name: 'start_date', label: 'Ngày bắt đầu', type: 'date', required: true },
  { name: 'end_date', label: 'Ngày kết thúc', type: 'date', required: true },
  { name: 'usage_limit', label: 'Giới hạn sử dụng', type: 'number', defaultValue: 100, required: true, min: 1, step: 1 },
  { name: 'is_active', label: 'Trạng thái', type: 'select', defaultValue: 1, required: true, options: [{ value: 1, label: 'Đang hoạt động' }, { value: 0, label: 'Đã tắt' }] }
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
      getRowLabel={(row) => row.code}
      deleteConfig={{
        title: 'Tắt mã khuyến mãi',
        actionLabel: 'Tắt',
        confirmLabel: 'Tắt mã',
        destructive: false,
        description: (row) => `Tắt mã “${row.code}”? Mã sẽ không thể áp dụng cho đơn hàng mới, nhưng lịch sử sử dụng vẫn được giữ lại.`
      }}
      canDelete={(row) => Boolean(row.is_active)}
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
