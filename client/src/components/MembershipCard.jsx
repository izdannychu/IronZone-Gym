import { CalendarDays } from 'lucide-react';
import { Badge } from './ui/Badge';

export const MembershipCard = ({ membership }) => {
  const end = new Date(membership.end_date);
  const now = new Date();
  const daysLeft = Math.max(Math.ceil((end - now) / 86400000), 0);
  const total = Math.max(Math.ceil((end - new Date(membership.start_date)) / 86400000), 1);
  const progress = Math.max(0, Math.min(100, (daysLeft / total) * 100));
  return (
    <article className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-black">{membership.plan_name}</h3>
          <p className="mt-1 flex items-center gap-2 text-sm text-zinc-500"><CalendarDays size={16} /> Het han {membership.end_date}</p>
        </div>
        <Badge tone={membership.status}>{membership.status}</Badge>
      </div>
      <div className="mt-5 h-3 rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-2 text-sm font-semibold">{daysLeft} ngay con lai</p>
    </article>
  );
};
