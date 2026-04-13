import User from "../models/user.model.js";
import {
  IAuthService,
  RegisterDto,
  LoginDto,
  AuthUser,
  LoginResult,
} from "../types/auth.types.js";
import { ApiError } from "../utils/apiError.js";

class MongoAuthService implements IAuthService {
  registerUser = async (dto: RegisterDto): Promise<AuthUser> => {
    const { name, email, username, password } = dto;

    const user = await User.findOne({ email, username });

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
}

export default new MongoAuthService();
