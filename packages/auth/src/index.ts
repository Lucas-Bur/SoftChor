// Auth instance and types
export { type Auth, auth } from './server'

// Session utilities
export { getSession, type Session, type User } from './middleware'

// Validation schemas
export type { LoginInput, RegisterInput } from './schema'
export { loginSchema, registerSchema } from './schema'
