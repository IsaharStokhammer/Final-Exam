import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";
interface JwtUnit {
  _id: ObjectId;
  name: string;
  isAdmin: boolean;
}
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).send({ message: "Unauthorized, missing token" });
    return;
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  const id = (decoded as JwtUnit)._id;
  if (!decoded || !id) {
    res.status(401).send({ message: "Unauthorized" });
  }
  (req as any).unit = decoded as JwtUnit;
  next();
};
export default authMiddleware;








