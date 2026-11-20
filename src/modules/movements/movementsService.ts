import { apiRequest } from "../../services/api";
import { IMovement, IPagination } from "../../types";

export const movementsService = {
  async getMyMovements(page = 1, limit = 10): Promise<{
    movements: IMovement[];
    pagination: IPagination;
  }> {
    return apiRequest<{ movements: IMovement[]; pagination: IPagination }>(
      `/movements/me?page=${page}&limit=${limit}`
    );
  },
};
