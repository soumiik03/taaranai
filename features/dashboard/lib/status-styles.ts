export type StatusType =
  | 'DRAFT'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'SHIPPED'
  | 'FAILED'
  | 'PENDING'
  | string

export interface StatusConfig {
  label: string
  dot: string
  text: string
}

export const statusMap: Record<string, StatusConfig> = {
  DRAFT: {
    label: 'Draft',
    dot: 'bg-[#8A8A93]',
    text: 'text-[#8A8A93]',
  },
  PENDING: {
    label: 'Pending',
    dot: 'bg-[#8A8A93]',
    text: 'text-[#8A8A93]',
  },
  IN_REVIEW: {
    label: 'In Review',
    dot: 'bg-[#7C6EF2]',
    text: 'text-[#8A8A93]',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    dot: 'bg-[#7C6EF2]',
    text: 'text-[#8A8A93]',
  },
  APPROVED: {
    label: 'Approved',
    dot: 'bg-[#22C55E]',
    text: 'text-[#8A8A93]',
  },
  COMPLETED: {
    label: 'Completed',
    dot: 'bg-[#22C55E]',
    text: 'text-[#8A8A93]',
  },
  SHIPPED: {
    label: 'Shipped',
    dot: 'bg-[#22C55E]',
    text: 'text-[#8A8A93]',
  },
  FAILED: {
    label: 'Failed',
    dot: 'bg-[#EF4444]',
    text: 'text-[#8A8A93]',
  },
}

export function getStatusStyle(status: StatusType): StatusConfig {
  const normalized = String(status).toUpperCase()
  return (
    statusMap[normalized] ?? {
      label: status,
      dot: 'bg-[#8A8A93]',
      text: 'text-[#8A8A93]',
    }
  )
}
