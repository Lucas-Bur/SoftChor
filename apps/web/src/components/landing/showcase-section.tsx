'use client'

import { FadeIn } from '@repo/ui'

const showcases = [
  {
    title: 'Intelligente Notenerkennung',
    description:
      'Die OMR-Engine analysiert deine Partituren und erkennt automatisch Noten, Pausen, Taktarten und vieles mehr. Unterstützt werden PDF-Dateien und gängige Bildformate.',
    features: ['PDF & Bild-Upload', 'Automatische Layout-Erkennung', 'Multi-Page-Unterstützung'],
  },
  {
    title: 'Stimmen auf einen Blick',
    description:
      'Sopran, Alt, Tenor, Bass - alle Stimmen werden automatisch erkannt und können separat angehört werden. Perfekt zum Üben der eigenen Stimme.',
    features: [
      'Automatische Stimm-Erkennung',
      'Separate Audio-Ausgabe',
      'Einfacher Stimmenwechsel',
    ],
  },
]

export function ShowcaseSection() {
  return (
    <section className='py-16 px-6 bg-muted/20'>
      <div className='max-w-6xl mx-auto'>
        {/* Section header */}
        <FadeIn className='text-center mb-12'>
          <h2 className='text-3xl sm:text-4xl font-display font-bold mb-4'>Funktionen im Detail</h2>
          <p className='text-lg text-landing-muted max-w-2xl mx-auto'>
            Moderne Technologie für traditionelle Chorarbeit.
          </p>
        </FadeIn>

        {/* Showcase items */}
        <div className='space-y-16'>
          {showcases.map((item, index) => (
            <FadeIn key={item.title} delay={0.1}>
              <div
                className={`grid md:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Mockup placeholder */}
                <div
                  className={`aspect-video rounded-2xl border border-landing-border bg-linear-to-br from-muted/50 to-background/30 flex items-center justify-center ${index % 2 === 1 ? 'md:order-2' : ''}`}
                >
                  <div className='text-center p-8'>
                    <div className='w-16 h-16 mx-auto mb-4 rounded-xl bg-landing-accent/10 flex items-center justify-center'>
                      <span className='text-2xl font-display font-bold text-landing-accent'>
                        {index + 1}
                      </span>
                    </div>
                    <p className='text-sm text-landing-muted'>Demo-Ansicht</p>
                  </div>
                </div>

                {/* Content */}
                <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                  <h3 className='text-2xl font-display font-bold mb-4'>{item.title}</h3>
                  <p className='text-landing-muted leading-relaxed mb-6'>{item.description}</p>
                  <ul className='space-y-3'>
                    {item.features.map(feature => (
                      <li key={feature} className='flex items-center gap-3'>
                        <span className='w-1.5 h-1.5 rounded-full bg-landing-accent' />
                        <span className='text-sm'>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
