import { ArrowLeft, Award, Calendar, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTrainer } from '../api/trainers';
import { formatMoney } from '../components/PlanCard';
import { ReviewCard } from '../components/ReviewCard';
import { Spinner } from '../components/ui/Spinner';

export default function TrainerDetail() {
  const { id } = useParams();
  const [trainer, setTrainer] = useState(null);
  useEffect(() => { getTrainer(id).then((res) => setTrainer(res.data.data)); }, [id]);
  if (!trainer) return <Spinner />;
  return (
    <main className="container-page py-10">
      <Link to="/trainers" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-primary"><ArrowLeft size={16} />Quay lai</Link>
      <section className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <img src={trainer.avatar_url} className="h-[460px] w-full rounded-xl object-cover" alt={trainer.full_name} />
        <div>
          <div className="flex flex-wrap items-center gap-3"><h1 className="text-4xl font-black">{trainer.full_name}</h1><span className="flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-1 font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"><Star size={16} fill="currentColor" />{trainer.rating}</span></div>
          <p className="mt-2 text-primary">{trainer.specialty}</p>
          <p className="mt-6 text-zinc-600 dark:text-zinc-300">{trainer.bio}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="card p-4"><Award className="text-primary" /><p className="mt-2 text-sm text-zinc-500">Chung chi</p><p className="font-bold">{trainer.certifications}</p></div>
            <div className="card p-4"><Calendar className="text-primary" /><p className="mt-2 text-sm text-zinc-500">Lich lam viec</p><p className="font-bold">Thu 2-7, 7:00-20:00</p></div>
          </div>
          <p className="mt-6 text-2xl font-black">{formatMoney(trainer.hourly_rate)}/gio</p>
        </div>
      </section>
      <section className="mt-12">
        <h2 className="text-2xl font-black">Review ve HLV</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">{trainer.reviews?.map((review) => <ReviewCard key={review.id} review={review} />)}</div>
      </section>
    </main>
  );
}
