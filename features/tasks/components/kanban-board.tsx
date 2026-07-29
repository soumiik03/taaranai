// features/tasks/components/kanban-board.tsx
'use client'

import { useState, useEffect, useTransition } from 'react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { TaskCard, TaskItem } from './task-card'
import {
  getTasksByPrd,
  approvePlan,
  createTask,
  triggerTaskGeneration,
  TaskStatus,
  TaskPriority,
} from '../actions'
import {
  Kanban,
  CheckCircle2,
  Clock,
  ListTodo,
  Plus,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Loader2,
  Check,
  FileText,
  Layers,
} from 'lucide-react'

interface PrdData {
  id: string
  planApproved: boolean
  featureRequest?: {
    title: string
    description: string
  } | null
}

interface KanbanBoardProps {
  prd: PrdData
  initialTasks: TaskItem[]
}

export function KanbanBoard({ prd, initialTasks }: KanbanBoardProps) {
  const router = useRouter()
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks || [])
  const [isPlanApproved, setIsPlanApproved] = useState(prd.planApproved)
  const [isApproving, startApproveTransition] = useTransition()
  const [isGenerating, startGenerateTransition] = useTransition()
  const [isFetching, setIsFetching] = useState(false)

  // Quick Add Task state per column
  const [addingColumn, setAddingColumn] = useState<TaskStatus | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium')
  const [isCreating, startCreateTransition] = useTransition()
useEffect(() => {
    if (tasks.length > 0) return

    const interval = setInterval(async () => {
      setIsFetching(true)
      try {
        const fetchedTasks = await getTasksByPrd(prd.id)
        if (fetchedTasks && fetchedTasks.length > 0) {
          setTasks(fetchedTasks as TaskItem[])
          setIsFetching(false)
          clearInterval(interval)
          router.refresh()
        }
      } catch (err) {
        console.error('Failed to poll tasks:', err)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [prd.id, tasks.length, router])

  async function handleRefresh() {
    setIsFetching(true)
    try {
      const fetchedTasks = await getTasksByPrd(prd.id)
      setTasks(fetchedTasks as TaskItem[])
    } finally {
      setIsFetching(false)
    }
  }

  function handleApprovePlan() {
    startApproveTransition(async () => {
      await approvePlan(prd.id)
      setIsPlanApproved(true)
      router.refresh()
    })
  }

  function handleTriggerGenerate() {
    startGenerateTransition(async () => {
      await triggerTaskGeneration(prd.id)
      setTasks([])
      setIsFetching(true)
    })
  }

  function handleCreateTask(status: TaskStatus) {
    if (!newTitle.trim()) return
    startCreateTransition(async () => {
      await createTask(prd.id, {
        title: newTitle.trim(),
        description: newDescription.trim(),
        priority: newPriority,
        status,
      })
      setNewTitle('')
      setNewDescription('')
      setNewPriority('medium')
      setAddingColumn(null)
      await handleRefresh()
    })
  }

  const columns: {
    id: TaskStatus
    title: string
    icon: LucideIcon
    color: string
    badge: string
  }[] = [
    {
      id: 'todo',
      title: 'Todo',
      icon: ListTodo,
      color: 'text-sky-400',
      badge: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      icon: Clock,
      color: 'text-amber-400',
      badge: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    },
    {
      id: 'done',
      title: 'Done',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    },
  ]

  const doneCount = tasks.filter((t) => t.status === 'done').length
  const totalCount = tasks.length

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Navigation & Header */}
      <div className="flex flex-col gap-4 border-b border-border pb-6">
        <div className="flex items-center justify-between">
          <Link href="/dashboard/prd">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to PRDs
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isFetching}
              className="gap-2 text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Link href={`/dashboard/prd/${prd.id}`}>
              <Button variant="outline" size="sm" className="gap-2 text-xs">
                <FileText className="h-3.5 w-3.5 text-primary" /> View PRD
              </Button>
            </Link>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Kanban className="h-8 w-8 text-primary shrink-0" />
            {prd.featureRequest?.title || 'Engineering Task Board'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap break-words">
            {prd.featureRequest?.description || 'AI-generated task breakdown and Kanban workspace.'}
          </p>
        </div>
      </div>

      {/* Top Banner: Task Count Summary & Approve Plan */}
      <div className="rounded-xl border border-border bg-card/60 backdrop-blur p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="font-bold text-lg">
                {totalCount === 0 ? 'Generating Tasks...' : `${totalCount} Engineering Tasks`}
              </h3>
              {isPlanApproved && (
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                  <Check className="h-3 w-3" /> Plan Approved
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalCount > 0
                ? `${doneCount} of ${totalCount} tasks completed (${
                    totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0
                  }%)`
: 'AI is preparing a focused task list.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
              variant="outline"
              size="sm"
              onClick={handleTriggerGenerate}
              disabled={isGenerating}
              className="gap-2 text-xs"
            >
              {isGenerating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              )}
              {totalCount > 0 ? 'Regenerate Tasks' : 'Generate Tasks'}
            </Button>

          {!isPlanApproved ? (
            <Button
              onClick={handleApprovePlan}
              disabled={isApproving || totalCount === 0}
              className="gap-2 w-full md:w-auto font-medium"
            >
              {isApproving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Approving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Approve Plan
                </>
              )}
            </Button>
          ) : (
            <div className="px-4 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Implementation Plan Approved
            </div>
          )}
        </div>
      </div>

      {/* Empty State / Polling Banner */}
      {totalCount === 0 && (
        <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-12 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">Generating Engineering Tasks...</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Please wait while AI breaks down your PRD into sequenced database, backend, and UI implementation tasks.
              This board will update automatically.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-background/50 px-3 py-1.5 rounded-full border border-border">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" /> Polling every 3 seconds...
          </div>
        </div>
      )}

      {/* 3-Column Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id)
          const ColIcon = col.icon

          return (
            <div
              key={col.id}
              className="flex flex-col rounded-xl border border-border bg-card/40 p-4 min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <ColIcon className={`h-4 w-4 ${col.color}`} />
                  <h3 className="font-bold text-sm tracking-tight">{col.title}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${col.badge}`}>
                    {colTasks.length}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setAddingColumn(addingColumn === col.id ? null : col.id)}
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  title={`Add task to ${col.title}`}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Inline Add Task Form */}
              {addingColumn === col.id && (
                <div className="mb-4 rounded-xl border border-primary/40 bg-card p-3 shadow-md space-y-2.5 animate-in fade-in-50">
                  <Input
                    placeholder="Task title..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="text-xs font-medium"
                    autoFocus
                  />
                  <Textarea
                    placeholder="Description / notes..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={2}
                    className="text-xs resize-none"
                  />
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex gap-1">
                      {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewPriority(p)}
                          className={`px-2 py-0.5 text-[10px] font-semibold rounded capitalize border ${
                            newPriority === p
                              ? 'border-primary bg-primary/20 text-primary'
                              : 'border-border text-muted-foreground'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setAddingColumn(null)}
                        className="h-7 text-[11px] px-2"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleCreateTask(col.id)}
                        disabled={isCreating || !newTitle.trim()}
                        className="h-7 text-[11px] px-2.5 gap-1"
                      >
                        {isCreating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tasks List */}
              <div className="flex-1 space-y-3">
                {colTasks.length === 0 ? (
                  <div className="h-32 flex items-center justify-center rounded-lg border border-dashed border-border/50 text-xs text-muted-foreground/60">
                    No tasks in {col.title}
                  </div>
                ) : (
                  colTasks.map((t) => (
                    <TaskCard key={t.id} task={t} onTaskUpdated={handleRefresh} />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
