"use client";

import Link from "next/link";
import { useState } from "react";
import { formatearFechaHora, formatearPesos } from "@/lib/fichas";
import { useSolicitudes } from "@/lib/hooks";
import Campo from "../Campo";
import EstadoBadge from "../EstadoBadge";

const ESTADOS = ["ingresada", "aprobada", "rechazada"];

// Listado de solicitudes (como las ordenes/boletas de la tienda), con filtro por estado
export default function TablaSolicitudes() {
  const solicitudes = useSolicitudes();
  const [estado, setEstado] = useState("");

  // las mas nuevas primero
  const filtradas = solicitudes
    .filter((s) => estado === "" || s.estado === estado)
    .slice()
    .reverse();

  return (
    <>
      <div className="row mb-3">
        <div className="col-12 col-sm-6 col-md-4">
          <Campo id="filtro-estado" etiqueta="Filtrar por estado" opciones={ESTADOS} valor={estado} onCambio={setEstado} />
        </div>
      </div>
      {filtradas.length === 0 ? (
        <div className="alert alert-info">
          {solicitudes.length === 0
            ? "Todavía no hay solicitudes. Se crean desde el sitio público, en Beneficios."
            : "No hay solicitudes con ese estado."}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle bg-white mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">N°</th>
                <th scope="col" className="d-none d-md-table-cell">Fecha</th>
                <th scope="col">Solicitante</th>
                <th scope="col" className="text-end d-none d-sm-table-cell">Total</th>
                <th scope="col">Estado</th>
                <th scope="col"><span className="visually-hidden">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((s) => (
                <tr key={s.id}>
                  <td className="text-nowrap">{s.id}</td>
                  <td className="d-none d-md-table-cell text-nowrap">{formatearFechaHora(s.fecha)}</td>
                  <td>
                    {s.solicitante.nombres} {s.solicitante.apellidos}
                  </td>
                  <td className="text-end text-nowrap d-none d-sm-table-cell">{formatearPesos(s.total)}</td>
                  <td>
                    <EstadoBadge estado={s.estado} />
                  </td>
                  <td className="text-end">
                    <Link href={"/admin/solicitudes/" + s.id} className="btn btn-sm btn-outline-primary">
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
