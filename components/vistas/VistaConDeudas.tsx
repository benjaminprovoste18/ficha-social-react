"use client";

import { formatearPesos, totalDeudasPendientes } from "@/lib/fichas";
import { useFichas } from "@/lib/hooks";
import TablaFichas from "../TablaFichas";

export default function VistaConDeudas() {
  const conDeudas = useFichas().filter((ficha) => totalDeudasPendientes(ficha) > 0);
  const total = conDeudas.reduce((suma, ficha) => suma + totalDeudasPendientes(ficha), 0);

  return (
    <>
      <p>
        Hay <strong>{conDeudas.length}</strong> fichas con deudas pendientes, por un total de{" "}
        <strong>{formatearPesos(total)}</strong>.
      </p>
      <TablaFichas fichas={conDeudas} mensajeVacio="No hay fichas con deudas pendientes." />
    </>
  );
}
