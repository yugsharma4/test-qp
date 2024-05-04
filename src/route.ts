import express from "express";
import itemRoute from "./routes/item";
import authRoute from "./routes/auth";
import orderRoute from "./routes/order";

const app = express();

app.use("/item", itemRoute);
app.use("/auth", authRoute);
app.use("/order", orderRoute);

export default app;
