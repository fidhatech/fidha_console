import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCoinPackageApi } from "../../../api/coin.api";
import { type PackageType } from "../../../types/coinManagement/package.type";

export const useCreateCoinMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PackageType) => createCoinPackageApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coins"] });
    },
  });
};