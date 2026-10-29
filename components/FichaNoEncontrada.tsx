import Link from "next/link";

export default function FichaNoEncontrada() {
  return (
    <div className="card shadow-sm">
      <div className="card-body p-4">
        <h2 className="h4 text-primary">No encontramos esa ficha</h2>
        <p>No existe una ficha social registrada para el RUT ingresado.</p>
        <div className="d-flex flex-column flex-sm-row gap-2">
          <Link href="/consultar" className="btn btn-primary">
            Consultar otro RUT
          </Link>
          <Link href="/fichas" className="btn btn-outline-primary">
            Ver fichas registradas
          </Link>
        </div>
      </div>
    </div>
  );
}
