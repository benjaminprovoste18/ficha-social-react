"use client";

import Link from "next/link";
import { restablecerDatos } from "@/lib/baseDatos";
import { formatearPesos, tienePendientes, totalBeneficiosPendientes, totalDeudasPendientes } from "@/lib/fichas";
import { useFichas, useSolicitudes } from "@/lib/hooks";
import BotonConfirmar from "../BotonConfirmar";
import TarjetaEstadistica from "./TarjetaEstadistica";

const secciones = [
  { href: "/admin/fichas", titulo: "Fichas", texto: "Crear, editar y eliminar fichas sociales." },
  { href: "/admin/solicitudes", titulo: "Solicitudes", texto: "Revisar, aprobar o rechazar las solicitudes de cobro." },
  { href: "/admin/reportes", titulo: "Reportes", texto: "Totales de deudas y beneficios por región." },
  { href: "/", titulo: "Sitio público", texto: "Ver el sitio tal como lo ven las familias." },
];

// Dashboard: resumen con numeros calculados desde la base de datos
export default function PanelAdmin() {
  const fichas = useFichas();
  const solicitudes = useSolicitudes();

  const enRevision = solicitudes.filter((s) => s.estado === "ingresada").length;
  const conPendientes = fichas.filter(tienePendientes).length;
  const porCobrar = fichas.reduce((suma, f) => suma + totalBeneficiosPendientes(f), 0);
  const deudas = fichas.reduce((suma, f) => suma + totalDeudasPendientes(f), 0);

  return (
    <>
      <div className="row g-3 mb-4" id="estadisticas">
        <div className="col-12 col-sm-6 col-xl-3">
          <TarjetaEstadistica titulo="Fichas" valor={fichas.length} detalle={conPendientes + " con trámites pendientes"} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <TarjetaEstadistica titulo="Solicitudes" valor={solicitudes.length} detalle={enRevision + " en revisión"} color="success" />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <TarjetaEstadistica titulo="Beneficios por cobrar" valor={formatearPesos(porCobrar)} color="info" />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <TarjetaEstadistica titulo="Deudas pendientes" valor={formatearPesos(deudas)} color="warning" />
        </div>
      </div>

      <div className="row g-3 mb-4">
        {secciones.map((seccion) => (
          <div className="col-12 col-sm-6 col-xl-3" key={seccion.href}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h3 className="h6">
                  <Link href={seccion.href} className="stretched-link text-decoration-none">
                    {seccion.titulo}
                  </Link>
                </h3>
                <p className="small text-body-secondary mb-0">{seccion.texto}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-danger-subtle">
        <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
          <div>
            <h3 className="h6 mb-1">Datos de prueba</h3>
            <p className="small text-body-secondary mb-0">
              Borra los cambios guardados en este navegador y vuelve a las 8 fichas iniciales.
            </p>
          </div>
          <BotonConfirmar etiqueta="Restablecer datos" pregunta="¿Borrar todos los cambios?" onConfirmar={restablecerDatos} />
        </div>
      </div>
    </>
  );
}
