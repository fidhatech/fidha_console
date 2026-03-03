import api from "./axios";
import { type PackageType } from "../types/coinManagement/package.type";
import { type GetParams, type PaginatedResponse } from "../types/general.type";
import { type CoinPackageType } from "../components/coinManagement";

export const coinPackageListApi = async (params: GetParams): Promise<PaginatedResponse<CoinPackageType>> => {
  const res = await api.get<PaginatedResponse<CoinPackageType>>("/coins", { params });
  return res.data;
};


export const createCoinPackageApi = (data: PackageType) => api.post('/coins', data);
export const updateCoinPackageApi = (id: string, data: Partial<PackageType>) => api.patch('/coins', { id, data });
export const deleteCoinPackageApi = (id: string) => api.delete('/coins', { data: { id } });



