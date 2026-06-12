import { Award, Clock, Dumbbell, Plus, Shield, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getPlans } from '../api/plans';
import { getTrainers } from '../api/trainers';
import { getReviews } from '../api/reviews';
import { PlanCard } from '../components/PlanCard';
import { TrainerCard } from '../components/TrainerCard';
import { ReviewCard } from '../components/ReviewCard';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../hooks/useLanguage';
import { Reveal, Stagger, StaggerItem } from '../components/motion/Motion';

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

const SectionHeading = ({ eyebrow, title, accent, subtitle, action }) => (
  <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
    <div className="max-w-3xl">
      <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
      <h2 className="mt-4 text-4xl font-black uppercase leading-[0.95] sm:text-5xl">
        {title}{' '}
        <span className="text-primary">{accent}</span>
      </h2>
      {subtitle && <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-500 dark:text-zinc-400">{subtitle}</p>}
    </div>
    {action}
  </div>
);

const FaqItem = ({ item }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div layout="position" transition={{ layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }} className="border-b border-zinc-800">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-5 py-7 text-left"
      >
        <span className="text-base font-black uppercase leading-6 sm:text-lg">
          {item.question}
        </span>
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition duration-300 ${open ? 'bg-primary text-black' : 'bg-zinc-900 text-zinc-400 hover:bg-primary hover:text-black'}`}>
          <Plus className={`transition-transform duration-300 ${open ? 'rotate-45' : 'rotate-0'}`} size={19} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ height: { duration: 0.42, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.25 } }}
            className="overflow-hidden"
          >
            <div className="max-w-2xl pb-7 pr-14 text-sm leading-7 text-zinc-400 sm:text-base">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function Home() {
  const { t } = useLanguage();
  const [plans, setPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeReview, setActiveReview] = useState(0);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    Promise.all([getPlans(), getTrainers(), getReviews({ target_type: 'gym', target_id: 0 })]).then(([p, t, r]) => {
      setPlans(p.data.data.filter((x) => x.is_featured).slice(0, 3));
      setTrainers(t.data.data.slice(0, 3));
      setReviews(r.data.data.slice(0, 3));
    }).catch(() => setApiError(true));
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
          <motion.div
            className="max-w-3xl text-white"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.11, delayChildren: 0.12 } }
            }}
          >
            <motion.p variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.6 }} className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-primary">{t.heroEyebrow}</motion.p>
            <motion.h1 variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.7 }} className="text-5xl font-black leading-tight sm:text-7xl">{t.heroTitle}</motion.h1>
            <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.65 }} className="mt-6 max-w-2xl text-lg text-zinc-200">{t.heroText}</motion.p>
            <motion.div variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.6 }} className="mt-8 flex flex-wrap gap-3">
              <Button as={Link} to="/plans">{t.viewPlans}</Button>
              <Button as={Link} to="/register" variant="outline" className="border-white/40 bg-white/10 !text-white hover:bg-white/20">{t.freeRegister}</Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-zinc-950 py-8 text-white">
        <Stagger className="container-page grid grid-cols-2 gap-5 md:grid-cols-4">
          {stats.map(([value, suffix, label]) => (
            <StaggerItem key={label}>
              <StatCounter value={value} suffix={suffix} label={label} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {apiError && (
        <section className="border-y border-amber-400/30 bg-amber-400/10 py-4">
          <div className="container-page text-sm font-semibold text-amber-700 dark:text-amber-300">
            Không thể kết nối đến máy chủ dữ liệu. Vui lòng kiểm tra cấu hình VITE_API_URL của bản deploy.
          </div>
        </section>
      )}

      <section className="container-page py-16">
        <Reveal>
          <SectionHeading
            eyebrow={t.whyEyebrow}
            title={t.whyHeading}
            accent={t.whyHeadingAccent}
            subtitle={t.whySubtitle}
          />
        </Reveal>
        <Stagger className="mt-8 grid gap-5 md:grid-cols-3">
          {benefits.map(([Icon, title, text]) => (
            <StaggerItem key={title} className="h-full">
              <article className="card h-full p-5"><Icon className="text-primary" /><h3 className="mt-4 font-black">{title}</h3><p className="mt-2 text-sm text-zinc-500">{text}</p></article>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="bg-zinc-100 py-16 dark:bg-zinc-950">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow={t.plansEyebrow}
              title={t.plansHeading}
              accent={t.plansHeadingAccent}
              subtitle={t.plansHomeSubtitle}
              action={<Link className="shrink-0 text-sm font-bold text-primary hover:text-primary-dark" to="/plans">{t.viewAll}</Link>}
            />
          </Reveal>
          <Stagger className="mt-8 grid gap-5 md:grid-cols-3">
            {plans.map((plan) => <StaggerItem key={plan.id} className="h-full"><PlanCard plan={plan} /></StaggerItem>)}
          </Stagger>
        </div>
      </section>

      <section className="bg-zinc-950 py-20 text-white">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal className="lg:py-3">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                {t.faqTitle}
              </p>
              <h2 className="mt-5 max-w-xl text-4xl font-black uppercase leading-[0.95] sm:text-5xl lg:text-6xl">
                {t.faqHeading}{' '}
                <span className="text-primary">{t.faqHeadingAccent}</span>
              </h2>
              <p className="mt-7 max-w-lg text-base leading-7 text-zinc-400">
                {t.faqSubtitle}
              </p>
              <Button as={Link} to="/contact" className="mt-8 px-6">
                {t.faqContact}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border-t border-zinc-800">
              {t.faqs.map((item) => <FaqItem key={item.question} item={item} />)}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-page py-16">
        <Reveal>
          <SectionHeading
            eyebrow={t.trainersEyebrow}
            title={t.trainersHeading}
            accent={t.trainersHeadingAccent}
            subtitle={t.trainersSubtitle}
          />
        </Reveal>
        <Stagger className="mt-8 grid gap-5 md:grid-cols-3">
          {trainers.map((trainer) => <StaggerItem key={trainer.id} className="h-full"><TrainerCard trainer={trainer} /></StaggerItem>)}
        </Stagger>
      </section>

      <section className="bg-zinc-100 py-16 dark:bg-zinc-950">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow={t.reviewsEyebrow}
              title={t.reviewsHeading}
              accent={t.reviewsHeadingAccent}
              subtitle={t.reviewsSubtitle}
            />
          </Reveal>
          <Reveal className="mt-8" delay={0.08}>
            <div className="overflow-hidden">
              <motion.div
                className="flex"
                animate={{ x: `-${activeReview * 100}%` }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
              {reviews.map((review) => (
                <div key={review.id} className="w-full shrink-0 px-1 md:px-20">
                  <ReviewCard review={review} />
                </div>
              ))}
              </motion.div>
            </div>
            <div className="mt-5 flex justify-center gap-2">
              {reviews.map((review, index) => <button key={review.id} aria-label={`Review ${index + 1}`} onClick={() => setActiveReview(index)} className={`h-2.5 rounded-full transition-all duration-500 ${index === activeReview ? 'w-8 bg-primary' : 'w-2.5 bg-zinc-300 dark:bg-zinc-700'}`} />)}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-page py-16">
        <Reveal>
          <div className="rounded-2xl bg-primary p-8 text-black md:flex md:items-center md:justify-between">
            <div><h2 className="text-3xl font-black">{t.promoHeadline}</h2><p className="mt-2 font-medium">{t.promoText}</p></div>
            <Button as={Link} to="/plans" variant="dark" className="mt-5 md:mt-0">{t.startNow}</Button>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
