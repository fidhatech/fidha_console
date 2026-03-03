import type { RowType1, RowType2 } from "../../types/offer.types";
import { Button, Table, type Column } from "../../ui";
import { Icons } from "../../ui";

export type OfferFestivalType = {
  id: string | number;
  title: string;
  coins?: number;
  actualPrice: number;
  offerPrice: number;
  startDate: string;
  endDate: string;
  type: string;
};

const columns = (
  onView: (row: RowType1 | RowType2) => void,
  onEdit: (id: number | string) => void,
  onDelete: (id: number | string) => void
): Column<OfferFestivalType>[] => [
  { key: "title", header: "Offer Name" },
  {
    key: "id",
    header: "Active Period",
    render: (row) => (
      <div className="flex flex-col text-xs">
        <p>{row.startDate}</p>
        <p>{row.endDate}</p>
      </div>
    ),
  },
  {
    key: "id",
    header: "Type",
    render: (row) => (
      <p className="px-2 py-1 rounded max-w-18 text-center text-gray-900">
        {row.type}
      </p>
    ),
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
              offerName: row.title,
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

type OfferListProps = {
  onView: (row: RowType1 | RowType2) => void;
  onEdit: (id: number | string) => void;
  onDelete: (id: number | string) => void;
  offerData: OfferFestivalType[] | undefined;
};

const OfferList = ({ onView, onEdit, onDelete, offerData }: OfferListProps) => {
  return <Table columns={columns(onView, onEdit, onDelete)} data={offerData} />;
};

export default OfferList;
