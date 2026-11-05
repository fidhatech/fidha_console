import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deductCoinsApi, grantBonusCoinsApi } from "../../../api/wallet.api";
import type { BonusCoinsGrantPayload, CoinsDeductPayload } from "../../../types/wallet.type";

// Both change balances, so the history table and any open ledger go stale.
const invalidateWallets = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ["wallet"] });
  queryClient.invalidateQueries({ queryKey: ["user-wallet"] });
};

export const useGrantBonusCoinsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BonusCoinsGrantPayload) => grantBonusCoinsApi(payload),
    onSuccess: () => invalidateWallets(queryClient),
  });
};

export const useDeductCoinsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CoinsDeductPayload) => deductCoinsApi(payload),
    onSuccess: () => invalidateWallets(queryClient),
  });
};
