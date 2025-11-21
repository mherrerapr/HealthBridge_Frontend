import React from "react";

function LoginStep({ loginData, onChange, onBack, onContinue, disabled }) {
  return (
    <div className="step">
      <h2>Validar usuario</h2>
      <p className="step-subtitle">
        Ingresa tu correo y tu fecha de nacimiento para verificar si ya estás
        registrado.
      </p>

      <div className="form-grid">
        <label>
          Email *
          <input
            type="email"
            value={loginData.email}
            onChange={(e) =>
              onChange({ ...loginData, email: e.target.value })
            }
            placeholder="tucorreo@ejemplo.com"
          />
        </label>

        <label>
          Fecha de nacimiento *
          <input
            type="date"
            value={loginData.birthDate}
            onChange={(e) =>
              onChange({ ...loginData, birthDate: e.target.value })
            }
          />
        </label>
      </div>

      <div className="step-actions">
        <button className="btn btn-ghost" onClick={onBack}>
          Volver
        </button>
        <button
          className="btn btn-primary"
          onClick={onContinue}
          disabled={disabled}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

export default LoginStep;
