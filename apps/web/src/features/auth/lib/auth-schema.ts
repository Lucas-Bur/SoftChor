import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email({ message: 'Bitte gib eine gültige E-Mail ein' }),
  password: z.string().min(1, { message: 'Passwort wird benötigt' }),
})

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name muss mindestens 2 Zeichen lang sein' }),
  email: z.email({ message: 'Bitte gib eine gültige E-Mail ein' }),
  password: z
    .string()
    .min(8, { message: 'Passwort muss mindestens 8 Zeichen lang sein' }),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
