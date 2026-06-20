import { adminEquipment, createAdminEquipment, deleteAdminEquipment, updateAdminEquipment } from '../../api/admin';
import { AdminResource } from '../../components/admin/AdminResource';
import { formatMoney } from '../../components/PlanCard';
import { Badge } from '../../components/ui/Badge';

const fields = [
  { name: 'name', label: 'Tên thiết bị', required: true },
  { name: 'category', label: 'Loại' },
  { name: 'brand', label: 'Hãng' },
  { name: 'serial_number', label: 'Số sê-ri' },
  { name: 'purchased_at', label: 'Ngày mua', type: 'date' },
  { name: 'purchase_price', label: 'Giá mua', type: 'number', min: 0, step: 1000 },
  { name: 'location', label: 'Vị trí' },
  { name: 'image_url', label: 'Hình ảnh (URL)' },
  {
    name: 'condition',
    label: 'Tình trạng',
    type: 'select',
    defaultValue: 'good',
    required: true,
    options: [
      { value: 'new', label: 'Mới' },
      { value: 'good', label: 'Tốt' },
      { value: 'fair', label: 'Cần theo dõi' },
      { value: 'poor', label: 'Cần sửa chữa' },
      { value: 'retired', label: 'Ngừng sử dụng' }
    ]
  }
];

export default function AdminEquipment() {
  return (
    <AdminResource
      title="Quản lý thiết bị"
      load={adminEquipment}
      createItem={createAdminEquipment}
      updateItem={updateAdminEquipment}
      deleteItem={deleteAdminEquipment}
      fields={fields}
      getRowLabel={(row) => row.name}
      deleteConfig={{
        title: 'Ngừng sử dụng thiết bị',
        actionLabel: 'Ngừng sử dụng',
        confirmLabel: 'Xác nhận ngừng sử dụng',
        description: (row) => `Chuyển “${row.name}” sang trạng thái ngừng sử dụng? Lịch sử bảo trì của thiết bị vẫn được giữ lại.`
      }}
      canDelete={(row) => row.condition !== 'retired'}
      columns={[
        { key: 'name', label: 'Tên', render: (row) => <strong>{row.name}</strong> },
        { key: 'category', label: 'Loại' },
        { key: 'brand', label: 'Hãng' },
        { key: 'condition', label: 'Tình trạng', render: (row) => <Badge tone={row.condition === 'good' || row.condition === 'new' ? 'active' : 'pending'}>{row.condition}</Badge> },
        { key: 'location', label: 'Vị trí' },
        { key: 'purchase_price', label: 'Giá mua', render: (row) => formatMoney(row.purchase_price) }
      ]}
    />
  );
}
