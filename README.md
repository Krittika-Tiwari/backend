# FoodLens — Backend

This service provides the Recipes API (Express + TypeScript) and a small database seeding script.

Quick setup (macOS / zsh)

1. Install dependencies

```bash
cd backend
npm install
```

2. Create a `.env` file in `backend/` with at least:

```
DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<database>
PORT=5001
```

3. Create the Postgres database (if you don't have one):

```bash
# example using psql
createdb foodlens_dev
```

4. Seed the database

The repository includes a TypeScript seed script at `src/setup-database.ts` that creates the `recipes` table and inserts sample rows.

Run it with one of these commands:

```bash
# preferred (uses ts-node via npx)
npx ts-node-esm src/setup-database.ts

# or use node loader if you have ts-node installed locally
node --loader ts-node/esm src/setup-database.ts

# If you prefer, update package.json to provide a script like:
# "setup-db": "node --loader ts-node/esm src/setup-database.ts"
# then run: npm run setup-db
```

5. Start the server (development)

```bash
npm run dev
```

Start (production build)

```bash
npm run build
npm start
```

API

- GET `/api/recipes` — list recipes (supports `search`, `filter`, `page`, `limit` query params)
- GET `/api/recipes/:id` — get single recipe

Notes and troubleshooting

- If `npm run setup-db` in `package.json` references a `.js` file but the seed file is TypeScript (`.ts`), use the `npx ts-node-esm` command above, or update the script accordingly.
- Ensure `DATABASE_URL` points to a writable Postgres instance and that the database user has permission to create tables.
- Port default is `5001` (adjust via `PORT` in `.env`).

Deployment

- Deploy the API to platforms like Render, Railway, or Fly. Provide `DATABASE_URL` as a secret config var on the host.

Questions?

If you want, I can update `package.json` scripts to add a working `setup-db` script that runs the TypeScript seeder directly.
