import type { GetParams, PaginatedResponse } from "../types/general.type";
import { type UserType } from "../components/verification/Verification";
import api from "./axios";

export const verifyUserApi = (userId: string) => api.patch("/user/onboard/accept", { userId });
export const rejectUserApi = (userId: string, reason: string) => api.post("/user/onboard/reject", { userId, reason });

export const onboardListApi = async (params: GetParams): Promise<PaginatedResponse<UserType>> => {
    const res = await api.get<PaginatedResponse<UserType>>("/users/onboard", { params });
    return res.data;
};