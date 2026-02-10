// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/http-error";

export const errorHandler = (
    err: Error | HttpError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err);

    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    res.status(500).json({ message: "Internal Server Error" });
};
