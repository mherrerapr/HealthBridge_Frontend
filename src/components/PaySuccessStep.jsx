import React from "react";

function PaySuccessStep({ onFinish }) {
  return (
    <div className="step">
      <h2>✅ Cita confirmada</h2>
      <p className="step-subtitle">
        Tu pago fue procesado correctamente y la cita quedó registrada en el
        sistema.
      </p>

      <div className="success-box">
        <p>
          En la versión final, aquí podrías mostrar el código de confirmación,
          resumen de la cita y botón para agregar al calendario.
        </p>
      </div>

      <div className="step-actions">
        <button className="btn btn-primary" onClick={onFinish}>
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

export default PaySuccessStep;
