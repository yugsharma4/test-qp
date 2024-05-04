import { NextFunction, Request, Response } from "express";

//services
import * as itemService from "../../services/item";

//helpers
import * as apiResponse from "../../helper/apiResponse";
import { userRole } from "../../constants";
import { Item } from "../../models/Item";
import { connect } from "../../database";

//add item
export const add = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { name, quantity, price } = request.body;
    const itemData: Item & { createdBy: number } = {
      name,
      quantity,
      price,
      createdBy: request.body.user.id,
    };

    const item = await itemService.addItem(itemData);
    request.body.insertItemId = item.insertId;
    return next();
  } catch (error) {
    return apiResponse.somethingResponse(response);
  }
};

export const addItemInputChecks = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { name, quantity, price } = request.body;

    //item fields checks
    if (!name)
      return apiResponse.validationError(response, "Please provide item name");
    if (!quantity)
      return apiResponse.validationError(
        response,
        "Please provide item quantity"
      );
    if (!price)
      return apiResponse.validationError(response, "Please provide item price");

    if (!Number.isInteger(quantity))
      return apiResponse.validationError(
        response,
        "quantity should be in number only"
      );
    if (!Number.isInteger(price))
      return apiResponse.validationError(
        response,
        "price should be in number only"
      );

    return next();
  } catch (error) {
    return apiResponse.ErrorResponse(response, error);
  }
};

//add inventory item
export const addInventory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { quantity, insertItemId } = request.body;

    const item = await itemService.addInventory({ insertItemId, quantity });

    return next();
  } catch (error) {
    console.log(error);
    return apiResponse.somethingResponse(response);
  }
};

//get single item
export const getItem = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const isItemExist = await itemService.getItem({
      name: request.body.name.trim(),
    });

    if (isItemExist.length == 0)
      return apiResponse.duplicateResponse(response, "Item not found!");

    request.body.item = isItemExist[0];
    return next();
  } catch (error) {
    return apiResponse.somethingResponse(response);
  }
};

//is item available already
export const isItemAvailable = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    //Admin only can get Item
    if (request.body.user.role != userRole.ADMIN)
      return apiResponse.unauthorizedResponse(
        response,
        "You are unauthorized!"
      );

    let isItemExist: any;

    //check item availablity by Id or Name
    if (request.body.itemId) {
      isItemExist = await itemService.getItemById({
        itemId: request.body.itemId,
      });
    } else {
      isItemExist = await itemService.getItem({
        name: request.body.name.trim(),
      });
    }

    if (isItemExist.length > 0 && !request.body.itemId)
      return apiResponse.duplicateResponse(response, "Duplicate item found");

    if (request.body.itemId && isItemExist.length == 0)
      return apiResponse.notFoundResponse(response, "Invalid item id");

    request.body.item = isItemExist[0];
    return next();
  } catch (error) {
    return apiResponse.somethingResponse(response);
  }
};

//remove single item
export const removeItem = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const removeItemRes = await itemService.removeItem({
      itemId: request.body.itemId,
    });

    return apiResponse.successResponse(response, "item removed successfully");
  } catch (error) {
    return apiResponse.somethingResponse(response);
  }
};

export const getAllItems = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const user = request.body.user;

    //check user role admin or not
    if (user.role != userRole.ADMIN) return next();

    //admin can see only all items
    const items = await itemService.getAllItems();
    return apiResponse.successResponseWithData(
      response,
      "items found successfully",
      items
    );
  } catch (error) {
    return apiResponse.somethingResponse(response);
  }
};

//get all items
export const getAvailableItemList = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    //admin can see only all items
    const items = await itemService.getAvailableItemList();
    return apiResponse.successResponseWithData(
      response,
      "items list found successfully",
      items
    );
  } catch (error) {
    return apiResponse.somethingResponse(response);
  }
};

//update item
export const updateItem = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    let { name, quantity, price, itemId } = request.body;

    let updateItemValues: {
      itemId: number;
      name?: string;
      quantity?: number;
      price?: number;
    } = { itemId };

    //handle item name
    if (name) {
      const item = await itemService.getItem({ name });
      if (item.length > 0 && item[0].name == name.trim())
        return apiResponse.duplicateResponse(
          response,
          "Duplicate item name found"
        );
      updateItemValues["name"] = name;
    }

    //handle item quantity
    if (quantity) {
      const avItem = await itemService.getAvailableItemQty({
        itemId,
      });

      //available item not found
      if (!avItem) throw {};

      //check item available qty and requested quantity
      //requested qty should be greater than available qty
      request.body.available_quantity = avItem.available_quantity;
      if (avItem.available_quantity > quantity)
        return apiResponse.validationError(
          response,
          "Please enter a valid quantity. The requested quantity less than the available items."
        );

      //valid quantity
      updateItemValues["quantity"] = quantity;
    }

    //handle item price
    if (price) {
      updateItemValues["price"] = price;
    }
    const item = await itemService.updateItem(updateItemValues);

    return next();
  } catch (error) {
    return apiResponse.somethingResponse(response);
  }
};

//update item qty and inventory (same time)
export const updateItemAndInventory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    let { quantity, itemId } = request.body;
    //quantity should be there
    if (!quantity) return next();

    const item = await itemService.updateItemAndInventory({
      itemId,
      quantity: quantity - request.body.available_quantity,
    });

    return apiResponse.successResponse(response, "item updated successfully");
  } catch (error) {
    return apiResponse.somethingResponse(response);
  }
};

export const updateItemInputChecks = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { name, quantity, price, itemId } = request.body;
    if (!itemId)
      return apiResponse.validationError(response, "Please provide item id");

    //item fields checks
    if (name != undefined && name.trim().length == 0)
      return apiResponse.validationError(response, "Invalid name");

    if (quantity != undefined && !Number.isInteger(quantity))
      return apiResponse.validationError(
        response,
        "quantity should be in number only"
      );
    if (price != undefined && !Number.isInteger(price))
      return apiResponse.validationError(
        response,
        "price should be in number only"
      );

    return next();
  } catch (error) {
    return apiResponse.ErrorResponse(response, error);
  }
};

//update item
export const updateInventory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    let { quantity, itemId } = request.body;

    //Item quantity (total quantity) should be greater than requested inventory quantity
    if (request.body.item.quantity < quantity)
      return apiResponse.validationError(
        response,
        "Item quantity must be greater than inventory quantity!"
      );

    const item = await itemService.directInventoryUpdate({ itemId, quantity });

    return next();
  } catch (error) {
    return apiResponse.somethingResponse(response);
  }
};
