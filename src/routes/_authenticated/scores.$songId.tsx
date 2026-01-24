import { createFileRoute } from '@tanstack/react-router'
import { SongDetail } from '@/features/scores/components/SongDetail'
import { songsCollection } from '@/features/scores/db/collections'

export const Route = createFileRoute('/_authenticated/scores/$songId')({
  component: () => <SongDetail />,
  loader: async ({ params }) => {
    await songsCollection.preload()
    return { songId: params.songId }
  },
  ssr: 'data-only',
})
