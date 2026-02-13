# @repo/auth

Centralized authentication package for SoftChor using better-auth.

## Installation

This package is part of the SoftChor monorepo and is automatically available via workspace protocol.

## Usage

```typescript
import {
  auth,
  getSessionServerFn,
  authMiddleware,
  guestMiddleware,
  loginSchema,
  registerSchema,
} from "@repo/auth";
```

## Features

- **Better-Auth Integration**: Full authentication flow with email/password
- **Middleware**: Auth middleware for protecting routes
- **Validation**: Zod schemas for login and registration
- **Server Functions**: Server-side session management

## Dependencies

- `better-auth` - Authentication framework
- `@neondatabase/serverless` - Neon database driver
- `drizzle-orm` - Database ORM
- `@repo/database` - Shared database package
