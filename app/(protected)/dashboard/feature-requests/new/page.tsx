import { RequestForm } from '@/features/requests/components/request-form'

export default function NewFeatureRequestPage() {
  return (
    <div className="p-8 max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New Feature Request</h1>
        <p className="text-sm text-muted-foreground">
          Describe what needs to be built. You'll be asked clarifying questions next.
        </p>
      </div>
      <RequestForm mode="create" />
    </div>
  )
}
