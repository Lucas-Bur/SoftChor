import * as z from 'zod'

export interface ActionResponse<T = any> {
  success: boolean
  message: string
  errors?: {
    [K in keyof T]?: string[]
  }
  inputs?: T
}

export const addSongFormSchema = z.object({
  title: z
    .string({ error: 'Song name is required' })
    .min(1, 'Song name is required')
    .max(255, 'Song name must be 255 characters or less'),
})

export type AddSongFormSchema = z.infer<typeof addSongFormSchema>
