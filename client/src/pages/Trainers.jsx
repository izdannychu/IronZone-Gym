import { Award, Search, SlidersHorizontal, Star, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { getTrainers } from '../api/trainers';
import { TrainerCard } from '../components/TrainerCard';
import { Reveal, Stagger, StaggerItem } from '../components/motion/Motion';
import { Spinner } from '../components/ui/Spinner';
import { useLanguage } from '../hooks/useLanguage';

export default function Trainers() {
  const { t } = useLanguage();
  const [trainers, setTrainers] = useState([]);
  const [specialty, setSpecialty] = useState('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrainers()
      .then((res) => setTrainers(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const specialties = useMemo(() => ['all', ...new Set(trainers.map((t) => t.specialty))], [trainers]);
  const rows = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return trainers.filter((trainer) => {
      const matchesSpecialty = specialty === 'all' || trainer.specialty === specialty;
      const searchableText = `${trainer.full_name} ${trainer.specialty} ${trainer.certifications || ''}`.toLocaleLowerCase();
      return matchesSpecialty && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [query, specialty, trainers]);

  const averageRating = useMemo(() => {
    if (!trainers.length) return '0.0';
    return (trainers.reduce((sum, trainer) => sum + Number(trainer.rating || 0), 0) / trainers.length).toFixed(1);
  }, [trainers]);

  return (
    <main className="page-shell pb-16 pt-24">
      <section className="relative overflow-hidden border-b border-zinc-800 bg-zinc-950 py-16 text-white sm:py-20">
        <div className="absolute -right-16 top-1/2 select-none text-[12rem] font-black leading-none text-white/[0.025] sm:text-[18rem] lg:text-[24rem]">
          IZ
        </div>
        <div className="container-page relative">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.82fr] lg:items-end">
            <Reveal>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">{t.trainersPageEyebrow}</p>
              <h1 className="mt-5 max-w-4xl text-5xl font-black uppercase leading-[0.9] sm:text-6xl lg:text-7xl">
                {t.trainersPageHeading}{' '}
                <span className="text-primary">{t.trainersPageHeadingAccent}</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">{t.trainersPageSubtitle}</p>
            </Reveal>

            <Stagger className="grid grid-cols-3 border-y border-zinc-800 lg:border-y-0 lg:border-l">
              <StaggerItem>
                <div className="py-5 lg:px-7">
                  <Users size={20} className="text-primary" />
                  <p className="mt-4 text-3xl font-black">{trainers.length}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">{t.trainersPageCoaches}</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="border-l border-zinc-800 px-4 py-5 lg:px-7">
                  <Award size={20} className="text-primary" />
                  <p className="mt-4 text-3xl font-black">{Math.max(0, specialties.length - 1)}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">{t.trainersPageSkills}</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="border-l border-zinc-800 px-4 py-5 lg:px-7">
                  <Star size={20} className="text-primary" />
                  <p className="mt-4 text-3xl font-black">{averageRating}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">{t.trainersPageRating}</p>
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
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">{t.trainersFilterEyebrow}</p>
                  <h2 className="mt-1 font-black">{t.trainersFilterTitle}</h2>
                </div>
              </div>

              <label className="relative mt-5 block">
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="input h-12 bg-zinc-100 pl-11 dark:bg-zinc-950"
                  placeholder={t.trainersSearchShort}
                />
              </label>

              <div className="mt-7">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-zinc-400">{t.trainersPageSkills}</p>
                <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
                  {specialties.map((item) => {
                    const count = item === 'all'
                      ? trainers.length
                      : trainers.filter((trainer) => trainer.specialty === item).length;

                    return (
                      <button
                        key={item}
                        onClick={() => setSpecialty(item)}
                        className={`flex shrink-0 items-center justify-between gap-4 rounded-lg border px-3.5 py-3 text-left text-sm font-bold transition duration-300 lg:w-full ${
                          specialty === item
                            ? 'border-primary bg-primary text-black'
                            : 'border-zinc-200 bg-transparent text-zinc-600 hover:border-primary hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-white'
                        }`}
                      >
                        <span>{item === 'all' ? t.all : item}</span>
                        <span className={`text-xs ${specialty === item ? 'text-black/60' : 'text-zinc-400'}`}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {(query || specialty !== 'all') && (
                <motion.button
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => {
                    setQuery('');
                    setSpecialty('all');
                  }}
                  className="mt-5 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-bold hover:border-primary dark:border-zinc-700"
                >
                  {t.trainersReset}
                </motion.button>
              )}
            </aside>
          </Reveal>

          <div className="min-w-0">
            <div className="flex items-end justify-between gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">{t.trainersDirectory}</p>
                <h2 className="mt-2 text-2xl font-black sm:text-3xl">{t.trainersResults}</h2>
              </div>
              <p className="shrink-0 text-sm font-bold text-zinc-500">
                <span className="text-zinc-950 dark:text-white">{rows.length}</span> {t.trainersFound}
              </p>
            </div>

            {loading ? (
              <Spinner />
            ) : rows.length ? (
              <motion.div layout className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {rows.map((trainer) => (
                    <motion.div
                      layout
                      key={trainer.id}
                      initial={{ opacity: 0, y: 18, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.97 }}
                      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <TrainerCard trainer={trainer} variant="directory" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-7 border-y border-zinc-200 py-20 text-center dark:border-zinc-800">
                <Search className="mx-auto text-primary" size={32} />
                <h3 className="mt-5 text-xl font-black">{t.trainersEmptyTitle}</h3>
                <p className="mt-2 text-sm text-zinc-500">{t.trainersEmptyText}</p>
                <button
                  onClick={() => {
                    setQuery('');
                    setSpecialty('all');
                  }}
                  className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-black"
                >
                  {t.trainersReset}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
