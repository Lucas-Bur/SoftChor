'use client'

import { useEffect, useState } from 'react'

import { ArrowRight, Music } from 'lucide-react'
import { motion } from 'motion/react'

import { Button } from '@repo/ui'

import { BassClef, TrebleClef } from '../clefs'

import { Link } from '@tanstack/react-router'

// Music staff lines background with clefs
function StaffLines() {
  return (
    <div className='absolute inset-0 w-full h-full overflow-hidden opacity-[0.05] dark:opacity-[0.05]'>
      <svg className='absolute w-full h-full'>
        {/* Multiple staves spanning the full height */}
        {[0, 1, 2, 3, 4, 5].map(staffIndex => {
          const baseY = 50 + staffIndex * 135 + (staffIndex % 2) * -45
          const isTreble = staffIndex % 2 === 0
          return (
            <g key={`staff-group-${staffIndex}`}>
              {/* Staff lines */}
              {[0, 1, 2, 3, 4].map(lineIndex => (
                <line
                  key={`staff-${staffIndex}-line-${lineIndex}`}
                  x1='0'
                  y1={baseY + lineIndex * 12}
                  x2='100%'
                  y2={baseY + lineIndex * 12}
                  stroke='currentColor'
                  strokeWidth='1.5'
                />
              ))}
              {/* Clef at the beginning */}
              {isTreble ? (
                <foreignObject x='15' y={baseY - 15} width='50' height='80'>
                  <TrebleClef className='w-full h-full text-current' />
                </foreignObject>
              ) : (
                <foreignObject x='15' y={baseY - 3} width='50' height='55'>
                  <BassClef className='w-full h-full text-current' />
                </foreignObject>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// Scroll indicator that hides when scrolled
function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      // Hide when scrolled down more than 50px
      setIsVisible(window.scrollY < 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className='fixed bottom-8 left-1/2 -translate-x-1/2 z-20'
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className='w-6 h-10 rounded-full border-2 border-landing-border flex items-start justify-center p-1'
      >
        <motion.div className='w-1.5 h-2.5 rounded-full bg-landing-muted' />
      </motion.div>
    </motion.div>
  )
}

export function HeroSection() {
  return (
    <section className='relative min-h-[85vh] flex items-center justify-center overflow-hidden px-6 py-16'>
      {/* Background */}
      <StaffLines />

      {/* Content */}
      <div className='relative z-10 max-w-4xl mx-auto text-center'>
        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='mb-6'
        >
          <div className='inline-flex items-center gap-2 text-landing-muted'>
            <Music className='size-8' />
            <span className='text-xl font-medium tracking-wide uppercase'>SoftChor</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6'
        >
          <span className='text-foreground'>Chorpartituren.</span>
          <br />
          <span className='text-landing-accent'>Intelligenter verwaltet.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='text-lg sm:text-xl text-landing-muted max-w-2xl mx-auto mb-8 leading-relaxed'
        >
          Laden, erkennen, extrahieren. SoftChor verarbeitet deine Noten automatisch und trennt
          Stimmen auf einen Klick.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className='flex flex-col sm:flex-row gap-4 justify-center items-center'
        >
          <Button asChild size='lg' className='gap-2 h-12 px-8 text-base'>
            <Link to='/scores'>
              Zur App
              <ArrowRight className='w-4 h-4' />
            </Link>
          </Button>
          <Button asChild variant='outline' size='lg' className='h-12 px-8 text-base'>
            <a href='#features'>Mehr erfahren</a>
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator - fixed at bottom */}
      <ScrollIndicator />
    </section>
  )
}
