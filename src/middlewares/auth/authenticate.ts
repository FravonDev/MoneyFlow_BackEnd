import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errorHandler/ApiErrors";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
    
  const blacklistedTokens: string[] = [];
  const token = req.body.token || req.headers["x-access-token"];
  console.log(token);
  

  if (!token) {
    throw new UnauthorizedError("Token not provided");
  }

  if (blacklistedTokens.includes(token)) {
    throw new UnauthorizedError("Token invalid");
  }

  const decoded = jwt.verify(token,  process.env.JWT_PASS as string);
  

  req.body.user = decoded;
  
  next();
};
