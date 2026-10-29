"use client";

import Link from "next/link";
import { useState } from "react";
import { eliminarFicha } from "@/lib/baseDatos";
import { filtrarFichas, tienePendientes } from "@/lib/fichas";
import { useFichas } from "@/lib/hooks";
import BarraBusqueda from "../BarraBusqueda";
import BotonConfirmar from "../BotonConfirmar";
import EstadoBadge from "../EstadoBadge";

// Listado de fichas del panel con las acciones del CRUD
export default function TablaAdminFichas() {
  const fichas = useFichas();
  const [texto, setTexto] = useState("");
  const [soloPendientes, setSoloPendientes] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const filtradas = filtrarFichas(fichas, texto, soloPendientes);

  function eliminar(rut: string, nombre: string) {
    eliminarFicha(rut);
    setMensaje(`Se eliminó la ficha de ${nombre} (${rut}).`);
  }

  return (
    <>
      {mensaje && (
        <div className="alert alert-success alert-dismissible" role="status" id="mensaje-admin">
          {mensaje}
          <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setMensaje("")}></button>
        </div>
      )}
      <BarraBusqueda
        texto={texto}
        soloPendientes={soloPendientes}
        onTextoChange={setTexto}
        onSoloPendientesChange={setSoloPendientes}
      />
      <p className="small text-body-secondary" id="contador-admin">
        {filtradas.length} de {fichas.length} fichas
      </p>
      {filtradas.length === 0 ? (
        <div className="alert alert-info">No hay fichas para mostrar.</div>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle bg-white mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">RUT</th>
                <th scope="col">Nombre</th>
                <th scope="col" className="d-none d-md-table-cell">Región</th>
                <th scope="col" className="d-none d-sm-table-cell">Estado</th>
                <th scope="col" className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((ficha) => (
                <tr key={ficha.id}>
                  <td className="text-nowrap">{ficha.id}</td>
                  <td>{ficha.nombre}</td>
                  <td className="d-none d-md-table-cell">{ficha.region}</td>
                  <td className="d-none d-sm-table-cell">
                    <EstadoBadge estado={tienePendientes(ficha) ? "con pendientes" : "al día"} />
                  </td>
                  <td className="text-end">
                    <div className="d-inline-flex flex-wrap justify-content-end gap-1">
                      <Link href={`/admin/fichas/${ficha.id}`} className="btn btn-sm btn-outline-primary">
                        Ver
                      </Link>
                      <Link href={`/admin/fichas/${ficha.id}/editar`} className="btn btn-sm btn-outline-secondary">
                        Editar
                      </Link>
                      <BotonConfirmar
                        etiqueta="Eliminar"
                        pregunta="¿Eliminar?"
                        onConfirmar={() => eliminar(ficha.id, ficha.nombre)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
