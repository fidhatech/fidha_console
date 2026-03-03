import { Fidget2 } from "../../ui";
import { type commissionType } from "../../types/commission.type";

type CommissionFidgetProps = {
  commissionData: commissionType[] | undefined;
  onCommissionType: (type: string) => void;
};

export const CommissionFidget = ({
  commissionData,
  onCommissionType,
}: CommissionFidgetProps) => {
  if (!commissionData) return;
  return (
    <>
      {commissionData.map((item) => (
        <Fidget2
          title={item.title}
          figurePercentage={item.commissionPercentage}
          policy={item.policy}
          actions={
            <button
              className="text-sm bg-gray-900 px-2 py-1 rounded text-white hover:underline"
              onClick={() => onCommissionType(item.type)}
            >
              Edit
            </button>
          }
        />
      ))}
    </>
  );
};
