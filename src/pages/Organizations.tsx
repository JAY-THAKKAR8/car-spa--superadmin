import { useEffect, useMemo, useState } from 'react';
import { Building2, Pencil, Plus, Power } from 'lucide-react';
import { api, apiErrorMessage } from '@/api/client';
import { useToast } from '@/context/ToastContext';
import { isValidPhone, isValidSlug } from '@/lib/validators';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Input, Textarea } from '@/components/ui/input';
import { Field } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Organization {
  id: string;
  name: string;
  slug: string;
  status: 'ACTIVE' | 'SUSPENDED';
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string | null;
  address: string | null;
  createdAt: string;
}

const EMPTY_FORM = { name: '', slug: '', ownerName: '', ownerPhone: '', ownerEmail: '', address: '', ownerPassword: '' };
const isValidEmail = (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function Organizations() {
  const toast = useToast();
  const [orgs, setOrgs] = useState<Organization[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Organization | null>(null);
  const [editForm, setEditForm] = useState({ name: '', ownerName: '', ownerPhone: '', ownerEmail: '', address: '' });
  const [editTouched, setEditTouched] = useState(false);
  const [editSaving, setEditSaving] = useState(false);

  async function load() {
    try {
      const res = await api.get('/organizations');
      setOrgs(res.data.data.organizations as Organization[]);
      setError(null);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }

  useEffect(() => {
    load();
  }, []);

  const slugPreview = useMemo(() => (form.slug ? `${form.slug.toLowerCase()}.carnmore.app` : ''), [form.slug]);

  async function create() {
    setTouched(true);
    if (!form.name.trim() || !isValidSlug(form.slug) || !form.ownerName.trim() || !isValidPhone(form.ownerPhone) || !isValidEmail(form.ownerEmail) || form.ownerPassword.length < 6) return;
    setSaving(true);
    try {
      await api.post('/organizations', form);
      toast('Car spa created', 'success');
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

  function openEdit(org: Organization) {
    setEditing(org);
    setEditForm({ name: org.name, ownerName: org.ownerName, ownerPhone: org.ownerPhone, ownerEmail: org.ownerEmail ?? '', address: org.address ?? '' });
    setEditTouched(false);
  }

  async function saveEdit() {
    if (!editing) return;
    setEditTouched(true);
    if (!editForm.name.trim() || !editForm.ownerName.trim() || !isValidPhone(editForm.ownerPhone) || !isValidEmail(editForm.ownerEmail)) return;
    setEditSaving(true);
    try {
      await api.patch(`/organizations/${editing.id}`, editForm);
      toast('Owner contact updated', 'success');
      setEditing(null);
      load();
    } catch (err) {
      toast(apiErrorMessage(err), 'error');
    } finally {
      setEditSaving(false);
    }
  }

  async function toggleStatus(org: Organization) {
    const next = org.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    if (next === 'SUSPENDED' && !window.confirm(`Suspend "${org.name}"? Its staff won't be able to log in until reactivated.`)) return;
    try {
      await api.patch(`/organizations/${org.id}/status`, { status: next });
      toast(next === 'SUSPENDED' ? 'Car spa suspended' : 'Car spa reactivated', 'success');
      load();
    } catch (err) {
      toast(apiErrorMessage(err), 'error');
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-[19px] font-semibold tracking-[-0.02em]">Car spas</h1>
          <p className="text-[13px] text-muted-foreground">Every tenant on the platform</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus /> New car spa
        </Button>
      </div>

      <Card className="overflow-hidden">
        {error ? (
          <p className="px-5 py-6 text-sm text-danger">{error}</p>
        ) : orgs === null ? (
          <p className="px-5 py-6 text-sm text-muted-foreground">Loading…</p>
        ) : orgs.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-5 py-14 text-center">
            <Building2 className="size-8 text-placeholder" />
            <p className="text-sm font-medium text-foreground">No car spas yet</p>
            <p className="text-[13px] text-muted-foreground">Create the first one to get started.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Car spa</TableHead>
                <TableHead>Subdomain</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orgs.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium text-foreground">{o.name}</TableCell>
                  <TableCell className="font-mono text-xs">{o.slug}.carnmore.app</TableCell>
                  <TableCell className="font-medium text-foreground">{o.ownerName}</TableCell>
                  <TableCell className="tabular">{o.ownerPhone}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{o.ownerEmail || <span className="text-placeholder">—</span>}</TableCell>
                  <TableCell>
                    <Badge tone={o.status === 'ACTIVE' ? 'success' : 'danger'}>{o.status === 'ACTIVE' ? 'Active' : 'Suspended'}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon-sm" aria-label={`Edit ${o.name}`} onClick={() => openEdit(o)}>
                      <Pencil />
                    </Button>
                    <Button variant="ghost" size="icon-sm" aria-label={o.status === 'ACTIVE' ? `Suspend ${o.name}` : `Reactivate ${o.name}`} onClick={() => toggleStatus(o)}>
                      <Power className={o.status === 'ACTIVE' ? 'text-danger' : 'text-success'} />
                    </Button>
                  </TableCell>
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
        <DialogContent>
          <DialogHeader title="New car spa" description="Creates the tenant and its first owner login." icon={<Building2 />} />
          <form
            className="flex min-h-0 flex-1 flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              create();
            }}
          >
            <DialogBody className="grid gap-4">
              <Field label="Business name" htmlFor="o-name" required error={touched && !form.name.trim() ? 'Required' : undefined}>
                <Input id="o-name" name="o-name" autoComplete="off" autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={touched && !form.name.trim()} />
              </Field>
              <Field label="Subdomain" htmlFor="o-slug" required hint={slugPreview || 'Lowercase letters, numbers, hyphens'} error={touched && !isValidSlug(form.slug) ? 'Lowercase letters, numbers, hyphens only' : undefined}>
                <Input id="o-slug" name="o-slug" autoComplete="off" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} aria-invalid={touched && !isValidSlug(form.slug)} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Owner name" htmlFor="o-oname" required error={touched && !form.ownerName.trim() ? 'Required' : undefined}>
                  <Input id="o-oname" name="o-oname" autoComplete="off" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} aria-invalid={touched && !form.ownerName.trim()} />
                </Field>
                <Field label="Owner phone" htmlFor="o-ophone" required hint="10-15 digits" error={touched && !isValidPhone(form.ownerPhone) ? 'Enter a valid phone number' : undefined}>
                  <Input
                    id="o-ophone"
                    name="o-ophone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="off"
                    maxLength={20}
                    value={form.ownerPhone}
                    onChange={(e) => setForm({ ...form, ownerPhone: e.target.value.replace(/[^\d+\-\s]/g, '') })}
                    aria-invalid={touched && !isValidPhone(form.ownerPhone)}
                  />
                </Field>
              </div>
              <Field label="Owner email" htmlFor="o-oemail" hint="Optional" error={touched && !isValidEmail(form.ownerEmail) ? 'Enter a valid email' : undefined}>
                <Input id="o-oemail" name="o-oemail" type="email" autoComplete="off" value={form.ownerEmail} onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })} aria-invalid={touched && !isValidEmail(form.ownerEmail)} />
              </Field>
              <Field label="Address" htmlFor="o-address" hint="Optional">
                <Textarea id="o-address" name="o-address" autoComplete="off" rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </Field>
              <Field label="Owner password" htmlFor="o-opass" required hint="Min 6 characters" error={touched && form.ownerPassword.length < 6 ? 'Min 6 characters' : undefined}>
                <Input id="o-opass" name="o-opass" type="password" autoComplete="new-password" value={form.ownerPassword} onChange={(e) => setForm({ ...form, ownerPassword: e.target.value })} aria-invalid={touched && form.ownerPassword.length < 6} />
              </Field>
            </DialogBody>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                Create car spa
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent size="sm">
          <DialogHeader title="Edit owner contact" description={editing ? `${editing.name} (${editing.slug}.carnmore.app)` : ''} icon={<Pencil />} />
          <form
            className="flex min-h-0 flex-1 flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              saveEdit();
            }}
          >
            <DialogBody className="grid gap-4">
              <Field label="Business name" htmlFor="e-name" required hint="Shown on this tenant's invoices and tracking page" error={editTouched && !editForm.name.trim() ? 'Required' : undefined}>
                <Input id="e-name" name="e-name" autoComplete="off" autoFocus value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} aria-invalid={editTouched && !editForm.name.trim()} />
              </Field>
              <Field label="Owner name" htmlFor="e-oname" required error={editTouched && !editForm.ownerName.trim() ? 'Required' : undefined}>
                <Input id="e-oname" name="e-oname" autoComplete="off" value={editForm.ownerName} onChange={(e) => setEditForm({ ...editForm, ownerName: e.target.value })} aria-invalid={editTouched && !editForm.ownerName.trim()} />
              </Field>
              <Field label="Owner phone" htmlFor="e-ophone" required hint="10-15 digits" error={editTouched && !isValidPhone(editForm.ownerPhone) ? 'Enter a valid phone number' : undefined}>
                <Input
                  id="e-ophone"
                  name="e-ophone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="off"
                  maxLength={20}
                  value={editForm.ownerPhone}
                  onChange={(e) => setEditForm({ ...editForm, ownerPhone: e.target.value.replace(/[^\d+\-\s]/g, '') })}
                  aria-invalid={editTouched && !isValidPhone(editForm.ownerPhone)}
                />
              </Field>
              <Field label="Owner email" htmlFor="e-oemail" hint="Optional" error={editTouched && !isValidEmail(editForm.ownerEmail) ? 'Enter a valid email' : undefined}>
                <Input id="e-oemail" name="e-oemail" type="email" autoComplete="off" value={editForm.ownerEmail} onChange={(e) => setEditForm({ ...editForm, ownerEmail: e.target.value })} aria-invalid={editTouched && !isValidEmail(editForm.ownerEmail)} />
              </Field>
              <Field label="Address" htmlFor="e-address" hint="Optional">
                <Textarea id="e-address" name="e-address" autoComplete="off" rows={2} value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} />
              </Field>
            </DialogBody>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button type="submit" loading={editSaving}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
