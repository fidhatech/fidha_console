import { Modal, Button, Input } from "../../ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  rejectionSchema,
  type RejectionFormValues,
} from "../../validation/schemas/rejection.schema";

type RejectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

export const RejectionModal = ({
  isOpen,
  onClose,
  onConfirm,
}: RejectionModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RejectionFormValues>({
    resolver: zodResolver(rejectionSchema),
    defaultValues: {
      reason: "",
    },
  });

  const handleConfirm = (data: RejectionFormValues) => {
    onConfirm(data.reason);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Action & Feedback"
      footer={
        <>
          <Button variant="action" onClick={handleSubmit(handleConfirm)}>
            confirm
          </Button>

          <Button variant="danger" onClick={onClose}>
            Cancel
          </Button>
        </>
      }
    >
      <Input
        label="Rejection Reason"
        type="text"
        {...register("reason")}
        error={errors.reason?.message}
      />
    </Modal>
  );
};
