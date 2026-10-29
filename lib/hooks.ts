import { useSyncExternalStore } from "react";
import type { Ficha, ItemSolicitud, Solicitud } from "./tipos";
import { fichasIniciales } from "./datosIniciales";
import { listarFichas, listarSeleccion, listarSolicitudes, suscribir } from "./baseDatos";

// Hooks que conectan la "base de datos" (lib/baseDatos.ts) con los componentes.
// useSyncExternalStore hace que el componente se vuelva a dibujar cada vez que
// los datos cambian, por ejemplo al crear una ficha o agregar un beneficio.
// En el servidor no hay localStorage, asi que ahi se usan los datos iniciales.

const SIN_SOLICITUDES: Solicitud[] = [];
const SIN_SELECCION: ItemSolicitud[] = [];

export function useFichas(): Ficha[] {
  return useSyncExternalStore(suscribir, listarFichas, () => fichasIniciales);
}

export function useFicha(rut: string): Ficha | undefined {
  return useFichas().find((ficha) => ficha.id === rut);
}

export function useSolicitudes(): Solicitud[] {
  return useSyncExternalStore(suscribir, listarSolicitudes, () => SIN_SOLICITUDES);
}

export function useSolicitud(id: string): Solicitud | undefined {
  return useSolicitudes().find((solicitud) => solicitud.id === id);
}

export function useSeleccion(): ItemSolicitud[] {
  return useSyncExternalStore(suscribir, listarSeleccion, () => SIN_SELECCION);
}
