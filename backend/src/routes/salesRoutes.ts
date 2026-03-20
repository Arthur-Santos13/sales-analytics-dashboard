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

// GET /api/sales/by-region
router.get("/by-region", salesController.getSalesByRegion);

// GET /api/sales/products
router.get("/products", salesController.getProductsList);

// POST /api/sales/products
router.post("/products", salesController.createProduct);

// PUT /api/sales/products/:id
router.put("/products/:id", salesController.updateProduct);

// DELETE /api/sales/products/:id
router.delete("/products/:id", salesController.deleteProduct);

export default router;
