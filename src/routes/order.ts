import express from "express";

// CONTROLLERS
import * as auth from "../controllers/auth/auth";
import * as user from "../controllers/user/user";
import * as item from "../controllers/item/item";
import * as order from "../controllers/order/order";

const router = express.Router();

//ROUTES
router.post("/place", auth.isAuth, user.get, order.placeOrder);
router.get("/history", auth.isAuth, user.get, order.getOrderHistory);

export default router;
