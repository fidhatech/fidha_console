import api from "./axios";
import { type CallRateDataType, type CallRateType } from "../types/coinManagement/callRate.type";
import type { CoinRatioType, commissionType } from "../types/commission.type";
import type { GetParams, PaginatedResponse, PayoutHistoryType, WithdrawalRequestResponse } from "../types/general.type";

export const payoutHistoryListApi = async (params: GetParams): Promise<PaginatedResponse<PayoutHistoryType>> => {
  const res = await api.get<PaginatedResponse<PayoutHistoryType>>("/payout/history", { params });
  return res.data;
};

export const withdrawalRequestsListApi = async (params: GetParams): Promise<WithdrawalRequestResponse> => {
    const res = await api.get<WithdrawalRequestResponse>("/withdrawal/requests", { params });
    return res.data;
};

export const getCommissionApi = async (): Promise<commissionType[]> => {
    const res = await api.get<commissionType[]>('/commission');
    return res.data;
};

export const getCoinRatioApi = async(): Promise<CoinRatioType> => {
    const res = await api.get<CoinRatioType>('/commission/ratio');
    return res.data;
};

export const updatedCommissionApi = (id: string, data: number, type: string) => api.patch('/commission', { id, data, type })

export const getCallRateApi = async (): Promise<CallRateDataType[]> => {
    const res = await api.get<CallRateDataType[]>('/call-rate');
    return res.data;
};

export const updateCallRateApi = (id: string, data: CallRateType, type: string) => api.patch('/call-rate', { id, data, type });
