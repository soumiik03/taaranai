import {
  LayoutDashboard,
  Sparkles,
  FileText,
  Kanban,
  GitBranch,
  GitPullRequest,
  History,
  CreditCard,
  Settings,
  LucideIcon,
} from 'lucide-react'

export interface NavRoute {
  label: string
  href: string
  icon: LucideIcon
  badge?: string
}

export interface NavSection {
  title?: string
  routes: NavRoute[]
}

export const navSections: NavSection[] = [
  {
    routes: [
      { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Feature Requests', href: '/dashboard/features', icon: Sparkles },
      { label: 'PRD Editor', href: '/dashboard/prds', icon: FileText },
      { label: 'Task Board', href: '/dashboard/tasks', icon: Kanban },
    ],
  },
  {
    title: 'INTEGRATIONS',
    routes: [
      { label: 'GitHub', href: '/dashboard/github', icon: GitBranch },
      { label: 'Pull Requests', href: '/dashboard/pull-requests', icon: GitPullRequest },
      { label: 'Review History', href: '/dashboard/reviews', icon: History },
    ],
  },
  {
    title: 'WORKSPACE',
    routes: [
      { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
      { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    ],
  },
]
