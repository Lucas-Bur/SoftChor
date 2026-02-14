'use client'

import { FileUp, Scan, Users } from 'lucide-react'

import { Card, FadeIn, StaggerContainer, StaggerItem } from '@repo/ui'

const features = [
  {
    icon: FileUp,
    title: 'Noten laden',
    description:
      'Lade PDF-Partituren oder Bilder hoch. SoftChor akzeptiert gängige Formate und bereitet sie für die Verarbeitung vor.',
  },
  {
    icon: Scan,
    title: 'Automatisch erkennen',
    description:
      'Die OMR-Technologie liest deine Noten automatisch. Kein manuelles Übertragen mehr.',
  },
  {
    icon: Users,
    title: 'Stimmen extrahieren',
    description:
      'Sopran, Alt, Tenor, Bass - alle Stimmen werden automatisch erkannt und separat verfügbar.',
  },
]

export function FeatureSection() {
  return (
    <section id='features' className='py-16 px-6 bg-muted/20'>
      <div className='max-w-6xl mx-auto'>
        {/* Section header */}
        <FadeIn className='text-center mb-12'>
          <h2 className='text-3xl sm:text-4xl font-display font-bold mb-4'>
            Alles was du brauchst
          </h2>
          <p className='text-lg text-landing-muted max-w-2xl mx-auto'>
            Von der Partitur zur einsatzbereiten Stimme - in drei Schritten.
          </p>
        </FadeIn>

        {/* Feature cards */}
        <StaggerContainer className='grid md:grid-cols-3 gap-6'>
          {features.map((feature, index) => (
            <StaggerItem key={feature.title}>
              <Card className='h-full p-6 border-landing-border bg-background/50 backdrop-blur-sm hover:border-landing-accent/50 transition-colors duration-300 group'>
                <div className='flex flex-col items-start gap-4'>
                  {/* Icon */}
                  <div className='p-3 rounded-xl bg-landing-accent/10 text-landing-accent group-hover:bg-landing-accent/20 transition-colors'>
                    <feature.icon className='w-6 h-6' />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className='text-xl font-display font-semibold mb-2'>{feature.title}</h3>
                    <p className='text-landing-muted leading-relaxed'>{feature.description}</p>
                  </div>

                  {/* Step number */}
                  <div className='mt-auto pt-4'>
                    <span className='text-sm font-medium text-landing-accent/60'>
                      Schritt {index + 1}
                    </span>
                  </div>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
