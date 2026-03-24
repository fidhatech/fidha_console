export type OfferType = {
  title: string,
  startDate: string,
  endDate: string,
  type: string,
  coins: number,
  offerPrice: number,
  actualPrice: number,
  isWelcomeOffer?: boolean,

}

export type RowType1 = {
  coins: number;
  actualPrice: number;
  offerPrice: number;
};

export type RowType2 = {
  offerName: string;
  coins: number;
  actualPrice: number;
  offerPrice: number;
};

export type GetOffersParams = {
  page: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type OfferFestivalType = {
  id: string | number,
  title: string,
  coins?: number,
  actualPrice: number,
  offerPrice: number,
  startDate: string,
  endDate: string,
  type: string,
  isWelcomeOffer?: boolean,
};