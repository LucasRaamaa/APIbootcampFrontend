import { apiRequest } from "../../services/api";
import { IUser } from "../../types";

export const authService = {
  async login(credentials: { email: string; password: string }): Promise<{
    payload: { _id: string; isAdmin: boolean };
    accessToken: string;
  }> {
    return apiRequest("/auth", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  async getMe(): Promise<IUser> {
    return apiRequest<IUser>("/auth/me");
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    return apiRequest("/auth/me/password", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};
