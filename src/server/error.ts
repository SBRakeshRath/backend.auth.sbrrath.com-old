import serverError from "../interfaces/serverErrorInterface.js";
import { NextFunction, Request, Response } from "express";
export default function finalErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if(err instanceof serverError){

  res.status(err.getError().status);

  res.json(err.getError());

  return ;
  }

  res.status(500)
  res.json({
    status:500,
    code:"INTERNAL_ERROR",
    message:"internal error #3212310"
  })
 

}
