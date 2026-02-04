import { useState } from 'react'
import { toast } from 'sonner' // oder console.log als Fallback
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from '@/features/auth/lib/auth-client'

export function UserProfile() {
  const { data: session } = authClient.useSession()
  const [name, setName] = useState(session?.user.name || '')
  const [loading, setLoading] = useState(false)

  // Update syncen, wenn Session geladen wird
  if (session?.user.name && name === '') setName(session.user.name)

  async function updateProfile() {
    setLoading(true)
    try {
      await authClient.updateUser({
        name: name,
        // image: ... hier könnte man auch Image URL updaten
      })
      toast.success('Profil aktualisiert')
    } catch (error) {
      console.error(error)
      toast.error('Fehler beim Aktualisieren')
    } finally {
      setLoading(false)
    }
  }

  if (!session) return null

  return (
    <div className='mx-auto max-w-2xl space-y-6 p-6'>
      <h1 className='text-3xl font-bold'>Einstellungen</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>
            Aktualisiere deine persönlichen Informationen.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid w-full items-center gap-1.5'>
            <Label htmlFor='email'>Email</Label>
            <Input
              type='email'
              id='email'
              value={session.user.email}
              disabled
            />
            <p className='text-sm text-muted-foreground'>
              E-Mail kann nicht geändert werden.
            </p>
          </div>

          <div className='grid w-full items-center gap-1.5'>
            <Label htmlFor='name'>Name</Label>
            <Input
              type='text'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={updateProfile} disabled={loading}>
            {loading ? 'Speichert...' : 'Speichern'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
