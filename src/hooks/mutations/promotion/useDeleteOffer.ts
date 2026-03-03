import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOfferApi } from "../../../api/offer.api";

export const useDeleteOfferMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => deleteOfferApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });
};
