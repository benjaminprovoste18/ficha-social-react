import Link from "next/link";
import type { Ficha } from "@/lib/tipos";
import { formatearPesos } from "@/lib/fichas";
import BotonAgregarSolicitud from "./BotonAgregarSolicitud";
import EstadoBadge from "./EstadoBadge";

type Props = {
  fichas: Ficha[];
};

// Junta los beneficios que todavia no se cobran (como la vista de ofertas).
// Los pendientes se pueden agregar a la solicitud; los solicitados ya estan en revision.
export default function TablaBeneficiosPendientes({ fichas }: Props) {
  const filas = fichas.flatMap((ficha) =>
    ficha.beneficios
      .filter((beneficio) => beneficio.estado !== "cobrado")
      .map((beneficio) => ({ ficha, beneficio }))
  );

  if (filas.length === 0) {
    return <div className="alert alert-info">No hay beneficios pendientes de cobro.</div>;
  }

  const total = filas.reduce((suma, fila) => suma + fila.beneficio.monto, 0);

  return (
    <div className="table-responsive">
      <table className="table table-striped align-middle bg-white mb-0">
        <thead className="table-light">
          <tr>
            <th scope="col">Persona</th>
            <th scope="col">Beneficio</th>
            <th scope="col" className="text-end">Monto</th>
            <th scope="col"><span className="visually-hidden">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {filas.map(({ ficha, beneficio }) => (
            <tr key={ficha.id + beneficio.nombre}>
              <td>
                <Link href={"/fichas/" + ficha.id}>{ficha.nombre}</Link>
              </td>
              <td>{beneficio.nombre}</td>
              <td className="text-end text-nowrap">{formatearPesos(beneficio.monto)}</td>
              <td className="text-end">
                {beneficio.estado === "pendiente" ? (
                  <BotonAgregarSolicitud
                    item={{ rut: ficha.id, nombreFallecido: ficha.nombre, beneficio: beneficio.nombre, monto: beneficio.monto }}
                  />
                ) : (
                  <EstadoBadge estado={beneficio.estado} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" colSpan={2}>Total por cobrar</th>
            <td className="text-end fw-bold text-nowrap" id="total-beneficios">
              {formatearPesos(total)}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
