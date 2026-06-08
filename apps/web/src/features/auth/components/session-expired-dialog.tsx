import { LogIn } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

import { Button } from '@workspace/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'

import { tokenStore } from '@/features/auth/lib/api.ts'

type SessionExpiredDialogProps = {
  open: boolean
}

export function SessionExpiredDialog({ open }: SessionExpiredDialogProps) {
  const navigate = useNavigate()

  function handleLogin() {
    tokenStore.clear()
    navigate({ to: '/login' })
  }

  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Session expired</DialogTitle>
          <DialogDescription>
            Your session has expired. Please sign in again to continue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleLogin}>
            <LogIn data-icon="inline-start" />
            Sign in again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
