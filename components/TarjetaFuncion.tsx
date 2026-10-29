import Link from "next/link";

type Props = {
  titulo: string;
  descripcion: string;
  enlace?: string;
  textoEnlace?: string;
};

// Tarjeta reutilizable para mostrar las funciones del sistema en el inicio.
// El enlace es opcional: si no viene, no se muestra el boton.
export default function TarjetaFuncion({
  titulo,
  descripcion,
  enlace,
  textoEnlace = "Ir",
}: Props) {
  return (
    <div className="card h-100 border-0 border-start border-4 border-ficha shadow-sm">
      <div className="card-body d-flex flex-column">
        <h3 className="h5 card-title">{titulo}</h3>
        <p className="card-text text-body-secondary">{descripcion}</p>
        {enlace && (
          <Link href={enlace} className="btn btn-sm btn-outline-primary mt-auto align-self-start">
            {textoEnlace}
          </Link>
        )}
      </div>
    </div>
  );
}
