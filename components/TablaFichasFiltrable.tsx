"use client";

import { useState } from "react";
import type { Ficha } from "@/lib/tipos";
import { filtrarFichas } from "@/lib/fichas";
import BarraBusqueda from "./BarraBusqueda";
import TablaFichas from "./TablaFichas";

type Props = {
  fichas: Ficha[];
};

// Componente padre: aqui vive el estado del filtro.
// Le pasa los valores a BarraBusqueda y la lista filtrada a TablaFichas.
export default function TablaFichasFiltrable({ fichas }: Props) {
  const [texto, setTexto] = useState("");
  const [soloPendientes, setSoloPendientes] = useState(false);

  const filtradas = filtrarFichas(fichas, texto, soloPendientes);

  return (
    <div>
      <BarraBusqueda
        texto={texto}
        soloPendientes={soloPendientes}
        onTextoChange={setTexto}
        onSoloPendientesChange={setSoloPendientes}
      />
      <p className="small text-body-secondary" id="contador-fichas">
        Mostrando {filtradas.length} de {fichas.length} fichas
      </p>
      <TablaFichas
        fichas={filtradas}
        mensajeVacio="Ninguna ficha coincide con la búsqueda."
      />
    </div>
  );
}
