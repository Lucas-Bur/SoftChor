# @repo/validation

Centralized validation schemas for SoftChor using Zod.

## Installation

This package is part of the SoftChor monorepo and is automatically available via workspace protocol.

## Usage

```typescript
import {
  loginSchema,
  registerSchema,
  addSongFormSchema,
} from "@repo/validation";
```

## Features

- **Auth Schemas**: Login and registration validation
- **Score Schemas**: Song and file upload validation
- **Framework Agnostic**: Works with any Zod-compatible framework

## Dependencies

- `zod` - Schema validation library
