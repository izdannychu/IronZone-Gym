export const StatCard = ({ icon: Icon, label, value }) => (
  <article className="card p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-zinc-500">{label}</p>
        <p className="mt-2 text-2xl font-black">{value}</p>
      </div>
      {Icon && <div className="rounded-xl bg-primary/15 p-3 text-primary"><Icon size={24} /></div>}
    </div>
  </article>
);
