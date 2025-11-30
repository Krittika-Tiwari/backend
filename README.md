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

````markdown
# FoodLens — Backend

This service provides the Recipes API (Express + TypeScript) and a database seeding script used for the "Food Recipes Dashboard" assignment.

Summary

- Tech: Node.js (Express) + TypeScript + PostgreSQL
- Endpoints:
  - GET `/api/recipes` — list recipes (pagination, search, filters)
  - GET `/api/recipes/:id` — get a single recipe

Local setup (macOS / zsh)

1. Install dependencies

```bash
cd backend
npm install
```
````

2. Environment

Create a `.env` file in `backend/` containing at least:

```
DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<database>
PORT=5001
```

3. Create Postgres database

Example (psql):

```bash
createdb foodlens_dev
```

4. Database schema

The seed script will create a `recipes` table with the following shape (approx.):

```sql
CREATE TABLE recipes (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	description TEXT,
	ingredients TEXT,
	steps TEXT,
	image_url TEXT,
	calories INTEGER,
	protein INTEGER,
	carbs INTEGER,
	fats INTEGER,
	category TEXT,
	created_at TIMESTAMP DEFAULT now()
);
```

The included seeder (`src/setup-database.ts`) will create this table (if missing) and insert sample rows.

5. Seed the database (50+ recipes)

The repository includes `src/setup-database.ts` which inserts seeded recipes. Run:

```bash
# Preferred (no global installs):
npx ts-node-esm src/setup-database.ts

# Alternatively, if you have ts-node installed:
node --loader ts-node/esm src/setup-database.ts

# To add a script in package.json, add:
# "setup-db": "node --loader ts-node/esm src/setup-database.ts"
# then run: npm run setup-db
```

The seeder is designed to insert 50+ rows for the assignment. If you re-run it you may want to DROP the `recipes` table first or modify the script to avoid duplicates.

Run the server

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

API usage examples

- List recipes (first page, 12 per page):

```bash
curl "http://localhost:5001/api/recipes?page=1&limit=12"
```

- Search by text (search name/description/ingredients):

```bash
curl "http://localhost:5001/api/recipes?search=chicken"
```

- Filter by category (case-insensitive exact match):

```bash
curl "http://localhost:5001/api/recipes?filter=Veg"
```

- Fetch a single recipe by id:

```bash
curl "http://localhost:5001/api/recipes/42"
```

Supported query params on GET `/api/recipes`

- `search` — full-text-ish search across name/description/ingredients
- `filter` — category filter (e.g. `Veg`, `Non-Veg`, `Dessert`)
- `page` — page number (1-indexed)
- `limit` — items per page



```

```
