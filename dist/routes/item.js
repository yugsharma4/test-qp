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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//CONTROLLERS
const auth = __importStar(require("../controllers/auth/auth"));
const user = __importStar(require("../controllers/user/user"));
const item = __importStar(require("../controllers/item/item"));
const apiResponse = __importStar(require("../helper/apiResponse"));
const router = express_1.default.Router();
//ROUTES
//get items
router.get("/", auth.isAuth, user.get, item.getAllItems, item.getAvailableItemList);
//add item
router.post("/add", auth.isAuth, item.addItemInputChecks, user.get, item.isItemAvailable, item.add, item.addInventory, (request, response) => {
    return apiResponse.successResponse(response, "item created successfully");
});
//remove item
router.delete("/remove", auth.isAuth, user.get, item.isItemAvailable, item.removeItem);
//update item
router.patch("/update", auth.isAuth, item.updateItemInputChecks, user.get, item.isItemAvailable, item.updateItem, item.updateItemAndInventory, (req, response) => {
    return apiResponse.successResponse(response, "item updated successfully");
});
//update item
router.patch("/update/inventory", auth.isAuth, user.get, item.isItemAvailable, item.updateInventory, (req, response) => {
    return apiResponse.successResponse(response, "Inventory updated successfully");
});
exports.default = router;
