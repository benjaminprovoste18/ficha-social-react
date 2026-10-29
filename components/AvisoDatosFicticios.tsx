"use client";

import { useState } from "react";

type Props = {
  mensaje?: string;
};

// Aviso que se puede cerrar. El estado "visible" controla si se muestra.
export default function AvisoDatosFicticios({
  mensaje = "Todos los datos de este sitio son ficticios y se usan solo con fines académicos. No corresponden a personas reales.",
}: Props) {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  return (
    <div className="container mt-3">
      <div className="alert alert-warning alert-dismissible mb-0" role="alert">
        <strong>Importante:</strong> {mensaje}
        <button
          type="button"
          className="btn-close"
          aria-label="Cerrar aviso"
          onClick={() => setVisible(false)}
        ></button>
      </div>
    </div>
  );
}
