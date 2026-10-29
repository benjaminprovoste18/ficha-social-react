"use client";

import { useState } from "react";
import BotonAccion from "./BotonAccion";

type Props = {
  etiqueta: string;
  pregunta: string;
  onConfirmar: () => void;
  variante?: string;
  tamano?: "sm" | "lg";
};

// Boton para acciones peligrosas (eliminar, restablecer).
// Al primer click pregunta; recien con "Sí" ejecuta la accion.
export default function BotonConfirmar({ etiqueta, pregunta, onConfirmar, variante = "outline-danger", tamano = "sm" }: Props) {
  const [confirmando, setConfirmando] = useState(false);

  if (!confirmando) {
    return <BotonAccion etiqueta={etiqueta} variante={variante} tamano={tamano} onClick={() => setConfirmando(true)} />;
  }

  return (
    <span className="d-inline-flex align-items-center gap-1 flex-wrap" role="group" aria-label={pregunta}>
      <span className="small text-danger fw-semibold">{pregunta}</span>
      <BotonAccion
        etiqueta="Sí"
        variante="danger"
        tamano={tamano}
        onClick={() => {
          setConfirmando(false);
          onConfirmar();
        }}
      />
      <BotonAccion etiqueta="No" variante="outline-secondary" tamano={tamano} onClick={() => setConfirmando(false)} />
    </span>
  );
}
