import { Dumbbell, Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';

export const Footer = () => (
  <footer className="border-t border-zinc-200 bg-white py-10 dark:border-zinc-800 dark:bg-zinc-950">
    <div className="container-page grid gap-8 md:grid-cols-4">
      <div className="md:col-span-2">
        <div className="flex items-center gap-2 text-xl font-black"><Dumbbell className="text-primary" /> IRONZONE</div>
        <p className="mt-3 max-w-md text-sm text-zinc-500">Gym management website voi gói tập, PT, cart, checkout, dashboard hoi vien va admin operations.</p>
      </div>
      <div>
        <h4 className="font-bold">Lien he</h4>
        <div className="mt-3 space-y-2 text-sm text-zinc-500">
          <p className="flex gap-2"><MapPin size={16} /> 99 Nguyen Trai, TP.HCM</p>
          <p className="flex gap-2"><Phone size={16} /> 0909 888 777</p>
          <p className="flex gap-2"><Mail size={16} /> hello@ironzone.vn</p>
        </div>
      </div>
      <div>
        <h4 className="font-bold">Social</h4>
        <div className="mt-3 flex gap-2">
          <span className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800"><Facebook size={18} /></span>
          <span className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800"><Instagram size={18} /></span>
        </div>
      </div>
    </div>
  </footer>
);
