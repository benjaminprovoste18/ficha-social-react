import Link from "next/link";
import type { ResumenRegion } from "@/lib/fichas";

type Props = {
  resumen: ResumenRegion[];
};

// Una tarjeta por region con la cantidad de fichas (como la vista de categorias).
export default function TarjetasRegiones({ resumen }: Props) {
  return (
    <div className="row g-3">
      {resumen.map((r) => (
        <div className="col-6 col-md-4 col-lg-3" key={r.slug}>
          <div className={"card h-100 shadow-sm text-center" + (r.cantidad === 0 ? " opacity-50" : "")}>
            <div className="card-body d-flex flex-column justify-content-center">
              <p className="fw-semibold mb-1">{r.region}</p>
              <p className="display-6 fw-bold text-primary mb-1">{r.cantidad}</p>
              <p className="small text-body-secondary mb-2">{r.cantidad === 1 ? "ficha" : "fichas"}</p>
              {r.cantidad > 0 && (
                <Link href={"/regiones/" + r.slug} className="btn btn-sm btn-outline-primary stretched-link">
                  Ver fichas
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
