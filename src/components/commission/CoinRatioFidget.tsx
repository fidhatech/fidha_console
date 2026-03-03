import { Fidget2 } from "../../ui";
import type { CoinRatioType } from "../../types/commission.type";

type CoinRatioFidgetProps = {
  ratio: CoinRatioType | undefined;
  onRatio: (type: string) => void;
};

export const CoinRatioFidget = ({ ratio, onRatio }: CoinRatioFidgetProps) => {
  //if (!ratio) return;

  return (
    <>
        <Fidget2
          title={ratio?.title ?? ''}
          figure1={ratio?.coinRatio }
          policy={ratio?.description}
          actions={
            <button
              className="text-sm bg-gray-900 px-2 py-1 rounded text-white hover:underline"
              onClick={() => onRatio(ratio?.type ?? 'dfsdfs')}
            >
              Edit
            </button>
          }
        />
    </>
  );
};
