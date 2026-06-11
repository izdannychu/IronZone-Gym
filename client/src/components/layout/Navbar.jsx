import { Menu, Moon, ShoppingCart, Sun, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

const links = [
  ['/', 'Home'],
  ['/plans', 'Goi tap'],
  ['/trainers', 'HLV']
];

export const Navbar = () => {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [open, setOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const navClass = ({ isActive }) => `rounded-lg px-3 py-2 text-sm font-semibold ${isActive ? 'bg-primary text-black' : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800'}`;

  const content = (
    <>
      {links.map(([href, label]) => <NavLink key={href} to={href} className={navClass} onClick={() => setOpen(false)}>{label}</NavLink>)}
      {isAdmin && <NavLink to="/admin" className={navClass} onClick={() => setOpen(false)}>Admin</NavLink>}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-dark/90">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-black tracking-wide">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-black">IZ</span>
          <span>IRONZONE</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">{content}</nav>
        <div className="hidden items-center gap-2 md:flex">
          <button title="Toggle theme" onClick={() => setDark((v) => !v)} className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">{dark ? <Sun size={19} /> : <Moon size={19} />}</button>
          {!isAdmin && <Link to="/cart" className="relative rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"><ShoppingCart size={20} />{count > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1.5 text-xs font-bold text-black">{count}</span>}</Link>}
          {user ? (
            <>
              <Button variant="ghost" onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')}><User size={16} />{user.full_name || user.username}</Button>
              <Button variant="outline" onClick={() => { logout(); navigate('/'); }}>Thoat</Button>
            </>
          ) : (
            <Button onClick={() => navigate('/login')}>Dang nhap</Button>
          )}
        </div>
        <button onClick={() => setOpen((v) => !v)} className="rounded-lg p-2 md:hidden">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="container-page flex flex-col gap-2 pb-4 md:hidden">{content}<Button onClick={() => navigate(user ? '/dashboard' : '/login')}>{user ? 'Tai khoan' : 'Dang nhap'}</Button></div>}
    </header>
  );
};
