import { useEffect } from "react";
import { Modal, Button, Input, Select, DateFilter } from "../../../ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  offerSchema,
  type OfferFormValues,
} from "../../../validation/schemas/offer.schema";
import { type OfferType } from "../../../types/offer.types";
import type { OfferFestivalType } from "../OfferList";

type OfferEditorProps = {
  offerData: OfferFestivalType | undefined;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (data: OfferType) => void;
};

const OFFER_TYPES = [
  { label: "Offer", value: "offer" },
  { label: "Promotion", value: "promotion" },
];

export const OfferEditor = ({
  offerData,
  isOpen,
  onClose,
  onEdit,
}: OfferEditorProps) => {
  if (!offerData) {
    return;
  }
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: offerData.title,
      coins: offerData.coins,
      actualPrice: offerData.actualPrice,
      offerPrice: offerData.offerPrice,
      type: offerData.type,
      isWelcomeOffer: offerData.isWelcomeOffer ?? false,
      startDate: offerData.startDate,
      endDate: offerData.endDate,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        title: offerData.title,
        coins: offerData.coins,
        actualPrice: offerData.actualPrice,
        offerPrice: offerData.offerPrice,
        type: offerData.type,
        isWelcomeOffer: offerData.isWelcomeOffer ?? false,
        startDate: offerData.startDate,
        endDate: offerData.endDate,
      });
    }
  }, [isOpen, offerData, reset]);

  const handleUpdate = (data: OfferFormValues) => {
    onEdit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Offer"
      footer={
        <>
          <Button disabled={!isValid} onClick={handleSubmit(handleUpdate)}>
            Update
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

export default OfferEditor;
