"use client";

import { formatearPesos, resumenPorRegion } from "@/lib/fichas";
import { useFichas, useSolicitudes } from "@/lib/hooks";
import EstadoBadge from "../EstadoBadge";

// Reportes calculados con los datos actuales
export default function ReportesAdmin() {
  const fichas = useFichas();
  const solicitudes = useSolicitudes();

  const regiones = resumenPorRegion(fichas).filter((r) => r.cantidad > 0);
  const maxBeneficios = Math.max(1, ...regiones.map((r) => r.beneficios));
  const totalDeudas = regiones.reduce((s, r) => s + r.deudas, 0);
  const totalBeneficios = regiones.reduce((s, r) => s + r.beneficios, 0);

  const porEstado = ["ingresada", "aprobada", "rechazada"].map((estado) => {
    const delEstado = solicitudes.filter((s) => s.estado === estado);
    return { estado, cantidad: delEstado.length, monto: delEstado.reduce((s, x) => s + x.total, 0) };
  });

  return (
    <div className="row g-4">
      <div className="col-12 col-xl-8">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <h3 className="h6">Por región</h3>
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0" id="reporte-regiones">
                <thead>
                  <tr>
                    <th scope="col">Región</th>
                    <th scope="col" className="text-end">Fichas</th>
                    <th scope="col" className="text-end">Deudas pendientes</th>
                    <th scope="col" className="text-end">Beneficios por cobrar</th>
                  </tr>
                </thead>
                <tbody>
                  {regiones.map((r) => (
                    <tr key={r.slug}>
                      <td>{r.region}</td>
                      <td className="text-end">{r.cantidad}</td>
                      <td className="text-end text-nowrap">{formatearPesos(r.deudas)}</td>
                      <td className="text-end" style={{ minWidth: 160 }}>
                        <div className="text-nowrap">{formatearPesos(r.beneficios)}</div>
                        <div className="progress" style={{ height: 6 }} role="presentation">
                          <div className="progress-bar" style={{ width: (r.beneficios / maxBeneficios) * 100 + "%" }}></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="fw-bold">
                    <td>Total</td>
                    <td className="text-end">{fichas.length}</td>
                    <td className="text-end text-nowrap" id="total-deudas">{formatearPesos(totalDeudas)}</td>
                    <td className="text-end text-nowrap" id="total-beneficios-reporte">{formatearPesos(totalBeneficios)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-xl-4">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <h3 className="h6">Solicitudes por estado</h3>
            <ul className="list-group list-group-flush" id="reporte-solicitudes">
              {porEstado.map((fila) => (
                <li className="list-group-item px-0 d-flex justify-content-between align-items-center" key={fila.estado}>
                  <span>
                    <EstadoBadge estado={fila.estado} /> {fila.cantidad}
                  </span>
                  <span className="text-nowrap">{formatearPesos(fila.monto)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
