import React from "react";

function RegisterStep({ data, onChange, onBack, onContinue, disabled }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="step">
      <h2>Registro de paciente</h2>
      <p className="step-subtitle">
        Completa los datos requeridos para crear tu perfil. Los campos con * son
        obligatorios.
      </p>

      <div className="form-grid">
        <label>
          First Name *
          <input
            value={data.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            placeholder="Marlon"
          />
        </label>

        <label>
          Last Name *
          <input
            value={data.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            placeholder="Herrera"
          />
        </label>

        <label>
          Género
          <select
            value={data.gender}
            onChange={(e) => update("gender", e.target.value)}
          >
            <option value="">Selecciona</option>
            <option value="female">Femenino</option>
            <option value="male">Masculino</option>
            <option value="other">Otro / Prefiero no decir</option>
          </select>
        </label>

        <label>
          Email personal *
          <input
            type="email"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="tucorreo@ejemplo.com"
          />
        </label>

        <label>
          Fecha de nacimiento *
          <input
            type="date"
            value={data.birthDate}
            onChange={(e) => update("birthDate", e.target.value)}
          />
        </label>

        <label>
          Número de SSN *
          <input
            value={data.ssn}
            onChange={(e) => update("ssn", e.target.value)}
            placeholder="###-##-####"
          />
        </label>

        <label>
          Teléfono personal 1
          <input
            value={data.phone1}
            onChange={(e) => update("phone1", e.target.value)}
            placeholder="+1 555 123 4567"
          />
        </label>

        <label>
          Teléfono personal 2
          <input
            value={data.phone2}
            onChange={(e) => update("phone2", e.target.value)}
          />
        </label>

        <label>
          Teléfono personal 3
          <input
            value={data.phone3}
            onChange={(e) => update("phone3", e.target.value)}
          />
        </label>

        <label className="full-row">
          Dirección domiciliaria
          <input
            value={data.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="Calle 123 #45-67, Ciudad"
          />
        </label>

        <label>
          Estado marital
          <select
            value={data.maritalStatus}
            onChange={(e) => update("maritalStatus", e.target.value)}
          >
            <option value="">Selecciona</option>
            <option value="single">Soltero(a)</option>
            <option value="married">Casado(a)</option>
            <option value="divorced">Divorciado(a)</option>
            <option value="widowed">Viudo(a)</option>
          </select>
        </label>

        <label>
          Grupo étnico
          <input
            value={data.ethnicGroup}
            onChange={(e) => update("ethnicGroup", e.target.value)}
            placeholder="Ej: Latino, Afrodescendiente, etc."
          />
        </label>

        <label>
          Teléfono contacto de emergencia
          <input
            value={data.emergencyPhone}
            onChange={(e) => update("emergencyPhone", e.target.value)}
            placeholder="+1 555 987 6543"
          />
        </label>

        <label>
          Idioma nativo
          <input
            value={data.nativeLanguage}
            onChange={(e) => update("nativeLanguage", e.target.value)}
            placeholder="Español, Inglés, etc."
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
          Crear cuenta y continuar
        </button>
      </div>
    </div>
  );
}

export default RegisterStep;
