import User from "../models/user.model.js";
import {
  IAuthService,
  RegisterDto,
  LoginDto,
  RegisterResut,
  LoginResult,
  RefreshTokenResult,
} from "../types/auth.types.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { generateOTP, getOTPExpiry } from "../utils/otp.js";
import { sendEmail } from "../utils/mailer.js";
import crypto from "crypto";
class MongoAuthService implements IAuthService {
  registerUser = async (dto: RegisterDto): Promise<RegisterResut> => {
    const { name, email, username, password } = dto;

    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      throw new ApiError(400, "Email or username already in use.");
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

    await sendEmail(
      email,
      "Verify your RepUp account",
      `<div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e0e0e0; border-radius: 8px;">
  <h2 style="color: #111;">Verify your RepUp account</h2>
  <p style="color: #444;">Thanks for signing up! Use the OTP below to verify your email address.</p>
  <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #111; background: #f5f5f5; padding: 16px; text-align: center; border-radius: 6px; margin: 24px 0;">
    ${otp}
  </div>
  <p style="color: #888; font-size: 13px;">This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;">
  <p style="color: #aaa; font-size: 12px;">If you didn't create a RepUp account, ignore this email.</p>
</div>`,
    );

    return {
      _id: newUser._id.toString(),
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
    };
  };

  loginUser = async (dto: LoginDto): Promise<LoginResult> => {
    const { email, password } = dto;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new ApiError(400, "Invalid email or password");
    }

    const isCorrect = await user.isPasswordCorrect(password);

    if (!isCorrect) {
      throw new ApiError(400, "Invalid email or password");
    }

    if (!user.isVerified) {
      throw new ApiError(403, "Please verify your email before logging in.");
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

    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

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

    if (user.otp !== otp) {
      throw new ApiError(400, "Invalid OTP.");
    }

    if (user.otpExpiry < new Date()) {
      throw new ApiError(400, "OTP expired. Please request a new one.");
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

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendEmail(
      email,
      "Your new RepUp OTP",
      `<div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e0e0e0; border-radius: 8px;">
  <h2 style="color: #111;">Your new OTP</h2>
  <p style="color: #444;">You requested a new OTP for your RepUp account. Here it is:</p>
  <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #111; background: #f5f5f5; padding: 16px; text-align: center; border-radius: 6px; margin: 24px 0;">
    ${otp}
  </div>
  <p style="color: #888; font-size: 13px;">This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;">
  <p style="color: #aaa; font-size: 12px;">If you didn't request this, ignore this email.</p>
</div>`,
    );
  };

  forgotPassword = async (email: string): Promise<void> => {
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 15);

    user.resetPasswordToken = token;
    user.resetPasswordExpiry = expiry;
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    await sendEmail(
      email,
      "Reset your RepUp password",
      `<div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e0e0e0; border-radius: 8px;">
    <h2 style="color: #111;">Reset your password</h2>
     <p style="color: #444;">We received a request to reset your RepUp password. Click the button below to proceed.</p>
    <div style="text-align: center; margin: 32px 0;">
    <a href="${resetLink}" style="background: #111; color: #fff; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-size: 15px; font-weight: bold;">Reset Password</a>
     </div>
    <p style="color: #888; font-size: 13px;">This link expires in <strong>15 minutes</strong>. If you didn't request a password reset, ignore this email.</p>
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;">
     <p style="color: #aaa; font-size: 12px;">For security, never share this link with anyone.</p>
    </div>`,
    );
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
    await user.save();
  };
}

export default new MongoAuthService();
