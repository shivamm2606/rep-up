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

class MongoAuthService implements IAuthService {
  registerUser = async (dto: RegisterDto): Promise<RegisterResut> => {
    const { name, email, username, password } = dto;

    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      throw new ApiError(400, "Email or username already in use.");
    }

    const newUser = await User.create({ name, email, username, password });

    if (!newUser) {
      throw new ApiError(500, "User creation failed.");
    }

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
      throw new ApiError(400, "User not found");
    }

    const isCorrect = await user.isPasswordCorrect(password);

    if (!isCorrect) {
      throw new ApiError(400, "Incorrect password");
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
}

export default new MongoAuthService();
