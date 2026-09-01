import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Card, CardHeader, ProgressBar, Badge, Button, Avatar, Modal, EmptyState } from '../components/ui';
import { SmartRecommendations } from '../components/common/SmartRecommendations';
import { HeartHandshake, Compass, Puzzle, Users, Plus, Check, X, UserPlus, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Recommendation } from '../data/types';

export function Validate() {
  const navigate = useNavigate();
  const { recommendations, capabilities, candidateIds, toggleCandidate, clearCandidate, formTeam, setInviteRec, setSaveRec, setRejectRec } = useStore();
  const [forming, setForming] = useState(false);

  const pending = recommendations.filter((r) => r.state === 'pending');
  const strengths = capabilities.filter((c) => c.score >= 70);
  const gaps = capabilities.filter((c) => c.score < 45);
  const selected = recommendations.filter((r) => candidateIds.includes(r.id));
  const teamMatch = selected.length ? Math.round(selected.reduce((a, r) => a + r.match, 0) / selected.length) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-ink flex items-center gap-2"><HeartHandshake size={22} className="text-teal" /> Validate</h2>
        <p className="text-ink-muted mt-1">Find teammates who complement your team and can work effectively together.</p>
      </div>

      {/* Compatibility vs Complementarity explainer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-teal-50/50 border-teal-100">
          <CardHeader icon={<Users size={18} className="text-teal" />} title="Compatibility" />
          <p className="text-sm text-ink-soft">How well do these people work together? Measured through working style, values, and personality fit.</p>
        </Card>
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader icon={<Puzzle size={18} className="text-yellow-600" />} title="Complementarity" />
          <p className="text-sm text-ink-soft">What capabilities does this person provide that the current team is missing? This is how we close gaps.</p>
        </Card>
      </div>

      {gaps.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50/40">
          <div className="flex items-start gap-3">
            <Sparkles size={18} className="text-yellow-600 mt-0.5" />
            <div>
              <div className="font-semibold text-ink">Your current team is technically strong but lacks commercial expertise.</div>
              <p className="text-sm text-ink-soft mt-1">We recommend members with <b>{gaps.map((g) => g.area).join(', ').toLowerCase()}</b> experience. {pending.length} recommended members match this gap.</p>
            </div>
          </div>
        </Card>
      )}

      {/* Recommended members */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-semibold text-ink">Recommended Members</h3>
          {pending.length === 0 && <Card><EmptyState icon={<HeartHandshake size={22} />} title="No pending recommendations" description="You've acted on all current matches. Check back for new ones." /></Card>}
          {pending.map((r) => (
            <MemberCard key={r.id} r={r} selected={candidateIds.includes(r.id)} onToggle={() => toggleCandidate(r.id)}
              onInvite={() => setInviteRec(r.id)} onSave={() => setSaveRec(r.id)} onReject={() => setRejectRec(r.id)} />
          ))}
        </div>

        <div className="space-y-4">
          {/* Candidate team */}
          <Card>
            <CardHeader icon={<UserPlus size={18} />} title="Candidate Team" subtitle={`${selected.length} selected`} />
            {selected.length === 0 ? (
              <p className="text-sm text-ink-muted">Select members above to build a temporary candidate team and see combined compatibility.</p>
            ) : (
              <>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selected.map((s) => <Avatar key={s.id} name={s.name} size="md" />)}
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-ink-muted">Team Compatibility</span>
                  <span className="font-bold text-teal">{teamMatch}%</span>
                </div>
                <ProgressBar value={teamMatch} color="teal" className="mb-3" />
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => setForming(true)} disabled={selected.length < 2}>Form Team</Button>
                  <Button size="sm" variant="ghost" onClick={clearCandidate}>Clear</Button>
                </div>
              </>
            )}
          </Card>

          <Card>
            <CardHeader icon={<Compass size={18} />} title="Team Composition" />
            <div className="space-y-2.5">
              {capabilities.map((c) => (
                <div key={c.area} className="flex items-center gap-2">
                  <span className="w-24 text-xs text-ink-soft truncate">{c.area}</span>
                  <ProgressBar value={c.score} color={c.score >= 70 ? 'teal' : c.score < 45 ? 'red' : 'yellow'} className="flex-1" height="h-1.5" />
                  <span className="w-8 text-right text-[11px] text-ink-muted">{c.score}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-line text-sm">
              <div className="text-ink-muted">Strengths: <span className="text-teal-700 font-medium">{strengths.map((s) => s.area).join(', ')}</span></div>
              <div className="text-ink-muted mt-1">Gaps: <span className="text-red-500 font-medium">{gaps.map((g) => g.area).join(', ') || 'None'}</span></div>
            </div>
          </Card>

          <SmartRecommendations compact />
        </div>
      </div>

      <Modal open={forming} onClose={() => setForming(false)} title="Form official team" size="sm"
        footer={<><Button variant="ghost" onClick={() => setForming(false)}>Cancel</Button><Button onClick={() => { formTeam(); setForming(false); navigate('/team'); }}>Confirm & Form</Button></>}>
        <p className="text-sm text-ink-soft">This creates an official team with the {selected.length} selected members, assigns roles, and unlocks the Build workspace.</p>
        <div className="flex flex-wrap gap-2 mt-3">{selected.map((s) => <Badge key={s.id} tone="teal">{s.name} · {s.preferredRole}</Badge>)}</div>
      </Modal>
    </div>
  );
}

function MemberCard({ r, selected, onToggle, onInvite, onSave, onReject }: {
  r: Recommendation; selected: boolean; onToggle: () => void; onInvite: () => void; onSave: () => void; onReject: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Card className={cn('relative', selected && 'ring-2 ring-teal')}>
      <div className="flex items-start gap-4">
        <Avatar name={r.name} size="xl" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-ink">{r.name}</h4>
            <Badge tone="teal">{r.mbti}</Badge>
            <Badge tone="yellow">Team Match {r.match}%</Badge>
          </div>
          <p className="text-sm text-ink-muted mt-0.5">{r.headline}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {r.skills.map((s) => <Badge key={s} tone="blue">{s}</Badge>)}
          </div>
          <div className="text-xs text-ink-muted mt-2">{r.experience} · {r.availability} · wants <b className="text-ink-soft">{r.preferredRole}</b></div>

          <button onClick={() => setOpen((o) => !o)} className="text-xs text-teal mt-2 hover:underline">Show match breakdown</button>
          {open && (
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
              {Object.entries(r.scores).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2">
                  <span className="w-40 text-[11px] text-ink-soft capitalize truncate">{k.replace(/([A-Z])/g, ' $1')}</span>
                  <ProgressBar value={v} color="blue" className="flex-1" height="h-1.5" />
                  <span className="w-7 text-right text-[11px] text-ink-muted">{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 items-end">
          <Button size="sm" variant={selected ? 'secondary' : 'outline'} onClick={onToggle}>{selected ? <><Check size={14} /> Selected</> : <><Plus size={14} /> Add</>}</Button>
          <Button size="sm" variant="primary" onClick={onInvite}>Invite</Button>
          <div className="flex gap-1">
            <button onClick={onSave} title="Save" className="w-7 h-7 rounded-md border border-line flex items-center justify-center text-ink-muted hover:text-teal hover:border-teal"><Check size={14} /></button>
            <button onClick={onReject} title="Reject" className="w-7 h-7 rounded-md border border-line flex items-center justify-center text-ink-muted hover:text-red-500 hover:border-red-300"><X size={14} /></button>
          </div>
        </div>
      </div>
    </Card>
  );
}
