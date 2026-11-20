import { apiRequest } from "../../services/api";
import { IUser, IPagination } from "../../types";

export const userService = {
  async register(userData: {
    name: string;
    lastname: string;
    email: string;
    password: string;
  }): Promise<IUser> {
    return apiRequest<IUser>("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  async updateProfile(userData: Partial<Pick<IUser, "name" | "lastname" | "email">>): Promise<IUser> {
    return apiRequest<IUser>("/users", {
      method: "PATCH",
      body: JSON.stringify(userData),
    });
  },

  async deleteAccount(): Promise<{ message: string }> {
    return apiRequest<{ message: string }>("/users", {
      method: "DELETE",
    });
  },

  async getAllUsers(page = 1, limit = 10): Promise<{
    users: IUser[];
    pagination: IPagination;
  }> {
    return apiRequest<{ users: IUser[]; pagination: IPagination }>(
      `/users?page=${page}&limit=${limit}`
    );
  },
};
