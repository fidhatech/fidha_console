import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type CallRateType } from "../../../types/coinManagement/callRate.type";
import { updateCallRateApi, updatedCommissionApi } from "../../../api/commission.api";

type UpdatePayload = {
  id: string | number,
  data: CallRateType,
  type: string,
};

type UpdateCommissionPayload = {
  id: string | number,
  data: number,
  type: string,
};

export const useUpdateCallRateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, type }: UpdatePayload) => updateCallRateApi(id as string, data, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["call-rate"] });
    },
  });
};

export const useUpdateCommissionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, type }: UpdateCommissionPayload) => updatedCommissionApi(id as string, data, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commission"] });
    },
  });
};

export const useUpdateCoinRatioMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, type }: UpdateCommissionPayload) => updatedCommissionApi(id as string, data, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commission-ratio"] });
    },
  });
};

