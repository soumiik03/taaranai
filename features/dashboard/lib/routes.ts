import { GitBranch } from 'lucide-react'
import {
  LayoutDashboard,
  Sparkles,
  HelpCircle,
  FileText,
  Kanban,
  GitPullRequest,
  Ship,
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
      { label: 'Feature Requests', href: '/dashboard/feature-requests', icon: Sparkles },
      { label: 'AI Clarifications', href: '/dashboard/clarifications', icon: HelpCircle },
      { label: 'PRD Editor', href: '/dashboard/prd', icon: FileText },
      { label: 'Task Board', href: '/dashboard/tasks', icon: Kanban },
    ],
  },
  {
    title: 'INTEGRATIONS & RELEASES',
    routes: [
      { label: 'GitHub', href: '/dashboard/github', icon: GitBranch },
      { label: 'Pull Requests', href: '/dashboard/pull-requests', icon: GitPullRequest },
      { label: 'Shipped Features', href: '/dashboard/shipped', icon: Ship },
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

