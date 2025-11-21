import React from "react";

function StripeStep({ doctor, slot, countdown, onBack, onSuccess, onFail }) {
  return (
    <div className="step">
      <h2>Pago en Stripe</h2>
      <p className="step-subtitle">
        Serás redirigido a la pasarela de pago. Dispones de{" "}
        <b>máximo 5 minutos</b> para completar el pago.
      </p>

      <div className="summary-card">
        <h3>Resumen de cita</h3>
        <p>
          <span>Doctor:</span> <b>{doctor?.name}</b>
        </p>
        <p>
          <span>Horario:</span> <b>{slot}</b>
        </p>
        <p>
          <span>Tiempo restante simulado:</span> <b>{countdown}</b>
        </p>
      </div>

      <p className="stripe-note">
        ⚠️ En la versión real, aquí se haría el redirect a Stripe.
        <br />
        Para esta demo, usa los botones de abajo para simular el resultado del
        pago.
      </p>

      <div className="step-actions stripe-actions">
        <button className="btn btn-ghost" onClick={onBack}>
          Volver
        </button>
        <button className="btn btn-outline" onClick={onFail}>
          Simular pago fallido
        </button>
        <button className="btn btn-primary" onClick={onSuccess}>
          Simular pago exitoso
        </button>
      </div>
    </div>
  );
}

export default StripeStep;
