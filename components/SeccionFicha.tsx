"use client";

import { useState, type ReactNode } from "react";

type Props = {
  titulo: string;
  cantidad: number;
  children: ReactNode;
};

// Seccion de la ficha que se puede ocultar o mostrar.
export default function SeccionFicha({ titulo, cantidad, children }: Props) {
  const [abierta, setAbierta] = useState(true);

  return (
    <section className="card h-100 shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center bg-white">
        <h3 className="h6 mb-0">
          {titulo} <span className="badge text-bg-light border">{cantidad}</span>
        </h3>
        <button
          type="button"
          className="btn btn-sm btn-link text-decoration-none"
          aria-expanded={abierta}
          onClick={() => setAbierta(!abierta)}
        >
          {abierta ? "Ocultar" : "Mostrar"}
        </button>
      </div>
      {abierta && (
        <div className="card-body">
          {cantidad === 0 ? (
            <p className="text-body-secondary mb-0">Sin registros.</p>
          ) : (
            children
          )}
        </div>
      )}
    </section>
  );
}
