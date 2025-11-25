import React, { useState, useEffect } from "react";
import "./App.css";

import {
  getPatientByBirthdateAndEmail,
  registerPatientModMed,
} from "./api/patientApi";

import { getDoctors } from "./api/doctorApi";

import {
  showSuccess,
  showError,
  showWarningChoice,
  showValidationErrors,
} from "./utils/alerts";

import ProgressBar from "./components/ProgressBar";
import StartStep from "./components/StartStep";
import LoginStep from "./components/LoginStep";
import RegisterStep from "./components/RegisterStep";
import DoctorStep from "./components/DoctorStep";
import DateTimeStep from "./components/DateTimeStep";
import StripeStep from "./components/StripeStep";
import PaySuccessStep from "./components/PaySuccessStep";
import PayFailedStep from "./components/PayFailedStep";

/* ------------------------------------------
 * PASOS DEL FLUJO
 * ------------------------------------------ */
export const STEPS = {
  DOCTOR: "doctor",
  START: "start",
  LOGIN: "login",
  REGISTER: "register",
  DATE_TIME: "datetime",
  STRIPE: "stripe",
  PAY_SUCCESS: "pay_success",
  PAY_FAILED: "pay_failed",
};

function App() {
  /* ------------------------------------------
   * ESTADOS PRINCIPALES
   * ------------------------------------------ */
  const [step, setStep] = useState(STEPS.DOCTOR);

  const [doctor, setDoctor] = useState(null);
  const [slot, setSlot] = useState("");

  const [patient, setPatient] = useState(null);

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  const [loginData, setLoginData] = useState({
    email: "",
    birthDate: "",
  });

  // 🔹 ESTE FALTABA
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    phone1: "",
    phone2: "",
    phone3: "",
    email: "",
    birthDate: "",
    address: "",
    maritalStatus: "",
    ssn: "",
    ethnicGroup: "",
    emergencyPhone: "",
    nativeLanguage: "",
  });

  const [stripeCountdown, setStripeCountdown] = useState(300);

  /* ------------------------------------------
   * CARGAR DOCTORES DESDE BACKEND
   * ------------------------------------------ */
  useEffect(() => {
    async function loadDocs() {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (err) {
        console.error(err);
        showError("Error cargando doctores", err.message);
      } finally {
        setLoadingDoctors(false);
      }
    }

    loadDocs();
  }, []);

  /* ------------------------------------------
   * CONTADOR DEL PAGO
   * ------------------------------------------ */
  useEffect(() => {
    if (step !== STEPS.STRIPE) return;

    setStripeCountdown(300);

    const interval = setInterval(() => {
      setStripeCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setStep(STEPS.PAY_FAILED);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  const formatSeconds = (s) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  /* ------------------------------------------
   * VALIDACIONES
   * ------------------------------------------ */
  const canLoginContinue =
    loginData.email.trim() !== "" && loginData.birthDate.trim() !== "";

  const canRegisterContinue =
    registerData.firstName.trim() !== "" &&
    registerData.lastName.trim() !== "" &&
    registerData.email.trim() !== "" &&
    registerData.birthDate.trim() !== "" &&
    registerData.ssn.trim() !== "";

  /* ------------------------------------------
   * RESET DEL FLUJO
   * ------------------------------------------ */
  const resetFlow = () => {
    setStep(STEPS.DOCTOR);
    setLoginData({ email: "", birthDate: "" });
    setRegisterData({
      firstName: "",
      lastName: "",
      gender: "",
      phone1: "",
      phone2: "",
      phone3: "",
      email: "",
      birthDate: "",
      address: "",
      maritalStatus: "",
      ssn: "",
      ethnicGroup: "",
      emergencyPhone: "",
      nativeLanguage: "",
    });
    setDoctor(null);
    setSlot("");
    setPatient(null);
  };

  return (
    <div className="app-root">
      <div className="app-bg" />
      <main className="app-main">
        <header className="app-header">
          <div className="brand">
            <span className="brand-pill">MVP</span>
            <h1>Agenda tu cita</h1>
          </div>
          <p className="brand-subtitle">Flujo demo conectado al backend 🚀</p>
        </header>

        <ProgressBar step={step} />

        <section className="card">
          {/* ------------------------------- DOCTORES ------------------------------- */}
          {step === STEPS.DOCTOR && (
            <>
              {loadingDoctors ? (
                <p style={{ textAlign: "center", color: "#999" }}>
                  Cargando doctores...
                </p>
              ) : (
                <DoctorStep
                  doctors={doctors}
                  selectedDoctor={doctor}
                  onSelectDoctor={setDoctor}
                  onContinue={() => {
                    if (!doctor) return;
                    setStep(STEPS.START);
                  }}
                />
              )}
            </>
          )}

          {/* ------------------------------- START ------------------------------- */}
          {step === STEPS.START && (
            <StartStep
              doctor={doctor}
              onChooseUser={() => setStep(STEPS.LOGIN)}
              onChooseRegister={() => setStep(STEPS.REGISTER)}
              onBack={() => {
                setDoctor(null);
                setStep(STEPS.DOCTOR);
              }}
            />
          )}

          {/* ------------------------------- LOGIN ------------------------------- */}
          {step === STEPS.LOGIN && (
            <LoginStep
              loginData={loginData}
              onChange={setLoginData}
              onBack={() => setStep(STEPS.START)}
              disabled={!canLoginContinue}
              onContinue={async () => {
                if (!canLoginContinue) return;

                try {
                  const result = await getPatientByBirthdateAndEmail(loginData);

                  if (result.ok) {
                    setPatient(result.patient);

                    await showSuccess(
                      "Paciente encontrado",
                      `Bienvenido ${result.patient.firstName} ${result.patient.lastName}`
                    );

                    setStep(STEPS.DATE_TIME);
                  } else if (result.notRegistered) {
                    const swalResult = await showWarningChoice({
                      title: "Paciente no registrado",
                      text: result.message,
                      confirmText: "Ir a registro",
                      denyText: "Volver a intentar",
                    });

                    if (swalResult.isConfirmed) {
                      setStep(STEPS.REGISTER);
                    }
                  } else {
                    await showError("Error", result.message);
                  }
                } catch (error) {
                  await showError(
                    "Error de conexión",
                    "No fue posible conectar con el servidor."
                  );
                }
              }}
            />
          )}

          {/* ------------------------------- REGISTRO ------------------------------- */}
          {step === STEPS.REGISTER && (
            <RegisterStep
              data={registerData}
              onChange={setRegisterData}
              onBack={() => setStep(STEPS.START)}
              disabled={!canRegisterContinue}
              onContinue={async () => {
                if (!canRegisterContinue) return;

                // 🔹 AQUÍ ARMAMOS EL PAYLOAD CON registerData
                const payload = {
                  patientFirstName: registerData.firstName,
                  patientLastName: registerData.lastName,
                  patientGender: registerData.gender || "unknown",
                  patientBirthDate: registerData.birthDate,
                  patientEmail: registerData.email,
                  patientMobilePhone: registerData.phone1 || "",
                  patientHomePhone: registerData.phone2 || "",
                  patientAddress: registerData.address || "",
                  patientCity: "Miami",
                  patientState: "FL",
                  patientCountry: "United States of America",
                  patientPostalCode: "33132",
                  patientMaritalStatus: registerData.maritalStatus || "Single",
                  patientPMS: "0",
                  patientSSN: registerData.ssn,
                };

                try {
                  const result = await registerPatientModMed(payload);

                  if (result.ok) {
                    setPatient(result.patient);

                    await showSuccess(
                      "Paciente registrado",
                      `Se creó ${result.patient.firstName} ${result.patient.lastName}`
                    );

                    setStep(STEPS.DATE_TIME);
                    return;
                  }

                  if (result.conflict) {
                    const swalResult = await showWarningChoice({
                      title: "Paciente ya existe",
                      text: result.message,
                      confirmText: "Ir a login",
                      denyText: "Cerrar",
                    });

                    if (swalResult.isConfirmed) {
                      setStep(STEPS.LOGIN);
                    }
                    return;
                  }

                  if (result.validationErrors) {
                    await showValidationErrors(result.validationErrors);
                    return;
                  }

                  await showError("Error al registrar", result.message);
                } catch (error) {
                  await showError(
                    "Error de conexión",
                    "No fue posible conectar con el backend."
                  );
                }
              }}
            />
          )}

          {/* ------------------------------- FECHA Y HORA ------------------------------- */}
          {step === STEPS.DATE_TIME && (
            <DateTimeStep
              doctor={doctor}
              slots={doctor?.slots || []}
              selectedSlot={slot}
              onSelectSlot={setSlot}
              onBack={() => setStep(STEPS.START)}
              onContinue={() => {
                if (!slot) return;
                setStep(STEPS.STRIPE);
              }}
            />
          )}

          {/* ------------------------------- STRIPE ------------------------------- */}
          {step === STEPS.STRIPE && (
            <StripeStep
              doctor={doctor}
              slot={slot}
              countdown={formatSeconds(stripeCountdown)}
              onBack={() => setStep(STEPS.DATE_TIME)}
              onSuccess={() => setStep(STEPS.PAY_SUCCESS)}
              onFail={() => setStep(STEPS.PAY_FAILED)}
            />
          )}

          {/* ------------------------------- PAGO ÉXITO ------------------------------- */}
          {step === STEPS.PAY_SUCCESS && (
            <PaySuccessStep onFinish={resetFlow} />
          )}

          {/* ------------------------------- PAGO FALLIDO ------------------------------- */}
          {step === STEPS.PAY_FAILED && (
            <PayFailedStep
              onRetry={() => setStep(STEPS.STRIPE)}
              onExit={resetFlow}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
