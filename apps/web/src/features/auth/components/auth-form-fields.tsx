import type React from 'react'

import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { cn } from '@workspace/ui/lib/utils'

type FieldProps = {
  id: string
  label: string
  children: React.ReactNode
  action?: React.ReactNode
}

export function AuthField({ id, label, children, action }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id} className="text-muted-foreground text-xs">
          {label}
        </Label>
        {action}
      </div>
      {children}
    </div>
  )
}

export function AuthInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn('h-10 rounded-xl px-3 text-sm', className)}
      {...props}
    />
  )
}

export function AuthSubmitButton({
  children,
  loading,
}: {
  children: React.ReactNode
  loading: boolean
}) {
  return (
    <Button
      type="submit"
      disabled={loading}
      className="mt-2 h-10 w-full rounded-xl"
    >
      {loading ? 'Please wait…' : children}
    </Button>
  )
}
