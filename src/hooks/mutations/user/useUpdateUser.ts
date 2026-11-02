import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restrictUserApi } from "../../../api/user.api";

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isBlocked }: { id: string; isBlocked: boolean }) =>
      restrictUserApi(id, isBlocked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
