import type { ItemSolicitud } from "@/lib/tipos";
import { formatearPesos } from "@/lib/fichas";
import BotonAccion from "./BotonAccion";

type Props = {
  items: ItemSolicitud[];
  onQuitar?: (item: ItemSolicitud) => void; // si no viene, la tabla es solo de lectura
  mensajeVacio?: string;
};

// Lista de beneficios de una solicitud con su total (como la tabla del carrito).
export default function TablaSeleccion({ items, onQuitar, mensajeVacio = "Todavía no agregas beneficios." }: Props) {
  if (items.length === 0) {
    return <div className="alert alert-light border mb-0">{mensajeVacio}</div>;
  }

  const total = items.reduce((suma, item) => suma + item.monto, 0);

  return (
    <div className="table-responsive">
      <table className="table align-middle bg-white mb-0">
        <thead className="table-light">
          <tr>
            <th scope="col">Beneficio</th>
            <th scope="col" className="d-none d-sm-table-cell">Persona</th>
            <th scope="col" className="text-end">Monto</th>
            {onQuitar && <th scope="col"><span className="visually-hidden">Acciones</span></th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.rut + item.beneficio}>
              <td>
                {item.beneficio}
                <div className="small text-body-secondary d-sm-none">{item.nombreFallecido}</div>
              </td>
              <td className="d-none d-sm-table-cell">{item.nombreFallecido}</td>
              <td className="text-end text-nowrap">{formatearPesos(item.monto)}</td>
              {onQuitar && (
                <td className="text-end">
                  <BotonAccion etiqueta="Quitar" variante="outline-danger" tamano="sm" onClick={() => onQuitar(item)} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" colSpan={2} className="d-none d-sm-table-cell">Total a cobrar</th>
            <th scope="row" className="d-sm-none">Total</th>
            <td className="text-end fw-bold text-nowrap" id="total-seleccion">{formatearPesos(total)}</td>
            {onQuitar && <td></td>}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
