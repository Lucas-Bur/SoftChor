import { useState } from 'react'

import { ArrowRight, Music2, Plus, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AddSongForm } from '@/features/scores/components/AddSongForm'
import { useSongContext } from '@/features/scores/context/SongContext'
import { songsCollection } from '@/features/scores/db/collections'

import { StatusBadge } from './StatusBadge'

import type { Song } from '@repo/database'

import { useLiveQuery } from '@tanstack/react-db'
import { Link } from '@tanstack/react-router'

export function Repertoire() {
  const [searchQuery, setSearchQuery] = useState('')

  const { data: songs } = useLiveQuery(query =>
    query.from({ songsCollection }).orderBy(q => q.songsCollection.createdAt)
  )

  const { setSelectedSongId, setSongTitle, showAddSongForm, setShowAddSongForm } = useSongContext()

  // Filter songs based on search query
  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSongClick = (song: Song) => {
    setSelectedSongId(song.id)
    setSongTitle(song.title)
  }

  const handleAddSongClick = () => {
    setShowAddSongForm(true)
  }

  const handleCloseForm = () => {
    setShowAddSongForm(false)
  }

  // console.log(songs)

  return (
    <div className='flex flex-col text-foreground'>
      {/* Header */}
      <header className='p-4 space-y-4'>
        <div className='flex gap-2'>
          <InputGroup className='bg-background'>
            <InputGroupInput
              placeholder='Song suchen...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
          <Button onClick={handleAddSongClick}>
            <Plus className='h-4 w-4' /> Neu
          </Button>
        </div>
      </header>

      {/* Add Song Dialog */}
      <AddSongForm open={showAddSongForm} onOpenChange={handleCloseForm} />

      {/* Main Content - Repertoire List */}
      <ScrollArea className='flex-1 px-4'>
        <h2 className='text-xs font-semibold mb-4 opacity-50 uppercase tracking-wider'>
          Aktuelles Repertoire{' '}
          <span className='float-right text-[10px]'>{filteredSongs.length} Titel</span>
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pb-32'>
          {filteredSongs.map(song => {
            return (
              <Card
                key={song.id}
                className='group flex-row items-center gap-4 py-2 px-3 rounded-xl border border-transparent hover:border-primary/50 transition-colors'
              >
                <div className='h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary'>
                  <Music2 />
                </div>
                <div className='flex-1'>
                  <h3 className='font-medium leading-none'>{song.title}</h3>
                  {/* <p className='text-sm text-muted-foreground mt-1'>
                    Leonard Cohen
                  </p> */}
                  <div className='flex items-center gap-2 mt-2'>
                    <StatusBadge status={song.status} />
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Button
                    size='icon'
                    onClick={() => handleSongClick(song)}
                    aria-label={`Load ${song.title} into musicbar`}
                    className='cursor-pointer'
                  >
                    <Music2 className='h-4 w-4' />
                  </Button>
                  <Link
                    to='/scores/$songId'
                    params={{ songId: song.id }}
                    className="inline-flex items-center justify-center gap-2 size-9 rounded-md border bg-background text-sm font-medium shadow-xs transition-all outline-none shrink-0 whitespace-nowrap hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:border-input dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0"
                    aria-label='Zu Song Details'
                  >
                    <ArrowRight className='size-4' />
                  </Link>
                </div>
              </Card>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
