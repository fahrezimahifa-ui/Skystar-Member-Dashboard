import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useAuth } from '../store/auth';
import { Card, CardHeader, Badge, Button, Avatar, Input, Label, Select } from '../components/ui';
import { Settings as SettingsIcon, UserCog, Palette, FlaskConical, LogOut } from 'lucide-react';
import type { Stage, Role } from '../data/types';
import { toast } from '../lib/toast';

export function Settings() {
  const { user, stage, setStage, setUser } = useStore();
  const { signOut } = useAuth();
  const [name, setName] = useState(user.name);
  const [status, setStatus] = useState(user.status);

  const save = () => {
    setUser({ name, status });
    toast.success('Profile saved');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-ink flex items-center gap-2"><SettingsIcon size={22} className="text-teal" /> Settings</h2>
        <p className="text-ink-muted mt-1">Manage your profile, role, and workspace.</p>
      </div>

      <Card>
        <CardHeader icon={<UserCog size={18} />} title="Profile" />
        <div className="flex items-center gap-4 mb-4">
          <Avatar name={user.name} size="xl" />
          <div><div className="font-semibold text-ink">{user.name}</div><div className="text-sm text-ink-muted">Username account · no email</div></div>
          <Badge tone="teal" className="ml-auto">{user.role}</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><Label>Username</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><Label>Role</Label><Select value={user.role} onChange={(v) => { setUser({ role: v as Role }); toast.success('Role updated'); }} options={(['Member', 'Team Lead', 'Admin'] as Role[]).map((r) => ({ value: r, label: r }))} /></div>
          <div><Label>Status</Label><Input value={status} onChange={(e) => setStatus(e.target.value)} /></div>
        </div>
        <Button className="mt-4" onClick={save}>Save changes</Button>
      </Card>

      <Card>
        <CardHeader icon={<Palette size={18} />} title="Appearance" />
        <p className="text-sm text-ink-soft">The interface uses the Teamrise brand palette (teal, yellow, blue) on a neutral canvas. Light theme is active.</p>
        <div className="flex gap-2 mt-3">
          <span className="w-8 h-8 rounded-lg bg-teal" title="Teal #3B988F" />
          <span className="w-8 h-8 rounded-lg bg-yellow" title="Yellow #F4DB73" />
          <span className="w-8 h-8 rounded-lg bg-blue" title="Blue #2682B5" />
          <span className="w-8 h-8 rounded-lg bg-canvas border border-line" title="Canvas" />
        </div>
      </Card>

      <Card>
        <CardHeader icon={<FlaskConical size={18} />} title="Demo · Simulate Stage" subtitle="See how the dashboard adapts (state logic)" />
        <p className="text-sm text-ink-soft mb-3">Switch the current stage to preview the dashboard's primary CTA and empty states for each phase of the journey.</p>
        <Select value={stage} onChange={(v) => setStage(v as Stage)} className="max-w-xs"
          options={['No Team', 'Discover', 'Team Formed', 'Validating', 'Building', 'Launch'].map((s) => ({ value: s, label: s }))} />
      </Card>

      <Card>
        <CardHeader title="Account" />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => void signOut()}><LogOut size={16} /> Log out</Button>
          <Button variant="ghost" className="text-red-500" onClick={() => toast.info('Account deletion is managed by your team admin.')}>Delete account</Button>
        </div>
      </Card>
    </div>
  );
}
