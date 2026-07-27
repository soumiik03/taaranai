export type StatusType =
  | 'DRAFT'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'SHIPPED'
  | 'FAILED'
  | 'PENDING'
  | 'CLARIFYING'
  | 'READY'
  | 'REJECTED'
  | string

export interface StatusConfig {
  label: string
  dot: string
  text: string
}

export const statusStyles: Record<string, string> = {
  PENDING: 'text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded text-xs font-medium border border-amber-400/20',
  CLARIFYING: 'text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded text-xs font-medium border border-blue-400/20',
  READY: 'text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-xs font-medium border border-emerald-400/20',
  REJECTED: 'text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded text-xs font-medium border border-rose-400/20',
  DRAFT: 'text-zinc-400 bg-zinc-400/10 px-2 py-0.5 rounded text-xs font-medium border border-zinc-400/20',
  IN_REVIEW: 'text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded text-xs font-medium border border-purple-400/20',
  IN_PROGRESS: 'text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded text-xs font-medium border border-sky-400/20',
  APPROVED: 'text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-xs font-medium border border-emerald-400/20',
  COMPLETED: 'text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-xs font-medium border border-emerald-400/20',
  SHIPPED: 'text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-xs font-medium border border-emerald-400/20',
  FAILED: 'text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded text-xs font-medium border border-rose-400/20',
}

export const statusMap: Record<string, StatusConfig> = {
  DRAFT: {
    label: 'Draft',
    dot: 'bg-[#8B8B92]',
    text: 'text-[#8B8B92]',
  },
  PENDING: {
    label: 'Pending',
    dot: 'bg-[#F59E0B]',
    text: 'text-[#8B8B92]',
  },
  CLARIFYING: {
    label: 'Clarifying',
    dot: 'bg-[#3B82F6]',
    text: 'text-[#8B8B92]',
  },
  READY: {
    label: 'Ready',
    dot: 'bg-[#22C55E]',
    text: 'text-[#8B8B92]',
  },
  REJECTED: {
    label: 'Rejected',
    dot: 'bg-[#EF4444]',
    text: 'text-[#8B8B92]',
  },
  IN_REVIEW: {
    label: 'In Review',
    dot: 'bg-[#8B8B92]',
    text: 'text-[#8B8B92]',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    dot: 'bg-[#8B8B92]',
    text: 'text-[#8B8B92]',
  },
  APPROVED: {
    label: 'Approved',
    dot: 'bg-[#22C55E]',
    text: 'text-[#8B8B92]',
  },
  COMPLETED: {
    label: 'Completed',
    dot: 'bg-[#22C55E]',
    text: 'text-[#8B8B92]',
  },
  SHIPPED: {
    label: 'Shipped',
    dot: 'bg-[#22C55E]',
    text: 'text-[#8B8B92]',
  },
  FAILED: {
    label: 'Failed',
    dot: 'bg-[#EF4444]',
    text: 'text-[#8B8B92]',
  },
}

export function getStatusStyle(status: StatusType): StatusConfig {
  const normalized = String(status).toUpperCase()
  return (
    statusMap[normalized] ?? {
      label: status,
      dot: 'bg-[#8B8B92]',
      text: 'text-[#8B8B92]',
    }
  )
}

