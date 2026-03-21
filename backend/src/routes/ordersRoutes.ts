import { Router } from "express";
import * as ordersController from "../controllers/ordersController";

const router = Router();

// GET /api/orders/stats
router.get("/stats", ordersController.getOrdersStats);

// GET /api/orders
router.get("/", ordersController.getOrdersList);

// GET /api/orders/:id
router.get("/:id", ordersController.getOrderById);

// PUT /api/orders/:id/status
router.put("/:id/status", ordersController.updateOrderStatus);

export default router;
