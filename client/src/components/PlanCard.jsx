import { Check, Plus } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useCart } from '../hooks/useCart';

export const formatMoney = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);

export const PlanCard = ({ plan }) => {
  const { add } = useCart();
  return (
    <article className={`card relative flex h-full flex-col p-6 ${plan.is_featured ? 'ring-2 ring-primary' : ''}`}>
      {plan.is_featured ? <div className="absolute right-4 top-4"><Badge tone="pending">Phổ biến nhất</Badge></div> : null}
      <h3 className="text-2xl font-black">{plan.name}</h3>
      <p className="mt-2 min-h-12 text-sm text-zinc-500">{plan.description}</p>
      <div className="mt-5">
        <span className="text-3xl font-black">{formatMoney(plan.price)}</span>
        <span className="text-sm text-zinc-500"> / {plan.duration_days} ngày</span>
      </div>
      <ul className="mt-5 flex-1 space-y-3 text-sm">
        {plan.features?.map((feature) => <li key={feature} className="flex gap-2"><Check size={18} className="shrink-0 text-primary" />{feature}</li>)}
      </ul>
      <Button className="mt-6 w-full" onClick={() => add(plan.id)}><Plus size={17} />Thêm vào giỏ</Button>
    </article>
  );
};
