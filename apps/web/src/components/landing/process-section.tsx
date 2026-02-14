'use client'

import { ArrowRight, FileText, Music2, Play, Scissors } from 'lucide-react'
import { motion } from 'motion/react'

import { FadeIn } from '@repo/ui'

const steps = [
  {
    icon: FileText,
    title: 'Upload',
    description: 'Partitur hochladen',
    detail: 'PDF, PNG, JPG',
  },
  {
    icon: Music2,
    title: 'Erkennen',
    description: 'OMR verarbeitet',
    detail: 'Automatische Analyse',
  },
  {
    icon: Scissors,
    title: 'Extrahieren',
    description: 'Stimmen trennen',
    detail: 'S • A • T • B',
  },
  {
    icon: Play,
    title: 'Üben',
    description: 'Mit deiner Stimme',
    detail: 'Audio-Ausgabe',
  },
]

export function ProcessSection() {
  return (
    <section className='py-16 px-6 overflow-hidden'>
      <div className='max-w-6xl mx-auto'>
        {/* Section header */}
        <FadeIn className='text-center mb-12'>
          <h2 className='text-3xl sm:text-4xl font-display font-bold mb-4'>So funktioniert es</h2>
          <p className='text-lg text-landing-muted max-w-2xl mx-auto'>
            Vier Schritte von der Partitur zur einsatzbereiten Stimme.
          </p>
        </FadeIn>

        {/* Timeline */}
        <div className='relative'>
          {/* Connection line */}
          <div className='absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-landing-border to-transparent -translate-y-1/2 hidden md:block' />

          {/* Steps */}
          <div className='grid md:grid-cols-4 gap-6 md:gap-4'>
            {steps.map((step, index) => (
              <FadeIn key={step.title} delay={index * 0.15}>
                <div className='relative flex flex-col items-center text-center group'>
                  {/* Icon circle */}
                  <motion.div
                    className='relative z-10 w-16 h-16 rounded-full bg-background border-2 border-landing-border flex items-center justify-center mb-4 group-hover:border-landing-accent/50 group-hover:bg-landing-accent/5 transition-colors duration-300'
                    whileHover={{ scale: 1.05 }}
                  >
                    <step.icon className='w-7 h-7 text-landing-muted group-hover:text-landing-accent transition-colors' />
                  </motion.div>

                  {/* Content */}
                  <h3 className='text-lg font-display font-semibold mb-1'>{step.title}</h3>
                  <p className='text-sm text-landing-muted mb-2'>{step.description}</p>
                  <span className='text-xs text-landing-accent/70 font-medium'>{step.detail}</span>

                  {/* Arrow between steps (desktop) */}
                  {index < steps.length - 1 && (
                    <div className='hidden md:flex absolute top-8 left-full w-full justify-center -translate-x-1/2'>
                      <ArrowRight className='w-5 h-5 text-landing-border' />
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
