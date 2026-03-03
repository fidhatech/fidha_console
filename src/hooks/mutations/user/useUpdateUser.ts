import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restrictUserApi } from "../../../api/user.api";

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      restrictUserApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
