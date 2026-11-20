import { apiRequest } from "../../services/api";
import { IAccount, IPagination } from "../../types";

export const accountService = {
  async getMyAccount(): Promise<IAccount> {
    return apiRequest<IAccount>("/accounts/me");
  },

  async updateAlias(alias: string): Promise<IAccount> {
    return apiRequest<IAccount>("/accounts/alias", {
      method: "PATCH",
      body: JSON.stringify({ alias }),
    });
  },

  async deposit(amount: number): Promise<IAccount> {
    return apiRequest<IAccount>("/accounts/deposit", {
      method: "PATCH",
      body: JSON.stringify({ amount }),
    });
  },

  async transfer(destination: string, amount: number): Promise<{
    message: string;
    amount: number;
    origin: IAccount;
    destination: IAccount;
  }> {
    return apiRequest("/accounts/transfer", {
      method: "PATCH",
      body: JSON.stringify({ destination, amount }),
    });
  },

  async getAllAccounts(page = 1, limit = 10): Promise<{
    accounts: IAccount[];
    pagination: IPagination;
  }> {
    return apiRequest<{ accounts: IAccount[]; pagination: IPagination }>(
      `/accounts?page=${page}&limit=${limit}`
    );
  },
};
