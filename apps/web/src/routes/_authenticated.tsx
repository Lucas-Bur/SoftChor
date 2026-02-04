import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getSessionServerFn } from '@/features/auth/lib/auth-server'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: async ({ location }) => {
    // beforeLoad checkt über Client, ob Anmeldung besteht
    const data = await getSessionServerFn()

    if (!data) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.pathname,
        },
      })
    }
  },
})

function AuthenticatedLayout() {
  return <Outlet />
}
