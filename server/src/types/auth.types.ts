export interface IAuthService {
  registerUser(dto: RegisterDto): Promise<RegisterResut>;
  loginUser(dto: LoginDto): Promise<LoginResult>;
  logoutUser(userId: string): Promise<void>;
}

export interface RegisterDto {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
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

