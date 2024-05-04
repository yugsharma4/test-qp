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
exports.updateInventory = exports.updateItemInputChecks = exports.updateItemAndInventory = exports.updateItem = exports.getAvailableItemList = exports.getAllItems = exports.removeItem = exports.isItemAvailable = exports.getItem = exports.addInventory = exports.addItemInputChecks = exports.add = void 0;
//services
const itemService = __importStar(require("../../services/item"));
//helpers
const apiResponse = __importStar(require("../../helper/apiResponse"));
const constants_1 = require("../../constants");
//add item
const add = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, quantity, price } = request.body;
        const itemData = {
            name,
            quantity,
            price,
            createdBy: request.body.user.id,
        };
        const item = yield itemService.addItem(itemData);
        request.body.insertItemId = item.insertId;
        return next();
    }
    catch (error) {
        return apiResponse.somethingResponse(response);
    }
});
exports.add = add;
const addItemInputChecks = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, quantity, price } = request.body;
        //item fields checks
        if (!name)
            return apiResponse.validationError(response, "Please provide item name");
        if (!quantity)
            return apiResponse.validationError(response, "Please provide item quantity");
        if (!price)
            return apiResponse.validationError(response, "Please provide item price");
        if (!Number.isInteger(quantity))
            return apiResponse.validationError(response, "quantity should be in number only");
        if (!Number.isInteger(price))
            return apiResponse.validationError(response, "price should be in number only");
        return next();
    }
    catch (error) {
        return apiResponse.ErrorResponse(response, error);
    }
});
exports.addItemInputChecks = addItemInputChecks;
//add inventory item
const addInventory = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quantity, insertItemId } = request.body;
        const item = yield itemService.addInventory({ insertItemId, quantity });
        return next();
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingResponse(response);
    }
});
exports.addInventory = addInventory;
//get single item
const getItem = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isItemExist = yield itemService.getItem({
            name: request.body.name.trim(),
        });
        if (isItemExist.length == 0)
            return apiResponse.duplicateResponse(response, "Item not found!");
        request.body.item = isItemExist[0];
        return next();
    }
    catch (error) {
        return apiResponse.somethingResponse(response);
    }
});
exports.getItem = getItem;
//is item available already
const isItemAvailable = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Admin only can get Item
        if (request.body.user.role != constants_1.userRole.ADMIN)
            return apiResponse.unauthorizedResponse(response, "You are unauthorized!");
        let isItemExist;
        //check item availablity by Id or Name
        if (request.body.itemId) {
            isItemExist = yield itemService.getItemById({
                itemId: request.body.itemId,
            });
        }
        else {
            isItemExist = yield itemService.getItem({
                name: request.body.name.trim(),
            });
        }
        if (isItemExist.length > 0 && !request.body.itemId)
            return apiResponse.duplicateResponse(response, "Duplicate item found");
        if (request.body.itemId && isItemExist.length == 0)
            return apiResponse.notFoundResponse(response, "Invalid item id");
        request.body.item = isItemExist[0];
        return next();
    }
    catch (error) {
        return apiResponse.somethingResponse(response);
    }
});
exports.isItemAvailable = isItemAvailable;
//remove single item
const removeItem = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const removeItemRes = yield itemService.removeItem({
            itemId: request.body.itemId,
        });
        return apiResponse.successResponse(response, "item removed successfully");
    }
    catch (error) {
        return apiResponse.somethingResponse(response);
    }
});
exports.removeItem = removeItem;
const getAllItems = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = request.body.user;
        //check user role admin or not
        if (user.role != constants_1.userRole.ADMIN)
            return next();
        //admin can see only all items
        const items = yield itemService.getAllItems();
        return apiResponse.successResponseWithData(response, "items found successfully", items);
    }
    catch (error) {
        return apiResponse.somethingResponse(response);
    }
});
exports.getAllItems = getAllItems;
//get all items
const getAvailableItemList = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //admin can see only all items
        const items = yield itemService.getAvailableItemList();
        return apiResponse.successResponseWithData(response, "items list found successfully", items);
    }
    catch (error) {
        return apiResponse.somethingResponse(response);
    }
});
exports.getAvailableItemList = getAvailableItemList;
//update item
const updateItem = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, quantity, price, itemId } = request.body;
        let updateItemValues = { itemId };
        //handle item name
        if (name) {
            const item = yield itemService.getItem({ name });
            if (item.length > 0 && item[0].name == name.trim())
                return apiResponse.duplicateResponse(response, "Duplicate item name found");
            updateItemValues["name"] = name;
        }
        //handle item quantity
        if (quantity) {
            const avItem = yield itemService.getAvailableItemQty({
                itemId,
            });
            //available item not found
            if (!avItem)
                throw {};
            //check item available qty and requested quantity
            //requested qty should be greater than available qty
            request.body.available_quantity = avItem.available_quantity;
            if (avItem.available_quantity > quantity)
                return apiResponse.validationError(response, "Please enter a valid quantity. The requested quantity less than the available items.");
            //valid quantity
            updateItemValues["quantity"] = quantity;
        }
        //handle item price
        if (price) {
            updateItemValues["price"] = price;
        }
        const item = yield itemService.updateItem(updateItemValues);
        return next();
    }
    catch (error) {
        return apiResponse.somethingResponse(response);
    }
});
exports.updateItem = updateItem;
//update item qty and inventory (same time)
const updateItemAndInventory = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { quantity, itemId } = request.body;
        //quantity should be there
        if (!quantity)
            return next();
        const item = yield itemService.updateItemAndInventory({
            itemId,
            quantity: quantity - request.body.available_quantity,
        });
        return apiResponse.successResponse(response, "item updated successfully");
    }
    catch (error) {
        return apiResponse.somethingResponse(response);
    }
});
exports.updateItemAndInventory = updateItemAndInventory;
const updateItemInputChecks = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, quantity, price, itemId } = request.body;
        if (!itemId)
            return apiResponse.validationError(response, "Please provide item id");
        //item fields checks
        if (name != undefined && name.trim().length == 0)
            return apiResponse.validationError(response, "Invalid name");
        if (quantity != undefined && !Number.isInteger(quantity))
            return apiResponse.validationError(response, "quantity should be in number only");
        if (price != undefined && !Number.isInteger(price))
            return apiResponse.validationError(response, "price should be in number only");
        return next();
    }
    catch (error) {
        return apiResponse.ErrorResponse(response, error);
    }
});
exports.updateItemInputChecks = updateItemInputChecks;
//update item
const updateInventory = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { quantity, itemId } = request.body;
        //Item quantity (total quantity) should be greater than requested inventory quantity
        if (request.body.item.quantity < quantity)
            return apiResponse.validationError(response, "Item quantity must be greater than inventory quantity!");
        const item = yield itemService.directInventoryUpdate({ itemId, quantity });
        return next();
    }
    catch (error) {
        return apiResponse.somethingResponse(response);
    }
});
exports.updateInventory = updateInventory;
