'use client'

import { Music2 } from 'lucide-react'

import { FadeIn } from '@repo/ui'

export function FooterSection() {
  return (
    <footer className='py-8 px-6 border-t border-landing-border'>
      <div className='max-w-6xl mx-auto'>
        <FadeIn>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            {/* Brand */}
            <div className='flex items-center gap-2 text-landing-muted'>
              <Music2 className='w-5 h-5' />
              <span className='font-medium'>SoftChor</span>
            </div>

            {/* Links */}
            <div className='flex items-center gap-6 text-sm text-landing-muted'>
              <button type='button' className='hover:text-foreground transition-colors'>
                Impressum
              </button>
              <button type='button' className='hover:text-foreground transition-colors'>
                Datenschutz
              </button>
            </div>

            {/* Copyright */}
            <p className='text-sm text-landing-muted'>© 2025 SoftChor</p>
          </div>
        </FadeIn>
      </div>
    </footer>
  )
}
