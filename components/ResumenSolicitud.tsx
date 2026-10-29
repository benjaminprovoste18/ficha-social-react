import type { Solicitud } from "@/lib/tipos";
import { formatearFechaHora } from "@/lib/fichas";
import EstadoBadge from "./EstadoBadge";
import TablaSeleccion from "./TablaSeleccion";

type Props = {
  solicitud: Solicitud;
};

// Resumen de una solicitud ya enviada (como la boleta de una compra).
export default function ResumenSolicitud({ solicitud }: Props) {
  const { solicitante, direccion } = solicitud;

  return (
    <div>
      <dl className="row small mb-3">
        <dt className="col-5 col-md-3">N° de solicitud</dt>
        <dd className="col-7 col-md-3">{solicitud.id}</dd>
        <dt className="col-5 col-md-3">Fecha</dt>
        <dd className="col-7 col-md-3">{formatearFechaHora(solicitud.fecha)}</dd>
        <dt className="col-5 col-md-3">Estado</dt>
        <dd className="col-7 col-md-3"><EstadoBadge estado={solicitud.estado} /></dd>
        <dt className="col-5 col-md-3">Solicitante</dt>
        <dd className="col-7 col-md-3">{solicitante.nombres} {solicitante.apellidos}</dd>
        <dt className="col-5 col-md-3">RUT</dt>
        <dd className="col-7 col-md-3">{solicitante.rut}</dd>
        <dt className="col-5 col-md-3">Parentesco</dt>
        <dd className="col-7 col-md-3">{solicitante.parentesco}</dd>
        <dt className="col-5 col-md-3">Correo</dt>
        <dd className="col-7 col-md-3 text-break">{solicitante.correo}</dd>
        <dt className="col-5 col-md-3">Dirección</dt>
        <dd className="col-7 col-md-3">
          {direccion.calle}
          {direccion.depto && ", depto " + direccion.depto}, {direccion.comuna}, {direccion.region}
        </dd>
        {direccion.indicaciones && (
          <>
            <dt className="col-5 col-md-3">Indicaciones</dt>
            <dd className="col-7 col-md-9">{direccion.indicaciones}</dd>
          </>
        )}
      </dl>
      <TablaSeleccion items={solicitud.items} />
    </div>
  );
}
