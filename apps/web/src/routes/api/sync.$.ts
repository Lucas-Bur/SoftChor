import { getSession } from '@repo/auth'

import { isAllowedTable } from '@/features/sync/lib/electric-helpers'
import { prepareElectricUrl, proxyElectricRequest } from '@/features/sync/lib/electric-proxy'

import { createFileRoute } from '@tanstack/react-router'

// Ein paar Anmerkungen zu diesem Part. Per Default ist Electric SQL Public.
// Dementsprechend ist es unsere Aufgabe den korrekten Zugriff auf die gewollten
// Daten sicherzustellen. Das beinhaltet also auch, dass Auth und Rechte des jeweiligen
// User gecheckt werden, dass die Daten für den User gefiltert werden und dass im
// schlimmsten Fall effiziente Queries an die Sync-Engine gestellt werden (komplexe Joins).
// Im einzelnen lässt sich das über einen generischen Proxy wie diesen nicht ganzheitlich
// abbilden. Eigentlich will man den sync so simpel wie möglich halten. Wenn das nicht geht,
// müssen zukünftig einzelne Tabellen eigene Endpunkte bekommen (yikes).
// Man könnte einen Gatekeepter noch zwischenschalten, was allerdings wieder einiges doppelt
// vermoppelt und man am Ende doch lieber je Tabelle einen eigenen Endpunkt haben sollte.

// Ein paar Quellen:
// https://electric-sql.com/docs/guides/security#network-security
// https://electric-sql.com/docs/guides/auth#proxy-auth
// https://electric-sql.com/docs/guides/auth#type-safe-where-clause-generation

const serve = async ({ request }: { request: Request }) => {
  // 1. Auth Check (Optional aber empfohlen)
  const session = await getSession(request.headers)
  if (!session) return new Response('Unauthorized', { status: 401 })

  const url = new URL(request.url)
  const table = url.searchParams.get('table')

  // 2. Security: Tabellen-Whitelist Check
  if (!table || !isAllowedTable(table)) {
    return new Response(JSON.stringify({ error: 'Table not allowed or missing' }), {
      status: 403,
      headers: { 'content-type': 'application/json' },
    })
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
