# Getting Started

Arcstack helps you scaffold TypeScript backend apps with a consistent architecture across frameworks.

## Prerequisites

- Node.js 20+
- pnpm (recommended), npm, or yarn

## Create a New App

::: code-group

```sh [npx]
$ npx create arcstack
```

```sh [npm]
$ npm init arcstack@latest
```

```sh [pnpm]
$ pnpm create arcstack@latest
```

```sh [yarn]
$ yarn create arcstack@latest
```

:::

You can also provide a target directory:

::: code-group

```sh [npx]
$ npx create arcstack my-app
```

```sh [npm]
$ npm init arcstack@latest my-app
```

```sh [pnpm]
$ pnpm create arcstack@latest my-app
```

```sh [yarn]
$ yarn create arcstack@latest my-app
```

:::

## Available Templates

- `express` - full Express kit with database features
- `express-lean` - Lean Express kit stripped of database features and app scaffolding
- `h3` - full H3 kit with database features
- `h3-lean` - Lean H3 kit stripped of database features and app scaffolding

## Install and Run

::: code-group

```sh [npm]
cd my-app
$ npm install
$ npm run dev
```

```sh [pnpm]
cd my-app
$ pnpm install
$ pnpm dev
```

```sh [yarn]
cd my-app
$ yarn install
$ yarn dev
```

:::

## Useful Commands

- `npx arch dev` - run in development mode
- `npx arch build` - build for production
- `npx arch` - run Arcstack console commands
- `pnpm lint` - run lint checks

## Full vs Lean

Use **full** templates when you want the complete Arcstack experience with Prisma and database features included. Full kits come with:

- `src/app` with generated controllers, resources, and services
- `src/routes/api.ts` with scaffolded API routes
- Prisma and related runtime files and dependencies

Use **lean** templates when you want a minimal HTTP starter without database dependencies. In lean kits, Arcstack removes:

- `src/app`
- `src/routes/api.ts`
- Prisma/database runtime files and dependencies

## Monorepo Packages (Concept)

Arcstack kits build on shared packages:

- `@arcstack-hq/contract`
- `@arcstack-hq/common`
- `@arcstack-hq/console`
- `@arcstack-hq/database` (full kits)

For architecture details, see [Architecture Overview](/architecture/overview).
