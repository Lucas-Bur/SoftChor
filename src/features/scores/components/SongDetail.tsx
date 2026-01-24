import { useLiveQuery } from '@tanstack/react-db'
import { Link, useParams } from '@tanstack/react-router'
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Music2,
} from 'lucide-react'
import { useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { StatusBadge } from '@/features/scores/components/StatusBadge'
import { useSongContext } from '@/features/scores/context/SongContext'
import {
  filesCollection,
  songsCollection,
  voicesCollection,
} from '@/features/scores/db/collections'
import type { SongFile, SongVoice } from '@/features/scores/db/schema'

function FileTypeBadge({ fileType }: { fileType: SongFile['fileType'] }) {
  const fileTypeLabels: Record<SongFile['fileType'], string> = {
    ORIGINAL_PDF: 'PDF',
    MUSIC_XML: 'XML',
    FULL_MP3: 'MP3',
    VOICE_MP3: 'VOICE',
  }

  return (
    <Badge variant='outline' className='text-[10px] h-5'>
      {fileTypeLabels[fileType] || fileType}
    </Badge>
  )
}

function VoiceTypeBadge({ voiceType }: { voiceType: SongVoice['voiceType'] }) {
  const voiceTypeLabels: Record<string, string> = {
    SOPRANO: 'Sopran',
    ALTO: 'Alt',
    TENOR: 'Tenor',
    BASS: 'Bass',
    OTHER: 'Andere',
    UNASSIGNED: 'Nicht zugewiesen',
  }

  const variantMap: Record<
    string,
    'default' | 'destructive' | 'outline' | 'secondary'
  > = {
    SOPRANO: 'default',
    ALTO: 'secondary',
    TENOR: 'outline',
    BASS: 'destructive',
    OTHER: 'outline',
    UNASSIGNED: 'outline',
  }

  const type = voiceType || 'UNASSIGNED'
  const label = voiceTypeLabels[type] || type
  const variant = variantMap[type] || 'outline'

  return (
    <Badge variant={variant} className='text-[10px] h-5'>
      {label}
    </Badge>
  )
}

export function SongDetail() {
  const { songId } = useParams({ from: '/_authenticated/scores/$songId' })
  const { setSelectedSongId, setSongTitle } = useSongContext()

  const { data: songs } = useLiveQuery((q) =>
    q.from({ songsCollection }).orderBy((q) => q.songsCollection.createdAt),
  )

  const { data: files } = useLiveQuery((q) =>
    q.from({ filesCollection }).orderBy((q) => q.filesCollection.createdAt),
  )

  const { data: voices } = useLiveQuery((q) =>
    q.from({ voicesCollection }).orderBy((q) => q.voicesCollection.createdAt),
  )

  const song = songs.find((s) => s.id === songId)
  const songFiles = files.filter((f) => f.songId === songId)
  const songVoices = voices.filter((v) => v.songId === songId)

  // Set the song as selected when this component mounts
  useEffect(() => {
    if (song) {
      setSelectedSongId(song.id)
      setSongTitle(song.title)
    }
  }, [song, setSelectedSongId, setSongTitle])

  if (!song) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen p-8'>
        <div className='text-center space-y-4'>
          <AlertTriangle className='h-16 w-16 text-destructive mx-auto' />
          <h2 className='text-2xl font-bold'>Song nicht gefunden</h2>
          <p className='text-muted-foreground'>
            Der angeforderte Song konnte nicht gefunden werden.
          </p>
          <Button asChild>
            <Link to='/scores'>Zurück zur Übersicht</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col text-foreground min-h-screen'>
      {/* Header */}
      <header className='p-4 space-y-4 border-b backdrop-blur-sm sticky top-0 z-10'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='icon' asChild>
            <Link to='/scores'>
              <ArrowLeft className='h-5 w-5' />
            </Link>
          </Button>
          <div className='flex-1'>
            <h1 className='text-xl font-bold leading-tight'>{song.title}</h1>
            <div className='flex items-center gap-2 mt-1'>
              <StatusBadge status={song.status} />
              {song.errorMessage && (
                <Badge variant='destructive' className='text-[10px] h-5'>
                  Fehler
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <ScrollArea className='flex-1 p-4 pb-32'>
        <div className='max-w-4xl mx-auto space-y-6'>
          {/* Song Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Music2 className='h-5 w-5 text-primary' />
                Song Details
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>Status</p>
                  <StatusBadge status={song.status} />
                </div>
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>Erstellt</p>
                  <div className='flex items-center gap-2 text-sm'>
                    <Calendar className='h-4 w-4 text-muted-foreground' />
                    {song.createdAt
                      ? new Date(song.createdAt).toLocaleDateString('de-DE', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'N/A'}
                  </div>
                </div>
                {song.startedAt && (
                  <div className='space-y-1'>
                    <p className='text-sm text-muted-foreground'>Gestartet</p>
                    <div className='flex items-center gap-2 text-sm'>
                      <Clock className='h-4 w-4 text-muted-foreground' />
                      {new Date(song.startedAt).toLocaleDateString('de-DE', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                )}
                {song.finishedAt && (
                  <div className='space-y-1'>
                    <p className='text-sm text-muted-foreground'>
                      Abgeschlossen
                    </p>
                    <div className='flex items-center gap-2 text-sm'>
                      <Clock className='h-4 w-4 text-muted-foreground' />
                      {new Date(song.finishedAt).toLocaleDateString('de-DE', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                )}
              </div>

              {song.errorMessage && (
                <div className='p-4 bg-destructive/10 border border-destructive/20 rounded-lg space-y-2'>
                  <div className='flex items-center gap-2 text-destructive font-semibold'>
                    <AlertTriangle className='h-4 w-4' />
                    Fehlermeldung
                  </div>
                  <p className='text-sm text-destructive/80'>
                    {song.errorMessage}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Files Section */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <FileText className='h-5 w-5 text-primary' />
                Dateien
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                {songFiles.length > 0 ? (
                  songFiles.map((file) => (
                    <div
                      key={file.id}
                      className='flex items-center justify-between p-3 rounded-lg bg-muted/50'
                    >
                      <div className='flex items-center gap-3'>
                        <FileTypeBadge fileType={file.fileType} />
                        <span className='text-sm font-medium'>
                          {file.fileType.replace('_', ' ')}
                        </span>
                      </div>
                      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        {file.sizeBytes && (
                          <span>
                            {(file.sizeBytes / 1024 / 1024).toFixed(2)} MB
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className='text-sm text-muted-foreground'>
                    Keine Dateien vorhanden
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Voices Section */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Music2 className='h-5 w-5 text-primary' />
                Stimmen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                {songVoices.length > 0 ? (
                  songVoices.map((voice) => (
                    <div
                      key={voice.id}
                      className='flex items-center justify-between p-3 rounded-lg bg-muted/50'
                    >
                      <div className='flex items-center gap-3'>
                        <VoiceTypeBadge voiceType={voice.voiceType} />
                        <span className='text-sm font-medium'>
                          {voice.labelRaw}
                        </span>
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        {voice.createdAt
                          ? new Date(voice.createdAt).toLocaleDateString(
                              'de-DE',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              },
                            )
                          : ''}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className='text-sm text-muted-foreground'>
                    Keine Stimmen vorhanden
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
