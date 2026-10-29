import type { Ficha } from "@/lib/tipos";
import FilaFicha from "./FilaFicha";

type Props = {
  fichas: Ficha[];
  mensajeVacio?: string;
};

export default function TablaFichas({
  fichas,
  mensajeVacio = "No se encontraron fichas.",
}: Props) {
  if (fichas.length === 0) {
    return <div className="alert alert-info">{mensajeVacio}</div>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle bg-white mb-0">
        <thead className="table-light">
          <tr>
            <th scope="col" className="d-none d-sm-table-cell">RUT</th>
            <th scope="col">Nombre</th>
            <th scope="col" className="d-none d-md-table-cell">Comuna</th>
            <th scope="col" className="d-none d-lg-table-cell">Defunción</th>
            <th scope="col">Estado</th>
            <th scope="col"><span className="visually-hidden">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {fichas.map((ficha) => (
            <FilaFicha ficha={ficha} key={ficha.id} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
