import { Link } from '@tanstack/react-router'
import { Layers } from 'lucide-react'
import { UserMenu } from '@/features/auth/components/UserMenu'
import { ModeToggle } from './ModeToggle'

export function Header() {
  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-backdrop-filter:bg-background/60'>
      <div className='container flex h-14 max-w-screen-2xl items-center mx-auto px-4'>
        {/* LOGO */}
        <div className='mr-4 flex'>
          <Link to='/' className='mr-6 flex items-center space-x-2'>
            <div className='bg-primary/10 p-1 rounded-md'>
              <Layers className='h-6 w-6 text-primary' />
            </div>
            <span className='hidden font-bold sm:inline-block tracking-tight text-lg'>
              Good<span className='text-primary'>Sync</span>
            </span>
          </Link>

          {/* NAVIGATION (Desktop) */}
          <nav className='flex items-center gap-6 text-sm font-medium'>
            <Link
              to='/scores'
              className='transition-colors hover:text-foreground/80 text-foreground/60'
              activeProps={{ className: 'text-foreground font-semibold' }}
            >
              Scores
            </Link>
            <Link
              to='/demo'
              className='transition-colors hover:text-foreground/80 text-foreground/60'
              activeProps={{ className: 'text-foreground font-semibold' }}
            >
              Data Explorer
            </Link>
          </nav>
        </div>

        {/* RECHTE SEITE */}
        <div className='flex flex-1 items-center justify-end space-x-2'>
          <nav className='flex items-center gap-2'>
            <a
              href='https://github.com/lucas-bur'
              target='_blank'
              rel='noreferrer'
              className='hidden md:inline-flex items-center justify-center h-9 px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent hover:text-accent-foreground focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none ring-offset-background'
            >
              Documentation
            </a>
            <ModeToggle />
            <UserMenu />
          </nav>
        </div>
      </div>
    </header>
  )
}
