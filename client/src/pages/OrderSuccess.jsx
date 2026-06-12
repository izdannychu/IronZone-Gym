import { CheckCircle2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { formatMoney } from '../components/PlanCard';

export default function OrderSuccess() {
  const { state } = useLocation();
  return (
    <main className="container-page page-shell grid min-h-screen place-items-center py-28">
      <div className="card max-w-xl p-8 text-center">
        <CheckCircle2 className="mx-auto text-emerald-500" size={64} />
        <h1 className="mt-4 text-3xl font-black">Đăng ký thành công</h1>
        <p className="mt-2 text-zinc-500">Membership của bạn đã được kích hoạt.</p>
        {state?.order && <p className="mt-4 font-bold">Mã đơn #{state.order.id} · {formatMoney(state.order.total_amount)}</p>}
        <Button as={Link} to="/dashboard" className="mt-6">Xem dashboard</Button>
      </div>
    </main>
  );
}
