import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { authClient } from '@/features/auth/lib/auth-client'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: async ({ location }) => {
    // beforeLoad checkt über Client, ob Anmeldung besteht
    const { data } = await authClient.getSession()
    const session = data

    if (!session) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.pathname,
        },
      })
    }
    // return { session }
  },
})

function AuthenticatedLayout() {
  return <Outlet />
}
