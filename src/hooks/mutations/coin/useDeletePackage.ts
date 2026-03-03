import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCoinPackageApi } from "../../../api/coin.api";

export const useDeleteCoinMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => deleteCoinPackageApi(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coins"] });
    },
  });
};