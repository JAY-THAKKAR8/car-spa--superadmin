import { useEffect, useState } from 'react';
import { History } from 'lucide-react';
import { api, apiErrorMessage } from '@/api/client';
import { Card } from '@/components/ui/card';

interface AuditLog {
  id: string;
  actorName: string;
  action: string;
  summary: string;
  createdAt: string;
}

export default function Activity() {
  const [logs, setLogs] = useState<AuditLog[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('/audit')
      .then((res) => setLogs(res.data.data.logs as AuditLog[]))
      .catch((err) => setError(apiErrorMessage(err)));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-[19px] font-semibold tracking-[-0.02em]">Activity</h1>
        <p className="text-[13px] text-muted-foreground">Everything platform admins have done — most recent first</p>
      </div>

      <Card className="overflow-hidden">
        {error ? (
          <p className="px-5 py-6 text-sm text-danger">{error}</p>
        ) : logs === null ? (
          <p className="px-5 py-6 text-sm text-muted-foreground">Loading…</p>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-5 py-14 text-center">
            <History className="size-8 text-placeholder" />
            <p className="text-sm font-medium text-foreground">No activity yet</p>
          </div>
        ) : (
          <ul className="divide-y">
            {logs.map((l) => (
              <li key={l.id} className="px-5 py-3">
                <p className="text-sm text-foreground">{l.summary}</p>
                <p className="text-xs text-muted-foreground">
                  {l.actorName} · {l.action} · {new Date(l.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
