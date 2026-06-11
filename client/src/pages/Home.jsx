import { Award, Clock, Dumbbell, Shield, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPlans } from '../api/plans';
import { getTrainers } from '../api/trainers';
import { getReviews } from '../api/reviews';
import { PlanCard } from '../components/PlanCard';
import { TrainerCard } from '../components/TrainerCard';
import { ReviewCard } from '../components/ReviewCard';
import { Button } from '../components/ui/Button';

const gymBg = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1800&q=80';
const benefits = [
  [Dumbbell, 'Thiet bi cao cap', 'May moc TechnoGym, Rogue, Eleiko cho moi muc tieu tap luyen.'],
  [Shield, 'An toan va sach se', 'Kiem tra thiet bi dinh ky, khu tap thong thoang, locker rieng.'],
  [Clock, 'Gio tap linh hoat', 'Mo cua tu 6h den 22h, phu hop nguoi di hoc va di lam.'],
  [Award, 'HLV chung chi', 'Doi ngu PT co ACE, NASM, RYT va kinh nghiem thi dau.'],
  [Users, 'Cong dong nang luong', 'Lop nhom moi tuan va su kien noi bo cho hoi vien.'],
  [Zap, 'Theo doi tien do', 'Danh gia the luc, body composition va dashboard hoi vien.']
];

export default function Home() {
  const [plans, setPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    Promise.all([getPlans(), getTrainers(), getReviews({ target_type: 'gym', target_id: 0 })]).then(([p, t, r]) => {
      setPlans(p.data.data.filter((x) => x.is_featured).slice(0, 3));
      setTrainers(t.data.data.slice(0, 3));
      setReviews(r.data.data.slice(0, 3));
    });
  }, []);

  return (
    <main>
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <img src={gymBg} alt="IronZone gym floor" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="container-page relative flex min-h-[calc(100vh-4rem)] items-center py-20">
          <div className="max-w-3xl text-white">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-primary">IronZone Gym Management</p>
            <h1 className="text-5xl font-black leading-tight sm:text-7xl">FORGE YOUR BEST SELF</h1>
            <p className="mt-6 max-w-2xl text-lg text-zinc-200">Tap luyen thong minh hon voi goi tap linh hoat, HLV chuyen nghiep, checkout online va dashboard hoi vien ro rang.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button as={Link} to="/plans">Xem goi tap</Button>
              <Button as={Link} to="/register" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">Dang ky mien phi</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 py-8 text-white">
        <div className="container-page grid grid-cols-2 gap-5 md:grid-cols-4">
          {['2000+ Hoi vien', '15 HLV', '50+ Lop/tuan', '5 Nam kinh nghiem'].map((item) => {
            const [value, ...label] = item.split(' ');
            return <div key={item}><p className="text-3xl font-black text-primary">{value}</p><p className="text-sm text-zinc-400">{label.join(' ')}</p></div>;
          })}
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-3xl font-black">Vi sao chon IronZone?</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {benefits.map(([Icon, title, text]) => <article key={title} className="card p-5"><Icon className="text-primary" /><h3 className="mt-4 font-black">{title}</h3><p className="mt-2 text-sm text-zinc-500">{text}</p></article>)}
        </div>
      </section>

      <section className="bg-zinc-100 py-16 dark:bg-zinc-950">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4"><h2 className="text-3xl font-black">Goi tap noi bat</h2><Link className="text-sm font-bold text-primary" to="/plans">Xem tat ca</Link></div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">{plans.map((plan) => <PlanCard key={plan.id} plan={plan} />)}</div>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-3xl font-black">HLV tieu bieu</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{trainers.map((trainer) => <TrainerCard key={trainer.id} trainer={trainer} />)}</div>
      </section>

      <section className="bg-zinc-100 py-16 dark:bg-zinc-950">
        <div className="container-page">
          <h2 className="text-3xl font-black">Hoi vien noi gi</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">{reviews.map((review) => <ReviewCard key={review.id} review={review} />)}</div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="rounded-2xl bg-primary p-8 text-black md:flex md:items-center md:justify-between">
          <div><h2 className="text-3xl font-black">Nhap NEWBIE10 giam 10% don dau tien</h2><p className="mt-2 font-medium">Ap dung cho tat ca goi tap online.</p></div>
          <Button as={Link} to="/plans" variant="dark" className="mt-5 md:mt-0">Bat dau ngay</Button>
        </div>
      </section>
    </main>
  );
}
