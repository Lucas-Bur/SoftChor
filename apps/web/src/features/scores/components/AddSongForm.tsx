'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Check } from 'lucide-react'
import { motion } from 'motion/react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { addSong } from '../db/collections'
import { type AddSongFormSchema, addSongFormSchema } from '../lib/form-schema'

interface AddSongFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddSongForm({ open, onOpenChange }: AddSongFormProps) {
  const queryClient = useQueryClient()

  const form = useForm<AddSongFormSchema>({
    resolver: zodResolver(addSongFormSchema),
    defaultValues: {
      title: '',
    },
  })

  const {
    formState: { isSubmitting, isSubmitSuccessful },
  } = form

  const handleSubmit = form.handleSubmit(async (data: AddSongFormSchema) => {
    try {
      // Add the song using the server function
      await addSong({
        data: {
          title: data.title,
        },
      })

      // Invalidate and refetch the songs query
      await queryClient.invalidateQueries({ queryKey: ['songs'] })

      // Reset form and close
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error adding song:', error)
      form.setError('root', {
        message: 'Failed to add song. Please try again.',
      })
    }
  })

  if (isSubmitSuccessful) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-md'>
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, stiffness: 300, damping: 25 }}
            className='p-6'
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.3,
                type: 'spring',
                stiffness: 500,
                damping: 15,
              }}
              className='mb-4 flex justify-center border rounded-full w-fit mx-auto p-2'
            >
              <Check className='size-8' />
            </motion.div>
            <h2 className='text-center text-2xl text-pretty font-bold mb-2'>
              Song Added!
            </h2>
            <p className='text-center text-lg text-pretty text-muted-foreground'>
              The song has been added to your repertoire.
            </p>
          </motion.div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Add a new song</DialogTitle>
          <DialogDescription>
            Enter the song name to add it to your repertoire.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Song name *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Enter song name'
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <p className='text-sm text-destructive'>
                {form.formState.errors.root.message}
              </p>
            )}

            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                    Adding...
                  </>
                ) : (
                  <>
                    <Check className='mr-2 h-4 w-4' />
                    Add Song
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
