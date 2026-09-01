import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card, CardHeader, ProgressBar, Badge, Button, Tabs, Select, Input, Label, Avatar, Modal } from '../components/ui';
import { MBTI_TYPES, MBTI_QUESTIONS, SKILL_OPTIONS, INTEREST_OPTIONS } from '../data/mbti';
import { Compass, ClipboardCheck, UserCheck, Lightbulb, Plus, Check } from 'lucide-react';
import { cn } from '../lib/utils';

type Tab = 'overview' | 'mbti' | 'profile' | 'results';

export function Discover() {
  const [tab, setTab] = useState<Tab>('overview');
  const user = useStore((s) => s.user);
  const setMBTI = useStore((s) => s.setMBTI);
  const addSkill = useStore((s) => s.addSkill);
  const updateSkill = useStore((s) => s.updateSkill);

  const prof = user.profile;
  const mbti = prof.mbti ? MBTI_TYPES[prof.mbti] : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-ink flex items-center gap-2"><Compass size={22} className="text-teal" /> Discover</h2>
        <p className="text-ink-muted mt-1">Understand yourself before we match you with complementary teammates.</p>
      </div>

      <Tabs
        tabs={[
          { key: 'overview', label: 'Overview' },
          { key: 'mbti', label: 'Assessment' },
          { key: 'profile', label: 'Personal Profile' },
          { key: 'results', label: 'Discover Results' },
        ]}
        active={tab}
        onChange={(t) => setTab(t as Tab)}
      />

      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader icon={<ClipboardCheck size={18} />} title="Profile Completion" subtitle="Complete these to unlock teammate matching" />
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl font-bold text-teal">{user.profileCompletion}%</div>
              <div className="flex-1">
                <ProgressBar value={user.profileCompletion} height="h-3" />
                <p className="text-xs text-ink-muted mt-2">Finish your assessment and profile to improve match quality.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Metric label="Assessment" value={`${user.assessmentCompletion}%`} done={user.assessmentCompletion === 100} />
              <Metric label="Strengths found" value={`${user.strengths.length}`} done />
              <Metric label="Skills added" value={`${prof.skills.length}`} done={prof.skills.length > 0} />
              <Metric label="Interests" value={`${prof.interests.length}`} done={prof.interests.length > 0} />
            </div>
            <Button className="mt-5" onClick={() => setTab('mbti')}>Continue Assessment</Button>
          </Card>

          <Card>
            <CardHeader icon={<UserCheck size={18} />} title="What we know" />
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between"><span className="text-ink-muted">MBTI</span><span className="font-medium">{prof.mbti ?? '—'}</span></li>
              <li className="flex justify-between"><span className="text-ink-muted">Experience</span><span className="font-medium">{prof.experience.workExperienceYears} yrs</span></li>
              <li className="flex justify-between"><span className="text-ink-muted">Availability</span><span className="font-medium">{prof.availability.hoursPerWeek}h/wk</span></li>
              <li className="flex justify-between"><span className="text-ink-muted">Risk tolerance</span><span className="font-medium">{prof.entrepreneurial.riskTolerance}</span></li>
            </ul>
          </Card>
        </div>
      )}

      {tab === 'mbti' && <MBTIPanel mbti={mbti} setMBTI={setMBTI} />}

      {tab === 'profile' && (
        <ProfileForms
          prof={prof}
          addSkill={addSkill}
          updateSkill={updateSkill}
        />
      )}

      {tab === 'results' && <DiscoverResults />}
    </div>
  );
}

function Metric({ label, value, done }: { label: string; value: string; done: boolean }) {
  return (
    <div className="rounded-lg border border-line p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-ink-muted">{label}</span>
        {done ? <Check size={14} className="text-teal" /> : <span className="w-1.5 h-1.5 rounded-full bg-yellow" />}
      </div>
      <div className="text-lg font-semibold text-ink mt-1">{value}</div>
    </div>
  );
}

/* ---------- MBTI ---------- */
function MBTIPanel({ mbti, setMBTI }: { mbti: any; setMBTI: any }) {
  const user = useStore((s) => s.user);
  const conf = user.profile.mbtiConfidence ?? 85;
  const [mode, setMode] = useState<'choose' | 'quiz'>('choose');
  const [selected, setSelected] = useState('');
  const [confidence, setConfidence] = useState(85);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [source, setSource] = useState<'Self-reported' | 'Professionally assessed'>('Self-reported');
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader title="How would you like to assess?" />
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button onClick={() => setMode('choose')} className={cn('rounded-lg border p-3 text-sm font-medium', mode === 'choose' ? 'border-teal bg-teal-50 text-teal-700' : 'border-line text-ink-soft')}>Enter a result</button>
          <button onClick={() => { setMode('quiz'); setQuizOpen(true); }} className={cn('rounded-lg border p-3 text-sm font-medium', mode === 'quiz' ? 'border-teal bg-teal-50 text-teal-700' : 'border-line text-ink-soft')}>Take the quiz</button>
        </div>

        {mode === 'choose' && (
          <div className="space-y-3">
            <div>
              <Label>MBTI Type</Label>
              <Select value={selected} onChange={setSelected} options={Object.values(MBTI_TYPES).map((m) => ({ value: m.type, label: `${m.type} · ${m.title}` }))} placeholder="Select your type" />
            </div>
            <div>
              <Label>Confidence ({confidence}%)</Label>
              <input type="range" min={0} max={100} value={confidence} onChange={(e) => setConfidence(+e.target.value)} className="w-full accent-teal" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
              <div>
                <Label>Source</Label>
                <Select value={source} onChange={(v) => setSource(v as any)} options={[{ value: 'Self-reported', label: 'Self-reported' }, { value: 'Professionally assessed', label: 'Professionally assessed' }]} />
              </div>
            </div>
            <Button disabled={!selected} onClick={() => setMBTI(selected, confidence, date, source)}>Save result</Button>
          </div>
        )}
        {mode === 'quiz' && !quizOpen && <p className="text-sm text-ink-muted">Open the quiz to get your type. Your result will be saved automatically.</p>}
      </Card>

      <Card className={mbti ? 'bg-teal-50/50' : ''}>
        <CardHeader title="Your Result" />
        {mbti ? (
          <div className="text-center">
            <div className="text-5xl font-bold text-teal">{mbti.type}</div>
            <div className="text-xl font-semibold text-ink mt-1">{mbti.title}</div>
            <p className="text-sm text-ink-muted mt-3 max-w-md mx-auto">{mbti.description}</p>
            <div className="mt-4 flex justify-center gap-2">
              <Badge tone="teal">Confidence {conf}%</Badge>
            </div>
            <p className="text-xs text-ink-muted mt-4">MBTI is one of several inputs into matching — not the only basis.</p>
          </div>
        ) : (
          <p className="text-sm text-ink-muted">No result yet. Enter one or take the quiz.</p>
        )}
      </Card>

      <QuizModal open={quizOpen} onClose={() => setQuizOpen(false)} onComplete={(type) => { setMBTI(type, 90, new Date().toISOString().slice(0, 10), 'Self-reported'); setSelected(type); }} />
    </div>
  );
}

function QuizModal({ open, onClose, onComplete }: { open: boolean; onClose: () => void; onComplete: (type: string) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const total = MBTI_QUESTIONS.length;

  const finish = () => {
    const dims: Record<string, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    Object.entries(answers).forEach(([, v]) => { dims[v]++; });
    const type =
      (dims.E >= dims.I ? 'E' : 'I') + (dims.S >= dims.N ? 'S' : 'N') + (dims.T >= dims.F ? 'T' : 'F') + (dims.J >= dims.P ? 'J' : 'P');
    onComplete(type);
    setStep(0); setAnswers({}); onClose();
  };

  if (!open) return null;
  const q = MBTI_QUESTIONS[step];

  return (
    <Modal open={open} onClose={onClose} title={`MBTI Quiz (${step + 1}/${total})`}>
      <p className="text-sm font-medium text-ink mb-4">{q.question}</p>
      <div className="space-y-2">
        {[q.aDim, q.bDim].map((dim, i) => (
          <button key={i} onClick={() => { setAnswers((a) => ({ ...a, [q.id]: dim })); }}
            className={cn('w-full text-left rounded-lg border p-3 text-sm', answers[q.id] === dim ? 'border-teal bg-teal-50 text-teal-700' : 'border-line hover:border-teal')}>
            {i === 0 ? q.a : q.b}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-5">
        <Button variant="ghost" onClick={() => { setStep(0); setAnswers({}); onClose(); }}>Cancel</Button>
        <div className="flex gap-2">
          {step > 0 && <Button variant="outline" onClick={() => setStep((s) => s - 1)}>Back</Button>}
          {step < total - 1
            ? <Button disabled={!answers[q.id]} onClick={() => setStep((s) => s + 1)}>Next</Button>
            : <Button disabled={!answers[q.id]} onClick={finish}>See result</Button>}
        </div>
      </div>
    </Modal>
  );
}

/* ---------- Profile forms ---------- */
function ProfileForms({ prof, addSkill, updateSkill }: any) {
  const [newSkill, setNewSkill] = useState('');
  const [newProf, setNewProf] = useState('Intermediate');
  const [interests, setInterests] = useState<string[]>(prof.interests);

  const toggleInterest = (i: string) => {
    setInterests((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Skills" subtitle="Rate your proficiency in each area" />
        <div className="space-y-2">
          {prof.skills.map((s: any) => (
            <div key={s.name} className="flex items-center gap-3">
              <span className="w-44 text-sm text-ink truncate">{s.name}</span>
              <Select value={s.proficiency} onChange={(v) => updateSkill(s.name, v)} className="flex-1"
                options={['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((p) => ({ value: p, label: p }))} />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <Select value={newSkill} onChange={setNewSkill} options={SKILL_OPTIONS.map((s) => ({ value: s, label: s }))} placeholder="Add a skill" className="flex-1" />
          <Select value={newProf} onChange={setNewProf} options={['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((p) => ({ value: p, label: p }))} />
          <Button disabled={!newSkill} onClick={() => { addSkill(newSkill, newProf); setNewSkill(''); }}><Plus size={16} /></Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Interests" subtitle="Select areas you care about" />
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((i) => (
              <button key={i} onClick={() => toggleInterest(i)}
                className={cn('rounded-full border px-3 py-1.5 text-sm', interests.includes(i) ? 'border-teal bg-teal-50 text-teal-700' : 'border-line text-ink-soft hover:border-teal')}>
                {i}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Availability" subtitle="Critical for team matching" />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Field label="Hours / week" value={`${prof.availability.hoursPerWeek}h`} />
            <Field label="Preferred" value={prof.availability.preferredHours} />
            <Field label="Location" value={prof.availability.location} />
            <Field label="Timezone" value={prof.availability.timezone} />
            <Field label="Commitment" value={prof.availability.commitment} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Experience" />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Field label="Work experience" value={`${prof.experience.workExperienceYears} yrs`} />
            <Field label="Previous businesses" value={`${prof.experience.previousBusinesses}`} />
            <Field label="Projects" value={`${prof.experience.projects}`} />
            <Field label="Internships" value={`${prof.experience.internships}`} />
            <Field label="Leadership" value={prof.experience.leadershipExperience ? 'Yes' : 'No'} />
            <Field label="Entrepreneurial" value={prof.experience.entrepreneurialExperience ? 'Yes' : 'No'} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Working Style" />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Field label="Leadership" value={prof.workingStyle.leadership} />
            <Field label="Independence" value={prof.workingStyle.independence} />
            <Field label="Structure" value={prof.workingStyle.structure} />
            <Field label="Decisions" value={prof.workingStyle.decision} />
            <Field label="Communication" value={prof.workingStyle.communication} />
            <Field label="Conflicts" value={prof.workingStyle.conflict} />
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Entrepreneurial Preferences" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          <Field label="Desired role" value={prof.entrepreneurial.desiredRole} />
          <Field label="Company size" value={prof.entrepreneurial.companySize} />
          <Field label="Risk tolerance" value={prof.entrepreneurial.riskTolerance} />
          <Field label="Growth ambition" value={prof.entrepreneurial.growthAmbition} />
          <Field label="Stage preference" value={prof.entrepreneurial.stagePreference} />
          <Field label="Decision role" value={prof.entrepreneurial.decisionRole} />
          <Field label="Equity" value={prof.entrepreneurial.equityExpectation} />
          <Field label="Wants founder" value={prof.entrepreneurial.wantsFounder ? 'Yes' : 'No'} />
        </div>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line p-2.5">
      <div className="text-[11px] text-ink-muted">{label}</div>
      <div className="font-medium text-ink mt-0.5 truncate">{value}</div>
    </div>
  );
}

/* ---------- Results ---------- */
function DiscoverResults() {
  const user = useStore((s) => s.user);
  const prof = user.profile;
  const mbti = prof.mbti ? MBTI_TYPES[prof.mbti] : null;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 bg-teal-50/50">
          <CardHeader icon={<Lightbulb size={18} />} title="Personality" />
          {mbti ? (
            <>
              <div className="text-4xl font-bold text-teal">{mbti.type}</div>
              <div className="font-semibold text-ink">{mbti.title}</div>
              <p className="text-sm text-ink-muted mt-2">{mbti.description}</p>
            </>
          ) : <p className="text-sm text-ink-muted">Complete the assessment to see your type.</p>}
        </Card>
        <Card>
          <CardHeader title="Strengths" />
          <div className="flex flex-wrap gap-2">
            {user.strengths.map((s) => <Badge key={s} tone="teal">{s}</Badge>)}
          </div>
        </Card>
        <Card>
          <CardHeader title="Development Areas" />
          <div className="flex flex-wrap gap-2">
            {user.developmentAreas.map((s) => <Badge key={s} tone="yellow">{s}</Badge>)}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader icon={<UserCheck size={18} />} title="Business Strengths" />
        <p className="text-ink-soft">{user.businessStrengths}</p>
      </Card>

      <Card>
        <CardHeader title="Suggested Roles" subtitle="Recommendations, not permanent assignments" />
        <div className="flex flex-wrap gap-2">
          {user.suggestedRoles.map((r) => (
            <div key={r} className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink">
              <Avatar name={r} size="sm" /> {r}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
