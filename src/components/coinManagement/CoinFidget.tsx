import { Fidget2 } from "../../ui";
import { type CallRateDataType } from "../../types/coinManagement/callRate.type";

type CoinFidgetProps = {
  callRateData: CallRateDataType[] | undefined;
  onCallRate: (type: string) => void;
};

export const CoinFidget = ({ callRateData, onCallRate }: CoinFidgetProps) => {
  if (!callRateData) return;

  return (
    <>
      {callRateData.map((item) => (
        <Fidget2
          title={item?.title}
          figure1={item?.coinsPerMinute.audioCallRate}
          figure1Text={item?.subtitle.audio}
          figure2={item?.coinsPerMinute.videoCallRate}
          figure2Text={item?.subtitle.video}
          policy={item?.policy}
          actions={
            <button
              className="text-sm bg-gray-900 px-2 py-1 rounded text-white hover:underline"
              onClick={() => onCallRate(item?.type)}
            >
              Edit
            </button>
          }
        />
      ))}
    </>
  );
};
