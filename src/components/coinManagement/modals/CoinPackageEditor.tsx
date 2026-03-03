import { useEffect } from "react";
import { Modal, Button, Input } from "../../../ui";
import { type PackageType } from "../../../types/coinManagement/package.type";
import {
  type PackageFormValues,
  packageSchema,
} from "../../../validation/schemas/package.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type EditPackageModalProps = {
  packageData: PackageType | undefined;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (data: PackageType) => void;
};

export const EditPackageModal = ({
  packageData,
  isOpen,
  onClose,
  onEdit,
}: EditPackageModalProps) => {
  if (!packageData) return;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      coins: packageData.coins,
      actualPrice: packageData.actualPrice,
      offerPrice: packageData.offerPrice,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        coins: packageData.coins,
        actualPrice: packageData.actualPrice,
        offerPrice: packageData.offerPrice,
      });
    }
  }, [isOpen, packageData, reset]);

  const handleUpdate = (data: PackageFormValues) => {
    onEdit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Package"
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
      <div className="space-y-4">
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
      </div>
    </Modal>
  );
};

export default EditPackageModal;
