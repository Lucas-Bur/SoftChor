import { createFileRoute } from '@tanstack/react-router'
import { Repertoire } from '@/features/scores/components/Repertoire'
import { songsCollection } from '@/features/scores/db/collections'

export const Route = createFileRoute('/_authenticated/scores/')({
  component: () => <Repertoire />,
  loader: async () => {
    await songsCollection.preload()
  },
  ssr: 'data-only',
})
