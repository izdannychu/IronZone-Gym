import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-primary text-black hover:bg-primary-dark',
  dark: 'bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200',
  ghost: 'bg-transparent text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800',
  outline: 'border border-zinc-300 bg-white text-zinc-900 hover:border-primary dark:border-zinc-700 dark:bg-zinc-900 dark:text-white'
};

export const Button = ({ as: Component = 'button', children, className = '', variant = 'primary', loading = false, ...props }) => (
  <Component className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`} disabled={loading || props.disabled} {...props}>
    {loading && <Loader2 size={16} className="animate-spin" />}
    {children}
  </Component>
);
