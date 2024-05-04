import { PoolClient } from "pg";
import { connect } from "../database";
import { User } from "../models/User";

// Register a new user
export const register = async (user: User): Promise<User[]> => {
  try {
    const client: PoolClient = await connect();
    const sql = `
      INSERT INTO Users ("name", "mobile", "password", "role", "createddate")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [
      user.name,
      user.mobile,
      user.password,
      user.role,
      new Date(),
    ];
    const { rows } = await client.query(sql, values);
    await client.release();

    return rows as User[];
  } catch (error) {
    console.error("Error while registering user:", error);
    throw error;
  }
};

// Check if user is valid by mobile number
export const isUserValid = async (user: {
  mobile: string;
}): Promise<User[]> => {
  try {
    const client: PoolClient = await connect();
    const sql = `
      SELECT * FROM Users WHERE "mobile" = $1;
    `;
    const values = [user.mobile];
    const { rows } = await client.query(sql, values);
    await client.release();

    return rows as User[];
  } catch (error) {
    console.error("Error while checking user validity:", error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (user: {
  userId: number;
}): Promise<User[]> => {
  try {
    const client: PoolClient = await connect();
    const sql = `
      SELECT * FROM Users WHERE "id" = $1;
    `;
    const values = [user.userId];
    const { rows } = await client.query(sql, values);
    await client.release();

    return rows as User[];
  } catch (error) {
    console.error("Error while fetching user by ID:", error);
    throw error;
  }
};
