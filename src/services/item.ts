import { connect } from "../database";
import { Item } from "../models/Item";

// Add single item
export async function addItem(
  item: Item & { createdBy: number }
): Promise<{ insertId: number }> {
  const connection = await connect();
  const query = `
    INSERT INTO Items(name, quantity, price, createdDate, createdBy, isActive)
    VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, true)
    RETURNING id;
  `;
  const values = [item.name, item.quantity, item.price, item.createdBy];
  const { rows } = await connection.query(query, values);
  await connection.release();
  return { insertId: rows[0].id };
}

// Add to inventory
export async function addInventory(item: {
  insertItemId: number;
  quantity: number;
}): Promise<{ insertId: number }> {
  const connection = await connect();
  const query = `
    INSERT INTO Inventory(itemId, available_quantity, createdDate, updatedDate)
    VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING id;
  `;
  const values = [item.insertItemId, item.quantity];
  const { rows } = await connection.query(query, values);
  await connection.release();
  return { insertId: rows[0].id };
}

// Get all items
export async function getAllItems(): Promise<Item[]> {
  const connection = await connect();
  const query = `
    SELECT it.id AS "itemId", it.name AS "itemName", it.quantity AS "itemQuantity",
           it.price AS "itemPrice", inv.available_quantity AS "available_quantity"
    FROM Items AS it
    LEFT JOIN Inventory AS inv ON it.id = inv.itemId
    WHERE it.isActive = true;
  `;
  const { rows } = await connection.query(query);
  await connection.release();
  return rows;
}

// Get single item details by name
export async function getItem(item: { name: string }): Promise<Item[]> {
  const connection = await connect();
  const query = `
    SELECT * FROM Items WHERE name = $1 AND isActive = true;
  `;
  const values = [item.name];
  const { rows } = await connection.query(query, values);
  await connection.release();
  return rows;
}

// Get single item by id
export async function getItemById(item: { itemId: number }): Promise<Item[]> {
  const connection = await connect();
  const query = `
    SELECT * FROM Items WHERE id = $1 AND isActive = true;
  `;
  const values = [item.itemId];
  const { rows } = await connection.query(query, values);
  await connection.release();
  return rows;
}

// Get available item quantity by Id
export async function getAvailableItemQty(item: {
  itemId: number;
}): Promise<{ available_quantity: number } | undefined> {
  const connection = await connect();

  try {
    const query = `
      SELECT available_quantity FROM Inventory WHERE itemId = $1 FOR UPDATE;
    `;
    const values = [item.itemId];
    const { rows } = await connection.query(query, values);

    if (rows.length === 0) {
      return undefined;
    }

    return rows[0] as { available_quantity: number };
  } catch (error) {
    throw error;
  } finally {
    await connection.release();
  }
}

// Update Inventory
export async function updateInventory(item: {
  itemId: number;
  quantity: number;
}): Promise<[]> {
  const connection = await connect();
  const query = `
    UPDATE Inventory SET available_quantity = available_quantity - $1
    WHERE itemId = $2;
  `;
  const values = [item.quantity, item.itemId];
  const { rows } = await connection.query(query, values);
  await connection.release();
  return rows as [];
}

// Direct admin Inventory update
export async function directInventoryUpdate(item: {
  itemId: number;
  quantity: number;
}): Promise<[]> {
  const connection = await connect();
  const query = `
    UPDATE Inventory SET available_quantity = $1 WHERE itemId = $2;
  `;
  const values = [item.quantity, item.itemId];
  const { rows } = await connection.query(query, values);
  await connection.release();
  return rows as [];
}

// Update item quantity and update Inventory
export async function updateItemAndInventory(item: {
  itemId: number;
  quantity: number;
}): Promise<[]> {
  const connection = await connect();
  const query = `
    UPDATE Inventory SET available_quantity = available_quantity + $1 WHERE itemId = $2;
  `;
  const values = [item.quantity, item.itemId];
  const { rows } = await connection.query(query, values);
  await connection.release();
  return rows as [];
}

// Get all available Items
export async function getAvailableItemList(): Promise<
  {
    itemId: number;
    itemName: string;
    itemPrice: number;
    available_quantity: number;
  }[]
> {
  const connection = await connect();

  try {
    const query = `
      SELECT it.id AS "itemId", it.name AS "itemName", it.price AS "itemPrice",
             inv.available_quantity AS "available_quantity"
      FROM Items AS it
      LEFT JOIN Inventory AS inv ON it.id = inv.itemId
      WHERE inv.available_quantity > 0 AND it.isActive = true;
    `;
    const { rows } = await connection.query(query);
    return rows;
  } catch (error) {
    throw error;
  } finally {
    await connection.release();
  }
}

// Remove single item (deactivate item)
export async function removeItem(item: { itemId: number }): Promise<Item[]> {
  const connection = await connect();
  try {
    const query = `
      UPDATE Items SET isActive = false WHERE id = $1;
    `;
    const values = [item.itemId];
    const { rows } = await connection.query(query, values);
    return rows;
  } catch (error) {
    throw error;
  } finally {
    await connection.release();
  }
}

// Update Item
export async function updateItem(item: {
  itemId: number;
  name?: string;
  quantity?: number;
  price?: number;
}): Promise<[]> {
  const connection = await connect();
  try {
    const values = [];
    let query = "UPDATE Items SET";

    if (item.name) {
      values.push(item.name);
      query += ` name = $${values.length},`;
    }

    if (item.quantity !== undefined) {
      values.push(item.quantity);
      query += ` quantity = $${values.length},`;
    }

    if (item.price !== undefined) {
      values.push(item.price);
      query += ` price = $${values.length},`;
    }

    query = query.slice(0, -1);
    values.push(item.itemId);
    query += ` WHERE id = $${values.length} `;
    console.log(query, values);
    const { rows } = await connection.query(query, values);
    return rows as [];
  } catch (error) {
    throw error;
  } finally {
    await connection.release();
  }
}
