import { Award, Clock, Dumbbell, Shield, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getPlans } from '../api/plans';
import { getTrainers } from '../api/trainers';
import { getReviews } from '../api/reviews';
import { PlanCard } from '../components/PlanCard';
import { TrainerCard } from '../components/TrainerCard';
import { ReviewCard } from '../components/ReviewCard';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../hooks/useLanguage';

const gymBg = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1800&q=80';
const benefits = [
  [Dumbbell, 'Thiết bị cao cấp', 'Máy móc TechnoGym, Rogue, Eleiko cho mọi mục tiêu tập luyện.'],
  [Shield, 'An toàn và sạch sẽ', 'Kiểm tra thiết bị định kỳ, khu tập thông thoáng, locker riêng.'],
  [Clock, 'Giờ tập linh hoạt', 'Mở cửa từ 6h đến 22h, phù hợp người đi học và đi làm.'],
  [Award, 'HLV chứng chỉ', 'Đội ngũ PT có ACE, NASM, RYT và kinh nghiệm thi đấu.'],
  [Users, 'Cộng đồng năng lượng', 'Lớp nhóm mỗi tuần và sự kiện nội bộ cho hội viên.'],
  [Zap, 'Theo dõi tiến độ', 'Đánh giá thể lực, body composition và dashboard hội viên.']
];

const useCountUp = (target) => {
  const [value, setValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const startedAt = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - startedAt) / 1300, 1);
        setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target]);

  return [ref, value];
};

const StatCounter = ({ value, suffix = '', label }) => {
  const [ref, current] = useCountUp(value);
  return (
    <div ref={ref}>
      <p className="text-3xl font-black text-primary">{current.toLocaleString('vi-VN')}{suffix}</p>
      <p className="text-sm text-zinc-400">{label}</p>
    </div>
  );
};

export default function Home() {
  const { t } = useLanguage();
  const [plans, setPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeReview, setActiveReview] = useState(0);

  useEffect(() => {
    Promise.all([getPlans(), getTrainers(), getReviews({ target_type: 'gym', target_id: 0 })]).then(([p, t, r]) => {
      setPlans(p.data.data.filter((x) => x.is_featured).slice(0, 3));
      setTrainers(t.data.data.slice(0, 3));
      setReviews(r.data.data.slice(0, 3));
    });
  }, []);

  useEffect(() => {
    if (!reviews.length) return undefined;
    const timer = setInterval(() => setActiveReview((index) => (index + 1) % reviews.length), 3500);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const stats = useMemo(() => [
    [2000, '+', t.members],
    [15, '', t.certifiedTrainers],
    [50, '+', t.classesWeek],
    [5, '', t.yearsExperience]
  ], [t]);

  return (
    <main className="page-shell">
      <section className="relative min-h-screen overflow-hidden">
        <img src={gymBg} alt="IronZone gym floor" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="container-page relative flex min-h-screen items-center py-28">
          <div className="max-w-3xl text-white">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-primary">{t.heroEyebrow}</p>
            <h1 className="text-5xl font-black leading-tight sm:text-7xl">{t.heroTitle}</h1>
            <p className="mt-6 max-w-2xl text-lg text-zinc-200">{t.heroText}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button as={Link} to="/plans">{t.viewPlans}</Button>
              <Button as={Link} to="/register" variant="outline" className="border-white/40 bg-white/10 !text-white hover:bg-white/20">{t.freeRegister}</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 py-8 text-white">
        <div className="container-page grid grid-cols-2 gap-5 md:grid-cols-4">
          {stats.map(([value, suffix, label]) => <StatCounter key={label} value={value} suffix={suffix} label={label} />)}
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-3xl font-black">{t.whyChoose}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {benefits.map(([Icon, title, text]) => <article key={title} className="card p-5"><Icon className="text-primary" /><h3 className="mt-4 font-black">{title}</h3><p className="mt-2 text-sm text-zinc-500">{text}</p></article>)}
        </div>
      </section>

      <section className="bg-zinc-100 py-16 dark:bg-zinc-950">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4"><h2 className="text-3xl font-black">{t.featuredPlans}</h2><Link className="text-sm font-bold text-primary" to="/plans">{t.viewAll}</Link></div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">{plans.map((plan) => <PlanCard key={plan.id} plan={plan} />)}</div>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-3xl font-black">{t.featuredTrainers}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{trainers.map((trainer) => <TrainerCard key={trainer.id} trainer={trainer} />)}</div>
      </section>

      <section className="bg-zinc-100 py-16 dark:bg-zinc-950">
        <div className="container-page">
          <h2 className="text-3xl font-black">{t.memberReviews}</h2>
          <div className="mt-8 overflow-hidden">
            <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${activeReview * 100}%)` }}>
              {reviews.map((review) => (
                <div key={review.id} className="w-full shrink-0 px-1 md:px-20">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 flex justify-center gap-2">
            {reviews.map((review, index) => <button key={review.id} aria-label={`Review ${index + 1}`} onClick={() => setActiveReview(index)} className={`h-2.5 rounded-full transition-all ${index === activeReview ? 'w-8 bg-primary' : 'w-2.5 bg-zinc-300 dark:bg-zinc-700'}`} />)}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="rounded-2xl bg-primary p-8 text-black md:flex md:items-center md:justify-between">
          <div><h2 className="text-3xl font-black">{t.promoHeadline}</h2><p className="mt-2 font-medium">{t.promoText}</p></div>
          <Button as={Link} to="/plans" variant="dark" className="mt-5 md:mt-0">{t.startNow}</Button>
        </div>
      </section>
    </main>
  );
}
