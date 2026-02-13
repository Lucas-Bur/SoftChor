import { UserProfile } from '@/features/auth/components/UserProfile'
import { authMiddleware } from '@/features/auth/middleware/auth'

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile')({
  component: UserProfile,
  server: {
    middleware: [authMiddleware],
  },
})
