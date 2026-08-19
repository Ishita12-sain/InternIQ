import crypto from 'crypto';
import { IUser, AuthUser, UserRole } from '../types/user.types';

export class UserRepository {
  private users: Map<string, IUser> = new Map();

  /**
   * Find a user by their email address (case-insensitive)
   */
  async findByEmail(email: string): Promise<IUser | null> {
    const normalizedEmail = email.trim().toLowerCase();
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === normalizedEmail) {
        return { ...user };
      }
    }
    return null;
  }

  /**
   * Find a user by their unique ID
   */
  async findById(id: string): Promise<IUser | null> {
    const user = this.users.get(id);
    if (!user) return null;
    return { ...user };
  }

  /**
   * Create and store a new user
   */
  async create(data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }): Promise<IUser> {
    const id = crypto.randomUUID ? crypto.randomUUID() : `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date();
    
    const newUser: IUser = {
      id,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      role: data.role,
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(id, newUser);
    return { ...newUser };
  }

  /**
   * Helper to strip sensitive fields (e.g. password) from user object
   */
  sanitizeUser(user: IUser): AuthUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  /**
   * Clear all users (testing utility)
   */
  async clear(): Promise<void> {
    this.users.clear();
  }
}

export const userRepository = new UserRepository();
export default userRepository;
