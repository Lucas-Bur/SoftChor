import { Repertoire } from '@/features/scores/components/Repertoire'
import { songsCollection } from '@/features/scores/db/collections'

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/scores/')({
  component: () => <Repertoire />,
  loader: async () => {
    await songsCollection.preload()
  },
  ssr: 'data-only',
})
