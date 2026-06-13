import { Clock3, ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '../components/motion/Motion';
import { useLanguage } from '../hooks/useLanguage';

const address = '99 Nguyễn Trãi, TP. Hồ Chí Minh';
const mapUrl = 'https://www.google.com/maps?q=99+Nguyen+Trai,+Ho+Chi+Minh+City&output=embed';
const directionsUrl = 'https://www.google.com/maps/search/?api=1&query=99+Nguyen+Trai,+Ho+Chi+Minh+City';

export default function Contact() {
  const { t } = useLanguage();

  const channels = [
    {
      Icon: MapPin,
      label: t.contactAddress,
      value: address,
      href: directionsUrl,
    },
    {
      Icon: Phone,
      label: t.contactPhone,
      value: '0909 888 777',
      href: 'tel:+84909888777',
    },
    {
      Icon: Mail,
      label: t.contactEmail,
      value: 'hello@ironzone.vn',
      href: 'mailto:hello@ironzone.vn',
    },
  ];

  return (
    <main className="page-shell pb-16 pt-24">
      <section className="relative overflow-hidden border-b border-zinc-800 bg-zinc-950 py-16 text-white sm:py-20">
        <div className="absolute -right-12 top-1/2 select-none text-[12rem] font-black leading-none text-white/[0.025] sm:text-[18rem] lg:text-[24rem]">
          IZ
        </div>
        <div className="container-page relative">
          <Reveal>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">{t.contactEyebrow}</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black uppercase leading-[0.9] sm:text-6xl lg:text-7xl">
              {t.contactHeading}{' '}
              <span className="text-primary">{t.contactHeadingAccent}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">{t.contactText}</p>
          </Reveal>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <Stagger className="grid gap-4 md:grid-cols-3">
          {channels.map(({ Icon, label, value, href }) => (
            <StaggerItem key={label}>
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                className="group flex h-full items-start gap-4 border border-zinc-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-primary dark:border-zinc-800 dark:bg-zinc-900"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/15 text-primary transition group-hover:bg-primary group-hover:text-black">
                  <Icon size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-black uppercase tracking-[0.14em] text-zinc-400">{label}</span>
                  <span className="mt-2 block break-words font-bold">{value}</span>
                </span>
              </a>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-10 grid overflow-hidden border border-zinc-200 bg-white shadow-2xl shadow-black/10 dark:border-zinc-800 dark:bg-zinc-900 lg:grid-cols-[0.68fr_1.32fr]">
          <Reveal className="h-full">
            <div className="flex h-full flex-col p-7 sm:p-9">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">{t.locationEyebrow}</p>
              <h2 className="mt-4 text-3xl font-black uppercase leading-tight sm:text-4xl">{t.locationTitle}</h2>
              <p className="mt-5 leading-7 text-zinc-500 dark:text-zinc-400">{t.locationText}</p>

              <div className="mt-8 space-y-5 border-y border-zinc-200 py-6 dark:border-zinc-800">
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 shrink-0 text-primary" size={19} />
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-400">{t.contactAddress}</p>
                    <p className="mt-1 font-bold">{address}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock3 className="mt-0.5 shrink-0 text-primary" size={19} />
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-400">{t.openingHours}</p>
                    <p className="mt-1 font-bold">{t.openingHoursValue}</p>
                  </div>
                </div>
              </div>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-black text-black hover:bg-primary-dark"
              >
                {t.openMaps}
                <ExternalLink size={17} />
              </a>
            </div>
          </Reveal>

          <Reveal className="min-h-[420px]" delay={0.08}>
            <div className="relative h-full min-h-[420px] bg-zinc-200 dark:bg-zinc-800">
              <iframe
                title={t.mapTitle}
                src={mapUrl}
                className="absolute inset-0 h-full w-full border-0 grayscale-[20%] contrast-[1.05]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
