# Architecture Overview

Arcstack separates framework specifics from application structure by using shared contracts and runtime drivers.

## Core Idea

- Keep app architecture consistent across frameworks.
- Isolate framework details inside driver packages.
- Reuse console/runtime logic through shared packages.

## Shared Packages

### `@arcstack/contract`

Defines framework-agnostic contracts for:

- kit drivers
- router capabilities
- app + runtime integration boundaries

### `@arcstack/common`

Provides reusable runtime helpers, including lifecycle and error response utilities.

### `@arcstack/console`

Provides a shared console kernel and base commands used by all kits.

### `@arcstack/database`

Provides shared database bootstrap helpers for full templates.

## Driver Packages

Each runtime implements the contract through a dedicated driver package:

- `@arcstack/driver-express`
- `@arcstack/driver-h3`

This keeps runtime-specific behavior in one place while preserving a uniform app structure.

## Console Command Model

Arcstack centralizes common developer commands in `@arcstack/console` and allows framework-specific extensions via driver stubs.

## Template Profiles

### Full Profiles

- Includes Prisma/database features.
- Includes generated app resources and API route scaffolding.

### Lean Profiles

- Removes Prisma/database dependencies and runtime files.
- Removes `src/app` and `src/routes/api.ts` for a minimal baseline.

## Why This Matters

- Easier migration between frameworks.
- Less duplicated maintenance across kits.
- Cleaner evolution path for future drivers (Fastify, Bun, and others).
