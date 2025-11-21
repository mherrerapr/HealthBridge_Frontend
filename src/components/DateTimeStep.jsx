import React from "react";

function DateTimeStep({ doctor, slots, selectedSlot, onSelectSlot, onBack, onContinue }) {
  return (
    <div className="step">
      <h2>Elige fecha y hora</h2>
      <p className="step-subtitle">
        Horarios disponibles para <b>{doctor?.name}</b> (
        <span>{doctor?.specialty}</span>).
      </p>

      <div className="cards-grid">
        {slots.length === 0 && (
          <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
            Este doctor no tiene citas disponibles en este momento.
          </p>
        )}

        {slots.map((s) => (
          <button
            key={s}
            className={
              "slot-card" + (selectedSlot === s ? " slot-card-active" : "")
            }
            onClick={() => onSelectSlot(s)}
          >
            <span className="slot-date">{s.split(" ")[0]}</span>
            <span className="slot-time">{s.split(" ")[1]} hrs</span>
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
          disabled={!selectedSlot}
        >
          Ir a pago
        </button>
      </div>
    </div>
  );
}

export default DateTimeStep;
