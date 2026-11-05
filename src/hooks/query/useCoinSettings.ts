import { useQuery } from "@tanstack/react-query";
import { getCoinSettingsApi } from "../../api/coinSettings.api";
import type { CoinSettingsView } from "../../types/coinSettings.type";

export const COIN_SETTINGS_KEY = ["coin-settings"];

export const useCoinSettingsQuery = () => {
  return useQuery<CoinSettingsView>({
    queryKey: COIN_SETTINGS_KEY,
    queryFn: () => getCoinSettingsApi(),
    placeholderData: (previousData) => previousData,
  });
};
