import { Link } from 'react-router-dom';
import { CartItem } from '../components/CartItem';
import { formatMoney } from '../components/PlanCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { useCart } from '../hooks/useCart';

export default function Cart() {
  const { cart } = useCart();
  return (
    <main className="container-page py-10">
      <h1 className="text-4xl font-black">Gio hang</h1>
      {!cart.items.length ? <div className="mt-8"><EmptyState title="Gio hang trong" subtitle="Chon mot goi tap de bat dau." /></div> : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">{cart.items.map((item) => <CartItem key={item.id} item={item} />)}</div>
          <aside className="card h-fit p-5">
            <h2 className="text-xl font-black">Tong don</h2>
            <div className="mt-4 flex justify-between text-sm"><span>Tam tinh</span><strong>{formatMoney(cart.subtotal)}</strong></div>
            <Button as={Link} to="/checkout" className="mt-6 w-full">Thanh toan</Button>
          </aside>
        </div>
      )}
    </main>
  );
}
