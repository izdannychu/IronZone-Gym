import { adminOrders, updateAdminOrder } from '../../api/admin';
import { AdminResource } from '../../components/admin/AdminResource';
import { formatMoney } from '../../components/PlanCard';
import { Badge } from '../../components/ui/Badge';

const fields = [
  { name: 'payment_status', label: 'Thanh toán', type: 'select', options: ['pending', 'paid', 'failed', 'refunded'].map((value) => ({ value, label: value })) },
  { name: 'status', label: 'Trạng thái đơn', type: 'select', options: ['pending', 'confirmed', 'cancelled'].map((value) => ({ value, label: value })) },
  { name: 'note', label: 'Ghi chú', type: 'textarea' }
];

export default function AdminOrders() {
  return (
    <AdminResource
      title="Quản lý đơn hàng"
      load={adminOrders}
      updateItem={updateAdminOrder}
      fields={fields}
      columns={[
        { key: 'id', label: 'Mã', render: (row) => <strong>#{row.id}</strong> },
        { key: 'full_name', label: 'Hội viên' },
        { key: 'total_amount', label: 'Tổng', render: (row) => formatMoney(row.total_amount) },
        { key: 'payment_status', label: 'Thanh toán', render: (row) => <Badge tone={row.payment_status}>{row.payment_status}</Badge> },
        { key: 'status', label: 'Trạng thái', render: (row) => <Badge tone={row.status}>{row.status}</Badge> }
      ]}
    />
  );
}
