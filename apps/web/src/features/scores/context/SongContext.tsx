import { createContext, type ReactNode, useContext, useState } from 'react'

interface SongContextType {
  selectedSongId: string | null
  setSelectedSongId: (songId: string | null) => void
  songTitle: string | null
  setSongTitle: (title: string | null) => void
  showAddSongForm: boolean
  setShowAddSongForm: (show: boolean) => void
}

const SongContext = createContext<SongContextType | undefined>(undefined)

export function SongProvider({ children }: { children: ReactNode }) {
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null)
  const [songTitle, setSongTitle] = useState<string | null>(null)
  const [showAddSongForm, setShowAddSongForm] = useState(false)

  return (
    <SongContext.Provider
      value={{
        selectedSongId,
        setSelectedSongId,
        songTitle,
        setSongTitle,
        showAddSongForm,
        setShowAddSongForm,
      }}
    >
      {children}
    </SongContext.Provider>
  )
}

export function useSongContext() {
  const context = useContext(SongContext)
  if (!context) {
    throw new Error('useSongContext must be used within a SongProvider')
  }
  return context
}
