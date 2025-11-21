import React from "react";

function PayFailedStep({ onRetry, onExit }) {
  return (
    <div className="step">
      <h2>❌ Pago no procesado</h2>
      <p className="step-subtitle">
        No se pudo completar el pago. Puedes intentarlo nuevamente o salir de
        la aplicación.
      </p>

      <div className="warning-box">
        <p>
          En la versión real deberías mostrar el mensaje de error que Stripe
          devolvió y ofrecer alternativas (otro método de pago, soporte, etc.).
        </p>
      </div>

      <div className="step-actions">
        <button className="btn btn-outline" onClick={onRetry}>
          Reintentar pago
        </button>
        <button className="btn btn-ghost" onClick={onExit}>
          Salir al inicio
        </button>
      </div>
    </div>
  );
}

export default PayFailedStep;
