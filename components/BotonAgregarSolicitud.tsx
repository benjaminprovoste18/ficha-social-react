"use client";

import { agregarASeleccion, quitarDeSeleccion } from "@/lib/baseDatos";
import { useSeleccion } from "@/lib/hooks";
import type { ItemSolicitud } from "@/lib/tipos";
import BotonAccion from "./BotonAccion";

type Props = {
  item: ItemSolicitud;
};

// Agrega un beneficio pendiente a la solicitud (como "Añadir al carrito").
// Si ya esta agregado, el mismo boton permite quitarlo.
export default function BotonAgregarSolicitud({ item }: Props) {
  const seleccion = useSeleccion();
  const agregado = seleccion.some((s) => s.rut === item.rut && s.beneficio === item.beneficio);

  if (agregado) {
    return (
      <BotonAccion
        etiqueta="Quitar de la solicitud"
        variante="outline-secondary"
        tamano="sm"
        onClick={() => quitarDeSeleccion(item.rut, item.beneficio)}
      />
    );
  }

  return <BotonAccion etiqueta="Agregar a solicitud" variante="outline-primary" tamano="sm" onClick={() => agregarASeleccion(item)} />;
}
