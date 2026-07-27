'use client'

import React from 'react'
import { getStatusStyle, StatusType } from '../lib/status-styles'
import {
  Sparkles,
  FileText,
  CheckCircle2,
  Plus,
  GitBranch,
  Clock,
  ChevronRight,
  ExternalLink,
  Check,
} from 'lucide-react'

interface OverviewContentProps {
  orgName: string
  hasGithubConnection: boolean
  metrics: {
    totalRequests: number
    pendingRequests: number
    readyRequests: number
    projectsCount: number
  }
  recentActivities: {
    id: string
    title: string
    type: string
    status: StatusType
    timestamp: string
    author: string
  }[]
}

export function OverviewContent({ orgName, hasGithubConnection, metrics, recentActivities }: OverviewContentProps) {
  const metricCards = [
    {
      title: 'Total Feature Requests',
      value: metrics.totalRequests.toString(),
      change: 'All time',
      icon: Sparkles,
    },
    {
      title: 'Pending Clarification',
      value: metrics.pendingRequests.toString(),
      change: 'Requires attention',
      icon: FileText,
    },
    {
      title: 'Ready for PRD',
      value: metrics.readyRequests.toString(),
      change: 'Fully specified',
      icon: CheckCircle2,
    },
    {
      title: 'Active Projects',
      value: metrics.projectsCount.toString(),
      change: 'In this workspace',
      icon: GitBranch,
    },
  ]

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans">
      {/* Top Header View */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#FAFAFA]">
            Overview
          </h1>
        </div>

        {/* Action Buttons (Primary white/black, Secondary 1px #262626 border) */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="px-3 py-1.5 rounded-none border border-[#262626] bg-[#0D0D0F] text-xs font-semibold text-[#FAFAFA] hover:bg-[#1F1F23] transition-colors"
          >
            Generate PRD
          </button>

          <button
            type="button"
            className="px-3.5 py-1.5 rounded-none bg-[#FAFAFA] text-xs font-semibold text-[#0A0A0A] hover:bg-[#E5E5E5] transition-colors flex items-center gap-1.5"
          >
            <Plus className="size-3.5" />
            <span>New Feature</span>
          </button>
        </div>
      </div>

      {/* Projects Section Header */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold tracking-tight text-[#FAFAFA]">
          Projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Main Project Card (Matching Render screenshot sharp box style) */}
          <div className="rounded-none border border-[#262626] bg-[#0D0D0F] p-6 space-y-4">
            <h3 className="text-base font-bold text-[#FAFAFA]">
              {orgName}
            </h3>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-[#00573D] text-white text-xs font-semibold">
              <Check className="size-3.5 text-white" />
              <span>All services are up and running</span>
            </div>
          </div>

          {/* Action Slot Card (Dashed border sharp box) */}
          <div className="rounded-none border border-dashed border-[#262626] bg-[#0D0D0F] p-6 flex items-center justify-center cursor-pointer hover:bg-[#161619] transition-colors text-xs font-semibold text-[#FAFAFA] gap-2">
            <Plus className="size-4 text-[#8B8B92]" />
            <span>Create new project</span>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards (Sharp 0px box, #262626 border, #0D0D0F surface) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric, idx) => {
          const Icon = metric.icon
          return (
            <div
              key={idx}
              className="rounded-none border border-[#262626] bg-[#0D0D0F] p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#8B8B92]">
                  {metric.title}
                </span>
                <Icon className="size-4 text-[#8B8B92]" />
              </div>

              <div className="space-y-0.5">
                <div className="text-2xl font-bold text-[#FAFAFA] tracking-tight">
                  {metric.value}
                </div>
                <div className="text-[11px] text-[#8B8B92]">
                  {metric.change}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Workspace Activity List & Integrations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Workspace Activity List (8 Cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#FAFAFA] tracking-tight">
              Activity & Deployments
            </h2>
            <span className="text-xs text-[#8B8B92]">Last 24 hours</span>
          </div>

          <div className="rounded-none border border-[#262626] bg-[#0D0D0F] divide-y divide-[#262626]">
            {recentActivities.length === 0 && (
              <div className="p-6 text-center text-sm text-[#8B8B92]">
                No recent activity.
              </div>
            )}
            {recentActivities.map((act) => {
              const style = getStatusStyle(act.status)
              return (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-3.5 hover:bg-[#161619] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <Clock className="size-4 text-[#8B8B92] shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium text-[#FAFAFA] truncate">
                        {act.title}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-[#8B8B92] mt-0.5 font-normal">
                        <span>{act.type}</span>
                        <span>•</span>
                        <span>{act.author}</span>
                        <span>•</span>
                        <span className="font-mono">{act.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator (Small 6px dot + Plain gray text) */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`size-1.5 rounded-full ${style.dot}`} />
                      <span className="text-xs text-[#8B8B92] font-medium">
                        {style.label}
                      </span>
                    </div>
                    <ChevronRight className="size-3.5 text-[#8B8B92] group-hover:text-[#FAFAFA] transition-colors" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Action Slots / Connect GitHub (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-sm font-semibold text-[#FAFAFA] tracking-tight">
            Integrations
          </h2>

          {hasGithubConnection ? (
            <div className="rounded-none border border-solid border-[#262626] bg-[#0D0D0F] p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#FAFAFA]">
                <GitBranch className="size-4 text-[#FAFAFA]" />
                <span>GitHub Connected</span>
              </div>
              <p className="text-xs text-[#8B8B92] leading-relaxed">
                Your workspace is successfully connected to GitHub for automated code reviews.
              </p>
              <button
                type="button"
                className="w-full py-1.5 rounded-none border border-[#262626] bg-[#161619] text-xs font-semibold text-[#FAFAFA] cursor-default flex items-center justify-center gap-1.5"
              >
                <Check className="size-3.5 text-[#00573D]" />
                <span>Active</span>
              </button>
            </div>
          ) : (
            <div className="rounded-none border border-dashed border-[#262626] bg-[#0D0D0F] p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#FAFAFA]">
                <GitBranch className="size-4 text-[#8B8B92]" />
                <span>Connect GitHub Repository</span>
              </div>

              <p className="text-xs text-[#8B8B92] leading-relaxed">
                Enable automated code reviews, PR validation, and AI pull request summaries.
              </p>

              <button
                type="button"
                className="w-full py-1.5 rounded-none border border-[#262626] bg-[#0D0D0F] text-xs font-semibold text-[#FAFAFA] hover:bg-[#1F1F23] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Setup Repository</span>
                <ExternalLink className="size-3.5 text-[#8B8B92]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
