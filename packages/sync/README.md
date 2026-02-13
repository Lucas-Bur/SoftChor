# @repo/sync

Centralized Electric-SQL sync utilities for SoftChor.

## Installation

This package is part of the SoftChor monorepo and is automatically available via workspace protocol.

## Usage

```typescript
import { prepareElectricUrl, proxyElectricRequest } from "@repo/sync";
import { isAllowedTable, getTableForSync } from "@repo/sync";
```

## Features

- **Electric Proxy**: Utilities for proxying Electric SQL requests
- **Table Helpers**: Type-safe table access for sync operations
- **Framework Agnostic**: Core sync utilities without framework coupling

## Dependencies

- `@electric-sql/client` - Electric SQL client library
- `@tanstack/react-db` - TanStack database integration
