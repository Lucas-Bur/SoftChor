import { createFileRoute, useSearch } from '@tanstack/react-router'
import z from 'zod'
import { AuthForm } from '@/components/AuthForm'
import { guestMiddleware } from '@/middleware/auth'

const loginSearchSchema = z.object({
  redirect: z.string().optional().default('').catch(''),
})

export const Route = createFileRoute('/login')({
  component: LoginPage,
  server: {
    middleware: [guestMiddleware],
  },
  validateSearch: loginSearchSchema,
})

function LoginPage() {
  const { redirect } = useSearch({ from: '/login' })
  return <AuthForm redirectTo={redirect} />
}
