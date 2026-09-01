export type Role = 'Member' | 'Team Lead' | 'Admin';
export type Stage = 'No Team' | 'Discover' | 'Team Formed' | 'Validating' | 'Building' | 'Launch';
export type TeamStatus = 'Forming' | 'Validating' | 'Building' | 'Active' | 'Paused' | 'Completed' | 'Archived';

export type Proficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TaskStatus = 'To Do' | 'In Progress' | 'Review' | 'Completed';
export type MilestoneStatus = 'Not Started' | 'In Progress' | 'Completed' | 'At Risk';
export type IssueStatus = 'Open' | 'In Progress' | 'Resolved';
export type IssueCategory = 'Product' | 'Team' | 'Financial' | 'Customer' | 'Technical' | 'Operational';
export type HypothesisStatus = 'Unvalidated' | 'Testing' | 'Validated' | 'Rejected';
export type Commitment = 'Low' | 'Medium' | 'High' | 'Full-time';

export interface MBTIMeta {
  type: string;
  title: string;
  description: string;
}

export interface Skill {
  name: string;
  proficiency: Proficiency;
}

export interface WorkingStyle {
  leadership: string;
  independence: string; // Independent <-> Collaborative
  structure: string; // Structured <-> Flexible
  decision: string; // Fast <-> Deliberate
  communication: string;
  meetingFrequency: string;
  conflict: string;
}

export interface Availability {
  hoursPerWeek: number;
  preferredHours: string;
  location: 'Remote' | 'In-person' | 'Hybrid';
  timezone: string;
  commitment: Commitment;
}

export interface EntrepreneurialPrefs {
  desiredRole: string;
  companySize: string;
  riskTolerance: string;
  growthAmbition: string;
  stagePreference: string;
  wantsFounder: boolean;
  decisionRole: string;
  equityExpectation: string;
}

export interface Profile {
  mbti?: string;
  mbtiConfidence?: number;
  mbtiDate?: string;
  mbtiSource?: 'Self-reported' | 'Professionally assessed';
  skills: Skill[];
  experience: {
    previousBusinesses: number;
    workExperienceYears: number;
    projects: number;
    internships: number;
    leadershipExperience: boolean;
    industryKnowledge: string[];
    entrepreneurialExperience: boolean;
  };
  interests: string[];
  workingStyle: WorkingStyle;
  availability: Availability;
  entrepreneurial: EntrepreneurialPrefs;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: Role;
  status: string;
  email: string;
  profile: Profile;
  profileCompletion: number;
  assessmentCompletion: number;
  strengths: string[];
  developmentAreas: string[];
  businessStrengths: string;
  suggestedRoles: string[];
}

export interface TeamMember {
  userId: string;
  name: string;
  avatar: string;
  mbti?: string;
  role: string;
  skills: string[];
  responsibilities: string[];
  availability: string;
  contact: string;
  contribution: number; // %
  currentTasks: number;
}

export interface CapabilityScore {
  area: string; // Leadership, Product, Engineering, Design, Marketing, Sales, Finance, Operations, Legal, Research
  score: number; // 0-100
}

export interface Milestone {
  id: string;
  order: number;
  name: string;
  status: MilestoneStatus;
  owner: string;
  deadline: string;
  completion: number;
  tasks: number;
  notes: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  owner: string;
  priority: Priority;
  deadline: string;
  status: TaskStatus;
  milestoneId: string;
}

export interface BusinessModel {
  revenueModel: string;
  pricing: string;
  customerAcquisition: string;
  keyResources: string;
  keyPartners: string;
  majorCosts: string;
  distributionChannels: string;
  revenueAssumptions: string;
}

export interface Business {
  name: string;
  valueProposition: string;
  stage: string;
  health: number; // 0-100
  progress: number; // 0-100
  lastUpdated: string;
  nextMilestone: string;
  problem: string;
  targetCustomer: string;
  solution: string;
  uvp: string;
  alternatives: string;
  advantage: string;
  model: BusinessModel;
}

export interface Hypothesis {
  id: string;
  statement: string;
  status: HypothesisStatus;
  evidence: string;
  feedback: string;
  interviews: number;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  validated: boolean;
}

export interface Goal {
  id: string;
  type: 'Long-Term' | 'Quarterly' | 'Weekly';
  text: string;
  owner: string;
  deadline: string;
  done: boolean;
}

export interface Decision {
  id: string;
  decision: string;
  date: string;
  responsible: string;
  reason: string;
  alternatives: string;
  result: string;
}

export interface Issue {
  id: string;
  category: IssueCategory;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  owner: string;
  status: IssueStatus;
  deadline: string;
  proposedSolution: string;
}

export interface Activity {
  id: string;
  text: string;
  date: string;
  type: 'task' | 'milestone' | 'business' | 'team' | 'validation';
}

export interface TeamValue {
  id: string;
  name: string;
  description: string;
  alignment: Record<string, number>; // userId -> 0-100
}

export interface Recommendation {
  id: string;
  name: string;
  avatar: string;
  mbti: string;
  headline: string;
  skills: string[];
  experience: string;
  interests: string[];
  availability: string;
  preferredRole: string;
  match: number; // overall team match %
  scores: {
    skillsComplementarity: number;
    businessInterest: number;
    workingStyle: number;
    availability: number;
    values: number;
    personalityCompatibility: number;
  };
  complementarity: string[]; // capabilities they add
  bio: string;
  state: 'pending' | 'saved' | 'invited' | 'rejected';
}

export type NotificationCategory =
  | 'invitation'
  | 'recommendation'
  | 'task'
  | 'deadline'
  | 'milestone'
  | 'mention'
  | 'update'
  | 'validation'
  | 'overdue';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  date: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface Team {
  id: string;
  name: string;
  avatar: string;
  description: string;
  members: TeamMember[];
  businessConcept: string;
  createdAt: string;
  status: TeamStatus;
  compatibilityScore: number;
}

export interface KPI {
  label: string;
  value: number;
  target?: number;
  unit?: string;
}

export interface SearchResult {
  id: string;
  type: 'Member' | 'Team' | 'Task' | 'Business Idea' | 'Document' | 'Milestone' | 'Issue';
  title: string;
  subtitle: string;
  to: string;
}
