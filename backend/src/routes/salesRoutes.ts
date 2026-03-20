import { Router } from "express";
import * as salesController from "../controllers/salesController";

const router = Router();

// GET /api/sales/summary
router.get("/summary", salesController.getSalesSummary);

// GET /api/sales/monthly?year=2026
router.get("/monthly", salesController.getMonthlySales);

// GET /api/sales/by-category
router.get("/by-category", salesController.getSalesByCategory);

// GET /api/sales/top-products?limit=5
router.get("/top-products", salesController.getTopProducts);

export default router;
