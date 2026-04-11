import api from "./axios";
import type { AppUpdateConfigType } from "../types/appUpdate.type";

export const getAppUpdateConfigApi = async (): Promise<AppUpdateConfigType> => {
  const res = await api.get<AppUpdateConfigType>('/app-update/config');
  return res.data;
};

export const updateAppUpdateConfigApi = async (data: AppUpdateConfigType): Promise<AppUpdateConfigType> => {
  const res = await api.patch<AppUpdateConfigType>('/app-update/config', data);
  return res.data;
};
