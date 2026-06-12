import { adminMaintenance, createAdminMaintenance, deleteAdminMaintenance, updateAdminMaintenance } from '../../api/admin';
import { AdminResource } from '../../components/admin/AdminResource';
import { formatMoney } from '../../components/PlanCard';
import { Badge } from '../../components/ui/Badge';

const fields = [
  { name: 'equipment_id', label: 'ID thiết bị', type: 'number' },
  { name: 'employee_id', label: 'ID nhân viên', type: 'number' },
  { name: 'maintenance_date', label: 'Ngày bảo trì', type: 'date' },
  { name: 'type', label: 'Loại', type: 'select', defaultValue: 'routine', options: ['routine', 'repair', 'replacement', 'inspection'].map((value) => ({ value, label: value })) },
  { name: 'description', label: 'Mô tả', type: 'textarea' },
  { name: 'cost', label: 'Chi phí', type: 'number' },
  { name: 'status', label: 'Trạng thái', type: 'select', defaultValue: 'completed', options: ['scheduled', 'in_progress', 'completed'].map((value) => ({ value, label: value })) }
];

export default function AdminMaintenance() {
  return (
    <AdminResource
      title="Quản lý bảo trì"
      load={adminMaintenance}
      createItem={createAdminMaintenance}
      updateItem={updateAdminMaintenance}
      deleteItem={deleteAdminMaintenance}
      fields={fields}
      columns={[
        { key: 'equipment_name', label: 'Thiết bị', render: (row) => <strong>{row.equipment_name || `#${row.equipment_id}`}</strong> },
        { key: 'maintenance_date', label: 'Ngày' },
        { key: 'type', label: 'Loại' },
        { key: 'cost', label: 'Chi phí', render: (row) => formatMoney(row.cost) },
        { key: 'status', label: 'Trạng thái', render: (row) => <Badge tone={row.status === 'completed' ? 'active' : 'pending'}>{row.status}</Badge> }
      ]}
    />
  );
}
