import { Request, Response, NextFunction } from "express";
import * as salesModel from "../models/salesModel";

export async function getSalesSummary(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const year = req.query.year ? Number(req.query.year) : undefined;
    const summary = await salesModel.getSummary(year);
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

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, category, price, quantity } = req.body as {
      name: string; category: string; price: number; quantity: number;
    };
    if (!name || !category || price == null || quantity == null) {
      res.status(400).json({ status: "error", message: "Campos obrigatórios: name, category, price, quantity" });
      return;
    }
    const data = await salesModel.createProduct({ name, category, price: Number(price), quantity: Number(quantity) });
    res.status(201).json({ status: "success", data });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { name, category, price, quantity } = req.body as {
      name: string; category: string; price: number; quantity: number;
    };
    if (!name || !category || price == null || quantity == null) {
      res.status(400).json({ status: "error", message: "Campos obrigatórios: name, category, price, quantity" });
      return;
    }
    const data = await salesModel.updateProduct(id, { name, category, price: Number(price), quantity: Number(quantity) });
    if (!data) {
      res.status(404).json({ status: "error", message: "Produto não encontrado" });
      return;
    }
    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const deleted = await salesModel.deleteProduct(id);
    if (!deleted) {
      res.status(404).json({ status: "error", message: "Produto não encontrado" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
