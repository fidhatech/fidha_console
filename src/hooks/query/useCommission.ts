import { useQuery } from "@tanstack/react-query";
import { getCallRateApi, getCoinRatioApi, getCommissionApi, getSignupBonusApi, payoutHistoryListApi, withdrawalRequestsListApi } from "../../api/commission.api";
import { type CallRateDataType } from "../../types/coinManagement/callRate.type";
import { type CoinRatioType, type commissionType, type SignupBonusType } from "../../types/commission.type";
import type { PaginatedResponse, PayoutHistoryType, UseQueryParams, WithdrawalRequestResponse } from "../../types/general.type";

export const useCallRateQuery = () => {
  return useQuery<CallRateDataType[]>({
    queryKey: [
      "call-rate",
    ],
    queryFn: () =>
      getCallRateApi(),
    placeholderData: (previousData) => previousData,
  });
};


export const useCommissionQuery = () => {
  return useQuery<commissionType[]>({
    queryKey: [
      "commission",
    ],
    queryFn: () =>
      getCommissionApi(),
    placeholderData: (previousData) => previousData,
  });
};

export const useCoinRatioQuery = () => {
  return useQuery<CoinRatioType>({
    queryKey: [
      "commission-ratio",
    ],
    queryFn: () =>
      getCoinRatioApi(),
    placeholderData: (previousData) => previousData,
  });
};

export const useSignupBonusQuery = () => {
  return useQuery<SignupBonusType>({
    queryKey: [
      "signup-bonus",
    ],
    queryFn: () =>
      getSignupBonusApi(),
    placeholderData: (previousData) => previousData,
  });
};


export const usePayoutQuery = (params: UseQueryParams) => {
  return useQuery<PaginatedResponse<PayoutHistoryType>>({
    queryKey: [
      "payout",
      params
    ],
    queryFn: () =>
      payoutHistoryListApi(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useWithdrawalRequestsQuery = (params: UseQueryParams) => {
  return useQuery<WithdrawalRequestResponse>({
    queryKey: [
      "withdrawal-requests",
      params,
    ],
    queryFn: () =>
      withdrawalRequestsListApi(params),
    placeholderData: (previousData) => previousData,
  });
};
