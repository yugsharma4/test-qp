import { connect } from "../database";
import { Order } from "../models/Order";

// Add order
export async function addOrder(order: {
  userId: number;
  amount: number;
}): Promise<{ insertId: number }> {
  const connection = await connect();
  const query = `
    INSERT INTO Orders (userId, orderDate, amount)
    VALUES ($1, CURRENT_TIMESTAMP, $2)
    RETURNING id;
  `;
  const values = [order.userId, order.amount];
  const { rows } = await connection.query(query, values);
  await connection.release();
  return { insertId: rows[0].id };
}

// Add order_item
export async function addOrderItems(order: {
  orderId: number;
  itemId: number;
  quantity: number;
}): Promise<{ insertId: number }> {
  const connection = await connect();
  const query = `
    INSERT INTO Order_Items (orderId, itemId, quantity)
    VALUES ($1, $2, $3)
    RETURNING id;
  `;
  const values = [order.orderId, order.itemId, order.quantity];
  const { rows } = await connection.query(query, values);
  await connection.release();
  return { insertId: rows[0].id };
}

// Get order history
export async function getOrderHistory(order: { userId: number }): Promise<[]> {
  const connection = await connect();
  const query = `
    SELECT oi.orderId AS "orderId", o.amount, oi.itemId AS "itemId", oi.quantity, i.name AS "itemName", o.orderDate AS "orderDate"
    FROM Orders AS o
    JOIN Order_Items AS oi ON o.id = oi.orderId
    JOIN Items AS i ON i.id = oi.itemId
    WHERE o.userId = $1;
  `;
  const values = [order.userId];
  const { rows } = await connection.query(query, values);
  await connection.release();
  return rows as [];
}
