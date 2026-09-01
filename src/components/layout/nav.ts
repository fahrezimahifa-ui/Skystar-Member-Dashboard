import {
  LayoutDashboard, Compass, HeartHandshake, Building2, Users, BarChart3, Bell, Settings,
} from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  end?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/validate', label: 'Validate', icon: HeartHandshake },
  { to: '/build', label: 'Build', icon: Building2 },
  { to: '/team', label: 'Team', icon: Users },
  { to: '/progress', label: 'Progress', icon: BarChart3 },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
];
