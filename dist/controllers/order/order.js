"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getOrderHistory = exports.placeOrder = void 0;
//services
const itemService = __importStar(require("../../services/item"));
const orderService = __importStar(require("../../services/order"));
//helpers
const apiResponse = __importStar(require("../../helper/apiResponse"));
const database_1 = require("../../database");
const placeOrder = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { items } = request.body;
        if (!items || items.length === 0) {
            return apiResponse.validationError(response, "User ID and Items are required fields!");
        }
        const connection = yield (0, database_1.connect)();
        try {
            // Begin transaction
            yield connection.query("BEGIN");
            let outOfStock = false;
            let totalAmount = 0;
            for (const item of items) {
                const result = yield itemService.getAvailableItemQty({
                    itemId: item.itemId,
                });
                if (!result) {
                    outOfStock = true;
                    break;
                }
                const availableQuantity = result.available_quantity || 0;
                //check if available qty is greater than requested item qty
                if (item.quantity > availableQuantity) {
                    outOfStock = true;
                    break;
                }
                //get price of that item
                const getItem = yield itemService.getItemById({ itemId: item.itemId });
                totalAmount += item.quantity * getItem[0].price;
            }
            //check out of stock true or not
            if (outOfStock) {
                yield connection.query("ROLLBACK");
                return apiResponse.validationError(response, "Some items are out of stock!");
            }
            const orderResult = yield orderService.addOrder({
                userId: request.body.user.id,
                amount: totalAmount,
            });
            const orderId = orderResult.insertId;
            //mapped orderId with item ids & update inventory available qty also
            const insertPromises = items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                yield orderService.addOrderItems({
                    orderId,
                    itemId: item.itemId,
                    quantity: item.quantity,
                });
                yield itemService.updateInventory({
                    itemId: item.itemId,
                    quantity: item.quantity,
                });
            }));
            yield Promise.all(insertPromises);
            yield connection.query("COMMIT");
            return apiResponse.successResponseWithData(response, "order placed successfully", { orderId });
        }
        catch (error) {
            yield connection.query("ROLLBACK");
            throw error;
        }
        finally {
            connection.release();
        }
    }
    catch (error) {
        return apiResponse.ErrorResponse(response, error);
    }
});
exports.placeOrder = placeOrder;
const getOrderHistory = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield orderService.getOrderHistory({
            userId: request.body.user.id,
        });
        const orderHistory = result.reduce((orders, curr) => {
            const index = orders.findIndex((o) => o.orderId === curr.orderId);
            // Order exists, update its details
            if (index !== -1) {
                orders[index].items.push({
                    itemId: curr.itemId,
                    itemName: curr.itemName,
                    quantity: curr.quantity,
                });
            }
            else {
                // Order doesn't exist, create a new one
                orders.push({
                    orderId: curr.orderId,
                    amount: curr.amount,
                    orderDate: new Date(curr.orderDate),
                    items: [
                        {
                            itemId: curr.itemId,
                            itemName: curr.itemName,
                            quantity: curr.quantity,
                        },
                    ],
                });
            }
            return orders;
        }, []);
        return apiResponse.successResponseWithData(response, "order history found successfully", orderHistory);
    }
    catch (error) {
        return apiResponse.somethingResponse(response);
    }
});
exports.getOrderHistory = getOrderHistory;
