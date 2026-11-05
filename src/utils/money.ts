/** Rupees (as typed) to whole paise, the unit the API stores. */
export const toPaise = (rupees: number) => Math.round(rupees * 100);

export const toRupees = (paise: number) => paise / 100;

export const formatRupees = (rupees: number, maximumFractionDigits = 2) =>
  `₹${rupees.toLocaleString("en-IN", { maximumFractionDigits })}`;

export const formatPaise = (paise: number) => formatRupees(toRupees(paise));

export const formatCoins = (coins: number) => coins.toLocaleString("en-IN");

/** Signed coins for ledger rows: "+50", "−20". */
export const formatSignedCoins = (coins: number) =>
  `${coins > 0 ? "+" : coins < 0 ? "−" : ""}${formatCoins(Math.abs(coins))}`;
