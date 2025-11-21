import React from "react";

function ProgressBar({ step }) {
  const order = [
    "doctor",
    "start",
    "login",
    "register",
    "datetime",
    "stripe",
    "pay_success",
  ];

  const current = step === "pay_failed" ? "stripe" : step;
  const activeIndex = Math.max(order.indexOf(current), 0);
  const percent = (activeIndex / (order.length - 1)) * 100;

  return (
    <div className="progress-wrapper">
      <div className="progress-track">
        <div className="progress-bar" style={{ width: `${percent}%` }} />
      </div>
      <div className="progress-labels">
        <span>Doctor</span>
        <span>Usuario</span>
        <span>Login</span>
        <span>Registro</span>
        <span>Fecha</span>
        <span>Pago</span>
        <span>Confirmación</span>
      </div>
    </div>
  );
}

export default ProgressBar;
