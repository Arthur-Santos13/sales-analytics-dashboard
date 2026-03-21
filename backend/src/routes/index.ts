import { Router } from "express";
import salesRoutes from "./salesRoutes";
import ordersRoutes from "./ordersRoutes";
import customersRoutes from "./customersRoutes";

const router = Router();

router.use("/sales", salesRoutes);
router.use("/orders", ordersRoutes);
router.use("/customers", customersRoutes);

export default router;
