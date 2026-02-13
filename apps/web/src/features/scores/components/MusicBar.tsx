import { useState } from 'react'

import { ChevronDown, ChevronUp, Play, SkipBack, SkipForward } from 'lucide-react'
import { motion } from 'motion/react'

import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useSongContext } from '@/features/scores/context/SongContext'
import { voicesCollection } from '@/features/scores/db/collections'

import { eq, useLiveQuery } from '@tanstack/react-db'

export function MusicBar() {
  const { songTitle, selectedSongId } = useSongContext()
  const [currentVoice, setCurrentVoice] = useState('gesamt')
  const [isCollapsed, setIsCollapsed] = useState(false)

  const { data: voices } = useLiveQuery(q =>
    q.from({ voicesCollection }).where(v => eq(v.voicesCollection.songId, selectedSongId))
  )

  const voiceOptions = voices
    .map(v => ({
      label: v.labelRaw,
      value: v.id,
    }))
    .concat([{ label: 'Gesamt', value: 'gesamt' }])

  return (
    <footer className='fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t p-4 pb-8 lg:pb-4'>
      <div className='max-w-3xl mx-auto space-y-4'>
        <div className='flex justify-center items-center'>
          <p className='font-semibold text-lg'>{songTitle ?? 'Kein Song ausgewählt'}</p>
          <div className='ml-auto flex items-center gap-2'>
            <ToggleGroup
              type='single'
              value={currentVoice}
              onValueChange={v => v && setCurrentVoice(v)}
              variant='outline'
              spacing={0}
              className='justify-center flex-wrap'
            >
              {voiceOptions.map(v => (
                <ToggleGroupItem
                  key={v.value}
                  value={v.value}
                  className='rounded-full px-4 h-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground'
                >
                  {v.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsCollapsed(!isCollapsed)}
              className='ml-2'
            >
              {isCollapsed ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>
        </div>

        <motion.div
          layout
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isCollapsed ? 0 : 1,
            height: isCollapsed ? 0 : 'auto',
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            bounce: 0,
            duration: 0.3,
          }}
          className='space-y-2 overflow-hidden'
          style={{
            visibility: isCollapsed ? 'hidden' : 'visible',
            pointerEvents: isCollapsed ? 'none' : 'auto',
          }}
        >
          <Slider defaultValue={[33]} max={100} step={1} className='w-full' />
          <div className='flex justify-center items-center gap-8'>
            <Button variant='ghost' size='icon'>
              <SkipBack />
            </Button>
            <Button size='icon' className='h-14 w-14 rounded-full bg-foreground text-background'>
              <Play className='fill-current h-6 w-6' />
            </Button>
            <Button variant='ghost' size='icon'>
              <SkipForward />
            </Button>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
