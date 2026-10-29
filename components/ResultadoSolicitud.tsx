"use client";

import Link from "next/link";
import { useSolicitud } from "@/lib/hooks";
import ResumenSolicitud from "./ResumenSolicitud";

type Props = {
  id: string;
  tipo: "exitosa" | "rechazada";
};

// Pantalla final del flujo: solicitud ingresada (como "pago correcto")
// o rechazada (como "no se pudo realizar el pago").
export default function ResultadoSolicitud({ id, tipo }: Props) {
  const solicitud = useSolicitud(id);

  if (!solicitud) {
    return (
      <div className="alert alert-warning">
        No encontramos la solicitud {id}. <Link href="/solicitud">Ir a mi solicitud</Link>
      </div>
    );
  }

  const exitosa = tipo === "exitosa";

  return (
    <div className="card shadow-sm mx-auto" style={{ maxWidth: 820 }}>
      <div className="card-body p-4">
        <div className={"alert " + (exitosa ? "alert-success" : "alert-danger")} role="status" id="resultado">
          <h2 className="h4 alert-heading mb-1">
            {exitosa ? "Solicitud ingresada" : "No se pudo ingresar la solicitud"} N° {solicitud.id}
          </h2>
          <p className="mb-0">
            {exitosa
              ? "Tu solicitud quedó en revisión. Te avisaremos por correo cuando sea aprobada."
              : solicitud.motivo}
          </p>
        </div>

        {!exitosa && (
          <div className="text-center mb-3">
            <Link href="/solicitud/datos" className="btn btn-success">
              Volver a intentar
            </Link>
          </div>
        )}

        <ResumenSolicitud solicitud={solicitud} />

        <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 mt-4">
          <Link href="/" className="btn btn-outline-primary">
            Volver al inicio
          </Link>
          <Link href="/beneficios" className="btn btn-outline-secondary">
            Ver beneficios
          </Link>
        </div>
      </div>
    </div>
  );
}
