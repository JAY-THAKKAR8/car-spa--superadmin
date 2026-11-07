import { NavLink, Outlet } from 'react-router-dom';
import { Activity, Building2, LayoutDashboard, LogOut, ShieldCheck, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/organizations', label: 'Car spas', icon: Building2 },
  { to: '/team', label: 'Team', icon: Users },
  { to: '/activity', label: 'Activity', icon: Activity },
];

export default function Shell() {
  const { admin, logout } = useAuth();
  return (
    <div className="flex min-h-dvh bg-background">
      <aside className="flex w-60 shrink-0 flex-col border-r bg-card px-3 py-4">
        <div className="mb-6 flex items-center gap-2.5 px-2">
          <div className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-brand-soft text-primary">
            <ShieldCheck className="size-4.5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm leading-5 font-semibold">Carnmore</p>
            <p className="truncate text-[11px] leading-4 text-muted-foreground">Platform</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors',
                  isActive ? 'bg-brand-soft text-brand-on-soft' : 'text-subtle-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              <item.icon className="size-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t pt-3">
          <p className="truncate px-2.5 text-[12px] text-muted-foreground">{admin?.name}</p>
          <button type="button" onClick={logout} className="mt-1 flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium text-subtle-foreground transition-colors hover:bg-muted hover:text-foreground">
            <LogOut className="size-4" /> Log out
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
