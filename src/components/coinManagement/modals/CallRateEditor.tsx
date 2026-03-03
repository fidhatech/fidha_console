import { useEffect } from "react";
import { Modal, Button, Input } from "../../../ui";
import { type CallRateType } from "../../../types/coinManagement/callRate.type";
import {
  callRateSchema,
  type CallRateFormValues,
} from "../../../validation/schemas/call.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type EditCallRateModalProps = {
  type: string;
  callRateData: CallRateType;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (data: CallRateType) => void;
};

export const EditCallRateModal = ({
  type,
  callRateData,
  isOpen,
  onClose,
  onEdit,
}: EditCallRateModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CallRateFormValues>({
    resolver: zodResolver(callRateSchema),
    defaultValues: {
      audioCallRate: callRateData.audioCallRate,
      videoCallRate: callRateData.videoCallRate,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        audioCallRate: callRateData.audioCallRate,
        videoCallRate: callRateData.videoCallRate,
      });
    }
  }, [isOpen, callRateData, reset]);

  const handleUpdate = (data: CallRateFormValues) => {
    onEdit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${type} call rate`}
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
          label="Audio Call Rate"
          type="number"
          {...register("audioCallRate", { valueAsNumber: true })}
          error={errors.audioCallRate?.message}
        />

        <Input
          label="Video Call Rate"
          type="number"
          {...register("videoCallRate", { valueAsNumber: true })}
          error={errors.videoCallRate?.message}
        />
      </div>
    </Modal>
  );
};

export default EditCallRateModal;
