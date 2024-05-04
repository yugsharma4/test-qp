import express, { Request, Response } from "express";

//CONTROLLERS
import * as auth from "../controllers/auth/auth";
import * as user from "../controllers/user/user";
import * as item from "../controllers/item/item";
import * as apiResponse from "../helper/apiResponse";

const router = express.Router();

//ROUTES

//get items
router.get(
  "/",
  auth.isAuth,
  user.get,
  item.getAllItems,
  item.getAvailableItemList
);

//add item
router.post(
  "/add",
  auth.isAuth,
  item.addItemInputChecks,
  user.get,
  item.isItemAvailable,
  item.add,
  item.addInventory,
  (request: Request, response: Response) => {
    return apiResponse.successResponse(response, "item created successfully");
  }
);

//remove item
router.delete(
  "/remove",
  auth.isAuth,
  user.get,
  item.isItemAvailable,
  item.removeItem
);

//update item
router.patch(
  "/update",
  auth.isAuth,
  item.updateItemInputChecks,
  user.get,
  item.isItemAvailable,
  item.updateItem,
  item.updateItemAndInventory,
  (req: Request, response: Response) => {
    return apiResponse.successResponse(response, "item updated successfully");
  }
);

//update item
router.patch(
  "/update/inventory",
  auth.isAuth,
  user.get,
  item.isItemAvailable,
  item.updateInventory,
  (req: Request, response: Response) => {
    return apiResponse.successResponse(
      response,
      "Inventory updated successfully"
    );
  }
);

export default router;
