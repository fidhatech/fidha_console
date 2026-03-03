import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PackageType } from "../../../types/coinManagement/package.type";
import { updateCoinPackageApi } from "../../../api/coin.api";

type UpdatePayload = {
  id: string | number;
  data: PackageType;
};

export const useUpdateCoinMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdatePayload) => updateCoinPackageApi(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coins"] });
    },
  });
};
