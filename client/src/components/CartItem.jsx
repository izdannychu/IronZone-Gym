import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatMoney } from './PlanCard';
import { useCart } from '../hooks/useCart';

export const CartItem = ({ item }) => {
  const { update, remove } = useCart();
  return (
    <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="font-black">{item.name}</h3>
        <p className="text-sm text-zinc-500">{item.duration_days} ngay · {formatMoney(item.price)}</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="rounded-lg border p-2 dark:border-zinc-700" onClick={() => update(item.id, Math.max(1, item.quantity - 1))}><Minus size={16} /></button>
        <span className="w-8 text-center font-bold">{item.quantity}</span>
        <button className="rounded-lg border p-2 dark:border-zinc-700" onClick={() => update(item.id, item.quantity + 1)}><Plus size={16} /></button>
        <span className="w-32 text-right font-black">{formatMoney(item.line_total)}</span>
        <button className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10" onClick={() => remove(item.id)}><Trash2 size={18} /></button>
      </div>
    </div>
  );
};
