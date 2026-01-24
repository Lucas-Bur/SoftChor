import { createFileRoute, Link } from '@tanstack/react-router'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Database,
  Fingerprint,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { enqueueSongProcessing } from '@/features/queue/services/queue'

export const Route = createFileRoute('/')({ component: LandingPage })

function LandingPage() {
  return (
    <div className='flex flex-col min-h-screen text-foreground overflow-hidden'>
      {/* HERO SECTION */}
      <section className='relative pt-24 pb-32 px-6 overflow-hidden'>
        {/* Abstract Background Elements */}
        {/* <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 blur-[20px] rounded-full opacity-100 pointer-events-none border-0 border-none' /> */}

        <div className='relative max-w-4xl mx-auto text-center z-10'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium text-muted-foreground mb-6  border-0 border-none'>
            <span className='flex h-2 w-2 rounded-full bg-primary animate-pulse'></span>
            Sync Engine v0.1 Experimental
          </div>

          <h1 className='text-5xl md:text-7xl font-bold tracking-tight mb-8'>
            <span className='text-foreground'>Local First.</span>
            <br />
            <span className='text-transparent bg-clip-text bg-linear-to-r from-primary via-cyan-400 to-purple-500 animate-text-glow'>
              Global Sync.
            </span>
          </h1>

          <p className='text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed'>
            Ein Experiment mit TanStack Start, Electric SQL und Drizzle ORM. Wie
            gut funktioniert der "Modern Data Stack" wirklich?
          </p>

          <div className='flex flex-wrap items-center justify-center gap-4'>
            <Button
              size='lg'
              className='h-12 px-8 text-base shadow-lg shadow-primary/20'
              asChild
            >
              <Link to='/demo'>
                Zur Demo App <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
            <Button
              variant='outline'
              size='lg'
              className='h-12 px-8 text-base backdrop-blur-sm bg-background/30'
              asChild
            >
              <a href='#analysis'>Die Analyse lesen</a>
            </Button>
          </div>
          <Button
            variant='outline'
            size='lg'
            className='h-12 px-8 text-base backdrop-blur-sm bg-background/30'
            onClick={async () => {
              const res = await enqueueSongProcessing({
                data: { jobId: '09b11d0b-05a3-4ce3-9a8d-840034c1223c' },
              })
              console.log(res)
            }}
          >
            Hier testen
          </Button>
        </div>
      </section>

      {/* ANALYSIS CONTENT SECTION */}
      <section id='analysis' className='py-24 bg-secondary/20 relative'>
        <div className='container max-w-4xl mx-auto px-6'>
          <div className='prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-primary max-w-none'>
            <div className='mb-16'>
              <h2 className='flex items-center gap-3 text-3xl mb-6'>
                <Cpu className='text-primary h-8 w-8' />
                Der Hype vs. Die Realität
              </h2>
              <p>
                Nach so viel Hype um die neuen Sync-Engines musste ich es selbst
                ausprobieren. Das Versprechen von <strong>TanStack DB</strong>{' '}
                und <strong>Electric SQL</strong> ist verlockend: Eine
                typsichere Basis für Local-First Applikationen. Einmal
                aufsetzen, Schema definieren, und die Daten fließen automatisch
                zwischen Client und Server. Kein doppelter Code, keine manuellen
                Fetch-Requests, pure Magie.
              </p>
              <div className='not-prose my-8 p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm shadow-sm flex items-start gap-4'>
                <CheckCircle2 className='h-6 w-6 text-green-500 shrink-0 mt-1' />
                <div>
                  <h4 className='font-semibold text-foreground'>Das Ziel</h4>
                  <p className='text-muted-foreground text-sm mt-1'>
                    Ein reaktives Frontend, das sich anfühlt wie eine native
                    App, ohne komplexe API-Layer schreiben zu müssen.
                  </p>
                </div>
              </div>
            </div>

            <div className='grid md:grid-cols-2 gap-12 mb-16'>
              <div>
                <h3 className='text-xl font-bold mb-4 flex items-center gap-2'>
                  <Database className='w-5 h-5 text-purple-400' />
                  Der Setup Pain
                </h3>
                <p className='text-base text-muted-foreground'>
                  Ganz so einfach ist es leider nicht. Gerade das Setup von
                  Drizzle und Neon in Kombination mit Electric erfordert
                  Disziplin. Schemas müssen oft so strukturiert werden, dass sie
                  vom Server und vom Client-Bundle importiert werden können,
                  ohne dass Node.js-spezifische Abhängigkeiten das Frontend
                  crashen.
                </p>
              </div>
              <div>
                <h3 className='text-xl font-bold mb-4 flex items-center gap-2'>
                  <Fingerprint className='w-5 h-5 text-purple-400' />
                  Identity & Security
                </h3>
                <p className='text-base text-muted-foreground'>
                  Theoretisch synct Electric <em>alles</em>. Man muss explizit
                  definieren, was gesynct werden soll ("Shapes"). Aber Vorsicht:
                  User-Permissions sind komplex. Es reicht nicht, Collections zu
                  joinen. Man muss sicherstellen, dass sensible Daten erst gar
                  nicht den Weg in den Sync-Stream finden.
                </p>
              </div>
            </div>

            <div className='bg-destructive/10 border border-destructive/20 rounded-xl p-8 not-prose'>
              <h3 className='text-destructive font-bold flex items-center gap-2 text-xl mb-4'>
                <AlertTriangle className='h-6 w-6' />
                The Pitfalls
              </h3>
              <ul className='space-y-3 text-muted-foreground'>
                <li className='flex gap-3'>
                  <span className='text-destructive font-bold'>•</span>
                  <span>
                    <strong>API Overhead:</strong> Ohne generische Abstraktion
                    benötigt man theoretisch für jede Tabelle einen eigenen
                    Proxy-Endpoint. Das skaliert schlecht.
                  </span>
                </li>
                <li className='flex gap-3'>
                  <span className='text-destructive font-bold'>•</span>
                  <span>
                    <strong>String Typing:</strong> Tabellennamen werden oft als
                    Strings übergeben (
                    <code>params: &#123; table: 'users' &#125;</code>). Hier
                    verliert man die Typsicherheit, wenn man nicht strikte
                    Enums/Const-Arrays nutzt.
                  </span>
                </li>
                <li className='flex gap-3'>
                  <span className='text-destructive font-bold'>•</span>
                  <span>
                    <strong>Sync Granularität:</strong> Zu kontrollieren,
                    welcher User welche Row sehen darf, ist deutlich komplexer
                    als bei einer traditionellen REST/Trpc API.
                  </span>
                </li>
              </ul>
            </div>

            <div className='mt-12 p-6 bg-primary/5 rounded-xl border border-primary/10'>
              <h3 className='text-primary font-bold text-lg mb-2'>
                Die Lösung in diesem Projekt
              </h3>
              <p className='text-sm text-muted-foreground'>
                Um den Boilerplate zu reduzieren, nutzt diese Demo eine{' '}
                <strong>generische Server Function</strong>, die
                Tabellenanfragen dynamisch proxied und gegen eine Whitelist
                prüft. Schau dir den Code in
                <code>/lib/electric-helpers.ts</code> und{' '}
                <code>/routes/api/sync.ts</code> an.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TECH STACK FOOTER */}
      <footer className='py-12 border-t border-border/40 bg-background/50 backdrop-blur-md'>
        <div className='container mx-auto text-center'>
          <p className='text-sm text-muted-foreground mb-6'>
            Powered by the Bleeding Edge Stack
          </p>
          <div className='flex justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500'>
            {/* Platzhalter für Logos oder Text */}
            <span className='font-bold'>TanStack Start</span>
            <span className='font-bold'>ElectricSQL</span>
            <span className='font-bold'>Drizzle ORM</span>
            <span className='font-bold'>Neon</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
