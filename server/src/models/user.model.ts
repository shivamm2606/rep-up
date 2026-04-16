import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser, IUserMethods, UserModel } from "../types/user.types.js";

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    userInfo: {
      height: { type: Number },
      currentWeight: { type: Number },
      targetWeight: { type: Number },
      gender: { type: String, enum: ["male", "female", "other"] },
      dateOfBirth: { type: Date },
      activityLevel: {
        type: String,
        enum: [
          "sedentary",
          "lightly_active",
          "moderately_active",
          "very_active",
        ],
      },
      goal: {
        type: String,
        enum: ["lose_weight", "maintain", "lean_bulk", "bulk"],
      },
      dailyCalorieGoal: { type: Number },
      isCalorieGoalAutoCalculated: { type: Boolean, default: true },
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = function (
  entered_password: string,
): Promise<boolean> {
  return bcrypt.compare(entered_password, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    { _id: this._id },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: (process.env.ACCESS_TOKEN_EXPIRY ||
        "1d") as jwt.SignOptions["expiresIn"],
    },
  );
};

userSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: (process.env.REFRESH_TOKEN_EXPIRY ||
        "7d") as jwt.SignOptions["expiresIn"],
    },
  );
};

const User = mongoose.model<IUser, UserModel>("User", userSchema);

export default User;
