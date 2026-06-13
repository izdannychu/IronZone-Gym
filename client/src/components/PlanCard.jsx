import { ArrowRight, Check, Clock3, Plus, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useCart } from '../hooks/useCart';
import { useLanguage } from '../hooks/useLanguage';

export const formatMoney = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);

export const PlanCard = ({ plan, variant = 'default' }) => {
  const { add } = useCart();
  const { t } = useLanguage();

  if (variant === 'directory') {
    return (
      <article className={`group relative flex h-full flex-col overflow-hidden rounded-lg border bg-white p-6 transition duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/10 dark:bg-zinc-900 dark:hover:shadow-black/40 ${
        plan.is_featured
          ? 'border-primary ring-1 ring-primary'
          : 'border-zinc-200 hover:border-primary/60 dark:border-zinc-800'
      }`}>
        {plan.is_featured && (
          <div className="absolute right-0 top-0 flex items-center gap-1.5 bg-primary px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-black">
            <Sparkles size={14} />
            {t.mostPopular}
          </div>
        )}

        <div className={plan.is_featured ? 'pr-24' : ''}>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">{t.membershipPlan}</p>
          <h3 className="mt-3 text-3xl font-black">{plan.name}</h3>
        </div>
        <p className="mt-4 min-h-12 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{plan.description}</p>

        <div className="mt-6 border-y border-zinc-200 py-5 dark:border-zinc-800">
          <span className="text-3xl font-black sm:text-4xl">{formatMoney(plan.price)}</span>
          <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-zinc-500">
            <Clock3 size={16} className="text-primary" />
            {plan.duration_days} {t.days}
          </div>
        </div>

        <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-zinc-400">{t.planIncludes}</p>
        <ul className="mt-4 flex-1 space-y-3 text-sm">
          {plan.features?.map((feature) => (
            <li key={feature} className="flex gap-3 leading-6">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                <Check size={13} strokeWidth={3} />
              </span>
              {feature}
            </li>
          ))}
        </ul>

        <Button className="mt-7 w-full justify-between px-5" onClick={() => add(plan.id)}>
          <span className="inline-flex items-center gap-2"><Plus size={17} />{t.addToCart}</span>
          <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </article>
    );
  }

  return (
    <article className={`card relative flex h-full flex-col p-6 ${plan.is_featured ? 'ring-2 ring-primary' : ''}`}>
      {plan.is_featured ? <div className="absolute right-4 top-4"><Badge tone="pending">{t.mostPopular}</Badge></div> : null}
      <h3 className="text-2xl font-black">{plan.name}</h3>
      <p className="mt-2 min-h-12 text-sm text-zinc-500">{plan.description}</p>
      <div className="mt-5">
        <span className="text-3xl font-black">{formatMoney(plan.price)}</span>
        <span className="text-sm text-zinc-500"> / {plan.duration_days} {t.days}</span>
      </div>
      <ul className="mt-5 flex-1 space-y-3 text-sm">
        {plan.features?.map((feature) => <li key={feature} className="flex gap-2"><Check size={18} className="shrink-0 text-primary" />{feature}</li>)}
      </ul>
      <Button className="mt-6 w-full" onClick={() => add(plan.id)}><Plus size={17} />{t.addToCart}</Button>
    </article>
  );
};
