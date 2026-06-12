import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatMoney } from './PlanCard';
import { Button } from './ui/Button';

export const TrainerCard = ({ trainer }) => (
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
        <span className="text-sm font-bold">{formatMoney(trainer.hourly_rate)}/giờ</span>
        <Button as={Link} to={`/trainers/${trainer.id}`} className="px-3" variant="outline">Xem chi tiết</Button>
      </div>
    </div>
  </article>
);
