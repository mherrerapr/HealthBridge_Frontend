import React from "react";

function DoctorStep({ doctors, selectedDoctor, onSelectDoctor, onContinue }) {
  return (
    <div className="step">
      <h2>Elige tu doctor</h2>
      <p className="step-subtitle">
        Selecciona el profesional con el que quieres agendar la cita.
      </p>

      <div className="cards-grid">
        {doctors.map((doc) => {
          const isActive = selectedDoctor && selectedDoctor.id === doc.id;
          const availableCount = doc.slots?.length || 0;

          return (
            <button
              key={doc.id}
              className={
                "doctor-card" + (isActive ? " doctor-card-active" : "")
              }
              onClick={() => onSelectDoctor(doc)}
            >
              <div className="doctor-avatar">
                <img
                  src={doc.photo}
                  alt={doc.name}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/80x80?text=DR";
                  }}
                />
              </div>

              <div className="doctor-info">
                <h3>{doc.name}</h3>
                <p className="doctor-specialty">{doc.specialty}</p>
                <p className="doctor-tag">{doc.tag}</p>
                <p className="doctor-availability">
                  {availableCount} citas disponibles
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="step-actions">
        <button
          className="btn btn-primary"
          onClick={onContinue}
          disabled={!selectedDoctor}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

export default DoctorStep;
