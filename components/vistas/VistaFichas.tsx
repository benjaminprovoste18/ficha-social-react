"use client";

import { useFichas } from "@/lib/hooks";
import TablaFichasFiltrable from "../TablaFichasFiltrable";

// Lista de fichas leida desde la base de datos (se actualiza sola si cambia)
export default function VistaFichas() {
  return <TablaFichasFiltrable fichas={useFichas()} />;
}
