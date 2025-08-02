import { validateToken } from '@/api/userAuth';

export interface UserData {
  email?: string;
}

/**
 * Service for handling authentication token persistence and validation
 */
export class AuthService {
  private static readonly TOKEN_KEY = 'authToken';
  private static readonly USER_EMAIL_KEY = 'userEmail';

  /**
   * Get the stored authentication token
   */
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Store authentication token and user data
   */
  static setToken(token: string, userEmail?: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    if (userEmail) {
      localStorage.setItem(this.USER_EMAIL_KEY, userEmail);
    }
  }

  /**
   * Clear all authentication data from storage
   */
  static clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_EMAIL_KEY);
  }

  /**
   * Get stored user data
   */
  static getUserData(): UserData | null {
    const email = localStorage.getItem(this.USER_EMAIL_KEY);
    return email ? { email } : null;
  }

  /**
   * Validate the stored token with the server
   */
  static async validateStoredToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const result = await validateToken(token);
      return result.success;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }
}
