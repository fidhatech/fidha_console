export type commissionType = {
        id: string,
        title: string,
        type: string,
        commissionPercentage: number,
        policy: string,
};

export type CoinRatioType = {
      id: string,
      title: string,
      type: string,
      coinRatio: number,
      description: string,
};

export type SignupBonusType = {
      id: string,
      title: string,
      type: string,
      signupBonusCoins: number,
      description: string,
};