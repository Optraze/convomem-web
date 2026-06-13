import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { tokenStore } from '@/features/auth/lib/api'

export function SessionExpiredDialog() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function handleAuthChange() {
      const token = tokenStore.getAccessToken()
      if (!token) {
        setOpen(true)
      }
    }

    window.addEventListener('auth-change', handleAuthChange)
    return () => window.removeEventListener('auth-change', handleAuthChange)
  }, [])

  function handleLogin() {
    setOpen(false)
    navigate({ to: '/login' })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Session expired</DialogTitle>
          <DialogDescription>
            Your session has expired. Please sign in again to continue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleLogin} className="w-full">
            Sign in
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
