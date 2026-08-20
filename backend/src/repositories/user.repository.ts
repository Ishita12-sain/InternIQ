import { query } from '../config/database';
import { IUser, AuthUser, UserRole } from '../types/user.types';

export class UserRepository {
  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<IUser | null> {
    const result = await query(
      `
      SELECT
        user_id,
        name,
        email,
        password_hash,
        role,
        created_at
      FROM users
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1
      `,
      [email.trim()]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapUser(result.rows[0]);
  }

  /**
   * Find user by database user_id
   */
  async findById(id: string): Promise<IUser | null> {
    const result = await query(
      `
      SELECT
        user_id,
        name,
        email,
        password_hash,
        role,
        created_at
      FROM users
      WHERE user_id = $1
      LIMIT 1
      `,
      [Number(id)]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapUser(result.rows[0]);
  }

  /**
   * Create a new user
   */
  async create(data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }): Promise<IUser> {
    const result = await query(
      `
      INSERT INTO users (
        name,
        email,
        password_hash,
        role
      )
      VALUES ($1, $2, $3, $4)
      RETURNING
        user_id,
        name,
        email,
        password_hash,
        role,
        created_at
      `,
      [
        data.name.trim(),
        data.email.trim().toLowerCase(),
        data.password,
        data.role,
      ]
    );

    return this.mapUser(result.rows[0]);
  }

  /**
   * Convert PostgreSQL row into application IUser
   */
  private mapUser(row: any): IUser {
    return {
      id: String(row.user_id),
      name: row.name,
      email: row.email,
      password: row.password_hash,
      role: row.role as UserRole,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.created_at),
    };
  }

  /**
   * Remove password before sending user to frontend
   */
  sanitizeUser(user: IUser): AuthUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}

export const userRepository = new UserRepository();

export default userRepository;