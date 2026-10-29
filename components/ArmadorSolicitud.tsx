"use client";

import Link from "next/link";
import { quitarDeSeleccion, vaciarSeleccion } from "@/lib/baseDatos";
import { formatearPesos } from "@/lib/fichas";
import { useFichas, useSeleccion } from "@/lib/hooks";
import BotonAccion from "./BotonAccion";
import BotonAgregarSolicitud from "./BotonAgregarSolicitud";
import TablaSeleccion from "./TablaSeleccion";

// Vista "Mi solicitud" (como el carrito de la tienda):
// a la izquierda los beneficios que se pueden pedir, a la derecha los elegidos.
export default function ArmadorSolicitud() {
  const fichas = useFichas();
  const seleccion = useSeleccion();

  const disponibles = fichas.flatMap((ficha) =>
    ficha.beneficios
      .filter((b) => b.estado === "pendiente")
      .map((b) => ({ rut: ficha.id, nombreFallecido: ficha.nombre, beneficio: b.nombre, monto: b.monto }))
  );

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-6">
        <h3 className="h5">Beneficios pendientes de cobro</h3>
        {disponibles.length === 0 ? (
          <div className="alert alert-info">No quedan beneficios pendientes.</div>
        ) : (
          <div className="row g-2" id="beneficios-disponibles">
            {disponibles.map((item) => (
              <div className="col-12 col-sm-6" key={item.rut + item.beneficio}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <p className="fw-semibold mb-0">{item.beneficio}</p>
                    <p className="small text-body-secondary mb-1">{item.nombreFallecido}</p>
                    <p className="fs-5 fw-bold text-primary mb-2">{formatearPesos(item.monto)}</p>
                    <div className="mt-auto">
                      <BotonAgregarSolicitud item={item} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="col-12 col-lg-6">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="h5">Mi solicitud de cobro</h3>
            <TablaSeleccion items={seleccion} onQuitar={(item) => quitarDeSeleccion(item.rut, item.beneficio)} />
            <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 mt-3">
              <BotonAccion
                etiqueta="Limpiar"
                variante="outline-secondary"
                deshabilitado={seleccion.length === 0}
                onClick={vaciarSeleccion}
              />
              {seleccion.length > 0 ? (
                <Link href="/solicitud/datos" className="btn btn-success">
                  Continuar con mis datos
                </Link>
              ) : (
                <BotonAccion etiqueta="Continuar con mis datos" variante="success" deshabilitado />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
