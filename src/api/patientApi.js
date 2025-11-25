// src/api/patientApi.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 🔹 Login por email + fecha
export async function getPatientByBirthdateAndEmail({ email, birthDate }) {
  const url = `${BASE_URL}/api/patient/patientConfirmation`;

  const payload = {
    PatientEmail: email,
    PatientBirthDate: birthDate,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (data.patientExternalId) {
    return {
      ok: true,
      patient: {
        externalId: data.patientExternalId,
        firstName: data.patientFirstName,
        lastName: data.patientLastName,
      },
    };
  }

  if (data.message === "Paciente no registrado en ModMed.") {
    return {
      ok: false,
      notRegistered: true,
      message: data.message,
    };
  }

  return {
    ok: false,
    notRegistered: false,
    message: data.message || "Error desconocido al consultar el paciente.",
  };
}

// 🔹 Registro de paciente
export async function registerPatientModMed(payload) {
  try {
    const response = await fetch(`${BASE_URL}/api/patient/registerModMed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 201) {
      const data = await response.json();
      return { ok: true, patient: data };
    }

    if (response.status === 409) {
      const data = await response.json();
      return { conflict: true, message: data.message };
    }

    if (response.status === 400) {
      const data = await response.json();

      const validationErrors = [];
      for (const field in data.errors) {
        data.errors[field].forEach((msg) =>
          validationErrors.push(`${field}: ${msg}`)
        );
      }

      return { validationErrors };
    }

    const errorBody = await response.text();
    return { ok: false, message: errorBody };

  } catch (error) {
    console.error("Error en registerPatientModMed:", error);
    return { ok: false, message: "No fue posible conectar con el backend." };
  }
}
