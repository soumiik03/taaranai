// features/tasks/components/task-card.tsx
'use client'

import { useState, useTransition } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  updateTaskStatus,
  updateTask,
  deleteTask,
  TaskStatus,
  TaskPriority,
} from '../actions'
import {
  MoreVertical,
  Edit2,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  AlertCircle,
  Flame,
  CheckCircle2,
  Clock,
  Loader2,
} from 'lucide-react'

export type TaskItem = {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  order: number
  prdId: string
  createdAt?: Date | string
  updatedAt?: Date | string
}

interface TaskCardProps {
  task: TaskItem
  onTaskUpdated?: () => void
}

export function TaskCard({ task, onTaskUpdated }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [priority, setPriority] = useState<TaskPriority>(task.priority)
  const [isPending, startTransition] = useTransition()

  const priorityStyles: Record<TaskPriority, { badge: string; label: string; icon: LucideIcon }> = {
    high: {
      badge: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
      label: 'High',
      icon: Flame,
    },
    medium: {
      badge: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      label: 'Medium',
      icon: AlertCircle,
    },
    low: {
      badge: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
      label: 'Low',
      icon: Clock,
    },
  }

  const PriorityIcon = priorityStyles[task.priority]?.icon || Clock

  function handleStatusMove(newStatus: TaskStatus) {
    startTransition(async () => {
      await updateTaskStatus(task.id, newStatus)
      if (onTaskUpdated) onTaskUpdated()
    })
  }

  function handleSaveEdit() {
    if (!title.trim()) return
    startTransition(async () => {
      await updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
      })
      setIsEditing(false)
      if (onTaskUpdated) onTaskUpdated()
    })
  }

  function handleDelete() {
    if (!confirm('Are you sure you want to delete this task?')) return
    startTransition(async () => {
      await deleteTask(task.id)
      if (onTaskUpdated) onTaskUpdated()
    })
  }

  return (
    <div className="group relative rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
      {isEditing ? (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title..."
              className="text-sm font-medium"
              disabled={isPending}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Technical implementation details..."
              rows={3}
              className="text-xs leading-relaxed resize-y"
              disabled={isPending}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Priority
            </label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  disabled={isPending}
                  className={`flex-1 rounded-md py-1 text-xs font-medium capitalize border transition-colors ${
                    priority === p
                      ? priorityStyles[p].badge + ' ring-1 ring-primary/30'
                      : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setTitle(task.title)
                setDescription(task.description)
                setPriority(task.priority)
                setIsEditing(false)
              }}
              disabled={isPending}
              className="h-8 text-xs gap-1"
            >
              <X className="h-3.5 w-3.5" /> Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveEdit}
              disabled={isPending || !title.trim()}
              className="h-8 text-xs gap-1"
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Card Header: Priority & Menu */}
          <div className="flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                priorityStyles[task.priority]?.badge || 'border-border bg-muted text-muted-foreground'
              }`}
            >
              <PriorityIcon className="h-3 w-3" />
              {priorityStyles[task.priority]?.label || task.priority}
            </span>

            <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                disabled={isPending}
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                title="Edit Task"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isPending}
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  >
                    <MoreVertical className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => setIsEditing(true)} className="gap-2 text-xs">
                    <Edit2 className="h-3.5 w-3.5 text-muted-foreground" /> Edit Task
                  </DropdownMenuItem>

                  {task.status !== 'todo' && (
                    <DropdownMenuItem
                      onClick={() => handleStatusMove('todo')}
                      className="gap-2 text-xs"
                    >
                      <ArrowLeft className="h-3.5 w-3.5 text-sky-400" /> Move to Todo
                    </DropdownMenuItem>
                  )}

                  {task.status !== 'in_progress' && (
                    <DropdownMenuItem
                      onClick={() => handleStatusMove('in_progress')}
                      className="gap-2 text-xs"
                    >
                      <Clock className="h-3.5 w-3.5 text-amber-400" /> Move to In Progress
                    </DropdownMenuItem>
                  )}

                  {task.status !== 'done' && (
                    <DropdownMenuItem
                      onClick={() => handleStatusMove('done')}
                      className="gap-2 text-xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Move to Done
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="gap-2 text-xs text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Card Body */}
          <div>
            <h4 className="font-semibold text-sm leading-snug text-foreground">
              {task.title}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap break-words mt-1">
              {task.description}
            </p>
          </div>

          {/* Card Footer Quick Move Action Buttons */}
          <div className="pt-2 border-t border-border/40 flex items-center justify-between">
            <div className="flex gap-1.5 w-full justify-end">
              {task.status === 'todo' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusMove('in_progress')}
                  disabled={isPending}
                  className="h-7 text-[11px] px-2.5 gap-1 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30"
                >
                  Start <ArrowRight className="h-3 w-3" />
                </Button>
              )}

              {task.status === 'in_progress' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusMove('todo')}
                    disabled={isPending}
                    className="h-7 text-[11px] px-2 gap-1"
                  >
                    <ArrowLeft className="h-3 w-3" /> Todo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusMove('done')}
                    disabled={isPending}
                    className="h-7 text-[11px] px-2.5 gap-1 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30"
                  >
                    Done <Check className="h-3 w-3" />
                  </Button>
                </>
              )}

              {task.status === 'done' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusMove('in_progress')}
                  disabled={isPending}
                  className="h-7 text-[11px] px-2.5 gap-1 text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3 w-3" /> Reopen
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
