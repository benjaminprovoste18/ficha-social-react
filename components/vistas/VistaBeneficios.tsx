"use client";

import { useFichas } from "@/lib/hooks";
import TablaBeneficiosPendientes from "../TablaBeneficiosPendientes";

export default function VistaBeneficios() {
  return <TablaBeneficiosPendientes fichas={useFichas()} />;
}
