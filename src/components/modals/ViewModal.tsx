import type { RowType1, RowType2 } from "../../types/offer.types";
import OfferModalUI, {
  type OfferModalUIProps,
} from "../../ui/Modal/DetailModal";

type OfferModalProps = {
  open: boolean;
  onClose: () => void;
  row: RowType1 | RowType2 | null;
};

const OfferModal = ({ open, onClose, row }: OfferModalProps) => {
  if (!row) return null;

  const uiData: OfferModalUIProps = {
    open,
    onClose,
    coins: row.coins,
    actualPrice: row.actualPrice,
    offerPrice: row.offerPrice,
    offerName: "offerName" in row ? row.offerName : undefined,
  };

  return <OfferModalUI {...uiData} />;
};

export default OfferModal;
