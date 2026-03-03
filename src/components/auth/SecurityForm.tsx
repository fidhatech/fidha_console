import { Button, Input, Spinner } from "../../ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {type SecurityFormValues, securitySchema } from "../../validation/schemas/security.schema";

type SecurityUpdateFormProps = {
  onSubmit: (data: SecurityFormValues) => void;
  isPending: boolean;
};

export const SecurityUpdateForm = ({ onSubmit, isPending }: SecurityUpdateFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
  });

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="text-center space-y-1">
        <p className="text-md text-gray-500">Please Enter your credentials</p>
      </div>

      <div className="space-y-4">
        <Input
          label="Old Password"
          type="password"
          placeholder="••••••••"
          {...register("oldPassword")}
          error={errors.oldPassword?.message}
        />

        <Input
          label="New Password"
          type="password"
          placeholder="••••••••"
          {...register("newPassword")}
          error={errors.newPassword?.message}
        />

        <Input
          label="New Email"
          type="email"
          placeholder="your@email.com (optional)"
          {...register("newEmail")}
          error={errors.newEmail?.message}
        />
      </div>

      <Button type="submit" variant="action" className="w-full">
        {isPending ? <Spinner/>: 'Update'} 
      </Button>
    </form>
  );
};
