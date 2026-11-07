import { useEffect, useState } from 'react';
import { Plus, UserCog } from 'lucide-react';
import { api, apiErrorMessage } from '@/api/client';
import { useToast } from '@/context/ToastContext';
import { isValidPhone } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TeamMember {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
}

const EMPTY_FORM = { name: '', phone: '', password: '' };

export default function Team() {
  const toast = useToast();
  const [members, setMembers] = useState<TeamMember[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const res = await api.get('/team');
      setMembers(res.data.data.admins as TeamMember[]);
      setError(null);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    setTouched(true);
    if (!form.name.trim() || !isValidPhone(form.phone) || form.password.length < 6) return;
    setSaving(true);
    try {
      await api.post('/team', form);
      toast('Platform admin added', 'success');
      setForm(EMPTY_FORM);
      setTouched(false);
      setShowCreate(false);
      load();
    } catch (err) {
      toast(apiErrorMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-[19px] font-semibold tracking-[-0.02em]">Team</h1>
          <p className="text-[13px] text-muted-foreground">Who can manage car spas on this platform</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus /> Add admin
        </Button>
      </div>

      <Card className="overflow-hidden">
        {error ? (
          <p className="px-5 py-6 text-sm text-danger">{error}</p>
        ) : members === null ? (
          <p className="px-5 py-6 text-sm text-muted-foreground">Loading…</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium text-foreground">{m.name}</TableCell>
                  <TableCell className="tabular">{m.phone}</TableCell>
                  <TableCell>{new Date(m.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog
        open={showCreate}
        onOpenChange={(o) => {
          setShowCreate(o);
          if (!o) {
            setTouched(false);
            setForm(EMPTY_FORM);
          }
        }}
      >
        <DialogContent size="sm">
          <DialogHeader title="Add platform admin" description="They'll be able to create and manage car spas." icon={<UserCog />} />
          <form
            className="flex min-h-0 flex-1 flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              create();
            }}
          >
            <DialogBody className="grid gap-4">
              <Field label="Name" htmlFor="t-name" required error={touched && !form.name.trim() ? 'Required' : undefined}>
                <Input id="t-name" name="t-name" autoComplete="off" autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={touched && !form.name.trim()} />
              </Field>
              <Field label="Phone" htmlFor="t-phone" required hint="10-15 digits" error={touched && !isValidPhone(form.phone) ? 'Enter a valid phone number' : undefined}>
                <Input
                  id="t-phone"
                  name="t-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="off"
                  maxLength={20}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/[^\d+\-\s]/g, '') })}
                  aria-invalid={touched && !isValidPhone(form.phone)}
                />
              </Field>
              <Field label="Password" htmlFor="t-pass" required hint="Min 6 characters" error={touched && form.password.length < 6 ? 'Min 6 characters' : undefined}>
                <Input id="t-pass" name="t-pass" type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} aria-invalid={touched && form.password.length < 6} />
              </Field>
            </DialogBody>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                Add admin
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
