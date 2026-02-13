import { MusicBar } from '@/features/scores/components/MusicBar'
import { SongProvider } from '@/features/scores/context/SongContext'
import { songsCollection } from '@/features/scores/db/collections'

import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/scores')({
  component: () => (
    <SongProvider>
      <div className='flex flex-col'>
        <Outlet />
        <MusicBar />
      </div>
    </SongProvider>
  ),
  loader: async () => {
    await songsCollection.preload()
  },
  ssr: 'data-only',
})
