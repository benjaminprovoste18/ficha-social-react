import Link from "next/link";
import type { Ficha } from "@/lib/tipos";
import { formatearFecha, tienePendientes } from "@/lib/fichas";
import EstadoBadge from "./EstadoBadge";

type Props = {
  ficha: Ficha;
};

export default function FilaFicha({ ficha }: Props) {
  return (
    <tr>
      <td className="d-none d-sm-table-cell text-nowrap">{ficha.id}</td>
      <td>
        {ficha.nombre}
        {/* en celular la columna RUT se oculta, asi que lo mostramos bajo el nombre */}
        <div className="small text-body-secondary d-sm-none">{ficha.id}</div>
      </td>
      <td className="d-none d-md-table-cell">{ficha.comuna}</td>
      <td className="d-none d-lg-table-cell text-nowrap">
        {formatearFecha(ficha.fechaDefuncion)}
      </td>
      <td>
        <EstadoBadge estado={tienePendientes(ficha) ? "con pendientes" : "al día"} />
      </td>
      <td className="text-end">
        <Link href={"/fichas/" + ficha.id} className="btn btn-sm btn-outline-primary text-nowrap">
          Ver
        </Link>
      </td>
    </tr>
  );
}
