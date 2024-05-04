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
exports.getOrderHistory = exports.addOrderItems = exports.addOrder = void 0;
const database_1 = require("../database");
// Add order
function addOrder(order) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, database_1.connect)();
        const query = `
    INSERT INTO Orders (userId, orderDate, amount)
    VALUES ($1, CURRENT_TIMESTAMP, $2)
    RETURNING id;
  `;
        const values = [order.userId, order.amount];
        const { rows } = yield connection.query(query, values);
        yield connection.release();
        return { insertId: rows[0].id };
    });
}
exports.addOrder = addOrder;
// Add order_item
function addOrderItems(order) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, database_1.connect)();
        const query = `
    INSERT INTO Order_Items (orderId, itemId, quantity)
    VALUES ($1, $2, $3)
    RETURNING id;
  `;
        const values = [order.orderId, order.itemId, order.quantity];
        const { rows } = yield connection.query(query, values);
        yield connection.release();
        return { insertId: rows[0].id };
    });
}
exports.addOrderItems = addOrderItems;
// Get order history
function getOrderHistory(order) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, database_1.connect)();
        const query = `
    SELECT oi.orderId AS "orderId", o.amount, oi.itemId AS "itemId", oi.quantity, i.name AS "itemName", o.orderDate AS "orderDate"
    FROM Orders AS o
    JOIN Order_Items AS oi ON o.id = oi.orderId
    JOIN Items AS i ON i.id = oi.itemId
    WHERE o.userId = $1;
  `;
        const values = [order.userId];
        const { rows } = yield connection.query(query, values);
        yield connection.release();
        return rows;
    });
}
exports.getOrderHistory = getOrderHistory;
