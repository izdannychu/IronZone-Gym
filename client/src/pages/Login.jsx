import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    const user = await signIn(form);
    navigate(user.type === 'admin' ? '/admin' : '/dashboard');
  };
  return (
    <main className="container-page page-shell grid min-h-screen place-items-center py-28">
      <form onSubmit={submit} className="w-full max-w-md overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-black/10 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="bg-zinc-950 p-8 text-white">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-black"><LockKeyhole /></div>
          <h1 className="mt-6 text-3xl font-black">{t.loginTitle}</h1>
          <p className="mt-2 text-sm text-zinc-300">{t.loginSubtitle}</p>
        </div>
        <div className="space-y-4 p-6">
          <label className="block">
            <span className="mb-2 block text-sm font-bold">{t.email}</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input className="input input-icon-left" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@ironzone.vn" />
            </div>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold">{t.password}</span>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input className="input input-icon-left input-icon-right" required type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" />
              <button type="button" title={showPassword ? t.hidePassword : t.showPassword} onClick={() => setShowPassword((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>
          <Button className="w-full" loading={loading}>{t.login}</Button>
          <p className="text-center text-sm text-zinc-500">{t.noAccount} <Link to="/register" className="font-bold text-primary">{t.register}</Link></p>
        </div>
      </form>
    </main>
  );
}
