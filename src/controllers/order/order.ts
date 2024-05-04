import { NextFunction, Request, Response } from "express";

//services
import * as itemService from "../../services/item";
import * as orderService from "../../services/order";

//helpers
import * as apiResponse from "../../helper/apiResponse";
import { userRole } from "../../constants";
import { Item } from "../../models/Item";
import { connect } from "../../database";

interface OrderItem {
  itemId: number;
  itemName: string;
  quantity: number;
}

interface Order {
  orderId: number;
  amount: number;
  orderDate: Date;
  items: OrderItem[];
}

export const placeOrder = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { items } = request.body;

    if (!items || items.length === 0) {
      return apiResponse.validationError(
        response,
        "User ID and Items are required fields!"
      );
    }

    const connection = await connect();

    try {
      // Begin transaction
      await connection.query("BEGIN");

      let outOfStock = false;
      let totalAmount = 0;
      for (const item of items) {
        const result = await itemService.getAvailableItemQty({
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
        const getItem = await itemService.getItemById({ itemId: item.itemId });
        totalAmount += item.quantity * getItem[0].price;
      }

      //check out of stock true or not
      if (outOfStock) {
        await connection.query("ROLLBACK");
        return apiResponse.validationError(
          response,
          "Some items are out of stock!"
        );
      }

      const orderResult = await orderService.addOrder({
        userId: request.body.user.id,
        amount: totalAmount,
      });
      const orderId = orderResult.insertId;

      //mapped orderId with item ids & update inventory available qty also
      const insertPromises = items.map(async (item: any) => {
        await orderService.addOrderItems({
          orderId,
          itemId: item.itemId,
          quantity: item.quantity,
        });

        await itemService.updateInventory({
          itemId: item.itemId,
          quantity: item.quantity,
        });
      });

      await Promise.all(insertPromises);

      await connection.query("COMMIT");

      return apiResponse.successResponseWithData(
        response,
        "order placed successfully",
        { orderId }
      );
    } catch (error) {
      await connection.query("ROLLBACK");
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    return apiResponse.ErrorResponse(response, error);
  }
};

export const getOrderHistory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    let result = await orderService.getOrderHistory({
      userId: request.body.user.id,
    });

    const orderHistory: Order[] = result.reduce(
      (orders: Order[], curr: any) => {
        const index = orders.findIndex(
          (o: Order) => o.orderId === curr.orderId
        );

        // Order exists, update its details
        if (index !== -1) {
          orders[index].items.push({
            itemId: curr.itemId,
            itemName: curr.itemName,
            quantity: curr.quantity,
          });
        } else {
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
      },
      []
    );

    return apiResponse.successResponseWithData(
      response,
      "order history found successfully",
      orderHistory
    );
  } catch (error) {
    return apiResponse.somethingResponse(response);
  }
};
