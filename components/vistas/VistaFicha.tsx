"use client";

import { useFicha } from "@/lib/hooks";
import DetalleFicha from "../DetalleFicha";
import FichaNoEncontrada from "../FichaNoEncontrada";

type Props = {
  rut: string;
};

export default function VistaFicha({ rut }: Props) {
  const ficha = useFicha(rut);
  return ficha ? <DetalleFicha ficha={ficha} /> : <FichaNoEncontrada />;
}
