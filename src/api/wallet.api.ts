import api from "./axios";
import { type TransactionHistoryType, type WalletFigureType } from "../types/wallet.type";
import type { GetParams, PaginatedResponse } from "../types/general.type";

export const getWalletTractionApi = async (): Promise<WalletFigureType[]> => {
  const res = await api.get<WalletFigureType[]>("/wallet/traction");
  return res.data;
};

export const transactionHistoryApi = async (params: GetParams): Promise<PaginatedResponse<TransactionHistoryType>> => {
  const res = await api.get<PaginatedResponse<TransactionHistoryType>>("/transaction/history", { params });
  return res.data;
};

export const grantBonusCoinsApi = async (payload: import("../types/wallet.type").BonusCoinsGrantPayload) => {
  const res = await api.post("/wallet/bonus-coins", payload);
  return res.data;
};