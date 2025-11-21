// src/api/patientApi.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 🔹 Login por email + fecha
export async function getPatientByBirthdateAndEmail({ email, birthDate }) {
  const url = `${BASE_URL}/api/patient/getPatientByBirthdateAndEmai`;

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
export async function registerPatient(formData) {
  const url = `${BASE_URL}/api/patient/register`;

  const payload = {
    patientFirstName: formData.firstName,
    patientLastName: formData.lastName,
    patientGender: formData.gender || "other",
    patientMobilePhone: formData.phone1,
    patientHomePhone: formData.phone2 || null,
    patientWorkPhone: formData.phone3 || null,
    patientEmail: formData.email,
    patientBirthDate: formData.birthDate,
    patientDeceased: false,
    patientAddress: formData.address || "",

    patientMaritalStatus:
      formData.maritalStatus === "single"
        ? "Single"
        : formData.maritalStatus === "married"
        ? "Married"
        : formData.maritalStatus === "divorced"
        ? "Divorced"
        : formData.maritalStatus === "widowed"
        ? "Widowed"
        : "Single",
    patientStatus: "Active",
    patientPMS: "0",
    patientSSN: formData.ssn,
    patientExtensionRace: formData.ethnicGroup || "Other",
    patientEthnicity: "Hispanic",
    patientEmergencyContactPhone: formData.emergencyPhone || "",
    patientComunicationLanguagePreference:
      formData.nativeLanguage?.toLowerCase() || "es",
    patientGeneralPractitioner: "N/A",
    patientGeneralPractitionerExtensionDateLastSeen: "2025-01-01",
    patientReferralResource: "N/A",
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 201 && data.patientId) {
    return {
      ok: true,
      patient: {
        id: data.patientId,
        firstName: data.patientFirstName,
        lastName: data.patientLastName,
        email: data.patientEmail,
        birthDate: data.patientBirthDate,
        pms: data.patientPms,
      },
    };
  }

  if (response.status === 409 && data.message) {
    return {
      ok: false,
      conflict: true,
      message: data.message,
    };
  }

  if (response.status === 400 && data.errors) {
    const validationErrors = [];

    for (const [field, messages] of Object.entries(data.errors)) {
      messages.forEach((msg) => {
        validationErrors.push(`${field}: ${msg}`);
      });
    }

    return {
      ok: false,
      validationErrors,
      message: "Hay errores en los datos enviados.",
    };
  }

  return {
    ok: false,
    conflict: false,
    validationErrors: null,
    message:
      data.message ||
      "Ocurrió un error al registrar el paciente en ModMed o en la base local.",
  };
}
