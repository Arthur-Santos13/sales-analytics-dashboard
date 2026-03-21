import { Request, Response, NextFunction } from "express";
import * as salesModel from "../models/salesModel";
import type { OrderStatus } from "../models/salesModel";

const VALID_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export async function getOrdersList(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await salesModel.getOrdersList();
    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
}

export async function getOrdersStats(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await salesModel.getOrdersStats();
    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const data = await salesModel.getOrderById(id);
    if (!data) {
      res.status(404).json({ status: "error", message: "Pedido não encontrado" });
      return;
    }
    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const { status } = req.body as { status: OrderStatus };

    if (!status || !VALID_STATUSES.includes(status)) {
      res.status(400).json({
        status: "error",
        message: `Status inválido. Use um de: ${VALID_STATUSES.join(", ")}`,
      });
      return;
    }

    const data = await salesModel.updateOrderStatus(id, status);
    if (!data) {
      res.status(404).json({ status: "error", message: "Pedido não encontrado" });
      return;
    }
    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
}
