import express from "express";
import { placeOrder, placeOrderStripe, allOrders, userOrders, updateStatus, verifyYookassa, removeOrder, removeMultipleOrders } from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import userAuth from "../middleware/userAuth.js";

const orderRouter = express.Router();

orderRouter.get("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);
orderRouter.delete("/remove", adminAuth, removeOrder);
orderRouter.delete("/remove-multiple", adminAuth, removeMultipleOrders);

orderRouter.post("/place", userAuth, placeOrder);
orderRouter.post("/yookassa", userAuth, placeOrderStripe);

orderRouter.get("/userorders", userAuth, userOrders);

orderRouter.post("/verifyYookassa", userAuth, verifyYookassa);

export default orderRouter;