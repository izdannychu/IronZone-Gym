import { Check, Clock3, CreditCard, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { getPlans } from '../api/plans';
import { formatMoney, PlanCard } from '../components/PlanCard';
import { Reveal, Stagger, StaggerItem } from '../components/motion/Motion';
import { Spinner } from '../components/ui/Spinner';
import { useLanguage } from '../hooks/useLanguage';

const durationOptions = ['all', '30', '90', '180'];

export default function Plans() {
  const { t } = useLanguage();
  const [plans, setPlans] = useState([]);
  const [duration, setDuration] = useState('all');
  const [sort, setSort] = useState('asc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlans()
      .then((res) => setPlans(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => plans
    .filter((plan) => {
      if (duration === '30') return plan.duration_days <= 30;
      if (duration === '90') return plan.duration_days === 90;
      if (duration === '180') return plan.duration_days >= 180;
      return true;
    })
    .sort((a, b) => sort === 'asc' ? a.price - b.price : b.price - a.price), [plans, duration, sort]);

  const durationLabel = (value) => {
    if (value === '30') return t.oneMonth;
    if (value === '90') return t.threeMonths;
    if (value === '180') return t.sixPlusMonths;
    return t.all;
  };

  const lowestPrice = plans.length ? Math.min(...plans.map((plan) => Number(plan.price))) : 0;
  const longestDuration = plans.length ? Math.max(...plans.map((plan) => Number(plan.duration_days))) : 0;
  const hasFeature = (plan, terms) => {
    const features = (plan.features || []).join(' ').toLocaleLowerCase();
    return terms.some((term) => features.includes(term));
  };

  return (
    <main className="page-shell pb-16 pt-24">
      <section className="relative overflow-hidden border-b border-zinc-800 bg-zinc-950 py-16 text-white sm:py-20">
        <div className="absolute -right-12 top-1/2 select-none text-[12rem] font-black leading-none text-white/[0.025] sm:text-[18rem] lg:text-[24rem]">
          IZ
        </div>
        <div className="container-page relative">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.82fr] lg:items-end">
            <Reveal>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">{t.plansPageEyebrow}</p>
              <h1 className="mt-5 max-w-4xl text-5xl font-black uppercase leading-[0.9] sm:text-6xl lg:text-7xl">
                {t.plansPageHeading}{' '}
                <span className="text-primary">{t.plansPageHeadingAccent}</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">{t.plansSubtitle}</p>
            </Reveal>

            <Stagger className="grid grid-cols-3 border-y border-zinc-800 lg:border-y-0 lg:border-l">
              <StaggerItem>
                <div className="py-5 lg:px-7">
                  <Sparkles size={20} className="text-primary" />
                  <p className="mt-4 text-3xl font-black">{plans.length}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">{t.plansAvailable}</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="border-l border-zinc-800 px-4 py-5 lg:px-7">
                  <CreditCard size={20} className="text-primary" />
                  <p className="mt-4 truncate text-xl font-black sm:text-2xl">{formatMoney(lowestPrice)}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">{t.plansStartingAt}</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="border-l border-zinc-800 px-4 py-5 lg:px-7">
                  <Clock3 size={20} className="text-primary" />
                  <p className="mt-4 text-3xl font-black">{longestDuration}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">{t.plansMaxDays}</p>
                </div>
              </StaggerItem>
            </Stagger>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="grid items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
          <Reveal>
            <aside className="border border-zinc-200 bg-white p-5 shadow-lg shadow-black/5 dark:border-zinc-800 dark:bg-zinc-900 lg:sticky lg:top-24">
              <div className="flex items-center gap-3 border-b border-zinc-200 pb-5 dark:border-zinc-800">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-black">
                  <SlidersHorizontal size={18} />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">{t.plansFilterEyebrow}</p>
                  <h2 className="mt-1 font-black">{t.plansFilterTitle}</h2>
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-zinc-400">{t.duration}</p>
                <div className="space-y-2">
                  {durationOptions.map((value) => {
                    const count = plans.filter((plan) => {
                      if (value === '30') return plan.duration_days <= 30;
                      if (value === '90') return plan.duration_days === 90;
                      if (value === '180') return plan.duration_days >= 180;
                      return true;
                    }).length;

                    return (
                      <button
                        key={value}
                        onClick={() => setDuration(value)}
                        className={`flex w-full items-center justify-between gap-4 rounded-lg border px-3.5 py-3 text-left text-sm font-bold transition duration-300 ${
                          duration === value
                            ? 'border-primary bg-primary text-black'
                            : 'border-zinc-200 text-zinc-600 hover:border-primary hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-white'
                        }`}
                      >
                        <span>{durationLabel(value)}</span>
                        <span className={`text-xs ${duration === value ? 'text-black/60' : 'text-zinc-400'}`}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="mt-7 block">
                <span className="mb-3 block text-xs font-black uppercase tracking-[0.16em] text-zinc-400">{t.plansSortBy}</span>
                <select className="input h-12 cursor-pointer bg-zinc-100 dark:bg-zinc-950" value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="asc">{t.priceAsc}</option>
                  <option value="desc">{t.priceDesc}</option>
                </select>
              </label>

              {(duration !== 'all' || sort !== 'asc') && (
                <motion.button
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => {
                    setDuration('all');
                    setSort('asc');
                  }}
                  className="mt-5 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-bold hover:border-primary dark:border-zinc-700"
                >
                  {t.plansReset}
                </motion.button>
              )}
            </aside>
          </Reveal>

          <div className="min-w-0">
            <div className="flex items-end justify-between gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">{t.plansDirectory}</p>
                <h2 className="mt-2 text-2xl font-black sm:text-3xl">{t.plansResults}</h2>
              </div>
              <p className="shrink-0 text-sm font-bold text-zinc-500">
                <span className="text-zinc-950 dark:text-white">{filtered.length}</span> {t.plansFound}
              </p>
            </div>

            {loading ? (
              <Spinner />
            ) : (
              <motion.div layout className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {filtered.map((plan) => (
                    <motion.div
                      layout
                      key={plan.id}
                      initial={{ opacity: 0, y: 18, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.97 }}
                      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <PlanCard plan={plan} variant="directory" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-100 py-16 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="container-page">
          <Reveal>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">{t.plansCompareEyebrow}</p>
            <h2 className="mt-3 text-3xl font-black uppercase sm:text-4xl">{t.plansCompareTitle}</h2>
            <p className="mt-4 max-w-2xl text-zinc-500 dark:text-zinc-400">{t.plansCompareSubtitle}</p>
          </Reveal>

          <Reveal className="mt-8" delay={0.08}>
            <div className="overflow-x-auto border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-zinc-950 text-white">
                  <tr>
                    {[t.plan, t.duration, t.price, t.freePt, t.sauna].map((heading) => (
                      <th key={heading} className="p-4 text-left text-xs font-black uppercase tracking-[0.12em]">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => {
                    const includesPt = hasFeature(plan, ['pt']);
                    const includesSauna = hasFeature(plan, ['xông hơi', 'sauna']);
                    return (
                      <tr key={plan.id} className="border-t border-zinc-200 transition hover:bg-primary/5 dark:border-zinc-800">
                        <td className="p-4 font-black">{plan.name}</td>
                        <td className="p-4">{plan.duration_days} {t.days}</td>
                        <td className="p-4 font-bold">{formatMoney(plan.price)}</td>
                        <td className="p-4">{includesPt ? <Check className="text-primary" size={19} /> : <X className="text-zinc-400" size={19} />}</td>
                        <td className="p-4">{includesSauna ? <Check className="text-primary" size={19} /> : <X className="text-zinc-400" size={19} />}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
