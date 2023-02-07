import { Request, NextFunction, Response } from "express";
import { ApiError } from "./ApiErrors";

export const errorMIddleware = (
  error: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode ?? 500;
  const message = error.statusCode ? error.message : "Internal Server Error";
  return res.status(statusCode).json({ message: error.message });
};

