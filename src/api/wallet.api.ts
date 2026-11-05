import api from "./axios";
import type {
  BonusCoinsGrantPayload,
  BonusCoinsGrantResult,
  CoinsDeductPayload,
  CoinsDeductResult,
  TransactionHistoryType,
  UserWalletPage,
  WalletActionResponse,
  WalletFigureType,
} from "../types/wallet.type";
import type { GetParams, PaginatedResponse } from "../types/general.type";

export const getWalletTractionApi = async (): Promise<WalletFigureType[]> => {
  const res = await api.get<WalletFigureType[]>("/wallet/traction");
  return res.data;
};

export const transactionHistoryApi = async (params: GetParams): Promise<PaginatedResponse<TransactionHistoryType>> => {
  const res = await api.get<PaginatedResponse<TransactionHistoryType>>("/transaction/history", { params });
  return res.data;
};

export const grantBonusCoinsApi = async (payload: BonusCoinsGrantPayload): Promise<WalletActionResponse<BonusCoinsGrantResult>> => {
  const res = await api.post<WalletActionResponse<BonusCoinsGrantResult>>("/wallet/bonus-coins", payload);
  return res.data;
};

export const deductCoinsApi = async (payload: CoinsDeductPayload): Promise<WalletActionResponse<CoinsDeductResult>> => {
  const res = await api.post<WalletActionResponse<CoinsDeductResult>>("/wallet/deduct-coins", payload);
  return res.data;
};

export const userWalletApi = async (
  userId: string,
  params: { cursor?: string; limit?: number } = {}
): Promise<UserWalletPage> => {
  const res = await api.get<UserWalletPage>(`/wallet/user/${encodeURIComponent(userId)}`, { params });
  return res.data;
};
