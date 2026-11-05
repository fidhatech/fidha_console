import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCoinSettingsApi } from "../../../api/coinSettings.api";
import type { CoinSettingsPatch } from "../../../types/coinSettings.type";
import { COIN_SETTINGS_KEY } from "../../query/useCoinSettings";

export const useUpdateCoinSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patch: CoinSettingsPatch) => updateCoinSettingsApi(patch),
    onSuccess: (data) => {
      // The PATCH returns the full view (with a fresh earningPreview).
      queryClient.setQueryData(COIN_SETTINGS_KEY, data);
    },
  });
};
