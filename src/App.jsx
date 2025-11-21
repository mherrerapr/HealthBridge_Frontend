import React, { useState, useEffect } from "react";
import "./App.css";

import {
  getPatientByBirthdateAndEmail,
  registerPatient,
} from "./api/patientApi";

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

/* ------------------------------------------
 * DOCTORES MOCK PARA EL MVP
 * ------------------------------------------ */
export const mockDoctors = [
  {
    id: 1,
    name: "Dr. Juan Pérez",
    specialty: "Medicina General",
    tag: "Telemedicina · 4.8 ★",
    photo:
      "https://staticnew-prod.topdoctors.es/provider/1087590/image/profile/large/prof__20240410153153.png",
    slots: ["2025-11-18 09:00", "2025-11-18 10:30", "2025-11-18 14:00"],
  },
  {
    id: 2,
    name: "Dra. Ana Gómez",
    specialty: "Medicina General",
    tag: "Atención en clínica · 4.9 ★",
    photo:
      "https://staticnew-prod.topdoctors.es/provider/1087590/image/profile/large/prof__20240410153153.png",
    slots: ["2025-11-19 08:00", "2025-11-19 15:30"],
  },
  {
    id: 3,
    name: "Dr. Carlos Ruiz",
    specialty: "Cardiología",
    tag: "Cardiólogo · 4.7 ★",
    photo:
      "https://staticnew-prod.topdoctors.es/provider/1087590/image/profile/large/prof__20240410153153.png",
    slots: ["2025-11-20 09:00", "2025-11-20 11:00"],
  },
  {
    id: 4,
    name: "Dra. Laura Torres",
    specialty: "Pediatría",
    tag: "Pediatra · 5.0 ★",
    photo:
      "https://staticnew-prod.topdoctors.es/provider/1087590/image/profile/large/prof__20240410153153.png",
    slots: ["2025-11-21 08:30", "2025-11-21 10:00"],
  },
];

function App() {
  /* ------------------------------------------
   * ESTADOS PRINCIPALES
   * ------------------------------------------ */
  const [step, setStep] = useState(STEPS.DOCTOR);

  const [doctor, setDoctor] = useState(null);
  const [slot, setSlot] = useState("");

  const [patient, setPatient] = useState(null);

  const [loginData, setLoginData] = useState({
    email: "",
    birthDate: "",
  });

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
   * REINICIO COMPLETO DEL FLUJO
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
          {/* -------------------------------------------------------
           * 1) SELECCIÓN DE DOCTOR
           * ------------------------------------------------------- */}
          {step === STEPS.DOCTOR && (
            <DoctorStep
              doctors={mockDoctors}
              selectedDoctor={doctor}
              onSelectDoctor={setDoctor}
              onContinue={() => {
                if (!doctor) return;
                setStep(STEPS.START);
              }}
            />
          )}

          {/* -------------------------------------------------------
           * 2) PREGUNTAR SI ES USUARIO O SE REGISTRA
           * ------------------------------------------------------- */}
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

          {/* -------------------------------------------------------
           * 3) LOGIN – VALIDAR PACIENTE
           * ------------------------------------------------------- */}
          {step === STEPS.LOGIN && (
            <LoginStep
              loginData={loginData}
              onChange={setLoginData}
              onBack={() => setStep(STEPS.START)}
              disabled={!canLoginContinue}
              onContinue={async () => {
                if (!canLoginContinue) return;

                try {
                  const result = await getPatientByBirthdateAndEmail({
                    email: loginData.email,
                    birthDate: loginData.birthDate,
                  });

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
                    await showError(
                      "Error",
                      result.message ||
                        "Ocurrió un error al validar el paciente."
                    );
                  }
                } catch (error) {
                  console.error(error);
                  await showError(
                    "Error de conexión",
                    "No fue posible conectar con el backend."
                  );
                }
              }}
            />
          )}

          {/* -------------------------------------------------------
           * 4) REGISTRO DE PACIENTE
           * ------------------------------------------------------- */}
          {step === STEPS.REGISTER && (
            <RegisterStep
              data={registerData}
              onChange={setRegisterData}
              onBack={() => setStep(STEPS.START)}
              disabled={!canRegisterContinue}
              onContinue={async () => {
                if (!canRegisterContinue) return;

                try {
                  const result = await registerPatient(registerData);

                  if (result.ok) {
                    setPatient(result.patient);

                    await showSuccess(
                      "Paciente registrado",
                      `Se creó ${result.patient.firstName} ${result.patient.lastName} (PMS: ${result.patient.pms})`
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

                  if (
                    result.validationErrors &&
                    result.validationErrors.length > 0
                  ) {
                    await showValidationErrors(result.validationErrors);
                    return;
                  }

                  await showError(
                    "Error al registrar",
                    result.message ||
                      "Ocurrió un error al registrar el paciente."
                  );
                } catch (error) {
                  console.error(error);
                  await showError(
                    "Error de conexión",
                    "No fue posible conectar con el backend."
                  );
                }
              }}
            />
          )}

          {/* -------------------------------------------------------
           * 5) FECHA Y HORA (slots del doctor)
           * ------------------------------------------------------- */}
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

          {/* -------------------------------------------------------
           * 6) PAGO
           * ------------------------------------------------------- */}
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

          {/* -------------------------------------------------------
           * 7) RESULTADOS DEL PAGO
           * ------------------------------------------------------- */}
          {step === STEPS.PAY_SUCCESS && (
            <PaySuccessStep onFinish={resetFlow} />
          )}

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
