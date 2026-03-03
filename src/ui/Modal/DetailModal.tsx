export interface OfferModalUIProps {
  open: boolean;
  onClose: () => void;
  coins: number;
  actualPrice: number;
  offerPrice: number;
  offerName?: string;
}

const OfferModalUI = ({
  open,
  onClose,
  coins,
  actualPrice,
  offerPrice,
  offerName,
}: OfferModalUIProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96 space-y-3">
        {offerName && (
          <p className="text-xs font-semibold text-orange-500">
            {offerName.toUpperCase()}
          </p>
        )}

        <p>🪙 Coins: {coins}</p>

        <p className="line-through text-gray-400">
          Actual Price: ₹{actualPrice}
        </p>

        <p className="text-green-600 font-bold">Offer Price: ₹{offerPrice}</p>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded bg-gray-900 text-white py-2"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OfferModalUI;
