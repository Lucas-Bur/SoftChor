'use client'

import * as React from 'react'

import { type HTMLMotionProps, motion } from 'motion/react'

import { cn } from '../../lib/utils'

interface FadeInProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  once?: boolean
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  direction = 'up',
  once = true,
  className,
  ...props
}: FadeInProps) {
  const directionOffset = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
    none: {},
  }

  const initialOffset = directionOffset[direction]

  return (
    <motion.div
      initial={{ opacity: 0, ...initialOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}
