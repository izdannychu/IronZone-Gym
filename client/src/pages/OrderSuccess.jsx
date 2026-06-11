import { CheckCircle2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { formatMoney } from '../components/PlanCard';

export default function OrderSuccess() {
  const { state } = useLocation();
  return (
    <main className="container-page grid min-h-[60vh] place-items-center py-10">
      <div className="card max-w-xl p-8 text-center">
        <CheckCircle2 className="mx-auto text-emerald-500" size={64} />
        <h1 className="mt-4 text-3xl font-black">Dang ky thanh cong</h1>
        <p className="mt-2 text-zinc-500">Membership cua ban da duoc kich hoat.</p>
        {state?.order && <p className="mt-4 font-bold">Ma don #{state.order.id} · {formatMoney(state.order.total_amount)}</p>}
        <Button as={Link} to="/dashboard" className="mt-6">Xem dashboard</Button>
      </div>
    </main>
  );
}
