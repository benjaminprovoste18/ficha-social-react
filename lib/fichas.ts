import type { Ficha } from "./tipos";
import { REGIONES } from "./opciones";

// Funciones de apoyo para trabajar con las fichas.
// Son funciones puras (no tocan el DOM), por eso son faciles de testear.

export function totalDeudasPendientes(ficha: Ficha): number {
  return ficha.deudas
    .filter((deuda) => deuda.estado === "pendiente")
    .reduce((suma, deuda) => suma + deuda.monto, 0);
}

export function totalBienes(ficha: Ficha): number {
  return ficha.bienes.reduce((suma, bien) => suma + bien.avaluo, 0);
}

// Pendientes = todavia no se cobran (pendiente o ya solicitado)
export function totalBeneficiosPendientes(ficha: Ficha): number {
  return ficha.beneficios
    .filter((beneficio) => beneficio.estado !== "cobrado")
    .reduce((suma, beneficio) => suma + beneficio.monto, 0);
}

// Una ficha tiene tramites pendientes si le queda alguna deuda
// o algun beneficio por cobrar.
export function tienePendientes(ficha: Ficha): boolean {
  return (
    ficha.deudas.some((deuda) => deuda.estado === "pendiente") ||
    ficha.beneficios.some((beneficio) => beneficio.estado !== "cobrado")
  );
}

// Filtra por nombre, RUT o comuna y opcionalmente solo las que tienen pendientes.
export function filtrarFichas(
  fichas: Ficha[],
  texto: string,
  soloPendientes: boolean
): Ficha[] {
  const busqueda = quitarTildes(texto.trim().toLowerCase().replace(/\./g, ""));

  return fichas.filter((ficha) => {
    if (soloPendientes && !tienePendientes(ficha)) return false;
    if (busqueda === "") return true;

    const campos = [ficha.nombre, ficha.id, ficha.comuna]
      .map((campo) => quitarTildes(campo.toLowerCase()));
    return campos.some((campo) => campo.includes(busqueda));
  });
}

export function quitarTildes(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function formatearPesos(monto: number): string {
  return "$" + monto.toLocaleString("es-CL");
}

// "2024-07-02" -> "02-07-2024"
export function formatearFecha(fecha: string): string {
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}-${mes}-${anio}`;
}

// Edad que tenia la persona al fallecer.
export function calcularEdad(fechaNacimiento: string, fechaDefuncion: string): number {
  const [anioN, mesN, diaN] = fechaNacimiento.split("-").map(Number);
  const [anioD, mesD, diaD] = fechaDefuncion.split("-").map(Number);

  let edad = anioD - anioN;
  if (mesD < mesN || (mesD === mesN && diaD < diaN)) {
    edad--;
  }
  return edad;
}

// "2026-10-28T21:40:00.000Z" -> "28-10-2026 18:40" (hora local)
export function formatearFechaHora(fechaIso: string): string {
  const fecha = new Date(fechaIso);
  const dos = (n: number) => String(n).padStart(2, "0");
  return `${dos(fecha.getDate())}-${dos(fecha.getMonth() + 1)}-${fecha.getFullYear()} ${dos(fecha.getHours())}:${dos(fecha.getMinutes())}`;
}

export type ResumenRegion = {
  region: string;
  slug: string;
  cantidad: number;
  deudas: number;
  beneficios: number;
};

// Totales por region, en el orden norte a sur de REGIONES
export function resumenPorRegion(fichas: Ficha[]): ResumenRegion[] {
  return REGIONES.map((region) => {
    const delaRegion = fichas.filter((ficha) => ficha.region === region.nombre);
    return {
      region: region.nombre,
      slug: region.slug,
      cantidad: delaRegion.length,
      deudas: delaRegion.reduce((suma, ficha) => suma + totalDeudasPendientes(ficha), 0),
      beneficios: delaRegion.reduce((suma, ficha) => suma + totalBeneficiosPendientes(ficha), 0),
    };
  });
}

// Fecha de hoy en hora local, formato AAAA-MM-DD
export function fechaLocalHoy(fecha: Date = new Date()): string {
  const dos = (n: number) => String(n).padStart(2, "0");
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`;
}
