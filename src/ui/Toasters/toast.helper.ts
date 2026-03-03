import { toast } from "react-toastify";

export const showToast = {
  success: (message: string) =>
    toast.success(message),

  error: (message: string) =>
    toast.error(message),

  info: (message: string) =>
    toast.info(message),

  warning: (message: string) =>
    toast.warn(message),

  loading: (message: string) =>
    toast.loading(message),

  dismiss: (toastId?: string | number) =>
    toast.dismiss(toastId),
};


export const toastPromise = <T>(
  promise: Promise<T>,
  messages: {
    pending: string;
    success: string;
    error: string;
  }
) => {
  return toast.promise(promise, messages);
};
