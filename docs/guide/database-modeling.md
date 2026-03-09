# Database & Modeling

Arkstack uses **Arkormˣ** as its modeling layer on top of Prisma, so you can work with models and query builders while keeping Prisma’s reliable schema/migration workflow.

This page covers the basics you need to start using Arkormˣ in an Arkstack app.

## Database Configuration

Set your database connection in `.env`:

```env
DATABASE_URL="postgres://postgres:postgres@localhost:5432/arkstack_dev?schema=public"
```

Then run Prisma migrations and generate the client:

```sh
pnpm prisma migrate dev
```

```sh
pnpm prisma generate
```

## Define a model

Create a model class (example):

```ts
import { Model } from 'arkormx';

export class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
}
```

Or use the Arkstack CLI to generate a model:

```sh
npx ark make:model User
```

For advanced Arkstack CLI model generation options, see [Arkstack CLI](/guide/cli#arkormx-powered-commands).

## Query data with Arkormˣ

Use the model query API for common operations:

```ts
const user = await User.query().create({
  name: 'John Doe',
  email: 'john@example.com',
});

const found = await User.query().where({ email: 'john@example.com' }).first();

if (found) {
  found.name = 'Jane Doe';
  await found.save();
  await found.delete();
}
```

## Advanced usage

For relationships, advanced query patterns, factories, seeders, and full Arkormˣ capabilities, see the official documentation:

- [Arkormˣ Documentation](https://arkorm.toneflix.net/)
