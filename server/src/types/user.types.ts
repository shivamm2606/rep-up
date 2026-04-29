import { Model } from "mongoose";
import type {
  UpdateUserInfoDto,
  UpdateAccountDto,
  ChangePasswordDto,
} from "../validator/user.validator.js";

interface IUserService {
  getProfile(userId: string): Promise<ProfileResult>;
  updateUserInfo(
    userId: string,
    dto: UpdateUserInfoDto,
  ): Promise<ProfileResult>;
  updateAccount(userId: string, dto: UpdateAccountDto): Promise<ProfileResult>;
  changePassword(userId: string, dto: ChangePasswordDto): Promise<void>;
  getCalorieGoal(userId: string): Promise<number>;
  deleteAccount(userId: string): Promise<void>;
}

interface ProfileResult {
  _id: string;
  name: string;
  username: string;
  email: string;
  userInfo?: IUserInfo;
}

interface IUserInfo {
  height?: number;
  currentWeight?: number;
  targetWeight?: number;
  gender?: "male" | "female" | "other";
  dateOfBirth?: Date;
  activityLevel?:
    | "sedentary"
    | "lightly_active"
    | "moderately_active"
    | "very_active";
  goal?: "lose_weight" | "maintain" | "lean_bulk" | "bulk";
  dailyCalorieGoal?: number;
  isCalorieGoalAutoCalculated?: boolean;
}

interface IUser {
  name: string;
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
  refreshToken?: string | null;
  userInfo?: IUserInfo;
  otp?: string;
  otpExpiry?: Date;
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
}

interface IUserMethods {
  isPasswordCorrect(enteredPassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

type UserModel = Model<IUser, {}, IUserMethods>;

export {
  IUser,
  IUserMethods,
  UserModel,
  IUserInfo,
  IUserService,
  UpdateUserInfoDto,
  ChangePasswordDto,
  UpdateAccountDto,
  ProfileResult,
};
