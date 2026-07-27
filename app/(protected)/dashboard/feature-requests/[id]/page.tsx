// app/(protected)/dashboard/feature-requests/[id]/page.tsx
import { notFound } from 'next/navigation'
import { getFeatureRequest, deleteFeatureRequest } from '@/features/requests/actions'
import { RequestForm } from '@/features/requests/components/request-form'
import { Button } from '@/components/ui/button'

export default async function FeatureRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const request = await getFeatureRequest(id)

  if (!request) notFound()

  return (
    <div className="p-8 max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{request.title}</h1>
          <p className="text-sm text-muted-foreground">Status: {request.status}</p>
        </div>
        <form
          action={async () => {
            'use server'
            await deleteFeatureRequest(id)
          }}
        >
          <Button variant="destructive" type="submit">
            Delete
          </Button>
        </form>
      </div>

      <RequestForm
        mode="edit"
        requestId={request.id}
        defaultValues={{
          title: request.title,
          description: request.description,
          sourceType: request.sourceType,
        }}
      />
    </div>
  )
}