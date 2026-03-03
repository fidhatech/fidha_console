import { Button, Input } from "../../ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginFormValues,
} from "../../validation/schemas/login.schema";
import { Spinner } from "../../ui";

type LoginFormProps = {
  onSubmit: (data: LoginFormValues) => void;
  isPending: boolean;
};

export const LoginForm = ({ onSubmit, isPending }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome Back</h1>
        <p className="text-sm text-gray-500">Please login to your account</p>
      </div>

      <div className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          error={errors.password?.message}
        />
      </div>

      <Button type="submit" className="w-full">
       {isPending ? <Spinner/>: 'Login'} 
      </Button>
    </form>
  );
};
