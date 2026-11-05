import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type CallRateType } from "../../../types/coinManagement/callRate.type";
import { updateCallRateApi } from "../../../api/commission.api";

type UpdatePayload = {
  id: string | number,
  data: CallRateType,
  type: string,
};

export const useUpdateCallRateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, type }: UpdatePayload) => updateCallRateApi(id as string, data, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["call-rate"] });
      // Coin settings' earningPreview is computed from the call rates.
      queryClient.invalidateQueries({ queryKey: ["coin-settings"] });
    },
  });
};
