'use client'

import {
  CheckCircle2,
  GitPullRequest,
  ExternalLink,
  UserCheck,
  Calendar,
  Sparkles,
  FileText,
  Kanban,
  GitBranch,
  ShieldCheck,
  Ship,
  ChevronRight,
} from 'lucide-react'
import type { ShippedFeatureItem } from '../actions'

interface ShippedFeatureCardProps {
  feature: ShippedFeatureItem
}

export function ShippedFeatureCard({ feature }: ShippedFeatureCardProps) {
  const timelineSteps = [
    {
      label: 'Request Submitted',
      date: feature.timeline.requestSubmitted,
      icon: Sparkles,
    },
    {
      label: 'PRD Approved',
      date: feature.timeline.prdApproved,
      icon: FileText,
    },
    {
      label: 'Tasks Created',
      date: feature.timeline.tasksCreated,
      icon: Kanban,
    },
    {
      label: 'PR Opened',
      date: feature.timeline.prOpened,
      icon: GitBranch,
    },
    {
      label: 'AI Reviews Passed',
      date: feature.timeline.reviewsPassed,
      icon: ShieldCheck,
    },
    {
      label: 'Human Approved & Shipped',
      date: feature.timeline.humanApproved,
      icon: Ship,
    },
  ]

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-card p-6 shadow-xl shadow-emerald-950/10 transition-all hover:border-emerald-500/50 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </span>
            <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
            <span className="rounded-full bg-emerald-500/15 px-3 py-0.5 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
              SHIPPED
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {feature.description}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
          <a
            href={feature.pullRequest.htmlUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 px-3.5 py-1.5 text-xs font-semibold text-indigo-300 ring-1 ring-indigo-500/30 transition-colors"
          >
            <GitPullRequest className="h-3.5 w-3.5" />
            <span>PR #{feature.pullRequest.number} ({feature.pullRequest.repoFullName})</span>
            <ExternalLink className="h-3 w-3" />
          </a>

          {feature.approvedByName && (
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <UserCheck className="h-3.5 w-3.5" />
              <span>Approved by {feature.approvedByName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Approver Notes Callout */}
      {feature.approvalNotes && (
        <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3.5 text-xs text-emerald-200">
          <span className="font-semibold uppercase text-[10px] tracking-wider text-emerald-400 block mb-0.5">
            Approver Notes:
          </span>
          <p className="italic text-emerald-100">{feature.approvalNotes}</p>
        </div>
      )}

      {/* Delivery Timeline Stepper */}
      <div className="mt-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
          Complete Delivery Timeline
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 relative">
          {timelineSteps.map((step, idx) => {
            const Icon = step.icon
            const isComplete = !!step.date

            return (
              <div
                key={idx}
                className={`relative rounded-xl border p-3 flex flex-col justify-between text-xs transition-all ${
                  isComplete
                    ? 'border-emerald-500/30 bg-emerald-950/15'
                    : 'border-border/60 bg-muted/20 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg ring-1 ${
                      isComplete
                        ? 'bg-emerald-500/20 text-emerald-300 ring-emerald-500/40'
                        : 'bg-muted text-muted-foreground ring-border'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground font-bold">
                    Step {idx + 1}
                  </span>
                </div>

                <div>
                  <p className="font-bold text-foreground text-[11px] leading-snug">
                    {step.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {step.date ? new Date(step.date).toLocaleDateString() : 'Pending'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
