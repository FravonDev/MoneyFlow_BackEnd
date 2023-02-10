import { NextFunction, Request, Response } from "express";
import { Unauthorized } from "../errorHandler/ApiErrors";

export const auth = (req: Request, es:Response, next: NextFunction) =>{
    const blacklistedTokens: string[] = []
    const token =  req.body.token || req.headers["x-access-token"];
    
    if (!token) {
      throw new Unauthorized("Token not provided");
    }
    if (blacklistedTokens.includes(token)) {
      throw new Unauthorized("Token invalid");
    }
    next();
  } 