import { Request, Response, NextFunction } from "express";
import * as salesModel from "../models/salesModel";

export async function getSalesSummary(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const summary = await salesModel.getSummary();
    res.json({ status: "success", data: summary });
  } catch (err) {
    next(err);
  }
}

export async function getMonthlySales(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();
    const sales = await salesModel.getMonthlySales(year);
    res.json({ status: "success", data: sales });
  } catch (err) {
    next(err);
  }
}

export async function getSalesByCategory(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await salesModel.getSalesByCategory();
    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
}

export async function getTopProducts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const data = await salesModel.getTopProducts(limit);
    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
}

export async function getSalesByRegion(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await salesModel.getSalesByRegion();
    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
}

export async function getProductsList(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await salesModel.getProductsList();
    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
}
