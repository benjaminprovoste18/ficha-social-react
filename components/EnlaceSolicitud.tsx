"use client";

import Link from "next/link";
import { useSeleccion } from "@/lib/hooks";

// Boton del menu que muestra cuantos beneficios lleva la solicitud (como el carrito).
export default function EnlaceSolicitud() {
  const cantidad = useSeleccion().length;

  return (
    <Link href="/solicitud" className="btn btn-success btn-sm" id="enlace-solicitud">
      Mi solicitud <span className="badge text-bg-light ms-1">{cantidad}</span>
    </Link>
  );
}
