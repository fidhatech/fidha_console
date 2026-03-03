import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOfferApi } from "../../../api/offer.api";
import type { OfferType } from "../../../types/offer.types";

export const useCreateOfferMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: OfferType) => createOfferApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });
};