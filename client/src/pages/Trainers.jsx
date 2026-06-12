import { useEffect, useMemo, useState } from 'react';
import { getTrainers } from '../api/trainers';
import { TrainerCard } from '../components/TrainerCard';
import { Spinner } from '../components/ui/Spinner';

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [specialty, setSpecialty] = useState('all');
  const [loading, setLoading] = useState(true);
  useEffect(() => { getTrainers().then((res) => setTrainers(res.data.data)).finally(() => setLoading(false)); }, []);
  const specialties = useMemo(() => ['all', ...new Set(trainers.map((t) => t.specialty))], [trainers]);
  const rows = specialty === 'all' ? trainers : trainers.filter((t) => t.specialty === specialty);
  return (
    <main className="container-page page-shell pb-10 pt-32">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div><h1 className="text-4xl font-black">Đội ngũ HLV</h1><p className="mt-2 text-zinc-500">Lọc theo chuyên môn và xem review từ hội viên.</p></div>
        <div className="flex flex-wrap gap-2">{specialties.map((s) => <button key={s} onClick={() => setSpecialty(s)} className={`rounded-lg px-3 py-2 text-sm font-bold ${specialty === s ? 'bg-primary text-black' : 'bg-white dark:bg-zinc-900'}`}>{s === 'all' ? 'Tất cả' : s}</button>)}</div>
      </div>
      {loading ? <Spinner /> : <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{rows.map((trainer) => <TrainerCard key={trainer.id} trainer={trainer} />)}</div>}
    </main>
  );
}
