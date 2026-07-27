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
    dot: 'bg-[#8B8B92]',
    text: 'text-[#8B8B92]',
  },
  PENDING: {
    label: 'Pending',
    dot: 'bg-[#8B8B92]',
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
