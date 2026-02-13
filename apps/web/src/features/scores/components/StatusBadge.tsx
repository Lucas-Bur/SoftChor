import { Clock } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

import type { Song } from '@repo/database'

export function StatusBadge({ status }: { status: Song['status'] }) {
  switch (status) {
    case 'COMPLETED':
      return (
        <Badge variant='default' className='text-[10px] h-5 w-12'>
          FERTIG
        </Badge>
      )
    case 'FAILED':
      return (
        <Badge variant='destructive' className='text-[10px] h-5 w-12'>
          FEHLER
        </Badge>
      )
    case 'PENDING':
      return (
        <Badge variant='secondary' className='text-[10px] h-5 w-12 '>
          <Clock className='h-3 w-3' />
        </Badge>
      )
    case 'PROCESSING':
      return (
        <Badge variant='secondary' className='text-[10px] h-5 w-12 '>
          <Clock className='h-3 w-3 animate-spin' />
        </Badge>
      )
    default:
      return (
        <Badge variant='outline' className='text-[10px] h-5 w-12'>
          ???
        </Badge>
      )
  }
}
