// src/utils/alerts.js
import Swal from "sweetalert2";

export function showSuccess(title, text, confirmText = "Continuar") {
  return Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonText: confirmText,
  });
}

export function showError(title, text, confirmText = "Cerrar") {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonText: confirmText,
  });
}

export function showWarningChoice({
  title,
  text,
  confirmText = "Aceptar",
  denyText = "Cancelar",
}) {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    showDenyButton: true,
    confirmButtonText: confirmText,
    denyButtonText: denyText,
  });
}

export function showValidationErrors(errors) {
  return Swal.fire({
    icon: "error",
    title: "Datos inválidos",
    html: errors.join("<br />"),
    confirmButtonText: "Corregir",
  });
}
