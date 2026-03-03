import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectUserApi, verifyUserApi } from "../../../api/verification.api";

type UpdatePayload = {
  id: string | number,
  data: string,
};

export const useUpdateVerifyUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => verifyUserApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verification"] });
    },
  });
};

export const useUpdateRejectUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdatePayload) => rejectUserApi(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verification"] });
    },
  });
};