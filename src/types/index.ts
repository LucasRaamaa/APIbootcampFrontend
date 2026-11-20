export interface IUser {
  _id: string;
  name: string;
  lastname: string;
  email: string;
  isAdmin: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAccount {
  _id: string;
  user: string | { _id: string; name: string; lastname: string };
  name: string;
  cvu: string;
  alias: string;
  balance: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMovement {
  _id: string;
  type: "deposit" | "transfer";
  account: string;
  amount: number;
  transferId?: string | null;
  counterpartAccount?: {
    _id: string;
    alias: string;
    cvu: string;
  } | null;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
}

export interface IPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IApiResponse<T> {
  error?: string;
  details?: string[];
  data?: T;
}
