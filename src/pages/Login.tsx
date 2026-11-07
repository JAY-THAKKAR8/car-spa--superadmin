import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { apiErrorMessage } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/label';

export default function Login() {
  const { admin, login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  if (admin) return <Navigate to="/" replace />;

  async function submit() {
    setBusy(true);
    try {
      await login(phone, password);
      navigate('/');
    } catch (err) {
      toast(apiErrorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-background px-4">
      <Card className="w-full max-w-sm p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-brand-soft text-primary">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h1 className="text-[17px] font-semibold tracking-[-0.02em]">Carnmore Platform</h1>
            <p className="text-[13px] text-muted-foreground">Super-admin sign in</p>
          </div>
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <Field label="Phone" htmlFor="phone" required>
            <Input id="phone" name="sa-phone" type="tel" inputMode="tel" autoComplete="off" maxLength={20} autoFocus value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d+\-\s]/g, ''))} />
          </Field>
          <Field label="Password" htmlFor="password" required>
            <Input id="password" name="sa-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <Button type="submit" loading={busy} disabled={!phone.trim() || !password}>
            Log in
          </Button>
        </form>
      </Card>
    </div>
  );
}
