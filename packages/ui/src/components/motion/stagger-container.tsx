'use client'

import * as React from 'react'

import { type HTMLMotionProps, motion, type Transition } from 'motion/react'

import { cn } from '../../lib/utils'

interface StaggerContainerProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode
  staggerDelay?: number
  once?: boolean
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  once = true,
  className,
  ...props
}: StaggerContainerProps) {
  const transition: Transition = {
    staggerChildren: staggerDelay,
  }

  return (
    <motion.div
      initial='hidden'
      whileInView='show'
      viewport={{ once, margin: '-50px' }}
      variants={{
        hidden: {},
        show: {
          transition,
        },
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Child item to be used inside StaggerContainer
interface StaggerItemProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode
}

export function StaggerItem({ children, className, ...props }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.21, 0.47, 0.32, 0.98],
          },
        },
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}
