// features/prd/components/prd-editor.tsx
'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { updatePrdSection, approvePrd, deletePrd } from '../actions'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Trash2,
  Plus,
  Target,
  XCircle,
  CheckSquare,
  AlertTriangle,
  BarChart2,
  Users,
  FileText,
  Loader2,
} from 'lucide-react'

type UserStory = { role: string; story: string }

type Prd = {
  id: string
  status: 'DRAFT' | 'APPROVED'
  problemStatement: string
  goals: string[]
  nonGoals: string[]
  userStories: UserStory[]
  acceptanceCriteria: string[]
  edgeCases: string[]
  successMetrics: string[]
  featureRequest?: {
    title: string
    description: string
  }
}

function SectionCard({
  title,
  icon: Icon,
  description,
  children,
}: {
  title: string
  icon: React.ElementType
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5 pb-2 border-b border-border/50">
        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-semibold text-base">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}

function InteractiveListSection({
  items,
  onSave,
  placeholder,
  isApproved,
}: {
  items: string[]
  onSave: (items: string[]) => void
  placeholder: string
  isApproved: boolean
}) {
  const [list, setList] = useState<string[]>(items || [])
  const [newItemText, setNewItemText] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleAdd() {
    if (!newItemText.trim()) return
    const updated = [...list, newItemText.trim()]
    setList(updated)
    setNewItemText('')
    startTransition(() => onSave(updated))
  }

  function handleRemove(index: number) {
    const updated = list.filter((_, i) => i !== index)
    setList(updated)
    startTransition(() => onSave(updated))
  }

  function handleTextChange(index: number, val: string) {
    const updated = [...list]
    updated[index] = val
    setList(updated)
  }

  function handleBlur(index: number) {
    const updated = [...list]
    updated[index] = updated[index].trim()
    setList(updated)
    startTransition(() => onSave(updated))
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2.5">
        {list.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-3 text-sm group transition-colors hover:border-border/80"
          >
            <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
            <Textarea
              value={item}
              onChange={(e) => handleTextChange(idx, e.target.value)}
              onBlur={() => handleBlur(idx)}
              disabled={isApproved || isPending}
              rows={Math.max(1, Math.ceil(item.length / 65))}
              className="flex-1 bg-transparent border-none p-0 focus-visible:ring-0 text-foreground text-sm leading-relaxed resize-none shadow-none"
            />
            {!isApproved && (
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                title="Delete item"
                className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded hover:bg-muted shrink-0 mt-0.5"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {!isApproved && (
        <div className="flex gap-2 pt-1">
          <Input
            placeholder={placeholder}
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAdd()
              }
            }}
            disabled={isPending}
            className="text-sm flex-1"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleAdd}
            disabled={isPending || !newItemText.trim()}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" /> Add Item
          </Button>
        </div>
      )}
    </div>
  )
}

function cleanUserStoryText(role: string, story: string) {
  // Fix duplicate "As a Developer, As a Developer..." prefixes
  let text = story.trim()
  if (/^as a /i.test(text)) {
    return text
  }
  return `As a ${role.trim() || 'user'}, ${text}`
}

export function PrdEditor({ prd }: { prd: Prd }) {
  const router = useRouter()
  const [isApproving, startApprove] = useTransition()
  const [isDeleting, startDelete] = useTransition()

  const [problemStatement, setProblemStatement] = useState(prd.problemStatement || '')
  const [userStories, setUserStories] = useState<UserStory[]>(prd.userStories || [])
  const [newRole, setNewRole] = useState('')
  const [newStory, setNewStory] = useState('')

  const isApproved = prd.status === 'APPROVED'

  function saveProblemStatement() {
    updatePrdSection(prd.id, 'problemStatement', problemStatement)
  }

  function handleAddUserStory() {
    if (!newStory.trim()) return
    const updated = [
      ...userStories,
      { role: newRole.trim() || 'User', story: newStory.trim() },
    ]
    setUserStories(updated)
    setNewRole('')
    setNewStory('')
    updatePrdSection(prd.id, 'userStories', updated)
  }

  function handleRemoveUserStory(idx: number) {
    const updated = userStories.filter((_, i) => i !== idx)
    setUserStories(updated)
    updatePrdSection(prd.id, 'userStories', updated)
  }

  function handleUserStoryChange(idx: number, newText: string) {
    const updated = [...userStories]
    updated[idx] = { ...updated[idx], story: newText }
    setUserStories(updated)
  }

  function handleUserStoryBlur() {
    updatePrdSection(prd.id, 'userStories', userStories)
  }

  function handleDeletePrd() {
    if (!confirm('Are you sure you want to delete this PRD?')) return
    startDelete(async () => {
      await deletePrd(prd.id)
      router.push('/dashboard/prd')
    })
  }

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col gap-4 border-b border-border pb-6">
        <div className="flex items-center justify-between">
          <Link href="/dashboard/prd">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to PRDs
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
                isApproved
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
              }`}
            >
              {isApproved ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approved
                </>
              ) : (
                <>
                  <Clock className="h-3.5 w-3.5" /> Draft
                </>
              )}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDeletePrd}
              disabled={isDeleting}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 gap-1.5"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete PRD
            </Button>

            {!isApproved && (
              <Button
                size="sm"
                onClick={() => startApprove(() => approvePrd(prd.id))}
                disabled={isApproving}
                className="gap-2"
              >
                {isApproving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Approve PRD
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {prd.featureRequest?.title || 'Product Requirement Document'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review, edit, and manage all specifications for this feature release.
          </p>
        </div>
      </div>

      {/* Editor Content */}
      <div className="grid gap-6">
        {/* Problem Statement */}
        <SectionCard title="Problem Statement" icon={FileText} description="What problem are we solving and why?">
          <Textarea
            value={problemStatement}
            onChange={(e) => setProblemStatement(e.target.value)}
            onBlur={saveProblemStatement}
            rows={4}
            disabled={isApproved}
            placeholder="Define the problem clearly..."
            className="text-sm leading-relaxed resize-y"
          />
        </SectionCard>

        {/* Goals & Non-Goals Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <SectionCard title="Goals" icon={Target} description="Core objectives and expected outcomes">
            <InteractiveListSection
              items={prd.goals}
              onSave={(v) => updatePrdSection(prd.id, 'goals', v)}
              placeholder="Add a goal..."
              isApproved={isApproved}
            />
          </SectionCard>

          <SectionCard title="Non-Goals" icon={XCircle} description="Explicitly out of scope for this release">
            <InteractiveListSection
              items={prd.nonGoals}
              onSave={(v) => updatePrdSection(prd.id, 'nonGoals', v)}
              placeholder="Add a non-goal..."
              isApproved={isApproved}
            />
          </SectionCard>
        </div>

        {/* User Stories */}
        <SectionCard title="User Stories" icon={Users} description="User behaviors and requirements">
          <div className="space-y-3">
            {userStories.map((story, i) => {
              const fullStory = cleanUserStoryText(story.role, story.story)
              return (
                <div
                  key={i}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border bg-muted/20 p-3 text-sm group"
                >
                  <Textarea
                    value={fullStory}
                    onChange={(e) => handleUserStoryChange(i, e.target.value)}
                    onBlur={handleUserStoryBlur}
                    disabled={isApproved}
                    rows={Math.max(1, Math.ceil(fullStory.length / 65))}
                    className="flex-1 bg-transparent border-none p-0 focus-visible:ring-0 text-foreground text-sm leading-relaxed resize-none shadow-none font-medium"
                  />
                  {!isApproved && (
                    <button
                      type="button"
                      onClick={() => handleRemoveUserStory(i)}
                      title="Delete story"
                      className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded hover:bg-muted shrink-0 mt-0.5"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )
            })}

            {!isApproved && (
              <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border/50">
                <Input
                  placeholder="Role (e.g. Developer)"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="sm:w-1/3 text-sm"
                />
                <Input
                  placeholder="I want to [action] so that [benefit]..."
                  value={newStory}
                  onChange={(e) => setNewStory(e.target.value)}
                  className="sm:w-2/3 text-sm"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddUserStory}
                  disabled={!newStory.trim()}
                  className="gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Add Story
                </Button>
              </div>
            )}
          </div>
        </SectionCard>

        {/* Acceptance Criteria & Edge Cases */}
        <div className="grid md:grid-cols-2 gap-6">
          <SectionCard title="Acceptance Criteria" icon={CheckSquare} description="Conditions required for feature completion">
            <InteractiveListSection
              items={prd.acceptanceCriteria}
              onSave={(v) => updatePrdSection(prd.id, 'acceptanceCriteria', v)}
              placeholder="Add acceptance criterion..."
              isApproved={isApproved}
            />
          </SectionCard>

          <SectionCard title="Edge Cases" icon={AlertTriangle} description="Potential exceptions and error scenarios">
            <InteractiveListSection
              items={prd.edgeCases}
              onSave={(v) => updatePrdSection(prd.id, 'edgeCases', v)}
              placeholder="Add an edge case..."
              isApproved={isApproved}
            />
          </SectionCard>
        </div>

        {/* Success Metrics */}
        <SectionCard title="Success Metrics" icon={BarChart2} description="Key metrics to evaluate feature success">
          <InteractiveListSection
            items={prd.successMetrics}
            onSave={(v) => updatePrdSection(prd.id, 'successMetrics', v)}
            placeholder="Add success metric..."
            isApproved={isApproved}
          />
        </SectionCard>
      </div>
    </div>
  )
}