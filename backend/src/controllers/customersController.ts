import { Request, Response, NextFunction } from "express";
import * as salesModel from "../models/salesModel";

export async function getCustomersList(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await salesModel.getCustomersList();
    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
}

export async function getCustomersStats(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await salesModel.getCustomersStats();
    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
}
