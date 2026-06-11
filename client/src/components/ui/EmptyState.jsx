import { Dumbbell } from 'lucide-react';
export const EmptyState = ({ title = 'Chua co du lieu', subtitle = 'Thu lai sau it phut.' }) => (
  <div className="card flex flex-col items-center justify-center py-12 text-center">
    <Dumbbell className="mb-3 text-primary" size={36} />
    <h3 className="font-bold">{title}</h3>
    <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
  </div>
);
