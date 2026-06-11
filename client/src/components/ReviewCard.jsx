import { Star } from 'lucide-react';

export const ReviewCard = ({ review }) => (
  <article className="card p-5">
    <div className="flex items-center gap-3">
      <img src={review.avatar_url || `https://i.pravatar.cc/100?u=${review.full_name}`} className="h-11 w-11 rounded-full object-cover" alt={review.full_name} />
      <div>
        <h4 className="font-bold">{review.full_name}</h4>
        <div className="flex text-primary">{Array.from({ length: review.rating }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div>
      </div>
    </div>
    <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">{review.comment}</p>
  </article>
);
