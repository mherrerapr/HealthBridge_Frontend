import React from "react";

function StartStep({ doctor, onChooseUser, onChooseRegister, onBack }) {
  return (
    <div className="step">
      <h2>¿Cómo quieres continuar?</h2>
      <p className="step-subtitle">
        Has seleccionado a <b>{doctor?.name}</b> (
        <span>{doctor?.specialty}</span>). 
        Ahora dinos si ya estás registrado o si es tu primera vez.
      </p>

      <div className="summary-card">
        <h3>Doctor seleccionado</h3>
        <p>
          <span>Nombre:</span> <b>{doctor?.name}</b>
        </p>
        <p>
          <span>Especialidad:</span> <b>{doctor?.specialty}</b>
        </p>
        <p>
          <span>Citas disponibles:</span>{" "}
          <b>{doctor?.slots?.length || 0}</b>
        </p>
      </div>

      <div className="grid-2">
        <button className="btn btn-primary" onClick={onChooseUser}>
          Ya estoy registrado
        </button>
        <button className="btn btn-outline" onClick={onChooseRegister}>
          Es mi primera vez
        </button>
      </div>

      <div className="step-actions" style={{ justifyContent: "flex-start" }}>
        <button className="btn btn-ghost" onClick={onBack}>
          Cambiar de doctor
        </button>
      </div>
    </div>
  );
}

export default StartStep;
