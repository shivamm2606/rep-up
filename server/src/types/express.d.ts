import { Types } from "mongoose";
import { IUser, IUserMethods } from "./user.types.js";

declare global {
  namespace Express {
    interface Request {
      user: IUser & IUserMethods & { _id: Types.ObjectId };
    }
  }
}
