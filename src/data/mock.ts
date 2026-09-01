import type {
  User, Team, Business, Milestone, Task, Hypothesis, Persona, Goal,
  Decision, Issue, Activity, AppNotification, Recommendation, TeamValue,
  CapabilityScore, KPI,
} from './types';

export const currentUserId = 'u-alex';

export const users: User[] = [
  {
    id: 'u-alex',
    name: 'Alex Rivera',
    avatar: 'AR',
    role: 'Team Lead',
    status: 'Active · Building',
    email: 'alex@campusgigs.app',
    profileCompletion: 82,
    assessmentCompletion: 100,
    strengths: ['Strategic thinking', 'Leadership', 'Problem solving'],
    developmentAreas: ['Delegation', 'Patience', 'Active listening'],
    businessStrengths: 'You appear particularly suited to product strategy, leadership, and business development.',
    suggestedRoles: ['CEO / Founder', 'Product Lead', 'Business Development'],
    profile: {
      mbti: 'ENTJ',
      mbtiConfidence: 85,
      mbtiDate: '2026-06-14',
      mbtiSource: 'Professionally assessed',
      skills: [
        { name: 'Product Management', proficiency: 'Expert' },
        { name: 'Leadership', proficiency: 'Advanced' },
        { name: 'Programming', proficiency: 'Intermediate' },
        { name: 'Business Development', proficiency: 'Advanced' },
        { name: 'Design', proficiency: 'Beginner' },
      ],
      experience: {
        previousBusinesses: 1, workExperienceYears: 4, projects: 8,
        internships: 2, leadershipExperience: true,
        industryKnowledge: ['Education', 'E-commerce', 'Technology'],
        entrepreneurialExperience: true,
      },
      interests: ['Education', 'Technology', 'E-commerce', 'AI'],
      workingStyle: {
        leadership: 'Visionary / delegative', independence: 'Collaborative',
        structure: 'Flexible', decision: 'Fast', communication: 'Async + weekly sync',
        meetingFrequency: 'Weekly', conflict: 'Direct, solution-focused',
      },
      availability: {
        hoursPerWeek: 25, preferredHours: 'Evenings', location: 'Remote',
        timezone: 'GMT-5', commitment: 'High',
      },
      entrepreneurial: {
        desiredRole: 'CEO / Founder', companySize: 'Small (2-10)',
        riskTolerance: 'Medium-High', growthAmbition: 'High (scale fast)',
        stagePreference: 'Early-stage', wantsFounder: true,
        decisionRole: 'Final decision maker', equityExpectation: 'Significant (>20%)',
      },
    },
  },
  {
    id: 'u-sarah',
    name: 'Sarah Chen',
    avatar: 'SC',
    role: 'Member',
    status: 'Active · Building',
    email: 'sarah@campusgigs.app',
    profileCompletion: 76,
    assessmentCompletion: 100,
    strengths: ['Empathy', 'Detail orientation', 'Research'],
    developmentAreas: ['Public speaking', 'Delegation'],
    businessStrengths: 'Suited to customer research, UX, and operations.',
    suggestedRoles: ['COO', 'Customer Success Lead', 'Operations'],
    profile: {
      mbti: 'INFJ', skills: [
        { name: 'Research', proficiency: 'Advanced' },
        { name: 'Design', proficiency: 'Intermediate' },
        { name: 'Operations', proficiency: 'Advanced' },
      ],
      experience: { previousBusinesses: 0, workExperienceYears: 3, projects: 5, internships: 3, leadershipExperience: false, industryKnowledge: ['Education', 'Healthcare'], entrepreneurialExperience: false },
      interests: ['Education', 'Healthcare', 'Sustainability'],
      workingStyle: { leadership: 'Supportive', independence: 'Collaborative', structure: 'Structured', decision: 'Deliberate', communication: 'Async', meetingFrequency: 'Weekly', conflict: 'Mediate' },
      availability: { hoursPerWeek: 20, preferredHours: 'Daytime', location: 'Remote', timezone: 'GMT-5', commitment: 'Medium' },
      entrepreneurial: { desiredRole: 'COO', companySize: 'Small', riskTolerance: 'Medium', growthAmbition: 'Balanced', stagePreference: 'Early-stage', wantsFounder: false, decisionRole: 'Contributor', equityExpectation: 'Moderate' },
    },
  },
  {
    id: 'u-daniel',
    name: 'Daniel Okafor',
    avatar: 'DO',
    role: 'Member',
    status: 'Active · Building',
    email: 'daniel@campusgigs.app',
    profileCompletion: 70,
    assessmentCompletion: 100,
    strengths: ['Technical depth', 'Focus', 'Reliability'],
    developmentAreas: ['Business acumen', 'Design sense'],
    businessStrengths: 'Suited to engineering leadership and architecture.',
    suggestedRoles: ['CTO', 'Technical Lead', 'Engineering'],
    profile: {
      mbti: 'ISTP', skills: [
        { name: 'Programming', proficiency: 'Expert' },
        { name: 'Engineering', proficiency: 'Advanced' },
        { name: 'Data Science', proficiency: 'Intermediate' },
      ],
      experience: { previousBusinesses: 0, workExperienceYears: 5, projects: 12, internships: 1, leadershipExperience: false, industryKnowledge: ['Technology', 'AI'], entrepreneurialExperience: false },
      interests: ['Technology', 'AI', 'Automotive'],
      workingStyle: { leadership: 'Hands-off', independence: 'Independent', structure: 'Flexible', decision: 'Deliberate', communication: 'Async', meetingFrequency: 'Bi-weekly', conflict: 'Avoid' },
      availability: { hoursPerWeek: 30, preferredHours: 'Evenings', location: 'Remote', timezone: 'GMT+1', commitment: 'High' },
      entrepreneurial: { desiredRole: 'CTO', companySize: 'Small', riskTolerance: 'Medium', growthAmbition: 'Balanced', stagePreference: 'Early-stage', wantsFounder: false, decisionRole: 'Technical contributor', equityExpectation: 'Moderate' },
    },
  },
  {
    id: 'u-mia',
    name: 'Mia Lindqvist',
    avatar: 'ML',
    role: 'Member',
    status: 'Active · Building',
    email: 'mia@campusgigs.app',
    profileCompletion: 64,
    assessmentCompletion: 100,
    strengths: ['Creativity', 'Communication', 'Branding'],
    developmentAreas: ['Finance', 'Technical depth'],
    businessStrengths: 'Suited to marketing, brand, and growth.',
    suggestedRoles: ['CMO', 'Marketing Lead', 'Design'],
    profile: {
      mbti: 'ENFP', skills: [
        { name: 'Marketing', proficiency: 'Advanced' },
        { name: 'Design', proficiency: 'Intermediate' },
        { name: 'Sales', proficiency: 'Intermediate' },
      ],
      experience: { previousBusinesses: 0, workExperienceYears: 2, projects: 4, internships: 4, leadershipExperience: false, industryKnowledge: ['E-commerce', 'Entertainment'], entrepreneurialExperience: false },
      interests: ['E-commerce', 'Entertainment', 'Sustainability'],
      workingStyle: { leadership: 'Inspirational', independence: 'Collaborative', structure: 'Flexible', decision: 'Fast', communication: 'Sync-heavy', meetingFrequency: 'Weekly', conflict: 'Open discussion' },
      availability: { hoursPerWeek: 15, preferredHours: 'Daytime', location: 'Hybrid', timezone: 'GMT+1', commitment: 'Medium' },
      entrepreneurial: { desiredRole: 'CMO', companySize: 'Small', riskTolerance: 'Medium', growthAmbition: 'High', stagePreference: 'Early-stage', wantsFounder: false, decisionRole: 'Contributor', equityExpectation: 'Moderate' },
    },
  },
];

export const team: Team = {
  id: 't-cg',
  name: 'Campus Gigs',
  avatar: 'CG',
  description: 'A verified freelance marketplace connecting university students with real, vetted opportunities — replacing unreliable job boards.',
  businessConcept: 'Marketplace for verified student freelance work',
  createdAt: '2026-05-02',
  status: 'Building',
  compatibilityScore: 91,
  members: [
    { userId: 'u-alex', name: 'Alex Rivera', avatar: 'AR', mbti: 'ENTJ', role: 'CEO / Founder', skills: ['Product', 'Leadership', 'BD'], responsibilities: ['Vision', 'Strategy', 'Fundraising'], availability: '25h/wk', contact: 'alex@campusgigs.app', contribution: 82, currentTasks: 4 },
    { userId: 'u-sarah', name: 'Sarah Chen', avatar: 'SC', mbti: 'INFJ', role: 'COO', skills: ['Research', 'Operations', 'UX'], responsibilities: ['Customer research', 'Ops'], availability: '20h/wk', contact: 'sarah@campusgigs.app', contribution: 55, currentTasks: 3 },
    { userId: 'u-daniel', name: 'Daniel Okafor', avatar: 'DO', mbti: 'ISTP', role: 'CTO', skills: ['Engineering', 'Data'], responsibilities: ['Architecture', 'Backend'], availability: '30h/wk', contact: 'daniel@campusgigs.app', contribution: 94, currentTasks: 5 },
    { userId: 'u-mia', name: 'Mia Lindqvist', avatar: 'ML', mbti: 'ENFP', role: 'CMO', skills: ['Marketing', 'Brand'], responsibilities: ['Growth', 'Brand'], availability: '15h/wk', contact: 'mia@campusgigs.app', contribution: 31, currentTasks: 2 },
  ],
};

export const business: Business = {
  name: 'Campus Gigs',
  valueProposition: 'We help university students find verified freelance opportunities without relying on traditional job boards.',
  stage: 'MVP Development',
  health: 84,
  progress: 67,
  lastUpdated: '2026-08-22',
  nextMilestone: 'MVP Launch',
  problem: 'University students struggle to find legitimate, flexible freelance work. Existing job boards are crowded with scams, irrelevant listings, and lack verification.',
  targetCustomer: 'University students (18-24) seeking flexible, skill-based freelance income and real experience.',
  solution: 'A mobile-first marketplace that verifies both students and posters, with skill-matched listings, escrow payments, and a reputation system.',
  uvp: 'Only platform that verifies student status and employer legitimacy before a single message is exchanged.',
  alternatives: 'General job boards (Indeed, LinkedIn), gig apps (Fiverr, Upwork), university career centers.',
  advantage: 'Trust-by-design verification + campus-native onboarding + zero upfront cost for students.',
  model: {
    revenueModel: 'Transaction fee (12%) on completed gigs + premium employer subscriptions',
    pricing: 'Free for students; employers pay per listing + 12% success fee; Pro employer $49/mo',
    customerAcquisition: 'Campus ambassadors, student community partnerships, TikTok/IG content',
    keyResources: 'Engineering team, brand, verification pipeline, campus partner network',
    keyPartners: 'University career centers, student clubs, payment providers',
    majorCosts: 'Engineering payroll, verification infra, marketing, legal/compliance',
    distributionChannels: 'Mobile app, web, campus ambassador program, student orgs',
    revenueAssumptions: '8% take-rate lift after trust features; 5,000 active gigs/mo by Q4',
  },
};

export const capabilities: CapabilityScore[] = [
  { area: 'Leadership', score: 88 },
  { area: 'Product', score: 80 },
  { area: 'Engineering', score: 90 },
  { area: 'Design', score: 70 },
  { area: 'Marketing', score: 35 },
  { area: 'Sales', score: 25 },
  { area: 'Finance', score: 40 },
  { area: 'Operations', score: 65 },
  { area: 'Legal', score: 20 },
  { area: 'Research', score: 75 },
];

export const milestones: Milestone[] = [
  { id: 'm1', order: 1, name: 'Team Formation', status: 'Completed', owner: 'Alex', deadline: '2026-05-10', completion: 100, tasks: 4, notes: 'Core team of 4 assembled.' },
  { id: 'm2', order: 2, name: 'Problem Identification', status: 'Completed', owner: 'Sarah', deadline: '2026-05-28', completion: 100, tasks: 6, notes: 'Validated via 18 interviews.' },
  { id: 'm3', order: 3, name: 'Customer Research', status: 'Completed', owner: 'Sarah', deadline: '2026-06-20', completion: 100, tasks: 9, notes: '212 survey responses.' },
  { id: 'm4', order: 4, name: 'Problem Validation', status: 'Completed', owner: 'Alex', deadline: '2026-07-08', completion: 100, tasks: 5, notes: 'Core problem confirmed.' },
  { id: 'm5', order: 5, name: 'Business Model', status: 'Completed', owner: 'Alex', deadline: '2026-07-25', completion: 100, tasks: 7, notes: 'Canvas finalized.' },
  { id: 'm6', order: 6, name: 'Prototype', status: 'Completed', owner: 'Daniel', deadline: '2026-08-12', completion: 100, tasks: 11, notes: 'Clickable prototype done.' },
  { id: 'm7', order: 7, name: 'MVP', status: 'In Progress', owner: 'Daniel', deadline: '2026-09-15', completion: 58, tasks: 14, notes: 'Backend + payments in progress.' },
  { id: 'm8', order: 8, name: 'Initial Customers', status: 'Not Started', owner: 'Mia', deadline: '2026-10-01', completion: 0, tasks: 6, notes: 'Waiting on MVP.' },
  { id: 'm9', order: 9, name: 'Product-Market Validation', status: 'Not Started', owner: 'Alex', deadline: '2026-11-15', completion: 0, tasks: 8, notes: '' },
  { id: 'm10', order: 10, name: 'Growth', status: 'Not Started', owner: 'Mia', deadline: '2027-01-30', completion: 0, tasks: 5, notes: '' },
];

export const tasks: Task[] = [
  { id: 't1', title: 'Build escrow payment flow', description: 'Integrate Stripe Connect for hold/release.', owner: 'Daniel', priority: 'Critical', deadline: '2026-09-05', status: 'In Progress', milestoneId: 'm7' },
  { id: 't2', title: 'Student verification API', description: 'Email + .edu domain + manual review.', owner: 'Daniel', priority: 'High', deadline: '2026-08-30', status: 'In Progress', milestoneId: 'm7' },
  { id: 't3', title: 'Employer onboarding screen', description: 'Posting wizard + identity check.', owner: 'Sarah', priority: 'High', deadline: '2026-09-02', status: 'To Do', milestoneId: 'm7' },
  { id: 't4', title: 'Landing page copy', description: 'Rewrite hero + trust section.', owner: 'Mia', priority: 'Medium', deadline: '2026-08-28', status: 'Review', milestoneId: 'm7' },
  { id: 't5', title: 'Pricing experiment design', description: 'A/B test 12% vs 10% fee.', owner: 'Alex', priority: 'Medium', deadline: '2026-09-10', status: 'To Do', milestoneId: 'm5' },
  { id: 't6', title: 'Campus ambassador outreach', description: 'Recruit 10 ambassadors at 5 schools.', owner: 'Mia', priority: 'High', deadline: '2026-09-20', status: 'To Do', milestoneId: 'm8' },
  { id: 't7', title: 'Security audit prep', description: 'Harden auth + data flows.', owner: 'Daniel', priority: 'Critical', deadline: '2026-09-12', status: 'To Do', milestoneId: 'm7' },
  { id: 't8', title: 'Customer interview #22-30', description: 'Deep-dive with employers.', owner: 'Sarah', priority: 'Medium', deadline: '2026-08-27', status: 'In Progress', milestoneId: 'm4' },
  { id: 't9', title: 'Referral incentive spec', description: 'Define student referral loop.', owner: 'Alex', priority: 'Low', deadline: '2026-09-18', status: 'Completed', milestoneId: 'm8' },
  { id: 't10', title: 'Brand guideline v2', description: 'Updated palette + logo usage.', owner: 'Mia', priority: 'Low', deadline: '2026-08-25', status: 'Review', milestoneId: 'm6' },
  { id: 't11', title: 'Compliance review (minor work)', description: 'Check local gig-law requirements.', owner: 'Alex', priority: 'High', deadline: '2026-09-08', status: 'To Do', milestoneId: 'm5' },
  { id: 't12', title: 'Analytics dashboard', description: 'Track gigs, conversion, retention.', owner: 'Daniel', priority: 'Medium', deadline: '2026-09-22', status: 'To Do', milestoneId: 'm9' },
];

export const hypotheses: Hypothesis[] = [
  { id: 'h1', statement: 'Students will pay nothing but expect verification.', status: 'Validated', evidence: '212/230 said free is required.', feedback: 'Strong.', interviews: 24 },
  { id: 'h2', statement: 'Employers want pre-vetted students.', status: 'Validated', evidence: '14/18 employers confirmed.', feedback: 'Top request.', interviews: 18 },
  { id: 'h3', statement: '12% success fee is acceptable to employers.', status: 'Testing', evidence: 'Pilot with 6 employers.', feedback: 'Mixed; some want <10%.', interviews: 6 },
  { id: 'h4', statement: 'Campus ambassadors drive the majority of supply.', status: 'Unvalidated', evidence: '', feedback: '', interviews: 0 },
  { id: 'h5', statement: 'Students prefer mobile over web.', status: 'Validated', evidence: '81% mobile in survey.', feedback: 'Build mobile-first.', interviews: 12 },
  { id: 'h6', statement: 'Employers will pay for faster matching.', status: 'Rejected', evidence: 'Only 2/18 interested.', feedback: 'Drop Pro-priority.', interviews: 18 },
];

export const personas: Persona[] = [
  { id: 'p1', name: 'Grad-seeking Grace', description: 'Senior student wanting portfolio-building gigs.', validated: true },
  { id: 'p2', name: 'Side-income Sam', description: 'Student needing flexible monthly income.', validated: true },
  { id: 'p3', name: 'Local Biz Laura', description: 'Small business wanting affordable help.', validated: true },
  { id: 'p4', name: 'Agency Alan', description: 'Agency wanting vetted junior talent.', validated: false },
];

export const goals: Goal[] = [
  { id: 'g1', type: 'Long-Term', text: 'Reach 10,000 active students by end of 2027.', owner: 'Alex', deadline: '2027-12-31', done: false },
  { id: 'g2', type: 'Quarterly', text: 'Launch MVP and onboard 500 students.', owner: 'Daniel', deadline: '2026-09-30', done: false },
  { id: 'g3', type: 'Weekly', text: 'Interview 20 potential employers.', owner: 'Sarah', deadline: '2026-08-29', done: false },
  { id: 'g4', type: 'Weekly', text: 'Ship escrow payment alpha.', owner: 'Daniel', deadline: '2026-09-05', done: false },
];

export const decisions: Decision[] = [
  { id: 'd1', decision: 'Target university students instead of professional freelancers.', date: '2026-06-10', responsible: 'Alex', reason: 'Interview data showed substantially stronger demand among university students.', alternatives: 'Target professionals; target both.', result: 'Confirmed by validation.' },
  { id: 'd2', decision: 'Use Stripe Connect for escrow rather than building payments.', date: '2026-07-30', responsible: 'Daniel', reason: 'Faster, compliant, reduces risk.', alternatives: 'Build custom ledger; use crypto.', result: 'In implementation.' },
  { id: 'd3', decision: 'Free for students, monetize employers.', date: '2026-07-22', responsible: 'Alex', reason: 'Supply-side growth requires zero friction for students.', alternatives: 'Subscription both sides.', result: 'Reflected in model.' },
];

export const issues: Issue[] = [
  { id: 'i1', category: 'Technical', description: 'Payment webhook occasionally duplicates events.', severity: 'High', owner: 'Daniel', status: 'In Progress', deadline: '2026-09-06', proposedSolution: 'Idempotency keys on handler.' },
  { id: 'i2', category: 'Team', description: 'Marketing tasks assigned to only one member (Mia).', severity: 'Medium', owner: 'Alex', status: 'Open', deadline: '2026-09-10', proposedSolution: 'Cross-train Sarah on growth.' },
  { id: 'i3', category: 'Financial', description: 'Runway covers 5 months at current burn.', severity: 'Medium', owner: 'Alex', status: 'Open', deadline: '2026-10-01', proposedSolution: 'Raise pre-seed or cut cost.' },
  { id: 'i4', category: 'Customer', description: 'Employer activation rate dropped to 40%.', severity: 'High', owner: 'Mia', status: 'Open', deadline: '2026-09-03', proposedSolution: 'Simplify posting flow.' },
];

export const activities: Activity[] = [
  { id: 'a1', text: 'Daniel completed Customer Interview #12.', date: '2026-08-24', type: 'task' },
  { id: 'a2', text: 'Sarah updated the business model.', date: '2026-08-23', type: 'business' },
  { id: 'a3', text: 'Mia completed the MVP prototype review.', date: '2026-08-22', type: 'milestone' },
  { id: 'a4', text: 'Team milestone "Problem Validation" completed.', date: '2026-08-20', type: 'milestone' },
  { id: 'a5', text: 'Alex logged decision: target students over professionals.', date: '2026-08-18', type: 'team' },
  { id: 'a6', text: 'Daniel started the escrow payment flow.', date: '2026-08-17', type: 'task' },
];

export const notifications: AppNotification[] = [
  { id: 'n1', category: 'deadline', title: 'MVP deadline approaching', body: 'MVP milestone is due in 21 days (Sep 15).', date: '2026-08-25', read: false, priority: 'high' },
  { id: 'n2', category: 'recommendation', title: '3 new teammate matches', body: 'Members matching your team’s sales/finance gap are available.', date: '2026-08-24', read: false, priority: 'high' },
  { id: 'n3', category: 'task', title: 'Task assigned to you', body: 'Alex assigned "Pricing experiment design" to you.', date: '2026-08-23', read: false, priority: 'medium' },
  { id: 'n4', category: 'validation', title: 'Hypothesis rejected', body: '"Employers pay for faster matching" was rejected.', date: '2026-08-22', read: true, priority: 'medium' },
  { id: 'n5', category: 'milestone', title: 'Milestone completed', body: '"Prototype" was marked completed.', date: '2026-08-21', read: true, priority: 'low' },
  { id: 'n6', category: 'overdue', title: 'Overdue: Brand guideline v2', body: 'Review due Aug 25 — please action.', date: '2026-08-25', read: false, priority: 'high' },
];

export const recommendations: Recommendation[] = [
  {
    id: 'r1', name: 'Priya Nair', avatar: 'PN', mbti: 'ESTJ', headline: 'Commercial operator who turns pipeline into revenue.',
    skills: ['Sales', 'Business Development', 'Finance'], experience: '6 yrs · 2 startups', interests: ['E-commerce', 'Finance', 'Technology'],
    availability: '20h/wk · Remote · GMT+5', preferredRole: 'Sales / BD Lead',
    match: 92, scores: { skillsComplementarity: 94, businessInterest: 91, workingStyle: 88, availability: 96, values: 90, personalityCompatibility: 86 },
    complementarity: ['Sales', 'Finance', 'Business Development'], bio: 'Former SaaS AE who scaled two marketplaces to profitability. Brings commercial rigor the team lacks.', state: 'pending',
  },
  {
    id: 'r2', name: 'Tomas Becker', avatar: 'TB', mbti: 'ENTP', headline: 'Growth-minded builder who loves early traction.',
    skills: ['Marketing', 'Growth', 'Sales'], experience: '4 yrs · 1 exit', interests: ['AI', 'E-commerce', 'Education'],
    availability: '18h/wk · Hybrid · GMT+1', preferredRole: 'Growth Lead',
    match: 88, scores: { skillsComplementarity: 90, businessInterest: 89, workingStyle: 85, availability: 92, values: 87, personalityCompatibility: 84 },
    complementarity: ['Marketing', 'Sales', 'Growth'], bio: 'Serial builder with a track record of low-cost growth loops. Complements Mia on marketing.', state: 'saved',
  },
  {
    id: 'r3', name: 'Hana Suzuki', avatar: 'HS', mbti: 'ISTJ', headline: 'Finance and ops backbone for early startups.',
    skills: ['Finance', 'Operations', 'Legal'], experience: '7 yrs · Big 4 + startup', interests: ['Finance', 'Logistics', 'Sustainability'],
    availability: '15h/wk · Remote · GMT+9', preferredRole: 'Finance Lead',
    match: 84, scores: { skillsComplementarity: 92, businessInterest: 80, workingStyle: 78, availability: 88, values: 85, personalityCompatibility: 80 },
    complementarity: ['Finance', 'Legal', 'Operations'], bio: 'Chartered accountant who keeps early startups solvent and compliant.', state: 'pending',
  },
  {
    id: 'r4', name: 'Leo Martins', avatar: 'LM', mbti: 'ENFJ', headline: 'People-first leader who aligns teams.',
    skills: ['Leadership', 'Sales', 'Customer Success'], experience: '5 yrs · scale-ups', interests: ['Education', 'Healthcare'],
    availability: '22h/wk · Remote · GMT-3', preferredRole: 'COO / People',
    match: 81, scores: { skillsComplementarity: 83, businessInterest: 82, workingStyle: 86, availability: 80, values: 90, personalityCompatibility: 84 },
    complementarity: ['Sales', 'Customer Success', 'Leadership'], bio: 'Operator who scales teams and culture. Strong values alignment with the group.', state: 'pending',
  },
];

export const teamValues: TeamValue[] = [
  { id: 'v1', name: 'Transparency', description: 'Default to open information sharing.', alignment: { 'u-alex': 95, 'u-sarah': 90, 'u-daniel': 80, 'u-mia': 88 } },
  { id: 'v2', name: 'Speed', description: 'Bias to action and momentum.', alignment: { 'u-alex': 90, 'u-sarah': 70, 'u-daniel': 85, 'u-mia': 92 } },
  { id: 'v3', name: 'Quality', description: 'Do it right, not just fast.', alignment: { 'u-alex': 78, 'u-sarah': 95, 'u-daniel': 92, 'u-mia': 70 } },
  { id: 'v4', name: 'Customer-first', description: 'Decisions start with the user.', alignment: { 'u-alex': 88, 'u-sarah': 96, 'u-daniel': 75, 'u-mia': 90 } },
  { id: 'v5', name: 'Sustainability', description: 'Build something that lasts.', alignment: { 'u-alex': 80, 'u-sarah': 88, 'u-daniel': 82, 'u-mia': 85 } },
];

export const kpis: KPI[] = [
  { label: 'Overall Completion', value: 67, unit: '%' },
  { label: 'Milestones Completed', value: 6, target: 10 },
  { label: 'Tasks Completed', value: 2, target: 12 },
  { label: 'Customer Interviews', value: 30, target: 50 },
  { label: 'Product Dev', value: 58, unit: '%' },
  { label: 'Revenue', value: 0, target: 5000, unit: '$' },
  { label: 'Users', value: 0, target: 500 },
  { label: 'Team Health', value: 84, unit: '/100' },
];

export const progressSeries = [
  { month: 'May', progress: 12, milestones: 1 },
  { month: 'Jun', progress: 28, milestones: 3 },
  { month: 'Jul', progress: 45, milestones: 5 },
  { month: 'Aug', progress: 67, milestones: 6 },
];

export const validationSeries = [
  { name: 'Validated', value: 4 },
  { name: 'Testing', value: 1 },
  { name: 'Unvalidated', value: 1 },
  { name: 'Rejected', value: 1 },
];
