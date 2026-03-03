import type { GetParams, PaginatedResponse } from "../types/general.type";
import type { UserListType } from "../types/user.type";
import api from "./axios";

export const restrictUserApi = (userId: string) => api.patch('/user/block', { userId });

export const usersListApi = async (params: GetParams): Promise<PaginatedResponse<UserListType>> => {
  const res = await api.get<PaginatedResponse<UserListType>>("/users", { params });
  return res.data;
};
