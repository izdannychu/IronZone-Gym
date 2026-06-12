import { Globe2, Menu, Moon, ShoppingCart, Sun, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useLanguage } from '../../hooks/useLanguage';

export const Navbar = () => {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const links = [
    ['/', t.navHome],
    ['/plans', t.navPlans],
    ['/trainers', t.navTrainers],
    ['/about', t.navAbout],
    ['/contact', t.navContact]
  ];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      setHidden(currentY > 96 && currentY > lastY);
      lastY = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navClass = ({ isActive }) => `rounded-full px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-primary text-black' : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800'}`;

  const content = (
    <>
      {links.map(([href, label]) => <NavLink key={href} to={href} className={navClass} onClick={() => setOpen(false)}>{label}</NavLink>)}
      {isAdmin && <NavLink to="/admin" className={navClass} onClick={() => setOpen(false)}>Admin</NavLink>}
    </>
  );

  return (
    <header className={`fixed left-0 right-0 top-4 z-40 transition-transform duration-300 ${hidden ? '-translate-y-24' : 'translate-y-0'}`}>
      <div className="container-page flex h-16 items-center justify-between rounded-full border border-zinc-200/80 bg-white/90 px-4 shadow-xl shadow-black/5 backdrop-blur dark:border-zinc-800/80 dark:bg-dark/90">
        <Link to="/" className="flex items-center gap-2 font-black tracking-wide">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-black">IZ</span>
          <span>IRONZONE</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">{content}</nav>
        <div className="hidden items-center gap-2 md:flex">
          <button title="Language" onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')} className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800"><Globe2 size={17} />{language.toUpperCase()}</button>
          <button title="Toggle theme" onClick={() => setDark((v) => !v)} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">{dark ? <Sun size={19} /> : <Moon size={19} />}</button>
          {!isAdmin && <Link to="/cart" title={t.cart} className="relative rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"><ShoppingCart size={20} />{count > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1.5 text-xs font-bold text-black">{count}</span>}</Link>}
          {user ? (
            <>
              <Button variant="ghost" onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')}><User size={16} />{user.full_name || user.username}</Button>
              <Button variant="outline" onClick={() => { logout(); navigate('/'); }}>{t.logout}</Button>
            </>
          ) : (
            <Button onClick={() => navigate('/login')}>{t.login}</Button>
          )}
        </div>
        <button onClick={() => setOpen((v) => !v)} className="rounded-full p-2 md:hidden">{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <div className="container-page mt-2 flex flex-col gap-2 rounded-3xl border border-zinc-200 bg-white/95 p-4 shadow-xl dark:border-zinc-800 dark:bg-dark/95 md:hidden">
          {content}
          <button onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')} className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800"><Globe2 size={17} />{language.toUpperCase()}</button>
          <Button onClick={() => navigate(user ? '/dashboard' : '/login')}>{user ? t.account : t.login}</Button>
        </div>
      )}
    </header>
  );
};
