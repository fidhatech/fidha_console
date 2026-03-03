import { useEffect } from "react";
import { Modal, Button, Input } from "../../ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  commissionSchema,
  type CommissionFormValues,
} from "../../validation/schemas/commission.schema";

type EditCommisssionBonusModalProps = {
  type: string;
  data: number;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (data: number) => void;
};

export const EditorCommisssionBonusModal = ({
  type,
  data,
  isOpen,
  onClose,
  onEdit,
}: EditCommisssionBonusModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommissionFormValues>({
    resolver: zodResolver(commissionSchema),
    defaultValues: {
      commission: data,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ commission: data });
    }
  }, [data, isOpen, reset]);

  const handleUpdate = (formData: CommissionFormValues) => {
    onEdit(formData.commission);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${type}`}
      footer={
        <>
          <Button onClick={handleSubmit(handleUpdate)}>Update</Button>
          <Button variant="action" onClick={onClose}>
            Cancel
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label={type}
          type="number"
          {...register("commission", { valueAsNumber: true })}
          error={errors.commission?.message}
        />
      </div>
    </Modal>
  );
};

export default EditorCommisssionBonusModal;
