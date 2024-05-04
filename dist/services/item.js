"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateItem = exports.removeItem = exports.getAvailableItemList = exports.updateItemAndInventory = exports.directInventoryUpdate = exports.updateInventory = exports.getAvailableItemQty = exports.getItemById = exports.getItem = exports.getAllItems = exports.addInventory = exports.addItem = void 0;
const database_1 = require("../database");
// Add single item
function addItem(item) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, database_1.connect)();
        const query = `
    INSERT INTO Items(name, quantity, price, createdDate, createdBy, isActive)
    VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, true)
    RETURNING id;
  `;
        const values = [item.name, item.quantity, item.price, item.createdBy];
        const { rows } = yield connection.query(query, values);
        yield connection.release();
        return { insertId: rows[0].id };
    });
}
exports.addItem = addItem;
// Add to inventory
function addInventory(item) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, database_1.connect)();
        const query = `
    INSERT INTO Inventory(itemId, available_quantity, createdDate, updatedDate)
    VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING id;
  `;
        const values = [item.insertItemId, item.quantity];
        const { rows } = yield connection.query(query, values);
        yield connection.release();
        return { insertId: rows[0].id };
    });
}
exports.addInventory = addInventory;
// Get all items
function getAllItems() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, database_1.connect)();
        const query = `
    SELECT it.id AS "itemId", it.name AS "itemName", it.quantity AS "itemQuantity",
           it.price AS "itemPrice", inv.available_quantity AS "available_quantity"
    FROM Items AS it
    LEFT JOIN Inventory AS inv ON it.id = inv.itemId
    WHERE it.isActive = true;
  `;
        const { rows } = yield connection.query(query);
        yield connection.release();
        return rows;
    });
}
exports.getAllItems = getAllItems;
// Get single item details by name
function getItem(item) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, database_1.connect)();
        const query = `
    SELECT * FROM Items WHERE name = $1 AND isActive = true;
  `;
        const values = [item.name];
        const { rows } = yield connection.query(query, values);
        yield connection.release();
        return rows;
    });
}
exports.getItem = getItem;
// Get single item by id
function getItemById(item) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, database_1.connect)();
        const query = `
    SELECT * FROM Items WHERE id = $1 AND isActive = true;
  `;
        const values = [item.itemId];
        const { rows } = yield connection.query(query, values);
        yield connection.release();
        return rows;
    });
}
exports.getItemById = getItemById;
// Get available item quantity by Id
function getAvailableItemQty(item) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, database_1.connect)();
        try {
            const query = `
      SELECT available_quantity FROM Inventory WHERE itemId = $1 FOR UPDATE;
    `;
            const values = [item.itemId];
            const { rows } = yield connection.query(query, values);
            if (rows.length === 0) {
                return undefined;
            }
            return rows[0];
        }
        catch (error) {
            throw error;
        }
        finally {
            yield connection.release();
        }
    });
}
exports.getAvailableItemQty = getAvailableItemQty;
// Update Inventory
function updateInventory(item) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, database_1.connect)();
        const query = `
    UPDATE Inventory SET available_quantity = available_quantity - $1
    WHERE itemId = $2;
  `;
        const values = [item.quantity, item.itemId];
        const { rows } = yield connection.query(query, values);
        yield connection.release();
        return rows;
    });
}
exports.updateInventory = updateInventory;
// Direct admin Inventory update
function directInventoryUpdate(item) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, database_1.connect)();
        const query = `
    UPDATE Inventory SET available_quantity = $1 WHERE itemId = $2;
  `;
        const values = [item.quantity, item.itemId];
        const { rows } = yield connection.query(query, values);
        yield connection.release();
        return rows;
    });
}
exports.directInventoryUpdate = directInventoryUpdate;
// Update item quantity and update Inventory
function updateItemAndInventory(item) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, database_1.connect)();
        const query = `
    UPDATE Inventory SET available_quantity = available_quantity + $1 WHERE itemId = $2;
  `;
        const values = [item.quantity, item.itemId];
        const { rows } = yield connection.query(query, values);
        yield connection.release();
        return rows;
    });
}
exports.updateItemAndInventory = updateItemAndInventory;
// Get all available Items
function getAvailableItemList() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, database_1.connect)();
        try {
            const query = `
      SELECT it.id AS "itemId", it.name AS "itemName", it.price AS "itemPrice",
             inv.available_quantity AS "available_quantity"
      FROM Items AS it
      LEFT JOIN Inventory AS inv ON it.id = inv.itemId
      WHERE inv.available_quantity > 0 AND it.isActive = true;
    `;
            const { rows } = yield connection.query(query);
            return rows;
        }
        catch (error) {
            throw error;
        }
        finally {
            yield connection.release();
        }
    });
}
exports.getAvailableItemList = getAvailableItemList;
// Remove single item (deactivate item)
function removeItem(item) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, database_1.connect)();
        try {
            const query = `
      UPDATE Items SET isActive = false WHERE id = $1;
    `;
            const values = [item.itemId];
            const { rows } = yield connection.query(query, values);
            return rows;
        }
        catch (error) {
            throw error;
        }
        finally {
            yield connection.release();
        }
    });
}
exports.removeItem = removeItem;
// Update Item
function updateItem(item) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, database_1.connect)();
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
            const { rows } = yield connection.query(query, values);
            return rows;
        }
        catch (error) {
            throw error;
        }
        finally {
            yield connection.release();
        }
    });
}
exports.updateItem = updateItem;
