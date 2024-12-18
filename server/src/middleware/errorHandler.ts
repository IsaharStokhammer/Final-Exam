import { Request, Response, NextFunction } from "express";
import { createResponse } from "../utils/utils";
import ErrorResponse from "../utils/ErrorResponse";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found with id that end with ${err.value} was not found`;
    err = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field_value = err.message.match(/\{(.*)\}/gi);
    const message = `Duplicate data ${field_value}`;
    err = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join("; ");
    err = new ErrorResponse(message, 400);
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? "Internal Server Error" : err.message;
  if (statusCode === 500) console.error(err.stack);

  res.status(statusCode).json(createResponse({}, message, false));
};
