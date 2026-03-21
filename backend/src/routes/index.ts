import { Router } from "express";
import salesRoutes from "./salesRoutes";
import ordersRoutes from "./ordersRoutes";

const router = Router();

router.use("/sales", salesRoutes);
router.use("/orders", ordersRoutes);

export default router;
