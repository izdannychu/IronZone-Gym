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
    <main className="container-page page-shell grid min-h-screen place-items-center py-28">
      <form onSubmit={submit} className="card w-full max-w-md p-6">
        <h1 className="text-3xl font-black">Đăng ký hội viên</h1>
        <div className="mt-6 space-y-4">
          <input className="input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Họ tên" required />
          <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" required />
          <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Số điện thoại" />
          <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Mật khẩu" required />
          <Button className="w-full" loading={loading}>Tạo tài khoản</Button>
        </div>
        <p className="mt-4 text-center text-sm text-zinc-500">Đã có tài khoản? <Link to="/login" className="font-bold text-primary">Đăng nhập</Link></p>
      </form>
    </main>
  );
}
