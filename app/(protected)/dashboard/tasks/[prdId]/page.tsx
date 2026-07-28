// app/(protected)/dashboard/tasks/[prdId]/page.tsx
import { notFound } from 'next/navigation'
import { getPrdWithTasks } from '@/features/tasks/actions'
import { KanbanBoard } from '@/features/tasks/components/kanban-board'
import { TaskItem } from '@/features/tasks/components/task-card'
import { TaskPriority, TaskStatus } from '@/features/tasks/actions'

export const dynamic = 'force-dynamic'

export default async function TaskBoardPage({
  params,
}: {
  params: Promise<{ prdId: string }>
}) {
  const { prdId } = await params
  const prd = await getPrdWithTasks(prdId)

  if (!prd) {
    notFound()
  }

  const formattedTasks: TaskItem[] = prd.tasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    status: t.status as TaskStatus,
    priority: t.priority as TaskPriority,
    order: t.order,
    prdId: t.prdId,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }))

  return (
    <div className="p-8">
      <KanbanBoard prd={prd as unknown as Parameters<typeof KanbanBoard>[0]['prd']} initialTasks={formattedTasks} />
    </div>
  )
}
