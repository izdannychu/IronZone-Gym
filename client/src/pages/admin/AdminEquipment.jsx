import { adminEquipment, createAdminEquipment, deleteAdminEquipment, updateAdminEquipment } from '../../api/admin';
import { AdminResource } from '../../components/admin/AdminResource';
import { formatMoney } from '../../components/PlanCard';
import { Badge } from '../../components/ui/Badge';

const fields = [
  { name: 'name', label: 'Tên thiết bị' },
  { name: 'category', label: 'Loại' },
  { name: 'brand', label: 'Hãng' },
  { name: 'serial_number', label: 'Serial' },
  { name: 'purchased_at', label: 'Ngày mua', type: 'date' },
  { name: 'purchase_price', label: 'Giá mua', type: 'number' },
  { name: 'location', label: 'Vị trí' },
  { name: 'image_url', label: 'Image URL' },
  { name: 'condition', label: 'Tình trạng', type: 'select', defaultValue: 'good', options: ['new', 'good', 'fair', 'poor', 'retired'].map((value) => ({ value, label: value })) }
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
