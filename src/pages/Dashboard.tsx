import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity as ActivityIcon, Building2, CheckCircle2, PauseCircle } from 'lucide-react';
import { api, apiErrorMessage } from '@/api/client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Organization {
  id: string;
  name: string;
  slug: string;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

interface AuditLog {
  id: string;
  actorName: string;
  action: string;
  summary: string;
  createdAt: string;
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number | string; icon: typeof Building2 }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 py-5">
        <div className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-brand-soft text-primary">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-2xl leading-7 font-semibold tabular">{value}</p>
          <p className="text-[13px] text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [orgs, setOrgs] = useState<Organization[] | null>(null);
  const [logs, setLogs] = useState<AuditLog[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.get('/organizations'), api.get('/audit')])
      .then(([o, a]) => {
        setOrgs(o.data.data.organizations as Organization[]);
        setLogs((a.data.data.logs as AuditLog[]).slice(0, 10));
      })
      .catch((err) => setError(apiErrorMessage(err)));
  }, []);

  const stats = useMemo(() => {
    const active = orgs?.filter((o) => o.status === 'ACTIVE').length ?? 0;
    const suspended = orgs?.filter((o) => o.status === 'SUSPENDED').length ?? 0;
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const newThisMonth = orgs?.filter((o) => new Date(o.createdAt) >= startOfMonth).length ?? 0;
    return { total: orgs?.length ?? 0, active, suspended, newThisMonth };
  }, [orgs]);

  const newest = useMemo(() => [...(orgs ?? [])].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 5), [orgs]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-[19px] font-semibold tracking-[-0.02em]">Dashboard</h1>
        <p className="text-[13px] text-muted-foreground">Across every car spa on the platform</p>
      </div>

      {error && <p className="mb-4 text-sm text-danger">{error}</p>}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total car spas" value={stats.total} icon={Building2} />
        <StatCard label="Active" value={stats.active} icon={CheckCircle2} />
        <StatCard label="Suspended" value={stats.suspended} icon={PauseCircle} />
        <StatCard label="New this month" value={stats.newThisMonth} icon={ActivityIcon} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Newest car spas</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {newest.length === 0 ? (
              <p className="text-[13px] text-muted-foreground">Nothing yet.</p>
            ) : (
              <ul className="divide-y">
                {newest.map((o) => (
                  <li key={o.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{o.name}</p>
                      <p className="truncate font-mono text-xs text-muted-foreground">{o.slug}.carnmore.app</p>
                    </div>
                    <Badge tone={o.status === 'ACTIVE' ? 'success' : 'danger'}>{o.status === 'ACTIVE' ? 'Active' : 'Suspended'}</Badge>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/organizations" className="mt-3 inline-block text-[13px] font-medium text-primary hover:underline">
              View all car spas →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {!logs || logs.length === 0 ? (
              <p className="text-[13px] text-muted-foreground">No activity yet.</p>
            ) : (
              <ul className="divide-y">
                {logs.map((l) => (
                  <li key={l.id} className="py-2.5">
                    <p className="text-sm text-foreground">{l.summary}</p>
                    <p className="text-xs text-muted-foreground">
                      {l.actorName} · {new Date(l.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/activity" className="mt-3 inline-block text-[13px] font-medium text-primary hover:underline">
              View full activity log →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
