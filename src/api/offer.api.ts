import api from "./axios";
import { type GetOffersParams, type OfferFestivalType, type OfferType } from "../types/offer.types";
import type { PaginatedResponse } from "../types/general.type";

export const createOfferApi = (data: OfferType) => api.post('/offers', { data });
export const updateOfferApi = (id: string | number, data: Partial<OfferType>) => api.patch('/offers', { id, data });
export const deleteOfferApi = (id: string | number) => api.delete('/offers', { data: { id } });

export const getOffersApi = async (params: GetOffersParams): Promise<PaginatedResponse<OfferFestivalType>> => {
  const res = await api.get<PaginatedResponse<OfferFestivalType>>("/offers", { params });
  return res.data;
};

