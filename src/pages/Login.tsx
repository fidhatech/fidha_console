import { useAuth } from "../hooks/useAuth";
import { LoginForm } from "../components/auth/LoginForm";
import type { LoginFormValues } from "../validation/schemas/login.schema";
import { loginApi } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toastPromise } from "../ui/Toasters/toast.helper";

const LoginPage = () => {
  const { setTokens, setUser } = useAuth();
  const navigate = useNavigate();

  const { mutateAsync: login, isPending } = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setTokens(data.data.tokens);
      setUser(data.data.admin);
      navigate("/admin/dashboard", { replace: true });
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    await toastPromise(login(values), {
      pending: 'Login request is processing',
      success: 'Logged in successfully',
      error:'Wrong crendentials or something went wrong'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <LoginForm isPending={isPending} onSubmit={handleLogin} />
      </div>
    </div>
  );
};

export default LoginPage;
