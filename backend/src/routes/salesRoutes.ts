import { Router } from "express";
import * as salesController from "../controllers/salesController";

const router = Router();

// GET /api/sales/summary   — KPI totals (revenue, orders, average ticket)
router.get("/summary", salesController.getSalesSummary);

// GET /api/sales/monthly?year=2025  — monthly breakdown
router.get("/monthly", salesController.getMonthlySales);

// GET /api/sales/by-category  — revenue split by product category
router.get("/by-category", salesController.getSalesByCategory);

export default router;
