"use client";

import Link from "next/link";
import { useFicha } from "@/lib/hooks";
import DetalleFicha from "../DetalleFicha";
import FormularioFicha from "./FormularioFicha";

type Props = {
  rut: string;
  modo: "ver" | "editar";
};

// Mostrar o editar una ficha en el panel
export default function VistaAdminFicha({ rut, modo }: Props) {
  const ficha = useFicha(rut);

  if (!ficha) {
    return (
      <div className="alert alert-warning">
        No existe una ficha con el RUT {rut}. <Link href="/admin/fichas">Volver al listado</Link>
      </div>
    );
  }

  if (modo === "editar") {
    // la key hace que el formulario parta de nuevo si la ficha cambia
    return <FormularioFicha key={JSON.stringify(ficha)} fichaInicial={ficha} />;
  }

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <Link href={`/admin/fichas/${rut}/editar`} className="btn btn-primary btn-sm">
          Editar ficha
        </Link>
      </div>
      <DetalleFicha ficha={ficha} volverA="/admin/fichas" permitirSolicitud={false} />
    </>
  );
}
