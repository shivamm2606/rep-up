import { Model } from "mongoose";

interface IUser {
  name: string;
  email: string;
  password: string;
  refreshToken?: string | null;
}

interface IUserMethods {
  isPasswordCorrect(enteredPassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

type UserModel = Model<IUser, {}, IUserMethods>;

export { IUser, IUserMethods, UserModel };
