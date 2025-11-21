import React from "react";

function SpecialtyStep({ specialties, selected, onSelect, onBack, onContinue }) {
  return (
    <div className="step">
      <h2>Elige la especialidad</h2>
      <p className="step-subtitle">
        ¿Con qué tipo de especialista necesitas tu cita?
      </p>

      <div className="cards-grid">
        {specialties.map((sp) => (
          <button
            key={sp}
            className={
              "chip-card" + (selected === sp ? " chip-card-active" : "")
            }
            onClick={() => onSelect(sp)}
          >
            <span>{sp}</span>
          </button>
        ))}
      </div>

      <div className="step-actions">
        <button className="btn btn-ghost" onClick={onBack}>
          Volver
        </button>
        <button
          className="btn btn-primary"
          onClick={onContinue}
          disabled={!selected}
        >
          Elegir doctor
        </button>
      </div>
    </div>
  );
}

export default SpecialtyStep;
