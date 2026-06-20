import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  adminMaintenance,
  adminMaintenanceLookups,
  createAdminMaintenance,
  deleteAdminMaintenance,
  updateAdminMaintenance
} from '../../api/admin';
import { AdminResource } from '../../components/admin/AdminResource';
import { formatMoney } from '../../components/PlanCard';
import { Badge } from '../../components/ui/Badge';

export default function AdminMaintenance() {
  const [lookups, setLookups] = useState({ equipment: [], employees: [] });

  useEffect(() => {
    adminMaintenanceLookups()
      .then((res) => setLookups(res.data.data))
      .catch((err) => toast.error(err.response?.data?.message || 'Không tải được danh sách thiết bị và nhân viên'));
  }, []);

  const fields = useMemo(() => [
    {
      name: 'equipment_id',
      label: 'Thiết bị',
      type: 'select',
      required: true,
      placeholder: 'Chọn thiết bị',
      options: lookups.equipment.map((item) => ({
        value: item.id,
        label: `${item.name}${item.serial_number ? ` - ${item.serial_number}` : ''}`
      }))
    },
    {
      name: 'employee_id',
      label: 'Nhân viên phụ trách',
      type: 'select',
      placeholder: 'Không phân công',
      options: lookups.employees.map((item) => ({
        value: item.id,
        label: `${item.full_name}${item.position ? ` - ${item.position}` : ''}`
      }))
    },
    { name: 'maintenance_date', label: 'Ngày bảo trì', type: 'date', required: true },
    {
      name: 'type',
      label: 'Loại bảo trì',
      type: 'select',
      defaultValue: 'routine',
      required: true,
      options: [
        { value: 'routine', label: 'Định kỳ' },
        { value: 'repair', label: 'Sửa chữa' },
        { value: 'replacement', label: 'Thay thế' },
        { value: 'inspection', label: 'Kiểm tra' }
      ]
    },
    { name: 'description', label: 'Mô tả', type: 'textarea' },
    { name: 'cost', label: 'Chi phí', type: 'number', defaultValue: 0, min: 0, step: 1000 },
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select',
      defaultValue: 'scheduled',
      required: true,
      options: [
        { value: 'scheduled', label: 'Đã lên lịch' },
        { value: 'in_progress', label: 'Đang thực hiện' },
        { value: 'completed', label: 'Đã hoàn thành' }
      ]
    }
  ], [lookups]);

  return (
    <AdminResource
      title="Quản lý bảo trì"
      load={adminMaintenance}
      createItem={createAdminMaintenance}
      updateItem={updateAdminMaintenance}
      deleteItem={deleteAdminMaintenance}
      fields={fields}
      normalize={(row) => ({ ...row, employee_id: row.employee_id || '' })}
      getRowLabel={(row) => `${row.equipment_name || `Thiết bị #${row.equipment_id}`} - ${row.maintenance_date}`}
      deleteConfig={{
        title: 'Xóa lịch sử bảo trì',
        confirmLabel: 'Xóa vĩnh viễn',
        description: (row) => `Xóa vĩnh viễn lịch bảo trì của “${row.equipment_name || `thiết bị #${row.equipment_id}`}” ngày ${row.maintenance_date}? Dữ liệu này không thể khôi phục.`
      }}
      columns={[
        { key: 'equipment_name', label: 'Thiết bị', render: (row) => <strong>{row.equipment_name || `#${row.equipment_id}`}</strong> },
        { key: 'employee_name', label: 'Phụ trách', render: (row) => row.employee_name || 'Chưa phân công' },
        { key: 'maintenance_date', label: 'Ngày' },
        { key: 'type', label: 'Loại' },
        { key: 'cost', label: 'Chi phí', render: (row) => formatMoney(row.cost) },
        { key: 'status', label: 'Trạng thái', render: (row) => <Badge tone={row.status === 'completed' ? 'active' : 'pending'}>{row.status}</Badge> }
      ]}
    />
  );
}
