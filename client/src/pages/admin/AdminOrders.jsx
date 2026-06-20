import { adminOrders, deleteAdminOrder, updateAdminOrder } from '../../api/admin';
import { AdminResource } from '../../components/admin/AdminResource';
import { formatMoney } from '../../components/PlanCard';
import { Badge } from '../../components/ui/Badge';

const fields = [
  {
    name: 'payment_status',
    label: 'Thanh toán',
    type: 'select',
    required: true,
    options: [
      { value: 'pending', label: 'Chờ thanh toán' },
      { value: 'paid', label: 'Đã thanh toán' },
      { value: 'failed', label: 'Thanh toán thất bại' },
      { value: 'refunded', label: 'Đã hoàn tiền' }
    ]
  },
  {
    name: 'status',
    label: 'Trạng thái đơn',
    type: 'select',
    required: true,
    options: [
      { value: 'pending', label: 'Đang chờ' },
      { value: 'confirmed', label: 'Đã xác nhận' },
      { value: 'cancelled', label: 'Đã hủy' }
    ]
  },
  { name: 'note', label: 'Ghi chú', type: 'textarea' }
];

export default function AdminOrders() {
  return (
    <AdminResource
      title="Quản lý đơn hàng"
      load={adminOrders}
      updateItem={updateAdminOrder}
      deleteItem={deleteAdminOrder}
      fields={fields}
      getRowLabel={(row) => `Đơn hàng #${row.id}`}
      deleteConfig={{
        title: 'Hủy đơn hàng',
        actionLabel: 'Hủy đơn',
        confirmLabel: 'Xác nhận hủy đơn',
        description: (row) => `Hủy đơn hàng #${row.id} của ${row.full_name}? Membership đang chờ hoặc đang hoạt động của đơn này cũng sẽ bị hủy. Thao tác không tự động hoàn tiền.`
      }}
      canDelete={(row) => row.status !== 'cancelled'}
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
