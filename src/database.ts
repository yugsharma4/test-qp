import { Pool } from "pg";

export async function connect() {
  const pool = new Pool({
    host: "postgres",
    port: 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  });

  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    console.error("Error connecting to PostgreSQL database:", error);
    throw error;
  }
}
