import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createOrder, validatePromotion } from '../api/orders';
import { formatMoney } from '../components/PlanCard';
import { Button } from '../components/ui/Button';
import { useCart } from '../hooks/useCart';

export default function Checkout() {
  const { cart, refresh } = useCart();
  const [payment, setPayment] = useState('bank_transfer');
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const total = Math.max(cart.subtotal - discount, 0);

  const applyCode = async () => {
    try {
      const res = await validatePromotion({ code, order_amount: cart.subtotal });
      setDiscount(res.data.data.discount_amount);
      toast.success(res.data.message);
    } catch (err) {
      setDiscount(0);
      toast.error(err.response?.data?.message || 'Ma khong hop le');
    }
  };

  const submit = async () => {
    setLoading(true);
    try {
      const res = await createOrder({ payment_method: payment, promotion_code: code || undefined });
      await refresh();
      navigate('/order-success', { state: res.data.data });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Thanh toan that bai');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container-page py-10">
      <h1 className="text-4xl font-black">Checkout</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="card p-6">
          <h2 className="text-xl font-black">Phuong thuc thanh toan</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {['bank_transfer', 'momo', 'zalopay', 'vnpay', 'cash'].map((m) => <label key={m} className={`cursor-pointer rounded-lg border p-4 font-bold dark:border-zinc-700 ${payment === m ? 'border-primary bg-primary/10' : ''}`}><input className="mr-2" type="radio" checked={payment === m} onChange={() => setPayment(m)} />{m}</label>)}
          </div>
          <div className="mt-6">
            <label className="text-sm font-bold">Ma giam gia</label>
            <div className="mt-2 flex gap-2"><input className="input" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="NEWBIE10" /><Button variant="outline" onClick={applyCode}>Ap dung</Button></div>
          </div>
        </section>
        <aside className="card h-fit p-6">
          <h2 className="text-xl font-black">Tom tat</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><span>Tam tinh</span><strong>{formatMoney(cart.subtotal)}</strong></div>
            <div className="flex justify-between"><span>Giam gia</span><strong>-{formatMoney(discount)}</strong></div>
            <div className="border-t border-zinc-200 pt-3 text-lg dark:border-zinc-800"><div className="flex justify-between"><span>Tong</span><strong>{formatMoney(total)}</strong></div></div>
          </div>
          <Button className="mt-6 w-full" loading={loading} onClick={submit} disabled={!cart.items.length}>Tao don hang</Button>
        </aside>
      </div>
    </main>
  );
}
