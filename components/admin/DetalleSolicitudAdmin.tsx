"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cambiarEstadoSolicitud, eliminarSolicitud } from "@/lib/baseDatos";
import { useSolicitud } from "@/lib/hooks";
import BotonAccion from "../BotonAccion";
import BotonConfirmar from "../BotonConfirmar";
import Campo from "../Campo";
import ResumenSolicitud from "../ResumenSolicitud";

type Props = {
  id: string;
};

// Detalle de una solicitud para el administrador: aprobar, rechazar o eliminar
export default function DetalleSolicitudAdmin({ id }: Props) {
  const router = useRouter();
  const solicitud = useSolicitud(id);
  const [motivo, setMotivo] = useState("");
  const [error, setError] = useState("");

  if (!solicitud) {
    return (
      <div className="alert alert-warning">
        No existe la solicitud {id}. <Link href="/admin/solicitudes">Volver a solicitudes</Link>
      </div>
    );
  }

  function rechazar() {
    if (motivo.trim() === "") {
      setError("Escribe el motivo del rechazo.");
      return;
    }
    setError("");
    cambiarEstadoSolicitud(id, "rechazada", motivo.trim());
  }

  function eliminar() {
    eliminarSolicitud(id);
    router.push("/admin/solicitudes");
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <ResumenSolicitud solicitud={solicitud} />

        {solicitud.motivo && (
          <div className="alert alert-danger mt-3 mb-0">
            <strong>Motivo del rechazo:</strong> {solicitud.motivo}
          </div>
        )}

        {solicitud.estado === "ingresada" && (
          <div className="border rounded-3 p-3 mt-3" id="revision">
            <h3 className="h6">Revisar solicitud</h3>
            <p className="small text-body-secondary">
              Al aprobarla, los beneficios quedan como cobrados. Al rechazarla, vuelven a quedar pendientes.
            </p>
            <div className="row g-2 align-items-end">
              <div className="col-12 col-md-6">
                <Campo id="motivo" etiqueta="Motivo (solo si se rechaza)" valor={motivo} error={error} onCambio={setMotivo} />
              </div>
              <div className="col-12 col-md-6 d-flex gap-2 justify-content-md-end">
                <BotonAccion etiqueta="Aprobar" variante="success" onClick={() => cambiarEstadoSolicitud(id, "aprobada")} />
                <BotonAccion etiqueta="Rechazar" variante="danger" onClick={rechazar} />
              </div>
            </div>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mt-4">
          <Link href="/admin/solicitudes" className="btn btn-outline-secondary btn-sm">
            Volver
          </Link>
          <BotonConfirmar etiqueta="Eliminar solicitud" pregunta="¿Eliminar?" onConfirmar={eliminar} />
        </div>
      </div>
    </div>
  );
}
