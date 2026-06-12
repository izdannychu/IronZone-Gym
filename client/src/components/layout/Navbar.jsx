import { Globe2, Menu, Moon, ShoppingCart, Sun, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useLanguage } from "../../hooks/useLanguage";

export const Navbar = () => {
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );
  const [open, setOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const links = [
    ["/", t.navHome],
    ["/plans", t.navPlans],
    ["/trainers", t.navTrainers],
    ["/about", t.navAbout],
    ["/contact", t.navContact],
  ];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const navClass = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-semibold transition ${isActive ? "bg-primary text-black" : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"}`;

  const content = (
    <>
      {links.map(([href, label]) => (
        <NavLink
          key={href}
          to={href}
          className={navClass}
          onClick={() => setOpen(false)}
        >
          {label}
        </NavLink>
      ))}
    </>
  );

  return (
    <header className="fixed left-0 right-0 top-4 z-40">
      <div className="container-page flex h-16 items-center justify-between rounded-full border border-white/30 bg-white/55 px-4 shadow-xl shadow-black/10 backdrop-blur-xl dark:border-white/10 dark:bg-black/35">
        <Link
          to="/"
          className="flex items-center gap-2 font-black tracking-wide"
        >
          <img
            src="/assets/ironzone-logo-light.png"
            alt="IronZone"
            className="h-8 w-auto dark:hidden"
          />
          <img
            src="/assets/ironzone-logo.png"
            alt="IronZone"
            className="hidden h-8 w-auto dark:block"
          />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">{content}</nav>
        <div className="hidden items-center gap-2 md:flex">
          <button
            title="Language"
            onClick={() => setLanguage(language === "vi" ? "en" : "vi")}
            className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Globe2 size={17} />
            {language.toUpperCase()}
          </button>
          <button
            title="Toggle theme"
            onClick={() => setDark((v) => !v)}
            className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {dark ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          {!isAdmin && (
            <Link
              to="/cart"
              title={t.cart}
              className="relative rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <ShoppingCart size={20} />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1.5 text-xs font-bold text-black">
                  {count}
                </span>
              )}
            </Link>
          )}
          {user ? (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")}
              >
                <User size={16} />
                {user.full_name || user.username}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                {t.logout}
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate("/login")}>{t.login}</Button>
          )}
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-full p-2 md:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="container-page mt-2 flex flex-col gap-2 rounded-3xl border border-white/30 bg-white/80 p-4 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/70 md:hidden">
          {content}
          <button
            onClick={() => setLanguage(language === "vi" ? "en" : "vi")}
            className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Globe2 size={17} />
            {language.toUpperCase()}
          </button>
          <Button
            onClick={() => {
              setOpen(false);
              navigate(user ? (isAdmin ? "/admin" : "/dashboard") : "/login");
            }}
          >
            {user ? t.account : t.login}
          </Button>
        </div>
      )}
    </header>
  );
};
