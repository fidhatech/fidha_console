import type { RowType1, RowType2 } from "../../types/offer.types";
import { Button, Icons, Table, type Column } from "../../ui";

export type CoinPackageType = {
  id: string | number;
  coins: number;
  actualPrice: number;
  offerPrice: number;
  date: string;
};

const columns = (
  onView: (row: RowType1 | RowType2) => void,
  onEdit: (id: number | string) => void,
  onDelete: (id: number | string) => void
): Column<CoinPackageType>[] => [
  { key: "coins", header: "Coins" },
  {
    key: "actualPrice",
    header: "Actual Price",
  },
  {
    key: "offerPrice",
    header: "Offer Price",
  },
  {
    key: "date",
    header: "Listed Date",
  },
  {
    key: "id",
    header: "Action",
    render: (row) => (
      <div className="flex gap-1">
        <Button
          variant="icon"
          onClick={() =>
            onView({
              coins: row?.coins || 0,
              actualPrice: row.actualPrice,
              offerPrice: row.offerPrice,
            })
          }
        >
          {<Icons.View />}
        </Button>

        <Button variant="icon" onClick={() => onEdit(row.id)}>
          {<Icons.Pen />}
        </Button>

        <Button variant="icon" onClick={() => onDelete(row.id)}>
          {<Icons.Bin />}
        </Button>
      </div>
    ),
  },
];

type CoinPackageProps = {
  onView: (row: RowType1 | RowType2) => void;
  onEdit: (id: number | string) => void;
  onDelete: (id: number | string) => void;
  coinPackageData: CoinPackageType[] | undefined;
};

export const CoinPackage = ({
  onView,
  onEdit,
  onDelete,
  coinPackageData,
}: CoinPackageProps) => {
  return (
    <>
      <Table
        columns={columns(onView, onEdit, onDelete)}
        data={coinPackageData}
      />
    </>
  );
};
