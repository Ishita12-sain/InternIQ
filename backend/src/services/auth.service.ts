import userRepository from '../repositories/user.repository';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateToken } from '../utils/jwt.util';
import { AppError } from '../utils/appError';
import { CreateUserDTO, LoginDTO, AuthResponse, AuthUser } from '../types/user.types';

export class AuthService {
  /**
   * Register a new user with hashed password and return auth response with JWT
   */
  async register(data: CreateUserDTO): Promise<AuthResponse> {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw AppError.conflict('An account with this email already exists');
    }

    const hashedPassword = await hashPassword(data.password);

    const newUser = await userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    });

    const user = userRepository.sanitizeUser(newUser);
    const accessToken = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      success: true,
      user,
      accessToken,
    };
  }

  /**
   * Authenticate user credentials and return auth response with JWT
   */
  async login(data: LoginDTO): Promise<AuthResponse> {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw AppError.unauthorized('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw AppError.unauthorized('Invalid email or password');
    }

    const sanitizedUser = userRepository.sanitizeUser(user);
    const accessToken = generateToken({
      id: sanitizedUser.id,
      email: sanitizedUser.email,
      role: sanitizedUser.role,
    });

    return {
      success: true,
      user: sanitizedUser,
      accessToken,
    };
  }

  /**
   * Retrieve sanitized profile of currently authenticated user
   */
  async getMe(userId: string): Promise<AuthUser> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw AppError.notFound('User not found');
    }

    return userRepository.sanitizeUser(user);
  }
}

export const authService = new AuthService();
export default authService;
