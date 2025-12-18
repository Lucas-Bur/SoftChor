import { createFileRoute } from '@tanstack/react-router'
import { auth } from '@/features/auth/lib/auth-server' // Dein Auth Server Import
import { isAllowedTable } from '@/lib/electric-helpers'
import { prepareElectricUrl, proxyElectricRequest } from '@/lib/electric-proxy'

const serve = async ({ request }: { request: Request }) => {
  // 1. Auth Check (Optional aber empfohlen)
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) return new Response('Unauthorized', { status: 401 })

  const url = new URL(request.url)
  const table = url.searchParams.get('table')

  // 2. Security: Tabellen-Whitelist Check
  if (!table || !isAllowedTable(table)) {
    return new Response(
      JSON.stringify({ error: 'Table not allowed or missing' }),
      {
        status: 403,
        headers: { 'content-type': 'application/json' },
      },
    )
  }

  // 3. Proxy Request vorbereiten
  const originUrl = prepareElectricUrl(request.url)

  // Wichtig: Der Parameter muss korrekt an Electric weitergegeben werden
  originUrl.searchParams.set('table', table)

  return proxyElectricRequest(originUrl)
}

export const Route = createFileRoute('/api/sync/$')({
  server: {
    handlers: {
      GET: serve,
    },
  },
})
