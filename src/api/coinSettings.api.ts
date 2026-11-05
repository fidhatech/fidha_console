import api from "./axios";
import type { CoinSettingsPatch, CoinSettingsView } from "../types/coinSettings.type";

export const getCoinSettingsApi = async (): Promise<CoinSettingsView> => {
  const res = await api.get<CoinSettingsView>("/coin-settings");
  return res.data;
};

export const updateCoinSettingsApi = async (patch: CoinSettingsPatch): Promise<CoinSettingsView> => {
  const res = await api.patch<CoinSettingsView>("/coin-settings", patch);
  return res.data;
};
