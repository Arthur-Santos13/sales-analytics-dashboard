import { Router } from "express";
import * as customersController from "../controllers/customersController";

const router = Router();

// GET /api/customers/stats
router.get("/stats", customersController.getCustomersStats);

// GET /api/customers
router.get("/", customersController.getCustomersList);

export default router;
