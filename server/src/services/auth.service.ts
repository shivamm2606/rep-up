import User from "../models/user.model.js";
import Exercise from "../models/exercise.model.js";
import WorkoutSession from "../models/workoutSession.model.js";
import WorkoutTemplate from "../models/workoutTemplate.model.js";
import Bodyweight from "../models/bodyweight.model.js";
import {
  IAuthService,
  RegisterDto,
  LoginDto,
  RegisterResult,
  LoginResult,
  RefreshTokenResult,
} from "../types/auth.types.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { generateOTP, getOTPExpiry } from "../utils/otp.js";
import { sendEmail } from "../utils/mailer.js";
import crypto from "crypto";
import {
  getResetPasswordHtml,
  getResendOtpHtml,
  getVerifyEmailHtml,
} from "../utils/mailTemplates.js";

class MongoAuthService implements IAuthService {
  registerUser = async (dto: RegisterDto): Promise<RegisterResult> => {
    const { name, email, username, password } = dto;

    const existingUsers = await User.find({ $or: [{ email }, { username }] });

    for (const user of existingUsers) {
      if (user.isVerified) {
        throw new ApiError(400, "Email or username already in use.");
      }
    }

    if (existingUsers.length > 0) {
      await User.deleteMany({
        _id: { $in: existingUsers.map((user) => user._id) },
      });
    }

    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    const newUser = await User.create({
      name,
      email,
      username,
      password,
      otp,
      otpExpiry,
    });

    if (!newUser) {
      throw new ApiError(500, "User creation failed.");
    }

    // Send email in the background to avoid blocking the registration request
    sendEmail(
      email,
      "Verify your RepUp account",
      getVerifyEmailHtml(otp)
    ).catch((error) => {
      console.error("[ERROR] Failed to send OTP email in background:", error);
      // We do not delete the user. They can request a new OTP from the UI.
    });

    return {
      _id: newUser._id.toString(),
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
    };
  };

  loginUser = async (dto: LoginDto): Promise<LoginResult> => {
    const { email, password } = dto;

    const user = await User.findOne({ email }).select("+password +otpExpiry");

    if (!user) {
      throw new ApiError(400, "Invalid email or password");
    }

    const isCorrect = await user.isPasswordCorrect(password);

    if (!isCorrect) {
      throw new ApiError(400, "Invalid email or password");
    }

    if (!user.isVerified) {
      if (!user.otpExpiry || user.otpExpiry < new Date()) {
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiry = getOTPExpiry();
        await user.save();

        try {
          await sendEmail(email, "Your new RepUp OTP", getResendOtpHtml(otp));
        } catch (error) {
          console.error("[ERROR] Failed to auto-resend OTP on login:", error);
        }

        throw new ApiError(403, "Email not verified. A new OTP has been sent.");
      }

      throw new ApiError(403, "Email not verified.");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: {
        _id: user._id.toString(),
        name: user.name,
        username: user.username,
        email: user.email,
        userInfo: user.userInfo,
      },
      accessToken,
      refreshToken,
    };
  };

  logoutUser = async (userId: string): Promise<void> => {
    await User.findByIdAndUpdate(userId, {
      $unset: { refreshToken: 1 },
    });
  };

  refreshToken = async (
    incomingRefreshToken: string,
  ): Promise<RefreshTokenResult> => {
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Refresh token missing");
    }

    let decoded: { _id: string };
    try {
      decoded = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
      ) as { _id: string };
    } catch {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await User.findById(decoded._id).select("+refreshToken");

    if (!user || incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const newAccessToken = await user.generateAccessToken();
    const newRefreshToken = await user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save();

    return {
      user: {
        _id: user._id.toString(),
        name: user.name,
        username: user.username,
        email: user.email,
      },
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  };

  verifyOtp = async (email: string, otp: string): Promise<void> => {
    const user = await User.findOne({ email }).select("+otp +otpExpiry");

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    if (user.isVerified) {
      throw new ApiError(400, "User already verified.");
    }

    if (!user.otp || !user.otpExpiry) {
      throw new ApiError(400, "OTP not found. Please request a new one.");
    }

    if (user.otpExpiry < new Date()) {
      throw new ApiError(400, "OTP expired. Please request a new one.");
    }

    if (user.otp !== otp) {
      throw new ApiError(400, "Invalid OTP.");
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
  };

  resendOtp = async (email: string): Promise<void> => {
    const user = await User.findOne({ email }).select("+otp +otpExpiry");

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    if (user.isVerified) {
      throw new ApiError(400, "User already verified.");
    }

    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    try {
      await sendEmail(email, "Your new RepUp OTP", getResendOtpHtml(otp));
    } catch (error: any) {
      console.error("[ERROR] Failed to resend OTP email:", error);
      throw new ApiError(
        500,
        "Failed to send verification email. Please try again.",
      );
    }

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
  };

  forgotPassword = async (email: string): Promise<void> => {
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    if (!user.isVerified) {
      throw new ApiError(
        403,
        "Email not verified. Please verify your account first.",
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 15);

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    try {
      await sendEmail(
        email,
        "Reset your RepUp password",
        getResetPasswordHtml(resetLink),
      );
    } catch (error: any) {
      console.error("[ERROR] Failed to send reset password email:", error);
      throw new ApiError(
        500,
        "Failed to send password reset email. Please try again.",
      );
    }

    user.resetPasswordToken = token;
    user.resetPasswordExpiry = expiry;
    await user.save();
  };

  resetPassword = async (token: string, newPassword: string): Promise<void> => {
    const user = await User.findOne({ resetPasswordToken: token }).select(
      "+resetPasswordToken +resetPasswordExpiry",
    );

    if (!user) {
      throw new ApiError(400, "Invalid or expired token.");
    }

    if (!user.resetPasswordExpiry || user.resetPasswordExpiry < new Date()) {
      throw new ApiError(400, "Token expired. Please request a new one.");
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    user.refreshToken = undefined;
    await user.save();
  };

  demoLogin = async (): Promise<LoginResult> => {
    const DEMO_EMAIL = "demo@repup.cloud";
    const DEMO_PASSWORD = "Demo@1234";

    const user = await User.findOne({ email: DEMO_EMAIL }).select("+password");

    if (!user) {
      throw new ApiError(404, "Demo account not configured.");
    }

    // reset demo data so every recruiter gets a fresh experience
    const userId = user._id;

    await WorkoutSession.deleteMany({ userId });
    await Bodyweight.deleteMany({ userId });
    await WorkoutTemplate.deleteMany({ userId });

    // rebuild exercise name → id map
    const exercises = await Exercise.find({ isCustom: false });
    const ex: Record<string, any> = {};
    for (const e of exercises) ex[e.name] = e._id;

    // re-seed templates
    await WorkoutTemplate.insertMany([
      {
        name: "Push Day", userId,
        exercises: [
          { exerciseId: ex["Barbell Bench Press"], targetSets: 4 },
          { exerciseId: ex["Incline Dumbbell Press"], targetSets: 3 },
          { exerciseId: ex["Cable Fly"], targetSets: 3 },
          { exerciseId: ex["Lateral Raise"], targetSets: 4 },
          { exerciseId: ex["Tricep Pushdown"], targetSets: 3 },
        ],
      },
      {
        name: "Pull Day", userId,
        exercises: [
          { exerciseId: ex["Pull Up"], targetSets: 3 },
          { exerciseId: ex["Bent Over Barbell Row"], targetSets: 4 },
          { exerciseId: ex["Seated Cable Row"], targetSets: 3 },
          { exerciseId: ex["Face Pull"], targetSets: 3 },
          { exerciseId: ex["Barbell Curl"], targetSets: 3 },
        ],
      },
      {
        name: "Leg Day", userId,
        exercises: [
          { exerciseId: ex["Barbell Back Squat"], targetSets: 4 },
          { exerciseId: ex["Romanian Deadlift"], targetSets: 3 },
          { exerciseId: ex["Leg Press"], targetSets: 3 },
          { exerciseId: ex["Leg Curl"], targetSets: 3 },
          { exerciseId: ex["Standing Calf Raise"], targetSets: 4 },
        ],
      },
    ]);

    // re-seed workout sessions
    const now = new Date();
    const day = (daysAgo: number) => {
      const d = new Date(now);
      d.setDate(d.getDate() - daysAgo);
      d.setHours(9, 0, 0, 0);
      return d;
    };

    await WorkoutSession.insertMany([
      {
        userId, name: "Push Day", date: day(0), status: "completed", duration: 3720,
        exercises: [
          { exerciseId: ex["Barbell Bench Press"], sets: [{ weight: 70, reps: 10 }, { weight: 75, reps: 8 }, { weight: 80, reps: 6 }, { weight: 80, reps: 5 }] },
          { exerciseId: ex["Incline Dumbbell Press"], sets: [{ weight: 24, reps: 10 }, { weight: 26, reps: 8 }, { weight: 26, reps: 7 }] },
          { exerciseId: ex["Cable Fly"], sets: [{ weight: 15, reps: 12 }, { weight: 17.5, reps: 10 }, { weight: 17.5, reps: 9 }] },
          { exerciseId: ex["Lateral Raise"], sets: [{ weight: 10, reps: 15 }, { weight: 10, reps: 12 }, { weight: 12, reps: 10 }, { weight: 12, reps: 8 }] },
          { exerciseId: ex["Tricep Pushdown"], sets: [{ weight: 25, reps: 12 }, { weight: 27.5, reps: 10 }, { weight: 30, reps: 8 }] },
        ],
      },
      {
        userId, name: "Pull Day", date: day(1), status: "completed", duration: 3540,
        exercises: [
          { exerciseId: ex["Pull Up"], sets: [{ weight: 0, reps: 10 }, { weight: 0, reps: 8 }, { weight: 0, reps: 7 }] },
          { exerciseId: ex["Bent Over Barbell Row"], sets: [{ weight: 60, reps: 10 }, { weight: 65, reps: 8 }, { weight: 70, reps: 6 }, { weight: 70, reps: 6 }] },
          { exerciseId: ex["Seated Cable Row"], sets: [{ weight: 50, reps: 12 }, { weight: 55, reps: 10 }, { weight: 55, reps: 9 }] },
          { exerciseId: ex["Barbell Curl"], sets: [{ weight: 25, reps: 12 }, { weight: 30, reps: 8 }, { weight: 30, reps: 7 }] },
        ],
      },
      {
        userId, name: "Leg Day", date: day(3), status: "completed", duration: 4200,
        exercises: [
          { exerciseId: ex["Barbell Back Squat"], sets: [{ weight: 80, reps: 8 }, { weight: 85, reps: 6 }, { weight: 90, reps: 5 }, { weight: 90, reps: 4 }] },
          { exerciseId: ex["Romanian Deadlift"], sets: [{ weight: 70, reps: 10 }, { weight: 75, reps: 8 }, { weight: 75, reps: 8 }] },
          { exerciseId: ex["Leg Press"], sets: [{ weight: 140, reps: 12 }, { weight: 160, reps: 10 }, { weight: 160, reps: 9 }] },
          { exerciseId: ex["Standing Calf Raise"], sets: [{ weight: 60, reps: 15 }, { weight: 60, reps: 12 }, { weight: 65, reps: 12 }, { weight: 65, reps: 10 }] },
        ],
      },
      {
        userId, name: "Push Day", date: day(5), status: "completed", duration: 3300,
        exercises: [
          { exerciseId: ex["Barbell Bench Press"], sets: [{ weight: 72.5, reps: 10 }, { weight: 77.5, reps: 7 }, { weight: 80, reps: 6 }] },
          { exerciseId: ex["Incline Dumbbell Press"], sets: [{ weight: 26, reps: 9 }, { weight: 26, reps: 8 }, { weight: 28, reps: 6 }] },
          { exerciseId: ex["Lateral Raise"], sets: [{ weight: 12, reps: 11 }, { weight: 12, reps: 10 }, { weight: 12, reps: 9 }] },
        ],
      },
    ]);

    // re-seed bodyweight
    await Bodyweight.insertMany([
      { userId, weight: 73.2, unit: "kg", date: day(13) },
      { userId, weight: 73.0, unit: "kg", date: day(11) },
      { userId, weight: 72.8, unit: "kg", date: day(9) },
      { userId, weight: 72.5, unit: "kg", date: day(7) },
      { userId, weight: 72.0, unit: "kg", date: day(4) },
      { userId, weight: 71.8, unit: "kg", date: day(2) },
      { userId, weight: 71.5, unit: "kg", date: day(0) },
    ]);

    // reset userInfo to defaults
    user.userInfo = {
      height: 175,
      currentWeight: 72,
      targetWeight: 70,
      gender: "male",
      dateOfBirth: new Date("2000-06-15"),
      activityLevel: "moderately_active",
      goal: "lean_bulk",
      dailyCalorieGoal: 2650,
      isCalorieGoalAutoCalculated: true,
    };

    // generate tokens
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: {
        _id: user._id.toString(),
        name: user.name,
        username: user.username,
        email: user.email,
        userInfo: user.userInfo,
      },
      accessToken,
      refreshToken,
    };
  };
}

export default new MongoAuthService();
