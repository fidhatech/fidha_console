import { useEffect } from "react";
import { Modal, Button, Input, Select, DateFilter } from "../../../ui";
import { type OfferType } from "../../../types/offer.types";
import {
  offerSchema,
  type OfferFormValues,
} from "../../../validation/schemas/offer.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type OfferCreatorProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: OfferType) => void;
};

const OFFER_TYPES = [
  { label: "Offer", value: "offer" },
  { label: "Promotion", value: "promotion" },
];

export const OfferCreator = ({
  isOpen,
  onClose,
  onCreate,
}: OfferCreatorProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: "",
      coins: 0,
      actualPrice: 0,
      offerPrice: 0,
      type: "offer",
      isWelcomeOffer: false,
      startDate: "2026-01-01",
      endDate: "2026-12-01",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleCreate = (data: OfferFormValues) => {
    90;
    onCreate(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Offer"
      footer={
        <>
          <Button variant="primary" onClick={handleSubmit(handleCreate)}>
            Create
          </Button>
          <Button variant="action" onClick={onClose}>
            Cancel
          </Button>
        </>
      }
    >
      <div className="space-y-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Offer Name / Description</label>
          <textarea
            {...register("title")}
            rows={4}
            placeholder="Enter full offer title or description"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          {errors.title?.message && (
            <span className="text-xs text-red-500">{errors.title.message}</span>
          )}
        </div>

        <Input
          label="Coins"
          type="number"
          {...register("coins", { valueAsNumber: true })}
          error={errors.coins?.message}
        />

        <Input
          label="Actual Price"
          type="number"
          {...register("actualPrice", { valueAsNumber: true })}
          error={errors.actualPrice?.message}
        />

        <Input
          label="Offer Price"
          type="number"
          {...register("offerPrice", { valueAsNumber: true })}
          error={errors.offerPrice?.message}
        />

        {/* Select (manual integration) */}
        <Select
          value={watch("type")}
          options={OFFER_TYPES}
          onChange={(value) =>
            setValue("type", value, { shouldValidate: true })
          }
          error={errors.type?.message}
        />

        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input type="checkbox" {...register("isWelcomeOffer")} />
          Mark as Welcome Offer
        </label>

        {/* Date range */}
        <DateFilter
          from={watch("startDate")}
          to={watch("endDate")}
          onFromChange={(value) =>
            setValue("startDate", value, { shouldValidate: true })
          }
          onToChange={(value) =>
            setValue("endDate", value, { shouldValidate: true })
          }
        />

        {(errors.startDate || errors.endDate) && (
          <p className="text-xs text-red-500">
            {errors.startDate?.message || errors.endDate?.message}
          </p>
        )}
      </div>
    </Modal>
  );
};

export default OfferCreator;
