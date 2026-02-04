# Turborepo Migration Plan

## Executive Summary

This document outlines a comprehensive plan to migrate the **SoftChor** (Software für den Chor) project from a multi-app directory structure to a Turborepo monorepo. The migration aims to:

- **Improve code sharing**: Extract common infrastructure code (database, queue, storage) into reusable packages
- **Optimize build performance**: Leverage Turborepo's caching to speed up builds, tests, and linting
- **Enhance developer experience**: Provide clear task orchestration and simplified command structure
- **Maintain flexibility**: Keep separate .env files, Dockerfiles, and tests per app while sharing configuration
- **Future-proof architecture**: Enable Drizzle → Python codegen and other cross-language integrations

### Expected Benefits

- **Faster CI/CD**: Turborepo's local caching reduces redundant tasks in GitHub Actions
- **Better code organization**: Shared packages eliminate duplication across apps
- **Type safety across boundaries**: TypeScript types from database schemas shared with web app
- **Simplified dependency management**: Centralized TypeScript, Biome, and tooling configurations
- **Clearer task dependencies**: Explicit build → test → deploy pipelines

---

## Project Rename

### New Project Name: SoftChor

The project should be renamed to **SoftChor** (Software für den Chor).

**Rationale**:
- **Clear Identity**: The name "SoftChor" clearly communicates the project's purpose as software for choirs
- **German Context**: "Software für den Chor" provides German-speaking users with immediate understanding
- **Professional Branding**: The capital "C" in "Chor" creates a distinctive brand identity
- **Memorable**: Short, easy to pronounce, and memorable for users

**Impact Areas**:
- Repository name (already: `softchor`)
- Package names (already: `softchor`)
- Documentation and README files
- Application titles and headers
- Environment variable prefixes
- Docker image names
- CI/CD configuration

**Implementation Notes**:
- The workspace directory is already named `softchor`
- The root `package.json` already uses `"name": "softchor"`
- Update all documentation to consistently use "SoftChor" with capital C
- Update application UI to display "SoftChor" in headers and titles
- Consider updating Docker image tags to use `softchor` prefix

---

## New Directory Structure

```
softchor/
├── .gitignore                        # Root gitignore (monorepo-wide)
├── package.json                      # Root workspace orchestrator
├── pnpm-workspace.yaml               # pnpm workspace configuration
├── turbo.json                        # Turborepo task configuration
├── biome.json                        # Root Biome config (shared settings)
├── README.md                         # Project overview
├── docs/
│   └── TURBOREPO_MIGRATION_PLAN.md   # This document
├── apps/
│   ├── web/
│   │   ├── .env.example              # Web-specific env template
│   │   ├── .env.local                # Local development env (git-ignored)
│   │   ├── .gitignore                # App-specific ignores
│   │   ├── Dockerfile                # Web app Docker build
│   │   ├── package.json              # Web dependencies
│   │   ├── biome.json                # Web-specific overrides (if needed)
│   │   ├── tsconfig.json             # Extends @repo/typescript-config
│   │   ├── vite.config.ts
│   │   ├── drizzle.config.ts         # Uses @repo/database
│   │   ├── components.json
│   │   ├── public/
│   │   ├── scripts/
│   │   │   └── generate-models.ts
│   │   └── src/
│   │       ├── router.tsx
│   │       ├── routeTree.gen.ts
│   │       ├── styles.css
│   │       ├── components/
│   │       ├── features/
│   │       │   ├── auth/              # Auth-specific feature
│   │       │   ├── scores/            # Scores-specific feature
│   │       │   └── sync/              # ElectricSQL sync
│   │       ├── integrations/
│   │       ├── lib/
│   │       └── routes/
│   │
│   └── worker/
│       ├── .env.example              # Worker-specific env template
│       ├── .env.local                # Local development env (git-ignored)
│       ├── .gitignore                # Worker-specific ignores
│       ├── .python-version
│       ├── Dockerfile                # Worker Docker build
│       ├── pyproject.toml            # Python dependencies
│       ├── uv.lock
│       ├── README.md
│       ├── scripts/
│       │   └── initial_setup.py
│       └── src/
│           ├── __init__.py
│           ├── config.py             # Uses shared env conventions
│           ├── db.py                 # TODO: Future Drizzle → Python codegen
│           ├── main.py
│           ├── processor.py
│           ├── s3_client.py          # Mirrors @repo/storage patterns
│           ├── task_types.py         # TODO: Share with TypeScript
│           ├── worker.py
│           └── processors/
│
├── packages/
│   ├── database/
│   │   ├── package.json              # @repo/database
│   │   ├── tsconfig.json             # TypeScript config
│   │   ├── drizzle.config.ts         # Shared Drizzle config
│   │   ├── src/
│   │   │   ├── index.ts              # Main export
│   │   │   ├── client.ts             # Database client initialization
│   │   │   ├── schema/
│   │   │   │   ├── index.ts          # Re-exports all schemas
│   │   │   │   ├── auth.ts           # Auth tables (users, sessions, accounts)
│   │   │   │   ├── scores.ts         # Scores tables (songs, files, voices)
│   │   │   │   └── posts.ts          # Posts table
│   │   │   └── types.ts              # Shared type exports
│   │   └── migrations/               # All Drizzle migrations
│   │       ├── meta/
│   │       └── *.sql
│   │
│   ├── queue/
│   │   ├── package.json              # @repo/queue
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── index.ts              # Main export
│   │   │   ├── client.ts             # RabbitMQ connection management
│   │   │   ├── enqueue.ts            # Job enqueue function
│   │   │   └── types.ts              # Task type definitions (shared with Python)
│   │   └── README.md
│   │
│   ├── storage/
│   │   ├── package.json              # @repo/storage
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── index.ts              # Main export
│   │   │   ├── client.ts             # S3 client configuration
│   │   │   ├── upload.ts             # Upload utilities
│   │   │   ├── presigned.ts          # Presigned URL generation
│   │   │   ├── delete.ts             # Delete utilities
│   │   │   └── types.ts              # Storage type definitions
│   │   └── README.md
│   │
│   ├── typescript-config/
│   │   ├── package.json              # @repo/typescript-config
│   │   ├── base.json                 # Base TypeScript config
│   │   ├── react.json                # React-specific config
│   │   └── node.json                 # Node.js-specific config
│   │
│   └── biome-config/
│       ├── package.json              # @repo/biome-config
│       └── index.json                # Shared Biome rules
│
└── services/
    └── docker-compose.dev.yaml       # Shared dev services (MinIO, RabbitMQ, ElectricSQL)
```

---

## Root Configuration Files

### `package.json` (Root)

```json
{
  "name": "softchor",
  "private": true,
  "version": "1.0.0",
  "description": "SoftChor (Software für den Chor) - Monorepo with Turborepo",
  "packageManager": "pnpm@9.15.4",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "format": "turbo run format",
    "check": "turbo run check",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean && rm -rf node_modules",
    "db:generate": "turbo run db:generate",
    "db:migrate": "turbo run db:migrate",
    "db:studio": "turbo run db:studio",
    "services:up": "docker compose -f services/docker-compose.dev.yaml up",
    "services:down": "docker compose -f services/docker-compose.dev.yaml down"
  },
  "devDependencies": {
    "@biomejs/biome": "2.3.8",
    "turbo": "^2.4.1",
    "typescript": "^5.9.3"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  }
}
```

### `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"

# Only build these dependencies (inherited from web app config)
onlyBuiltDependencies:
  - bufferutil
  - core-js
  - esbuild
```

### `turbo.json`

```json
{
  "$schema": "https://turborepo.org/schema.json",
  "globalEnv": [
    "NODE_ENV"
  ],
  "globalDependencies": [
    ".env",
    ".env.local"
  ],
  "tasks": {
    "build": {
      "dependsOn": [
        "^build"
      ],
      "inputs": [
        "$TURBO_DEFAULT$",
        ".env",
        ".env.local",
        ".env.production",
        ".env.production.local"
      ],
      "outputs": [
        "dist/**",
        ".next/**",
        "!.next/cache/**",
        "build/**"
      ],
      "env": [
        "DATABASE_URL",
        "ELECTRIC_SECRET",
        "BETTER_AUTH_SECRET",
        "AMQP_URL",
        "S3_ENDPOINT",
        "S3_REGION",
        "S3_ACCESS_KEY_ID",
        "S3_SECRET_ACCESS_KEY",
        "S3_BUCKET_NAME"
      ]
    },
    "dev": {
      "cache": false,
      "persistent": true,
      "inputs": [
        "$TURBO_DEFAULT$",
        ".env.local",
        ".env.development.local",
        ".env.development",
        ".env"
      ]
    },
    "lint": {
      "dependsOn": [
        "^build"
      ],
      "inputs": [
        "src/**/*.ts",
        "src/**/*.tsx",
        "biome.json",
        "../biome-config/**"
      ],
      "outputs": []
    },
    "format": {
      "inputs": [
        "src/**/*.ts",
        "src/**/*.tsx",
        "biome.json",
        "../biome-config/**"
      ],
      "outputs": []
    },
    "check": {
      "dependsOn": [
        "^build"
      ],
      "inputs": [
        "src/**/*.ts",
        "src/**/*.tsx",
        "biome.json",
        "../biome-config/**"
      ],
      "outputs": []
    },
    "type-check": {
      "dependsOn": [
        "^build"
      ],
      "inputs": [
        "src/**/*.ts",
        "src/**/*.tsx",
        "tsconfig.json",
        "../typescript-config/**"
      ],
      "outputs": []
    },
    "test": {
      "dependsOn": [
        "build"
      ],
      "inputs": [
        "$TURBO_DEFAULT$",
        "src/**/*.test.ts",
        "src/**/*.test.tsx",
        "src/**/*.spec.ts",
        "src/**/*.spec.tsx"
      ],
      "outputs": [
        "coverage/**"
      ]
    },
    "clean": {
      "cache": false
    },
    "db:generate": {
      "cache": false,
      "inputs": [
        "src/db/**/*.ts",
        "drizzle.config.ts"
      ],
      "outputs": [
        "migrations/**"
      ]
    },
    "db:migrate": {
      "cache": false,
      "dependsOn": [
        "db:generate"
      ],
      "env": [
        "DATABASE_URL"
      ]
    },
    "db:studio": {
      "cache": false,
      "persistent": true,
      "env": [
        "DATABASE_URL"
      ]
    }
  }
}
```

### `biome.json` (Root)

```json
{
  "$schema": "https://biomejs.dev/schemas/2.3.8/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": [
      "node_modules",
      "dist",
      "build",
      ".next",
      "coverage",
      "**/routeTree.gen.ts",
      "**/*.css"
    ]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "assist": {
    "actions": {
      "source": {
        "organizeImports": "on"
      }
    }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded",
      "jsxQuoteStyle": "single"
    }
  }
}
```

### `.gitignore` (Root - Updated)

```gitignore
# Dependencies
node_modules
.pnp
.pnp.js

# Testing
coverage
*.log

# Production builds
dist
build
.next
out

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Editor directories and files
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Turborepo
.turbo

# Python
__pycache__
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
.venv

# Misc
.cache
temp
tmp
```

---

## Package Details

### `packages/database`

**Purpose**: Shared database schema, migrations, and types for PostgreSQL with Drizzle ORM.

#### `packages/database/package.json`

```json
{
  "name": "@repo/database",
  "version": "1.0.0",
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./schema": "./src/schema/index.ts",
    "./client": "./src/client.ts"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "clean": "rm -rf dist",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@neondatabase/serverless": "^1.0.2",
    "drizzle-orm": "^0.45.1",
    "drizzle-zod": "^0.8.3",
    "pg": "^8.16.3",
    "ws": "^8.18.3",
    "zod": "^4.2.1"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@types/node": "^25.0.3",
    "@types/pg": "^8.16.0",
    "@types/ws": "^8.18.1",
    "drizzle-kit": "^0.31.8",
    "typescript": "^5.9.3"
  }
}
```

#### `packages/database/src/index.ts`

```typescript
// Main export: re-export everything
export * from './client'
export * from './schema'
export * from './types'
```

#### `packages/database/src/client.ts`

```typescript
import { neonConfig, Pool } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-serverless'
import ws from 'ws'
import * as schema from './schema'

/**
 * Configure Neon for WebSocket connection.
 * Required for serverless environments.
 */
neonConfig.webSocketConstructor = ws

/**
 * Create database client with connection pooling.
 * Expects DATABASE_URL environment variable.
 */
export function createDbClient(connectionString: string) {
  const pool = new Pool({ connectionString })
  return drizzle({ client: pool, schema })
}

// Default export for convenience
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required')
}

export const db = createDbClient(connectionString)
```

#### `packages/database/src/schema/index.ts`

```typescript
import { getTableName } from 'drizzle-orm'

export * from './auth'
export * from './scores'
export * from './posts'

import { authSync } from './auth'
import { scoresSync } from './scores'
import { postsSync } from './posts'

const ALL_SYNCABLE = [...authSync, ...postsSync, ...scoresSync] as const
const ALL_SYNCABLE_NAMES = ALL_SYNCABLE.map((pgTable) => getTableName(pgTable))

export type SyncableTable = (typeof ALL_SYNCABLE_NAMES)[number]

export const TABLE_REGISTRY = Object.fromEntries(
  ALL_SYNCABLE.map((table) => [getTableName(table), table]),
) as Record<SyncableTable, (typeof ALL_SYNCABLE)[number]>
```

**Note**: Copy auth.ts, scores.ts, and posts.ts from current locations.

---

### `packages/queue`

**Purpose**: RabbitMQ client and job enqueue utilities (extracted from `apps/web/src/features/queue`).

#### `packages/queue/package.json`

```json
{
  "name": "@repo/queue",
  "version": "1.0.0",
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "clean": "rm -rf dist",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "amqplib": "^0.10.9"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@types/amqplib": "^0.10.8",
    "@types/node": "^25.0.3",
    "typescript": "^5.9.3"
  }
}
```

#### `packages/queue/src/index.ts`

```typescript
export * from './client'
export * from './enqueue'
export * from './types'
```

#### `packages/queue/src/client.ts`

```typescript
import amqp, { type ChannelModel, type ConfirmChannel } from 'amqplib'

type State = {
  connection: ChannelModel | null
  channel: ConfirmChannel | null
}

const state: State = {
  connection: null,
  channel: null,
}

export async function getChannel(amqpUrl: string, queueName: string) {
  if (state.channel) return state.channel

  if (!amqpUrl) {
    throw new Error('AMQP_URL is not set')
  }

  const connection = await amqp.connect(amqpUrl)
  state.connection = connection

  const channel = await connection.createConfirmChannel()
  await channel.assertQueue(queueName, { durable: true })
  state.channel = channel

  const cleanup = () => {
    state.connection = null
    state.channel = null
  }

  connection.on('error', cleanup)
  connection.on('close', cleanup)

  return channel
}
```

#### `packages/queue/src/enqueue.ts`

```typescript
import { getChannel } from './client'
import type { JobMessage } from './types'

export async function enqueueJob(
  amqpUrl: string,
  queueName: string,
  data: JobMessage
): Promise<void> {
  const ch = await getChannel(amqpUrl, queueName)
  const payload = Buffer.from(JSON.stringify(data), 'utf8')

  const sent = ch.sendToQueue(queueName, payload, {
    contentType: 'application/json',
    persistent: true,
  })

  if (!sent) {
    // backpressure: wait for drain
    await new Promise<void>((resolve) => ch.once('drain', resolve))
  }

  // confirm publish
  await ch.waitForConfirms()
}
```

#### `packages/queue/src/types.ts`

```typescript
import { z } from 'zod'

/**
 * Task types supported by the worker.
 * TODO: Keep in sync with Python worker (apps/worker/src/task_types.py)
 */
export const TaskType = z.enum([
  'generate_xml_from_input',
  'generate_voices_from_xml',
])

export type TaskType = z.infer<typeof TaskType>

export const JobMessageSchema = z.object({
  job_id: z.string().uuid(),
  task_type: TaskType,
  task_params: z.object({
    input_key: z.string(),
  }),
})

export type JobMessage = z.infer<typeof JobMessageSchema>
```

---

### `packages/storage`

**Purpose**: S3/MinIO client and utilities for file operations (extracted from `apps/web/src/features/s3`).

#### `packages/storage/package.json`

```json
{
  "name": "@repo/storage",
  "version": "1.0.0",
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./client": "./src/client.ts"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "clean": "rm -rf dist",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@aws-sdk/client-s3": "^3.958.0",
    "@aws-sdk/s3-request-presigner": "^3.958.0"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@types/node": "^25.0.3",
    "typescript": "^5.9.3"
  }
}
```

#### `packages/storage/src/index.ts`

```typescript
export * from './client'
export * from './upload'
export * from './presigned'
export * from './delete'
export * from './types'
```

#### `packages/storage/src/client.ts`

```typescript
import { S3Client } from '@aws-sdk/client-s3'

export interface StorageConfig {
  endpoint?: string
  region?: string
  accessKeyId: string
  secretAccessKey: string
  bucketName: string
  forcePathStyle?: boolean
}

export function createS3Client(config: StorageConfig) {
  return new S3Client({
    endpoint: config.endpoint,
    region: config.region || 'eu-central-1',
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    forcePathStyle: config.forcePathStyle ?? false,
  })
}

// Default client for convenience
export function createDefaultS3Client() {
  const isDevelopment = process.env.NODE_ENV === 'development'

  return createS3Client({
    endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
    region: process.env.S3_REGION || 'eu-central-1',
    accessKeyId: process.env.S3_ACCESS_KEY_ID || 'minioadmin',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || 'minioadmin',
    bucketName: process.env.S3_BUCKET_NAME || 'scores-bucket',
    forcePathStyle: isDevelopment,
  })
}

export const s3Client = createDefaultS3Client()
export const bucketName = process.env.S3_BUCKET_NAME || 'scores-bucket'
```

**Note**: Add `upload.ts`, `presigned.ts`, `delete.ts` with appropriate utilities extracted from storage.ts.

---

### `packages/typescript-config`

**Purpose**: Shared TypeScript configurations for all packages and apps.

#### `packages/typescript-config/package.json`

```json
{
  "name": "@repo/typescript-config",
  "version": "1.0.0",
  "private": true,
  "files": [
    "base.json",
    "react.json",
    "node.json"
  ]
}
```

#### `packages/typescript-config/base.json`

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": false,
    "noEmit": true,
    "skipLibCheck": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  }
}
```

#### `packages/typescript-config/react.json`

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vite/client"]
  }
}
```

#### `packages/typescript-config/node.json`

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "types": ["node"]
  }
}
```

---

### `packages/biome-config`

**Purpose**: Shared Biome linting and formatting rules.

#### `packages/biome-config/package.json`

```json
{
  "name": "@repo/biome-config",
  "version": "1.0.0",
  "private": true,
  "files": [
    "index.json"
  ]
}
```

#### `packages/biome-config/index.json`

```json
{
  "$schema": "https://biomejs.dev/schemas/2.3.8/schema.json",
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "assist": {
    "actions": {
      "source": {
        "organizeImports": "on"
      }
    }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded",
      "jsxQuoteStyle": "single"
    }
  }
}
```

---

## Updated App Configurations

### `apps/web/package.json` (Updated Dependencies)

```json
{
  "name": "web",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev --port 3000",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "format": "biome format",
    "lint": "biome lint",
    "check": "biome check",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist .next node_modules/.vite",
    "db:studio": "drizzle-kit studio",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "dotenv -e .env.local -- drizzle-kit migrate",
    "db:push": "dotenv -e .env.local -- drizzle-kit push"
  },
  "dependencies": {
    "@repo/database": "workspace:*",
    "@repo/queue": "workspace:*",
    "@repo/storage": "workspace:*",
    "@electric-sql/client": "^1.3.0",
    "@hookform/resolvers": "^5.2.2",
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-progress": "^1.1.8",
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slider": "^1.3.6",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-toggle": "^1.1.10",
    "@radix-ui/react-toggle-group": "^1.1.11",
    "@tailwindcss/vite": "^4.1.18",
    "@tanstack/db": "^0.5.12",
    "@tanstack/electric-db-collection": "^0.2.15",
    "@tanstack/query-db-collection": "^1.0.8",
    "@tanstack/react-db": "^0.1.56",
    "@tanstack/react-query": "^5.90.12",
    "@tanstack/react-router": "^1.141.6",
    "@tanstack/react-router-ssr-query": "^1.141.6",
    "@tanstack/react-start": "^1.141.7",
    "@tanstack/router-plugin": "^1.141.7",
    "better-auth": "^1.4.7",
    "bufferutil": "^4.1.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.559.0",
    "motion": "^12.23.26",
    "next-themes": "^0.4.6",
    "nitro": "latest",
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "react-hook-form": "^7.68.0",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.4.0",
    "tailwindcss": "^4.1.18",
    "tailwindcss-animate": "^1.0.7",
    "tw-animate-css": "^1.4.0",
    "uuid": "^13.0.0",
    "zod": "^4.2.1"
  },
  "devDependencies": {
    "@repo/biome-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "@biomejs/biome": "2.3.8",
    "@tanstack/devtools-vite": "^0.3.12",
    "@tanstack/react-devtools": "^0.8.4",
    "@tanstack/react-query-devtools": "^5.91.1",
    "@tanstack/react-router-devtools": "^1.141.6",
    "@testing-library/dom": "^10.4.1",
    "@testing-library/react": "^16.3.1",
    "@types/node": "^25.0.3",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.2",
    "babel-plugin-react-compiler": "^1.0.0",
    "dotenv": "^17.2.3",
    "dotenv-cli": "^11.0.0",
    "jsdom": "^27.3.0",
    "ts-morph": "^27.0.2",
    "tsx": "^4.21.0",
    "typescript": "^5.9.3",
    "vite": "^7.3.0",
    "vite-plugin-db": "^0.5.0",
    "vite-tsconfig-paths": "^5.1.4",
    "vitest": "^4.0.16",
    "web-vitals": "^5.1.0"
  }
}
```

### `apps/web/tsconfig.json` (Updated)

```json
{
  "extends": "@repo/typescript-config/react.json",
  "include": ["**/*.ts", "**/*.tsx"],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@repo/database": ["../../packages/database/src"],
      "@repo/queue": ["../../packages/queue/src"],
      "@repo/storage": ["../../packages/storage/src"]
    }
  }
}
```

### `apps/web/biome.json` (Updated - Optional Override)

```json
{
  "extends": "@repo/biome-config/index.json",
  "files": {
    "includes": [
      "**/src/**/*",
      "**/.vscode/**/*",
      "**/index.html",
      "**/vite.config.js"
    ],
    "ignore": [
      "src/routeTree.gen.ts",
      "src/styles.css"
    ]
  }
}
```

### `apps/web/drizzle.config.ts` (Updated)

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: '../../packages/database/migrations',
  schema: '../../packages/database/src/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

---

## Services Directory

Move the docker-compose.dev.yaml to a higher level for shared infrastructure:

### `services/docker-compose.dev.yaml`

```yaml
# Shared development services for the SoftChor (Software für den Chor) monorepo
services:
  electric:
    image: electricsql/electric:latest
    container_name: electric_dev_sync
    environment:
      DATABASE_URL: ${DATABASE_URL}
      ELECTRIC_SECRET: ${ELECTRIC_SECRET}
      ELECTRIC_USAGE_REPORTING: false
    ports:
      - 30000:3000
    volumes:
      - electric_data:/var/lib/electric/persistent

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 10s
      timeout: 5s
      retries: 5

  rabbitmq:
    image: rabbitmq:3.13-management
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: app
      RABBITMQ_DEFAULT_PASS: app-secret
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "-q", "ping"]
      interval: 10s
      timeout: 5s
      retries: 10

volumes:
  electric_data:
  minio_data:
  rabbitmq_data:
```

---

## Migration Steps

Follow these numbered steps sequentially to migrate to Turborepo:

### 1. Preparation & Backup

```bash
# Create a backup branch
git checkout -b pre-turborepo-backup
git push origin pre-turborepo-backup

# Create migration branch
git checkout main
git checkout -b feature/turborepo-migration
```

### 2. Initialize Root Workspace

```bash
# Create root package.json
cat > package.json << 'EOF'
{
  "name": "softchor",
  "private": true,
  "version": "1.0.0",
  "description": "SoftChor (Software für den Chor) - Monorepo with Turborepo",
  "packageManager": "pnpm@9.15.4",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "@biomejs/biome": "2.3.8",
    "turbo": "^2.4.1",
    "typescript": "^5.9.3"
  }
}
EOF

# Install Turborepo at root
pnpm install

# Create pnpm-workspace.yaml
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - "apps/*"
  - "packages/*"

onlyBuiltDependencies:
  - bufferutil
  - core-js
  - esbuild
EOF
```

### 3. Create Root Configuration Files

```bash
# Create turbo.json (copy content from "Root Configuration Files" section)
# Create root biome.json (copy content from section above)
# Update .gitignore (copy content from section above)

# Create docs directory
mkdir -p docs

# Create services directory
mkdir -p services
```

### 4. Move Shared Services

```bash
# Move docker-compose to services/
mv apps/web/docker-compose.dev.yaml services/docker-compose.dev.yaml
```

### 5. Create Packages Directory Structure

```bash
# Create package directories
mkdir -p packages/{database,queue,storage,typescript-config,biome-config}

# Database package
mkdir -p packages/database/src/schema
mkdir -p packages/database/migrations

# Queue package
mkdir -p packages/queue/src

# Storage package
mkdir -p packages/storage/src

# Config packages
mkdir -p packages/typescript-config
mkdir -p packages/biome-config
```

### 6. Create TypeScript Config Package

```bash
cd packages/typescript-config

# Create package.json
cat > package.json << 'EOF'
{
  "name": "@repo/typescript-config",
  "version": "1.0.0",
  "private": true,
  "files": ["base.json", "react.json", "node.json"]
}
EOF

# Create config files (copy from "packages/typescript-config" section above)

cd ../..
```

### 7. Create Biome Config Package

```bash
cd packages/biome-config

# Create package.json and index.json (copy from section above)

cd ../..
```

### 8. Create Database Package

```bash
cd packages/database

# Create package.json (copy from section above)

# Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
EOF

# Copy schema files
cp ../../apps/web/src/db/schema/posts.ts src/schema/
cp ../../apps/web/src/features/auth/db/schema.ts src/schema/auth.ts
cp ../../apps/web/src/features/scores/db/schema.ts src/schema/scores.ts

# Create index files (copy from section above)

# Copy migrations
cp -r ../../apps/web/migrations/* migrations/

# Copy drizzle.config
cp ../../apps/web/drizzle.config.ts ./

cd ../..
```

### 9. Create Queue Package

```bash
cd packages/queue

# Create package.json and tsconfig.json

# Copy and refactor queue code
# - Extract from apps/web/src/features/queue/lib/rabbitmq.ts
# - Create client.ts, enqueue.ts, types.ts (see section above)

cd ../..
```

### 10. Create Storage Package

```bash
cd packages/storage

# Create package.json and tsconfig.json

# Extract and refactor storage code
# - From apps/web/src/features/s3/lib/client.ts
# - Create client.ts, upload.ts, presigned.ts, delete.ts

cd ../..
```

### 11. Update Web App Configuration

```bash
cd apps/web

# Remove old workspace config
rm pnpm-workspace.yaml

# Update package.json (see "Updated App Configurations" section)
# Update tsconfig.json
# Update biome.json (optional override)
# Update drizzle.config.ts

cd ../..
```

### 12. Update Web App Imports

Update import statements in `apps/web` to use the new packages:

```typescript
// Before:
import { db } from '@/db'
import { songs } from '@/db/schema'

// After:
import { db, songs } from '@repo/database'

// Before:
import { enqueueJob } from '@/features/queue/lib/rabbitmq'

// After:
import { enqueueJob } from '@repo/queue'

// Before:
import { s3Client, bucketName } from '@/features/s3/lib/client'

// After:
import { s3Client, bucketName } from '@repo/storage'
```

Files to update:
- `apps/web/src/features/queue/services/queue.ts`
- `apps/web/src/features/s3/services/storage.ts`
- All files importing from `@/db`

### 13. Remove Old Feature Directories

```bash
# After confirming imports work:
rm -rf apps/web/src/features/queue/lib
rm -rf apps/web/src/features/s3/lib
rm -rf apps/web/src/db
```

### 14. Install Dependencies

```bash
# Install all dependencies from root
pnpm install

# This will install dependencies for all workspace packages
```

### 15. Build Packages

```bash
# Build all packages
pnpm run build

# This should build database, queue, storage packages
```

### 16. Test the Migration

```bash
# Run type checking
pnpm run type-check

# Run linting
pnpm run lint

# Run tests
pnpm run test

# Try running dev server
pnpm run dev
```

### 17. Update Environment Files

```bash
# Create root .env.example (optional, for documentation)
cat > .env.example << 'EOF'
# This is a monorepo. Each app has its own .env file:
# - apps/web/.env.local
# - apps/worker/.env.local
# See each app's .env.example for required variables
EOF

# Keep app-specific .env files in their locations
# apps/web/.env.local
# apps/worker/.env.local
```

### 18. Update CI/CD (GitHub Actions)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: ${{ secrets.TURBO_TEAM }}

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9
          
      - name: Get pnpm store directory
        id: pnpm-cache
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT
          
      - name: Setup pnpm cache
        uses: actions/cache@v4
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-
            
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Build packages
        run: pnpm run build
        
      - name: Run type checks
        run: pnpm run type-check
        
      - name: Run linting
        run: pnpm run lint
        
      - name: Run tests
        run: pnpm run test
```

### 19. Documentation Updates

```bash
# Update root README.md with monorepo structure
# Create package-specific README files
# Document new commands and workflows
```

### 20. Final Verification & Commit

```bash
# Verify everything works
pnpm run build
pnpm run type-check
pnpm run lint
pnpm run test

# Commit changes
git add .
git commit -m "feat: migrate SoftChor to Turborepo monorepo structure

- Add Turborepo for task orchestration
- Extract database, queue, and storage into shared packages
- Create shared TypeScript and Biome configs
- Move services to root level
- Update CI/CD workflow for monorepo"

# Push to remote
git push origin feature/turborepo-migration
```

---

## Dependency Management Strategy

### Dependencies to Hoist to Root

**Development Tools** (used across all packages):
- `typescript`
- `@biomejs/biome`
- `turbo`

**Note**: Most dependencies should remain in their respective packages for clarity and to avoid version conflicts.

### App-Specific Dependencies

**Web App Only**:
- All React and TanStack dependencies
- `better-auth`
- Radix UI components
- Vite and build tooling

**Worker App Only**:
- Python dependencies in `pyproject.toml`

### Workspace Package References

Use `workspace:*` protocol for internal packages:

```json
{
  "dependencies": {
    "@repo/database": "workspace:*",
    "@repo/queue": "workspace:*",
    "@repo/storage": "workspace:*"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@repo/biome-config": "workspace:*"
  }
}
```

This ensures pnpm links the local packages instead of trying to fetch from npm.

---

## Development Commands

### Running Tasks

```bash
# Run dev servers for all apps
pnpm run dev

# Run dev for specific app
pnpm --filter web run dev
pnpm --filter worker run dev  # (if Python has pnpm script)

# Build all packages and apps
pnpm run build

# Build specific package
pnpm --filter @repo/database run build

# Run tests
pnpm run test

# Lint all code
pnpm run lint

# Type check
pnpm run type-check
```

### Database Commands

```bash
# Generate migrations (from any directory)
pnpm run db:generate

# Run migrations
pnpm run db:migrate

# Open Drizzle Studio
pnpm run db:studio
```

### Services Commands

```bash
# Start development services (MinIO, RabbitMQ, ElectricSQL)
pnpm run services:up

# Stop services
pnpm run services:down
```

### Package-Specific Development

```bash
# Work on database package with watch mode
cd packages/database
pnpm run dev

# Work on queue package
cd packages/queue
pnpm run dev
```

### Filtering by Directory

Turborepo and pnpm support filtering:

```bash
# Run build in all packages/* only
pnpm --filter "./packages/**" run build

# Run test in apps/* only
pnpm --filter "./apps/**" run test
```

---

## GitHub Actions Workflow

### Complete CI Configuration

`.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint-and-test:
    name: Lint & Test
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 2
          
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9.15.4
          
      - name: Get pnpm store directory
        id: pnpm-cache
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT
          
      - name: Setup pnpm cache
        uses: actions/cache@v4
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-
            
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Cache Turbo
        uses: actions/cache@v4
        with:
          path: .turbo
          key: ${{ runner.os }}-turbo-${{ github.sha }}
          restore-keys: |
            ${{ runner.os }}-turbo-
            
      - name: Build packages
        run: pnpm run build
        
      - name: Type check
        run: pnpm run type-check
        
      - name: Lint
        run: pnpm run lint
        
      - name: Run tests
        run: pnpm run test

  build-worker:
    name: Build Worker (Python)
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
          
      - name: Install uv
        run: pip install uv
        
      - name: Install dependencies
        working-directory: apps/worker
        run: uv pip install --system -r pyproject.toml
        
      - name: Build Docker image
        working-directory: apps/worker
        run: docker build -t worker:test .
```

### Turborepo Remote Caching (Optional Future Enhancement)

For now, we're using **local caching only**. If you want to enable Vercel's remote caching in the future:

1. Sign up at https://vercel.com/signup
2. Link your repo and get a token
3. Add secrets to GitHub:
   - `TURBO_TOKEN`
   - `TURBO_TEAM`
4. Turborepo will automatically use remote cache

---

## Future Improvements (TODOs)

### 1. Drizzle to Python Schema Codegen

**Goal**: Automatically generate Python SQLAlchemy/Pydantic models from Drizzle schema.

**Implementation Ideas**:
- Create a codegen script in `packages/database/scripts/codegen-python.ts`
- Use `ts-morph` or `drizzle-kit` introspection to read schema
- Generate Python dataclasses or Pydantic models
- Run as part of `db:generate` task

**Benefits**:
- Single source of truth for database schema
- Guaranteed type consistency between TypeScript and Python
- Reduced manual sync effort

### 2. Shared Task Type Definitions

**Goal**: Share task type enums between TypeScript (web) and Python (worker).

**Current State**: 
- TypeScript: `packages/queue/src/types.ts`
- Python: `apps/worker/src/task_types.py`

**Implementation Ideas**:
- Generate Python enums from TypeScript during build
- Or maintain JSON schema that both languages consume
- Add validation script to ensure sync

### 3. Enhanced CI/CD

- **Docker Compose in CI**: Spin up services for integration tests
- **E2E Testing**: Add Playwright/Cypress for full-stack tests
- **Preview Deployments**: Auto-deploy PRs to staging
- **Database Migration Testing**: Test migrations against real database

### 4. Additional Shared Packages

Consider extracting:
- **`@repo/ui`**: Shared React components (if used in multiple apps later)
- **`@repo/utils`**: Common utility functions
- **`@repo/validators`**: Zod schemas shared across apps
- **`@repo/test-utils`**: Shared testing utilities

### 5. Python Package Management in Monorepo

**Current**: Each Python app manages its own dependencies.

**Future**: Consider:
- Using a Python monorepo tool like `pants` or `poetry` with workspaces
- Sharing Python utilities in `packages/python-shared`

### 6. Remote Caching

Enable Vercel Turborepo remote caching to share build artifacts across team and CI.

### 7. Docker Optimization

- Multi-stage builds to leverage Turborepo cache
- Build only changed packages
- Prune devDependencies in production images

---

## Rollback Plan

If the migration encounters critical issues:

### Quick Rollback

```bash
# Switch back to pre-migration backup
git checkout pre-turborepo-backup

# Or revert the migration commit
git revert <migration-commit-sha>
```

### Partial Rollback

If only specific packages are problematic:

1. Keep Turborepo infrastructure
2. Move problematic code back to apps/web
3. Update imports
4. Remove broken package from `pnpm-workspace.yaml`

### Common Issues & Solutions

**Issue**: Circular dependencies between packages
- **Solution**: Refactor to remove cycles, use dependency injection

**Issue**: TypeScript path mapping not working
- **Solution**: Ensure `tsconfig.json` paths align with package structure

**Issue**: Vite not resolving workspace packages
- **Solution**: Add `vite-tsconfig-paths` plugin (already in web app)

**Issue**: Turborepo cache not invalidating
- **Solution**: Adjust `inputs` in `turbo.json` to include all relevant files

---

## References & Documentation

- **Turborepo Official Docs**: https://turborepo.org/docs
- **pnpm Workspaces**: https://pnpm.io/workspaces
- **Biome Configuration**: https://biomejs.dev/reference/configuration/
- **Drizzle ORM**: https://orm.drizzle.team/
- **TypeScript Project References**: https://www.typescriptlang.org/docs/handbook/project-references.html

---

## Summary

This migration plan provides a comprehensive, step-by-step guide to transform the **SoftChor** (Software für den Chor) project into a well-organized Turborepo monorepo. The new structure:

✅ **Extracts shared code** into reusable packages (database, queue, storage)  
✅ **Maintains app independence** with separate .env files, Dockerfiles, and tests  
✅ **Optimizes build performance** with Turborepo's intelligent caching  
✅ **Improves developer experience** with clear commands and task orchestration  
✅ **Enables future enhancements** like Drizzle → Python codegen  

The migration is designed to be **incremental and reversible**, with clear rollback options if issues arise. Follow the numbered steps sequentially, test at each stage, and commit progress regularly.

**Ready for review and approval before implementation.**
