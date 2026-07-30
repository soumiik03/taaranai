// features/tasks/components/task-details-modal.tsx
'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { TaskItem } from './task-card'
import {
  updateTaskStatus,
  updateTask,
  deleteTask,
  TaskStatus,
  TaskPriority,
} from '../actions'
import {
  X,
  Edit2,
  Trash2,
  Check,
  Flame,
  AlertCircle,
  Clock,
  CheckCircle2,
  ArrowLeft,
  FileText,
  Loader2,
  Sparkles,
} from 'lucide-react'
import { ConfirmModal } from '@/components/ui/confirm-modal'

interface TaskDetailsModalProps {
  task: TaskItem | null
  prdContext?: {
    title: string
    description: string
  } | null
  isOpen: boolean
  onClose: () => void
  onTaskUpdated?: () => void
}

export function TaskDetailsModal({
  task,
  prdContext,
  isOpen,
  onClose,
  onTaskUpdated,
}: TaskDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [prevTaskId, setPrevTaskId] = useState<string | null>(null)
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium')
  const [isPending, startTransition] = useTransition()

  if (task && task.id !== prevTaskId) {
    setPrevTaskId(task.id)
    setTitle(task.title)
    setDescription(task.description)
    setPriority(task.priority)
    setIsEditing(false)
  }

  if (!isOpen || !task) return null

  const priorityStyles: Record<TaskPriority, { badge: string; label: string; icon: typeof Flame }> = {
    high: {
      badge: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
      label: 'High Priority',
      icon: Flame,
    },
    medium: {
      badge: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      label: 'Medium Priority',
      icon: AlertCircle,
    },
    low: {
      badge: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
      label: 'Low Priority',
      icon: Clock,
    },
  }

  const statusStyles: Record<TaskStatus, { badge: string; label: string; icon: typeof Clock }> = {
    todo: {
      badge: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
      label: 'Todo',
      icon: Clock,
    },
    in_progress: {
      badge: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      label: 'In Progress',
      icon: Clock,
    },
    done: {
      badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
      label: 'Done',
      icon: CheckCircle2,
    },
  }

  const PriorityIcon = priorityStyles[task.priority]?.icon || Clock
  const StatusIcon = statusStyles[task.status]?.icon || Clock

  function handleStatusMove(newStatus: TaskStatus) {
    startTransition(async () => {
      await updateTaskStatus(task!.id, newStatus)
      if (onTaskUpdated) onTaskUpdated()
      onClose()
    })
  }

  function handleSaveEdit() {
    if (!title.trim()) return
    startTransition(async () => {
      await updateTask(task!.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
      })
      setIsEditing(false)
      if (onTaskUpdated) onTaskUpdated()
    })
  }

  function handleDeleteConfirm() {
    setShowDeleteModal(false)
    startTransition(async () => {
      await deleteTask(task!.id)
      if (onTaskUpdated) onTaskUpdated()
      onClose()
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in-50 duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                  statusStyles[task.status]?.badge
                }`}
              >
                <StatusIcon className="h-3.5 w-3.5" />
                {statusStyles[task.status]?.label}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                  priorityStyles[task.priority]?.badge
                }`}
              >
                <PriorityIcon className="h-3.5 w-3.5" />
                {priorityStyles[task.priority]?.label}
              </span>
            </div>

            {!isEditing ? (
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground leading-snug">
                {task.title}
              </h2>
            ) : (
              <div className="space-y-1 pt-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                  Task Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-base font-semibold"
                  disabled={isPending}
                />
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* PRD Context Summary Box */}
        {prdContext && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Feature Context: {prdContext.title}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {prdContext.description}
            </p>
          </div>
        )}

        {/* Modal Body / Full Context */}
        {!isEditing ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-primary" /> Full Implementation Context & Instructions
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-7 text-xs gap-1.5"
              >
                <Edit2 className="h-3.5 w-3.5" /> Edit Details
              </Button>
            </div>

            <div className="rounded-xl border border-border/80 bg-muted/20 p-4 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap break-words min-h-[120px]">
              {task.description || 'No detailed instructions provided.'}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Detailed Implementation Context & Instructions
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="text-sm leading-relaxed"
                disabled={isPending}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Priority
              </label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    disabled={isPending}
                    className={`flex-1 rounded-lg py-2 text-xs font-semibold capitalize border transition-all ${
                      priority === p
                        ? priorityStyles[p].badge + ' ring-2 ring-primary/40'
                        : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {p} Priority
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTitle(task.title)
                  setDescription(task.description)
                  setPriority(task.priority)
                  setIsEditing(false)
                }}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveEdit}
                disabled={isPending || !title.trim()}
                className="gap-1.5"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Save Changes
              </Button>
            </div>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="border-t border-border/60 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-muted-foreground font-medium">Move Status:</span>
            <div className="flex gap-2">
              {task.status !== 'todo' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusMove('todo')}
                  disabled={isPending}
                  className="h-8 text-xs gap-1 hover:border-sky-500/40 hover:text-sky-400"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Todo
                </Button>
              )}
              {task.status !== 'in_progress' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusMove('in_progress')}
                  disabled={isPending}
                  className="h-8 text-xs gap-1 hover:border-amber-500/40 hover:text-amber-400"
                >
                  <Clock className="h-3.5 w-3.5" /> In Progress
                </Button>
              )}
              {task.status !== 'done' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusMove('done')}
                  disabled={isPending}
                  className="h-8 text-xs gap-1 hover:border-emerald-500/40 hover:text-emerald-400"
                >
                  <Check className="h-3.5 w-3.5" /> Done
                </Button>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
            disabled={isPending}
            className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 self-end sm:self-auto"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete Task
          </Button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete Task"
        isLoading={isPending}
      />
    </div>
  )
}
