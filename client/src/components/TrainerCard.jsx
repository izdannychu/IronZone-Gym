import { ArrowUpRight, BadgeCheck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatMoney } from './PlanCard';
import { Button } from './ui/Button';
import { useLanguage } from '../hooks/useLanguage';

export const TrainerCard = ({ trainer, variant = 'default' }) => {
  const { t } = useLanguage();

  if (variant === 'directory') {
    return (
      <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white transition duration-500 hover:-translate-y-1 hover:border-primary/60 hover:shadow-2xl hover:shadow-black/10 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:shadow-black/40">
        <Link to={`/trainers/${trainer.id}`} className="relative block aspect-[4/4.3] overflow-hidden bg-zinc-900">
          <img
            src={trainer.avatar_url}
            alt={trainer.full_name}
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/5 to-transparent" />
          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
            <Star size={14} className="text-primary" fill="currentColor" />
            {trainer.rating || '0.0'}
            <span className="font-medium text-zinc-400">({trainer.review_count || 0})</span>
          </div>
          <span className="absolute bottom-4 left-4 right-4 text-xs font-black uppercase tracking-[0.16em] text-primary">
            {trainer.specialty}
          </span>
        </Link>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black leading-tight">{trainer.full_name}</h3>
                <BadgeCheck size={18} className="shrink-0 text-primary" />
              </div>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
                {trainer.certifications}
              </p>
            </div>
          </div>
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{trainer.bio}</p>
          <div className="mt-auto flex items-end justify-between gap-3 border-t border-zinc-200 pt-5 dark:border-zinc-800">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-400">{t.trainerRate}</p>
              <p className="mt-1 font-black">{formatMoney(trainer.hourly_rate)}<span className="text-xs font-medium text-zinc-500">/{t.perHour}</span></p>
            </div>
            <Link
              to={`/trainers/${trainer.id}`}
              aria-label={`${t.viewTrainer} ${trainer.full_name}`}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-zinc-950 text-white transition duration-300 group-hover:rotate-45 group-hover:bg-primary group-hover:text-black dark:bg-white dark:text-black"
            >
              <ArrowUpRight size={19} />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="card overflow-hidden">
      <img src={trainer.avatar_url} alt={trainer.full_name} className="h-64 w-full object-cover" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-black">{trainer.full_name}</h3>
            <p className="text-sm text-primary">{trainer.specialty}</p>
          </div>
          <span className="flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-1 text-sm font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"><Star size={15} fill="currentColor" />{trainer.rating || '0.0'}</span>
        </div>
        <p className="mt-3 line-clamp-2 text-sm text-zinc-500">{trainer.bio}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-bold">{formatMoney(trainer.hourly_rate)}/{t.perHour}</span>
          <Button as={Link} to={`/trainers/${trainer.id}`} className="px-3" variant="outline">{t.viewDetails}</Button>
        </div>
      </div>
    </article>
  );
};
