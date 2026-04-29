import type { RegisterDto, LoginDto } from "../validator/auth.validator.js";

export type { RegisterDto, LoginDto };

export interface IAuthService {
  registerUser(dto: RegisterDto): Promise<RegisterResut>;
  loginUser(dto: LoginDto): Promise<LoginResult>;
  logoutUser(userId: string): Promise<void>;
  refreshToken(incomingRefreshToken: string): Promise<RefreshTokenResult>;
  verifyOtp(email: string, otp: string): Promise<void>;
  resendOtp(email: string): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
}

export interface RegisterResut {
  _id: string;
  username: string;
  name: string;
  email: string;
}

export interface LoginResult {
  user: RegisterResut;
  accessToken: string;
  refreshToken: string;
}
export interface RefreshTokenResult {
  user: RegisterResut;
  accessToken: string;
  refreshToken: string;
}
