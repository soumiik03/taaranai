// features/requests/components/request-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { featureRequestSchema, type FeatureRequestInput } from '../schema'
import { createFeatureRequest, updateFeatureRequest } from '../actions'

type Props = {
  mode: 'create' | 'edit'
  requestId?: string
  defaultValues?: Partial<FeatureRequestInput>
}

export function RequestForm({ mode, requestId, defaultValues }: Props) {
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<FeatureRequestInput>({
    resolver: zodResolver(featureRequestSchema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      sourceType: defaultValues?.sourceType ?? 'MANUAL',
    },
  })

  function onSubmit(values: FeatureRequestInput) {
    setFormError(null)
    const formData = new FormData()
    formData.set('title', values.title)
    formData.set('description', values.description)
    formData.set('sourceType', values.sourceType)

    startTransition(async () => {
      const action =
        mode === 'create'
          ? createFeatureRequest(formData)
          : updateFeatureRequest(requestId!, formData)

      const result = await action
      if (result?.error) {
        const message = Object.values(result.error).flat()[0]
        setFormError(message ?? 'Something went wrong')
      }
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input placeholder="Add SSO login" {...form.register('title')} />
        {form.formState.errors.title && (
          <p className="mt-1 text-sm text-red-500">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          rows={6}
          placeholder="What does the user need, and why?"
          {...form.register('description')}
        />
        {form.formState.errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium">Source</label>
        <Select
          defaultValue={form.getValues('sourceType')}
          onValueChange={(value: string) =>
            form.setValue('sourceType', value as FeatureRequestInput['sourceType'])
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MANUAL">Manual</SelectItem>
            <SelectItem value="EMAIL">Email</SelectItem>
            <SelectItem value="TICKET">Ticket</SelectItem>
            <SelectItem value="CALL">Call</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formError && <p className="text-sm text-red-500">{formError}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending
          ? mode === 'create'
            ? 'Creating...'
            : 'Saving...'
          : mode === 'create'
            ? 'Create Feature Request'
            : 'Save Changes'}
      </Button>
    </form>
  )
}