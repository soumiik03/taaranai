// app/(protected)/dashboard/tasks/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getActiveOrganization } from '@/lib/session'
import { getAllPrdsWithTasks } from '@/features/tasks/actions'
import { Button } from '@/components/ui/button'
import {
  Kanban,
  FileText,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function TasksIndexPage() {
  const org = await getActiveOrganization()
  if (!org) notFound()

  const prds = await getAllPrdsWithTasks()
return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5">
            <Kanban className="h-6 w-6 text-primary" />
            Task Boards
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Select a PRD implementation plan to open its Kanban board.
          </p>
        </div>
        <Link href="/dashboard/prd">
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4 text-indigo-400" />
            PRD Editor
          </Button>
        </Link>
      </div>

      {/* PRD Task Boards List */}
      {prds.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center space-y-4 bg-muted/10">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Kanban className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">No Task Boards yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Approve a PRD in the PRD Editor to automatically generate engineering tasks and open a Kanban task board.
            </p>
          </div>
          <Link href="/dashboard/prd">
            <Button className="mt-2 gap-2">
              <Sparkles className="h-4 w-4" /> Go to PRDs
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {prds.map((prd) => {
            const totalTasks = prd.tasks.length
            const doneTasks = prd.tasks.filter((t) => t.status === 'done').length

            return (
              <div
                key={prd.id}
                className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                        prd.planApproved
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {prd.planApproved ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" /> Plan Approved
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3" /> Draft Plan
                        </>
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                      <Layers className="h-3 w-3" /> {totalTasks} tasks
                    </span>
                  </div>

                  <div>
                    <h2 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                      {prd.featureRequest?.title || 'Feature Plan'}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {prd.featureRequest?.description || 'PRD engineering tasks.'}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-border/50 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">
                    {totalTasks > 0 ? `${doneTasks}/${totalTasks} done` : 'No tasks generated'}
                  </span>
                  <Link
                    href={`/dashboard/tasks/${prd.id}`}
                    className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                  >
                    Open Board <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
