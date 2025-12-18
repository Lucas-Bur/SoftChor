import { createFileRoute } from '@tanstack/react-router'
import { UserProfile } from '@/features/auth/components/UserProfile'
import { authMiddleware } from '@/features/auth/middleware/auth'

export const Route = createFileRoute('/profile')({
  component: UserProfile,
  server: {
    middleware: [authMiddleware],
  },
})
