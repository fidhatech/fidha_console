import { useAuth, useLogoutMutation } from "../hooks/useAuth";
import { updatePasswordApi } from "../api/auth.api";
import { useMutation } from "@tanstack/react-query";
import { SecurityUpdateForm } from "../components/auth/SecurityForm";
import type { SecurityFormValues } from "../validation/schemas/security.schema";
import { showToast } from "../ui/Toasters/toast.helper";


const SecurityPage = () => {
  const { getUser } = useAuth();
  const user = getUser();

  if (!user)
    return <p>User is not present or not authenticated at the moment</p>;
 
  const {mutateAsync: logout} = useLogoutMutation();
  
  const { mutateAsync: updatePassword, isPending } = useMutation({
    mutationFn: ({ newPassword, oldPassword, newEmail }: SecurityFormValues) =>
    updatePasswordApi(user, newEmail, oldPassword, newPassword),
    onSuccess: () => {
      showToast.success('Credentials updated. Login again!');
      logout();
    },
    onError: () => {
      showToast.error('Wrong credentials or something went wrong')
    }
  });

  const handleUpdatePassword = async (values: SecurityFormValues) => {
    await updatePassword(values);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <SecurityUpdateForm isPending={isPending} onSubmit={handleUpdatePassword} />
      </div>
    </div>
  );
};

export default SecurityPage;
