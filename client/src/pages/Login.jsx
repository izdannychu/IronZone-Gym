import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [form, setForm] = useState({ email: 'user1@example.com', password: 'password123' });
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    const user = await signIn(form);
    navigate(user.type === 'admin' ? '/admin' : '/dashboard');
  };
  return (
    <main className="container-page grid min-h-[70vh] place-items-center py-10">
      <form onSubmit={submit} className="card w-full max-w-md p-6">
        <h1 className="text-3xl font-black">Dang nhap</h1>
        <p className="mt-2 text-sm text-zinc-500">Demo user: user1@example.com / password123. Admin: admin@ironzone.vn / admin123.</p>
        <div className="mt-6 space-y-4">
          <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
          <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Mat khau" />
          <Button className="w-full" loading={loading}>Dang nhap</Button>
        </div>
        <p className="mt-4 text-center text-sm text-zinc-500">Chua co tai khoan? <Link to="/register" className="font-bold text-primary">Dang ky</Link></p>
      </form>
    </main>
  );
}
