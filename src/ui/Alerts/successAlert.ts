import Swal from "sweetalert2";

export const successAlert = (message: string) => {
  return Swal.fire({
    icon: "success",
    title: "Success",
    text: message,
    timer: 2000,
    showConfirmButton: false,
  });
};
