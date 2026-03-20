import { Router } from "express";
import salesRoutes from "./salesRoutes";

const router = Router();

router.use("/sales", salesRoutes);

export default router;
