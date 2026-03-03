import { Modal, Button, Input } from "../../../ui";
import { type PackageType } from "../../../types/coinManagement/package.type";
import {
  type PackageFormValues,
  packageSchema,
} from "../../../validation/schemas/package.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type CreatePackageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: PackageType) => void;
};

export const CreatePackageModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreatePackageModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      coins: 0,
      actualPrice: 0,
      offerPrice: 0,
    },
  });

  const handleCreate = (data: PackageFormValues) => {
    onCreate(data);
    onClose();
    reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Package"
      footer={
        <>
          <Button disabled={!isValid} onClick={handleSubmit(handleCreate)}>
            Create
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

export default CreatePackageModal;
