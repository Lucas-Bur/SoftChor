import { useLiveQuery } from '@tanstack/react-db'
import { createFileRoute } from '@tanstack/react-router'
import { Database, Loader2, Plus, User } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { postsCollection, usersCollection } from '@/db-collections'

export const Route = createFileRoute('/_authenticated/demo')({
  component: DemoDrizzle,
  loader: async () => {
    // loader zeiht auch erst, wenn man wirklich erst, wenn man beforeLoad von der auth Route bestanden hat!
    // Vorladen der Daten
    await usersCollection.preload()
  },
  ssr: 'data-only',
})

function LiveUsers() {
  const { data: liveUsers, isLoading } = useLiveQuery((q) =>
    q
      .from({ usersCollection })
      .orderBy(({ usersCollection }) => usersCollection.name),
  )

  const { data: livePosts } = useLiveQuery((q) => q.from({ postsCollection }))

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-muted-foreground'>
        <Loader2 className='h-8 w-8 animate-spin mb-2' />
        <p>Synchronisiere Daten...</p>
      </div>
    )
  }

  if (liveUsers.length === 0) {
    return (
      <div className='text-center py-12 border-2 border-dashed border-border/50 rounded-xl bg-card/30'>
        <User className='h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-50' />
        <p className='text-muted-foreground'>Keine User gefunden.</p>
        <p className='text-xs text-muted-foreground/60'>
          Erstelle einen neuen User unten.
        </p>
      </div>
    )
  }

  return (
    <ul className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-6'>
      {liveUsers.map((user) => (
        <li
          key={user.id}
          className='group relative overflow-hidden rounded-xl border border-border/50 bg-card/40 p-4 transition-all hover:bg-card/60 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5'
        >
          {/* Decorative Gradient Blob */}
          <div className='absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/10 blur-xl transition-all group-hover:bg-primary/20' />

          <div className='relative flex items-center justify-between'>
            <div>
              <span className='block font-medium text-foreground group-hover:text-primary transition-colors'>
                {user.name}
              </span>
              <span className='text-xs font-mono text-muted-foreground/70 truncate block max-w-[150px]'>
                {user.email}
              </span>
            </div>
            <span className='text-[10px] font-mono py-1 px-2 rounded bg-background border border-border text-muted-foreground'>
              #{user.id}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}

function DemoDrizzle() {
  const handleAddUser = async () => {
    try {
      const fakeId = Math.floor(Math.random() * 100000) * -1 // Negative ID für optimistic Updates, btw this is just wrong and adds flickering
      usersCollection.insert({
        age: 20 + Math.floor(Math.random() * 30),
        email: `user${Date.now()}@example.com`,
        id: fakeId,
        name: `User ${Math.floor(Math.random() * 1000)}`,
      })
      toast.success('User erstellt (Optimistic Update)')
    } catch (_e) {
      toast.error('Fehler beim Erstellen')
    }
  }

  const handleAddPost = async () => {
    try {
      const fakeId = -1
      postsCollection.insert({
        content: 'Das ist der wildeste Content ever!',
        id: fakeId,
        userId: 72,
        title: 'Es ist soweit!',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    } catch (_e) {
      toast.error('Fehler beim erstellen')
    }
  }

  return (
    <div className='min-h-screen bg-background relative flex flex-col items-center pt-20 px-4'>
      {/* Background Decor */}
      <div className='fixed inset-0 pointer-events-none'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]' />
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]' />
      </div>

      <div className='w-full max-w-4xl relative z-10'>
        {/* Header Section */}
        <div className='mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-foreground flex items-center gap-2'>
              <Database className='h-8 w-8 text-primary' />
              Live Database
            </h1>
            <p className='text-muted-foreground mt-1'>
              Echtzeit-Synchronisation zwischen Client & Server.
            </p>
          </div>
          <Button
            onClick={handleAddUser}
            className='shadow-lg shadow-primary/20'
          >
            <Plus className='mr-2 h-4 w-4' /> User hinzufügen
          </Button>
          <Button
            onClick={handleAddPost}
            className='shadow-lg shadow-primary/20'
          >
            <Plus className='mr-2 h-4 w-4' /> Post hinzufügen
          </Button>
        </div>

        {/* Content Area */}
        <div className='rounded-2xl border border-border bg-card/30 backdrop-blur-md shadow-2xl overflow-hidden'>
          <div className='p-6 border-b border-border/50 bg-muted/20 flex justify-between items-center'>
            <h2 className='font-semibold flex items-center gap-2'>
              <span className='relative flex h-2 w-2'>
                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
                <span className='relative inline-flex rounded-full h-2 w-2 bg-green-500'></span>
              </span>
              Users Table
            </h2>
            <div className='text-xs font-mono text-muted-foreground'>
              Sync Active
            </div>
          </div>

          <div className='p-6'>
            <LiveUsers />
          </div>

          <div className='bg-muted/30 p-6 border-t border-border/50'>
            <h3 className='text-sm font-semibold mb-3 text-foreground'>
              Wie das funktioniert:
            </h3>
            <div className='grid md:grid-cols-3 gap-4 text-xs text-muted-foreground'>
              <div className='p-3 rounded border border-border/50 bg-background/50'>
                <strong className='block text-primary mb-1'>
                  1. Optimistic UI
                </strong>
                Daten werden sofort lokal angezeigt, noch bevor der Server
                antwortet.
              </div>
              <div className='p-3 rounded border border-border/50 bg-background/50'>
                <strong className='block text-primary mb-1'>
                  2. Electric Sync
                </strong>
                Im Hintergrund synchronisiert der Client Änderungen über den
                generischen Proxy-Endpoint.
              </div>
              <div className='p-3 rounded border border-border/50 bg-background/50'>
                <strong className='block text-primary mb-1'>
                  3. Server Validation
                </strong>
                Der Server validiert den Schreibvorgang und schreibt via Drizzle
                in die Neon DB.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
