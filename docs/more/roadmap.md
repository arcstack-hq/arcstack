# Roadmap

This roadmap tracks Arcstack progress and upcoming priorities.

## Current Status

### Completed

- ✅ Framework-agnostic contracts and shared packages
  - `@arcstack/contract`
  - `@arcstack/common`
  - `@arcstack/console`
  - `@arcstack/database`
- ✅ Driver packages for current runtimes
  - `@arcstack/driver-express`
  - `@arcstack/driver-h3`
- ✅ Shared console command surface
  - `route:list`
  - `make:controller`
  - `make:resource`
  - `make:full-resource`
  - `dev`
  - `build`
- ✅ Lean and full starter profiles in create-arcstack
  - `express`, `h3`
  - `express-lean`, `h3-lean`
- ✅ Lean profile stripping of app/api/database scaffolding
  - Removes `src/app`
  - Removes `src/routes/api.ts`
  - Removes Prisma and database runtime/dependencies
- ✅ Root-level test coverage for shared architecture and command surface

### In Progress

- 🔄 Documentation expansion and API reference hardening

## Next Priorities

1. 🔲 Add first additional runtime driver (Fastify candidate)
2. 🔲 Add a plugin/extension model for driver and console integration
3. 🔲 Ship richer end-to-end command and scaffolding tests
4. 🔲 Publish package-level versioning/release workflow guidance
5. 🔲 Add migration and upgrade guides between template versions

## Future

- Bun runtime driver
- Optional auth presets
- Optional validation abstraction presets
- Multi-runtime starter comparison matrix
