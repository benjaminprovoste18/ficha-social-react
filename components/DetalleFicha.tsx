import Link from "next/link";
import type { Ficha } from "@/lib/tipos";
import {
  calcularEdad,
  formatearFecha,
  formatearPesos,
  totalBeneficiosPendientes,
  totalBienes,
  totalDeudasPendientes,
} from "@/lib/fichas";
import BotonAgregarSolicitud from "./BotonAgregarSolicitud";
import EstadoBadge from "./EstadoBadge";
import SeccionFicha from "./SeccionFicha";

type Props = {
  ficha: Ficha;
  volverA?: string; // a donde lleva "Volver al listado"
  permitirSolicitud?: boolean; // en el panel de administracion no se muestran los botones de solicitud
};

// Muestra toda la ficha social de una persona.
// Cada modulo (familia, bienes, deudas, beneficios, documentos) va en su propia seccion.
export default function DetalleFicha({ ficha, volverA = "/fichas", permitirSolicitud = true }: Props) {
  const resumen = [
    { titulo: "Bienes", valor: totalBienes(ficha), color: "text-success" },
    { titulo: "Deudas pendientes", valor: totalDeudasPendientes(ficha), color: "text-danger" },
    { titulo: "Beneficios por cobrar", valor: totalBeneficiosPendientes(ficha), color: "text-primary" },
  ];

  return (
    <article>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
            <div>
              <p className="text-body-secondary small mb-1">Ficha social · RUT {ficha.id}</p>
              <h2 className="h3 mb-2">{ficha.nombre}</h2>
            </div>
            <div className="mb-3 mb-md-0">
              <Link href={volverA} className="btn btn-sm btn-outline-secondary">
                Volver al listado
              </Link>
            </div>
          </div>
          <dl className="row mb-0 small">
            <dt className="col-6 col-md-3">Nacimiento</dt>
            <dd className="col-6 col-md-3">{formatearFecha(ficha.fechaNacimiento)}</dd>
            <dt className="col-6 col-md-3">Defunción</dt>
            <dd className="col-6 col-md-3">{formatearFecha(ficha.fechaDefuncion)}</dd>
            <dt className="col-6 col-md-3">Edad al fallecer</dt>
            <dd className="col-6 col-md-3" id="edad">
              {calcularEdad(ficha.fechaNacimiento, ficha.fechaDefuncion)} años
            </dd>
            <dt className="col-6 col-md-3">Estado civil</dt>
            <dd className="col-6 col-md-3">{ficha.estadoCivil}</dd>
            <dt className="col-6 col-md-3">Comuna</dt>
            <dd className="col-6 col-md-3">{ficha.comuna}</dd>
            <dt className="col-6 col-md-3">Región</dt>
            <dd className="col-6 col-md-3 mb-0">{ficha.region}</dd>
          </dl>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {resumen.map((item) => (
          <div className="col-12 col-md-4" key={item.titulo}>
            <div className="card text-center shadow-sm h-100">
              <div className="card-body">
                <p className="text-body-secondary small mb-1">{item.titulo}</p>
                <p className={"fs-4 fw-bold mb-0 " + item.color}>{formatearPesos(item.valor)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <SeccionFicha titulo="Grupo familiar" cantidad={ficha.familia.length}>
            <ul className="list-group list-group-flush">
              {ficha.familia.map((familiar) => (
                <li className="list-group-item px-0 d-flex justify-content-between" key={familiar.nombre}>
                  <span>{familiar.nombre}</span>
                  <span className="text-body-secondary">{familiar.parentesco}</span>
                </li>
              ))}
            </ul>
          </SeccionFicha>
        </div>

        <div className="col-12 col-lg-6">
          <SeccionFicha titulo="Bienes" cantidad={ficha.bienes.length}>
            <ul className="list-group list-group-flush">
              {ficha.bienes.map((bien) => (
                <li className="list-group-item px-0 d-flex justify-content-between gap-2" key={bien.descripcion}>
                  <span>
                    {bien.tipo}: {bien.descripcion}
                  </span>
                  <span className="text-nowrap">{formatearPesos(bien.avaluo)}</span>
                </li>
              ))}
            </ul>
          </SeccionFicha>
        </div>

        <div className="col-12 col-lg-6">
          <SeccionFicha titulo="Deudas" cantidad={ficha.deudas.length}>
            <ul className="list-group list-group-flush">
              {ficha.deudas.map((deuda) => (
                <li className="list-group-item px-0 d-flex justify-content-between gap-2" key={deuda.institucion}>
                  <span>{deuda.institucion}</span>
                  <span className="text-nowrap">
                    {formatearPesos(deuda.monto)} <EstadoBadge estado={deuda.estado} />
                  </span>
                </li>
              ))}
            </ul>
          </SeccionFicha>
        </div>

        <div className="col-12 col-lg-6">
          <SeccionFicha titulo="Beneficios" cantidad={ficha.beneficios.length}>
            <ul className="list-group list-group-flush">
              {ficha.beneficios.map((beneficio) => (
                <li className="list-group-item px-0" key={beneficio.nombre}>
                  <div className="d-flex justify-content-between gap-2">
                    <span>{beneficio.nombre}</span>
                    <span className="text-nowrap">
                      {formatearPesos(beneficio.monto)} <EstadoBadge estado={beneficio.estado} />
                    </span>
                  </div>
                  {permitirSolicitud && beneficio.estado === "pendiente" && (
                    <div className="text-end mt-1">
                      <BotonAgregarSolicitud
                        item={{ rut: ficha.id, nombreFallecido: ficha.nombre, beneficio: beneficio.nombre, monto: beneficio.monto }}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </SeccionFicha>
        </div>

        <div className="col-12">
          <SeccionFicha titulo="Documentos" cantidad={ficha.documentos.length}>
            <ul className="list-group list-group-flush">
              {ficha.documentos.map((documento) => (
                <li className="list-group-item px-0 d-flex justify-content-between" key={documento.nombre}>
                  <span>{documento.nombre}</span>
                  <EstadoBadge estado={documento.estado} />
                </li>
              ))}
            </ul>
          </SeccionFicha>
        </div>
      </div>
    </article>
  );
}
