import { Award, Dumbbell, ShieldCheck, Users } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

const values = [
  [Dumbbell, 'Modern training floor', 'Strength, cardio, functional and recovery zones are arranged for a smooth training flow.'],
  [Award, 'Certified coaching', 'Every program is guided by coaches with practical experience and recognized certifications.'],
  [ShieldCheck, 'Clean operations', 'Equipment, maintenance and member safety are tracked through the same management system.'],
  [Users, 'Active community', 'Group classes, progress check-ins and member events keep the training habit alive.']
];

export default function About() {
  const { t } = useLanguage();

  return (
    <main className="container-page page-shell py-28">
      <section className="max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-primary">IronZone</p>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">{t.aboutTitle}</h1>
        <p className="mt-5 text-lg text-zinc-600 dark:text-zinc-300">{t.aboutText}</p>
      </section>
      <section className="mt-12 grid gap-5 md:grid-cols-2">
        {values.map(([Icon, title, text]) => (
          <article key={title} className="card p-6">
            <Icon className="text-primary" />
            <h2 className="mt-4 text-xl font-black">{title}</h2>
            <p className="mt-2 text-sm text-zinc-500">{text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
