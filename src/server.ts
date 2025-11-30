import express from "express";
import { Pool } from "pg";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

export type Request = express.Request;
export type Response = express.Response;

const app = express();
const port = process.env.PORT || 5000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: false,
  })
);

app.use(express.json());

interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: string;
  steps: string;
  image_url: string;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  category: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRecipes: number;
  limit: number;
}

interface RecipesResponse {
  recipes: Recipe[];
  pagination: PaginationInfo;
}

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Food Recipes API is running" });
});

app.get("/api/recipes", async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = "1", limit = "10" } = req.query;
    const filter = req.query.filter ? String(req.query.filter) : null;
    const search = req.query.search ? String(req.query.search) : null;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    let query = `
      SELECT * FROM recipes 
      WHERE 1=1
    `;

    const params: (string | number)[] = [];
    let paramCount = 1;

    if (search) {
      query += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount} OR ingredients ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    if (filter) {
      query += ` AND lower(category) = lower($${paramCount})`;
      params.push(filter);
      paramCount++;
    }

    const countQuery = `SELECT COUNT(*) FROM (${query}) as filtered`;
    const countResult = await pool.query(countQuery, params);
    const totalRecipes = parseInt(countResult.rows[0].count);

    query += ` ORDER BY id LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limitNum, offset);
    const result = await pool.query(query, params);

    const response: RecipesResponse = {
      recipes: result.rows,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalRecipes / limitNum),
        totalRecipes,
        limit: limitNum,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get(
  "/api/recipes/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await pool.query("SELECT * FROM recipes WHERE id = $1", [
        id,
      ]);

      if (result.rows.length === 0) {
        res.status(404).json({ error: "Recipe not found" });
        return;
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
