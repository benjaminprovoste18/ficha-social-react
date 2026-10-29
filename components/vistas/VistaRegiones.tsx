"use client";

import { resumenPorRegion } from "@/lib/fichas";
import { useFichas } from "@/lib/hooks";
import TarjetasRegiones from "../TarjetasRegiones";

export default function VistaRegiones() {
  return <TarjetasRegiones resumen={resumenPorRegion(useFichas())} />;
}
