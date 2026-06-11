import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '' });
  const { signUp, loading } = useAuth();
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    await signUp(form);
    navigate('/dashboard');
  };
  return (
    <main className="container-page grid min-h-[70vh] place-items-center py-10">
      <form onSubmit={submit} className="card w-full max-w-md p-6">
        <h1 className="text-3xl font-black">Dang ky hoi vien</h1>
        <div className="mt-6 space-y-4">
          <input className="input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Ho ten" required />
          <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" required />
          <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="So dien thoai" />
          <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Mat khau" required />
          <Button className="w-full" loading={loading}>Tao tai khoan</Button>
        </div>
        <p className="mt-4 text-center text-sm text-zinc-500">Da co tai khoan? <Link to="/login" className="font-bold text-primary">Dang nhap</Link></p>
      </form>
    </main>
  );
}
