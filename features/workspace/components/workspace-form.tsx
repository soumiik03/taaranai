'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createOrganization } from '../actions'

const schema = z.object({
  name: z.string().min(2, 'Too short').max(50, 'Too long'),
})

type FormValues = z.infer<typeof schema>

export function WorkspaceForm() {
  const [isPending, startTransition] = useTransition()
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  })

  function onSubmit(values: FormValues) {
    const formData = new FormData()
    formData.set('name', values.name)
    startTransition(() => {
      createOrganization(formData)
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input placeholder="Acme Inc." {...form.register('name')} />
        {form.formState.errors.name && (
          <p className="mt-1 text-sm text-red-500">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Creating...' : 'Create workspace'}
      </Button>
    </form>
  )
}