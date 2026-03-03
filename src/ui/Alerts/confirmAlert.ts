import Swal from "sweetalert2";

export const confirmAlert = async ({
  title = "Are you sure?",
  text = "Kindly verify before proceed",
  confirmText = "Yes",
  cancelText = "Cancel",
} = {}) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });

  return result.isConfirmed;
};
