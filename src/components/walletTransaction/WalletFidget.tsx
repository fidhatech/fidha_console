import { Fidget } from "../../ui";
import { type WalletFigureType } from "../../types/wallet.type";

type WalletFigureProps = {
  walletData: WalletFigureType[] | undefined;
};

export const WalletFigure = ({ walletData }: WalletFigureProps) => {
  if(!walletData) return;
  return (
    <>
      {walletData.map((item) => (
        <Fidget
          key={item.title}
          title={item.title}
          figure={item.figure}
          growthPercentage={item.growth}
        />
      ))}
    </>
  );
};
