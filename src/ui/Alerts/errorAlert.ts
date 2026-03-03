import Swal from "sweetalert2";

export const errorAlert = (message: string) => {
  return Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
  });
};
