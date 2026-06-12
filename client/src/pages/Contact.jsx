import { Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

const channels = [
  [MapPin, '99 Nguyen Trai, TP.HCM'],
  [Phone, '0909 888 777'],
  [Mail, 'hello@ironzone.vn']
];

export default function Contact() {
  const { t } = useLanguage();

  return (
    <main className="container-page page-shell py-28">
      <section className="max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-primary">IronZone</p>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">{t.contactTitle}</h1>
        <p className="mt-5 text-lg text-zinc-600 dark:text-zinc-300">{t.contactText}</p>
      </section>
      <section className="mt-12 grid gap-5 md:grid-cols-3">
        {channels.map(([Icon, value]) => (
          <article key={value} className="card p-6">
            <Icon className="text-primary" />
            <p className="mt-4 font-bold">{value}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
