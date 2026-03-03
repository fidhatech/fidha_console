import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOfferApi } from "../../../api/offer.api";
import type { OfferType } from "../../../types/offer.types";

type UpdatePayload = {
  id: string | number;
  data: OfferType;
};

export const useUpdateOfferMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdatePayload) =>
      updateOfferApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });
};
